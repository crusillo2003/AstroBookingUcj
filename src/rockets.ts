import { Router, Request, Response } from "express";
import { randomUUID } from "crypto";

// Constants
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

type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; errors: ValidationErrors };

const rocketStore = new Map<string, Rocket>();
const router = Router();

function isValidRocketRange(value: unknown): value is RocketRange {
  return typeof value === "string" && RocketRanges.includes(value as RocketRange);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidCapacity(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= MIN_CAPACITY && value <= MAX_CAPACITY;
}

function buildValidationError(field: string, message: string, errors: ValidationErrors): void {
  if (!errors[field]) {
    errors[field] = [];
  }
  errors[field].push(message);
}

function validateRocketPayload(
  payload: Partial<RocketCreate>,
  existingId?: string,
): ValidationResult<RocketCreate> {
  const errors: ValidationErrors = {};

  if (!isNonEmptyString(payload.name)) {
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
    buildValidationError("capacity", `Capacity is required and must be an integer between ${MIN_CAPACITY} and ${MAX_CAPACITY}.`, errors);
  }

  const name = payload.name?.trim();
  if (name) {
    const duplicate = Array.from(rocketStore.values()).find((rocket) => {
      return rocket.name.toLowerCase() === name.toLowerCase() && rocket.id !== existingId;
    });

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
  if (typeof value === "string" && value.trim().length > 0) {
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
  const pagedItems = items.slice(startIndex, startIndex + pageSize);

  return {
    items: pagedItems,
    meta: {
      page: normalizedPage,
      pageSize,
      totalPages,
      totalItems,
    },
  };
}

router.get("/", (req: Request, res: Response): void => {
  const rangeQuery = req.query.range;
  const capacityQuery = req.query.capacity;
  const pageQuery = req.query.page;
  const pageSizeQuery = req.query.pageSize;

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
    res.status(400).json({ errors });
    return;
  }

  const result = getPagedRockets(rangeFilter, capacityFilter, page, pageSize);
  res.status(200).json(result);
});

router.post("/", (req: Request, res: Response): void => {
  const payload = req.body as Partial<RocketCreate>;
  const validation = validateRocketPayload(payload);

  if (!validation.ok) {
    res.status(400).json({ errors: validation.errors });
    return;
  }

  const id = randomUUID();
  const timestamp = new Date().toISOString();
  const rocket: Rocket = {
    id,
    createdAt: timestamp,
    updatedAt: timestamp,
    ...validation.value,
  };

  rocketStore.set(id, rocket);
  res.status(201).json(rocket);
});

router.get("/:id", (req: Request, res: Response): void => {
  const rocket = rocketStore.get(req.params.id);

  if (!rocket) {
    res.status(404).json({ errors: { id: ["Rocket not found."] } });
    return;
  }

  res.status(200).json(rocket);
});

router.put("/:id", (req: Request, res: Response): void => {
  const rocket = rocketStore.get(req.params.id);

  if (!rocket) {
    res.status(404).json({ errors: { id: ["Rocket not found."] } });
    return;
  }

  const payload = req.body as Partial<RocketCreate>;
  const validation = validateRocketPayload(payload, rocket.id);

  if (!validation.ok) {
    res.status(400).json({ errors: validation.errors });
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
    res.status(404).json({ errors: { id: ["Rocket not found."] } });
    return;
  }

  rocketStore.delete(req.params.id);
  res.sendStatus(204);
});

export default router;
