import { randomUUID } from "crypto";
import rocketRepository from "../repositories/rocketRepository.js";
import {
  Rocket,
  RocketCreate,
  RocketRange,
  RocketRanges,
  ValidationErrors,
  PagedResult,
} from "../rockets.js";

const MIN_CAPACITY = 1;
const MAX_CAPACITY = 10;

type ValidationResult<T> = { ok: true; value: T } | { ok: false; errors: ValidationErrors };

/**
 * Rocket business logic and domain operations
 */
class RocketService {
  /**
   * Get all rockets with optional filtering and pagination
   */
  listRockets(
    rangeFilter: RocketRange | undefined,
    capacityFilter: number | undefined,
    page: number,
    pageSize: number,
  ): PagedResult<Rocket> {
    let items = rocketRepository.getAll();

    if (rangeFilter) {
      items = items.filter((rocket) => rocket.range === rangeFilter);
    }

    if (typeof capacityFilter === "number") {
      items = items.filter((rocket) => rocket.capacity >= capacityFilter);
    }

    const totalItems = items.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const normalizedPage = Math.min(Math.max(page, 1), totalPages);
    const startIndex = (normalizedPage - 1) * pageSize;

    return {
      items: items.slice(startIndex, startIndex + pageSize),
      meta: {
        page: normalizedPage,
        pageSize,
        totalPages,
        totalItems,
      },
    };
  }

  /**
   * Get a rocket by ID
   */
  getRocketById(id: string): Rocket | undefined {
    return rocketRepository.getById(id);
  }

  /**
   * Create a new rocket after validation
   */
  createRocket(payload: Partial<RocketCreate>): ValidationResult<Rocket> {
    const validation = this.validateRocketPayload(payload);

    if (!validation.ok) {
      return validation;
    }

    const timestamp = new Date().toISOString();
    const rocket: Rocket = {
      id: randomUUID(),
      createdAt: timestamp,
      updatedAt: timestamp,
      ...validation.value,
    };

    rocketRepository.create(rocket);
    return { ok: true, value: rocket };
  }

  /**
   * Update an existing rocket after validation
   */
  updateRocket(id: string, payload: Partial<RocketCreate>): ValidationResult<Rocket> {
    const existing = rocketRepository.getById(id);
    if (!existing) {
      return { ok: false, errors: { id: ["Rocket not found."] } };
    }

    const validation = this.validateRocketPayload(payload, id);

    if (!validation.ok) {
      return validation;
    }

    const updatedRocket: Rocket = {
      ...existing,
      ...validation.value,
      updatedAt: new Date().toISOString(),
    };

    rocketRepository.update(id, updatedRocket);
    return { ok: true, value: updatedRocket };
  }

  /**
   * Delete a rocket by ID
   */
  deleteRocket(id: string): boolean {
    if (!rocketRepository.exists(id)) {
      return false;
    }
    return rocketRepository.delete(id);
  }

  /**
   * Validate a rocket payload
   */
  private validateRocketPayload(
    payload: Partial<RocketCreate>,
    existingId?: string,
  ): ValidationResult<RocketCreate> {
    const errors: ValidationErrors = {};
    const name = payload.name?.trim();

    if (!this.isNonEmptyString(name)) {
      this.buildValidationError("name", "Name is required and must be a non-empty string.", errors);
    }

    if (!this.isValidRocketRange(payload.range)) {
      this.buildValidationError(
        "range",
        `Range is required and must be one of: ${RocketRanges.join(", ")}.`,
        errors,
      );
    }

    if (!this.isValidCapacity(payload.capacity)) {
      this.buildValidationError(
        "capacity",
        `Capacity is required and must be an integer between ${MIN_CAPACITY} and ${MAX_CAPACITY}.`,
        errors,
      );
    }

    if (name && rocketRepository.existsByName(name, existingId)) {
      this.buildValidationError("name", "A rocket with the same name already exists.", errors);
    }

    if (Object.keys(errors).length > 0) {
      return { ok: false, errors };
    }

    return {
      ok: true,
      value: {
        name: name as string,
        range: payload.range as RocketRange,
        capacity: payload.capacity as number,
      },
    };
  }

  private isNonEmptyString(value: unknown): value is string {
    return typeof value === "string" && value.trim().length > 0;
  }

  private isValidRocketRange(value: unknown): value is RocketRange {
    return this.isNonEmptyString(value) && RocketRanges.includes(value as RocketRange);
  }

  private isValidCapacity(value: unknown): value is number {
    return typeof value === "number" && Number.isInteger(value) && value >= MIN_CAPACITY && value <= MAX_CAPACITY;
  }

  private buildValidationError(field: string, message: string, errors: ValidationErrors): void {
    errors[field] = errors[field] ?? [];
    errors[field].push(message);
  }
}

export default new RocketService();
