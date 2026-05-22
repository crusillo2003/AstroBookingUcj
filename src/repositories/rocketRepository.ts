import { Rocket } from "../rockets.js";

/**
 * Repository for Rocket data access operations.
 * Manages all in-memory storage and retrieval of rockets.
 */
class RocketRepository {
  private store: Map<string, Rocket> = new Map();

  /**
   * Get all rockets from the store
   */
  getAll(): Rocket[] {
    return Array.from(this.store.values());
  }

  /**
   * Get a rocket by ID
   */
  getById(id: string): Rocket | undefined {
    return this.store.get(id);
  }

  /**
   * Check if a rocket exists by ID
   */
  exists(id: string): boolean {
    return this.store.has(id);
  }

  /**
   * Create and store a new rocket
   */
  create(rocket: Rocket): Rocket {
    this.store.set(rocket.id, rocket);
    return rocket;
  }

  /**
   * Update an existing rocket
   */
  update(id: string, rocket: Rocket): Rocket {
    this.store.set(id, rocket);
    return rocket;
  }

  /**
   * Delete a rocket by ID
   */
  delete(id: string): boolean {
    return this.store.delete(id);
  }

  /**
   * Check if a rocket with the given name exists (case-insensitive)
   * Optionally exclude a specific rocket ID from the check
   */
  existsByName(name: string, excludeId?: string): boolean {
    const lowerName = name.toLowerCase();
    return Array.from(this.store.values()).some(
      (rocket) => rocket.name.toLowerCase() === lowerName && rocket.id !== excludeId,
    );
  }
}

export default new RocketRepository();
