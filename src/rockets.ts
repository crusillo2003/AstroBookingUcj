import { Router, Request, Response } from "express";
import { randomUUID } from "crypto";

const MIN_CAPACITY = 1;
const MAX_CAPACITY = 10;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE = 1;

export type RocketRange = "suborbital" | "orbital" | "interplanetary";
export const RocketRanges = ["suborbital", "orbital", "interplanetary"] as const;

export interface Rocket {
  id: string;
  name: string;
  range: RocketRange;
  capacity: number;
  createdAt: string;
  updatedAt: string;
}

export interface RocketCreate {
  name: string;
  range: RocketRange;
  capacity: number;
}

export type RocketUpdate = Partial<RocketCreate>;

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
}

export interface PagedResult<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface ValidationErrors {
  [field: string]: string[];
}

type ValidationResult<T> = { ok: true; value: T } | { ok: false; errors: ValidationErrors };

const rocketStore = new Map<string, Rocket>();
const router = Router();

function buildValidationError(field: string, message: string, errors: ValidationErrors): void {
  errors[field] = errors[field] ?? [];
  errors[field].push(message);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function parseQueryParam(value: unknown): string | undefined {
  return isNonEmptyString(value) ? value.trim() : undefined;
}

function isValidRocketRange(value: unknown): value is RocketRange {
  return isNonEmptyString(value) && RocketRanges.includes(value as RocketRange);
}

function isValidCapacity(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= MIN_CAPACITY && value <= MAX_CAPACITY;
}

function validateRocketPayload(
  payload: Partial<RocketCreate>,
  existingId?: string,
): ValidationResult<RocketCreate> {
  const errors: ValidationErrors = {};
  const name = payload.name?.trim();

  if (!isNonEmptyString(name)) {
    buildValidationError("name", "Name is required and must be a non-empty string.", errors);
  }

  if (!isValidRocketRange(payload.range)) {
    buildValidationError(
      "range",
      `Range is required and must be one of: ${RocketRanges.join(", ")}.`,
      errors,
    );
  }

  if (!isValidCapacity(payload.capacity)) {
    buildValidationError(
      "capacity",
      `Capacity is required and must be an integer between ${MIN_CAPACITY} and ${MAX_CAPACITY}.`,
      errors,
    );
  }

  if (name) {
    const duplicate = Array.from(rocketStore.values()).find(
      (rocket) => rocket.name.toLowerCase() === name.toLowerCase() && rocket.id !== existingId,
    );

    if (duplicate) {
      buildValidationError("name", "A rocket with the same name already exists.", errors);
    }
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

function parsePositiveInteger(value: unknown, defaultValue: number): number {
  if (typeof value === "number" && Number.isInteger(value) && value > 0) {
    return value;
  }

  if (isNonEmptyString(value)) {
    const parsed = Number(value);
    if (Number.isInteger(parsed) && parsed > 0) {
      return parsed;
    }
  }

  return defaultValue;
}

function getPagedRockets(
  rangeFilter: RocketRange | undefined,
  capacityFilter: number | undefined,
  page: number,
  pageSize: number,
): PagedResult<Rocket> {
  let items = Array.from(rocketStore.values());

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

function buildErrorResponse(res: Response, status: number, errors: ValidationErrors): void {
  res.status(status).json({ errors });
}

function createRocket(payload: RocketCreate): Rocket {
  const timestamp = new Date().toISOString();
  return {
    id: randomUUID(),
    createdAt: timestamp,
    updatedAt: timestamp,
    ...payload,
  };
}

router.get("/", (req: Request, res: Response): void => {
  const rangeQuery = parseQueryParam(req.query.range);
  const capacityQuery = parseQueryParam(req.query.capacity);
  const pageQuery = parseQueryParam(req.query.page);
  const pageSizeQuery = parseQueryParam(req.query.pageSize);

  const errors: ValidationErrors = {};
  let rangeFilter: RocketRange | undefined;
  let capacityFilter: number | undefined;

  if (rangeQuery !== undefined) {
    if (!isValidRocketRange(rangeQuery)) {
      buildValidationError("range", `Range filter must be one of: ${RocketRanges.join(", ")}.`, errors);
    } else {
      rangeFilter = rangeQuery;
    }
  }

  if (capacityQuery !== undefined) {
    const capacityValue = Number(capacityQuery);
    if (!Number.isInteger(capacityValue) || capacityValue < MIN_CAPACITY) {
      buildValidationError("capacity", "Capacity filter must be an integer greater than or equal to 1.", errors);
    } else {
      capacityFilter = capacityValue;
    }
  }

  const page = parsePositiveInteger(pageQuery, DEFAULT_PAGE);
  const pageSize = parsePositiveInteger(pageSizeQuery, DEFAULT_PAGE_SIZE);

  if (Object.keys(errors).length > 0) {
    buildErrorResponse(res, 400, errors);
    return;
  }

  const result = getPagedRockets(rangeFilter, capacityFilter, page, pageSize);
  res.status(200).json(result);
});

router.post("/", (req: Request, res: Response): void => {
  const payload = req.body as Partial<RocketCreate>;
  const validation = validateRocketPayload(payload);

  if (!validation.ok) {
    buildErrorResponse(res, 400, validation.errors);
    return;
  }

  const rocket = createRocket(validation.value);
  rocketStore.set(rocket.id, rocket);
  res.status(201).json(rocket);
});

router.get("/:id", (req: Request, res: Response): void => {
  const rocket = rocketStore.get(req.params.id);

  if (!rocket) {
    buildErrorResponse(res, 404, { id: ["Rocket not found."] });
    return;
  }

  res.status(200).json(rocket);
});

router.put("/:id", (req: Request, res: Response): void => {
  const rocket = rocketStore.get(req.params.id);

  if (!rocket) {
    buildErrorResponse(res, 404, { id: ["Rocket not found."] });
    return;
  }

  const payload = req.body as Partial<RocketCreate>;
  const validation = validateRocketPayload(payload, rocket.id);

  if (!validation.ok) {
    buildErrorResponse(res, 400, validation.errors);
    return;
  }

  const updatedRocket: Rocket = {
    ...rocket,
    ...validation.value,
    updatedAt: new Date().toISOString(),
  };

  rocketStore.set(rocket.id, updatedRocket);
  res.status(200).json(updatedRocket);
});

router.delete("/:id", (req: Request, res: Response): void => {
  if (!rocketStore.has(req.params.id)) {
    buildErrorResponse(res, 404, { id: ["Rocket not found."] });
    return;
  }

  rocketStore.delete(req.params.id);
  res.sendStatus(204);
});

export default router;
