---
name: typescript-instructions
description: "Use when: working with TypeScript files in the AstroBooking project; following TypeScript 5.5+ conventions and Express patterns"
applyTo:
  - "src/**/*.ts"
  - "tests/**/*.ts"
---

# TypeScript Instructions for AstroBooking

## Project Context
- **TypeScript**: 5.5+
- **Framework**: Express 4.x
- **Environment**: In-memory database (no external DB)
- **Security**: Demo/training project (no production security)

## Coding Standards

### Type Safety
- Always use explicit types for function parameters and returns
- Avoid `any` type; use `unknown` with type guards instead
- Use interfaces for object shapes, especially for API requests/responses
- Example:
  ```typescript
  interface Rocket {
    id: string;
    name: string;
    capacity: number;
  }
  
  function getRocket(id: string): Rocket | null {
    // implementation
  }
  ```

### File Organization
- Keep files focused on single responsibility
- Name exports clearly (no default exports for services/utilities)
- Group related types in dedicated `types.ts` or inline in the same file
- Structure:
  ```
  src/
    index.ts          # Entry point
    rockets.ts        # Rockets service/routes
    types.ts          # Shared types
    middleware/       # Express middleware
  ```

### Express Patterns
- Use strongly typed request/response handlers:
  ```typescript
  import { Request, Response } from 'express';
  
  app.get('/rockets/:id', (req: Request, res: Response): void => {
    // Implementation
  });
  ```
- Type middleware handlers consistently
- Use `res.status()` with appropriate HTTP codes (200, 201, 400, 404, 500)

### Variable Naming
- Use camelCase for variables and functions
- Use PascalCase for classes and interfaces
- Use UPPER_SNAKE_CASE for constants
- Be descriptive: `rocket` over `r`, `launchDate` over `ld`

### Error Handling
- Always provide meaningful error messages
- Log to console (console.log/console.error as per project spec)
- Return appropriate HTTP status codes
- Example:
  ```typescript
  if (!rocket) {
    console.error(`Rocket not found: ${id}`);
    res.status(404).json({ error: 'Rocket not found' });
    return;
  }
  ```

## Testing Considerations
- Use Playwright for smoke tests (in `tests/` folder)
- Test files follow: `*.spec.ts` or `*.spec.js`
- Keep tests focused and readable
- Use descriptive test names that explain the scenario

## Build & Execution
- Compile: `npm run build` (outputs to `dist/`)
- Type check: `npm run typecheck`
- Development: `npm run dev`
- Production: `npm start`
- Tests: `npm run test:smoke`

## Common Patterns

### Array Operations
- Prefer `.find()` and `.filter()` over `.map()` when only selecting
- Use `.includes()` for existence checks
- For modifications, consider immutability where feasible

### String Handling
- Use template literals for multi-line or interpolated strings
- Validate string inputs (null/undefined checks)

### Module Imports
- Use ES6 import syntax
- Group imports: standard library → third-party → local code
- Example:
  ```typescript
  import { createServer } from 'http';
  import express from 'express';
  import { getRockets } from './rockets';
  ```

## Documentation
- Add JSDoc comments for exported functions
- Keep comments concise and focused on "why", not "what"
- Example:
  ```typescript
  /**
   * Retrieves a rocket by ID from the in-memory store
   * @param id - The rocket identifier
   * @returns The rocket object or null if not found
   */
  function getRocket(id: string): Rocket | null {
    // ...
  }
  ```
