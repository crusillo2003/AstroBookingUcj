import { Router, Request, Response } from "express";
import logger from "./utils/logger.js";
import rocketService from "./services/rocketService.js";

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

const router = Router();

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function parseQueryParam(value: unknown): string | undefined {
  return isNonEmptyString(value) ? value.trim() : undefined;
}

function isValidRocketRange(value: unknown): value is RocketRange {
  return isNonEmptyString(value) && RocketRanges.includes(value as RocketRange);
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

function buildErrorResponse(res: Response, status: number, errors: ValidationErrors): void {
  res.status(status).json({ errors });
}

router.get("/", (req: Request, res: Response): void => {
  logger.log("rockets", "list request", { query: req.query });
  const rangeQuery = parseQueryParam(req.query.range);
  const capacityQuery = parseQueryParam(req.query.capacity);
  const pageQuery = parseQueryParam(req.query.page);
  const pageSizeQuery = parseQueryParam(req.query.pageSize);

  const errors: ValidationErrors = {};
  let rangeFilter: RocketRange | undefined;
  let capacityFilter: number | undefined;

  if (rangeQuery !== undefined) {
    if (!isValidRocketRange(rangeQuery)) {
      errors["range"] = errors["range"] ?? [];
      errors["range"].push(`Range filter must be one of: ${RocketRanges.join(", ")}.`);
    } else {
      rangeFilter = rangeQuery;
    }
  }

  if (capacityQuery !== undefined) {
    const capacityValue = Number(capacityQuery);
    if (!Number.isInteger(capacityValue) || capacityValue < 1) {
      errors["capacity"] = errors["capacity"] ?? [];
      errors["capacity"].push("Capacity filter must be an integer greater than or equal to 1.");
    } else {
      capacityFilter = capacityValue;
    }
  }

  const page = parsePositiveInteger(pageQuery, DEFAULT_PAGE);
  const pageSize = parsePositiveInteger(pageSizeQuery, DEFAULT_PAGE_SIZE);

  if (Object.keys(errors).length > 0) {
    logger.log("rockets", "validation failed for list", { errors });
    buildErrorResponse(res, 400, errors);
    return;
  }

  const result = rocketService.listRockets(rangeFilter, capacityFilter, page, pageSize);
  res.status(200).json(result);
});

router.post("/", (req: Request, res: Response): void => {
  const payload = req.body as Partial<RocketCreate>;
  logger.log("rockets", "create request", { payload });
  const result = rocketService.createRocket(payload);

  if (!result.ok) {
    logger.log("rockets", "validation failed for create", { errors: result.errors });
    buildErrorResponse(res, 400, result.errors);
    return;
  }

  logger.log("rockets", "rocket created", { id: result.value.id, name: result.value.name });
  res.status(201).json(result.value);
});

router.get("/:id", (req: Request, res: Response): void => {
  const rocket = rocketService.getRocketById(req.params.id);

  if (!rocket) {
    logger.log("rockets", "rocket not found", { id: req.params.id });
    buildErrorResponse(res, 404, { id: ["Rocket not found."] });
    return;
  }

  res.status(200).json(rocket);
});

router.put("/:id", (req: Request, res: Response): void => {
  const payload = req.body as Partial<RocketCreate>;
  const result = rocketService.updateRocket(req.params.id, payload);

  if (!result.ok) {
    buildErrorResponse(res, 404, result.errors);
    return;
  }

  res.status(200).json(result.value);
});

router.delete("/:id", (req: Request, res: Response): void => {
  const deleted = rocketService.deleteRocket(req.params.id);

  if (!deleted) {
    buildErrorResponse(res, 404, { id: ["Rocket not found."] });
    return;
  }

  res.sendStatus(204);
});

export default router;
