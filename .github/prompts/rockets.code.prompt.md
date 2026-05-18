# Code

## Role 

Act as a senior software developer.
## Task

Implement the functionality described in the specification file provided.

Do not write tests or documentation, just the functional code.

## Context

A file named `specs/rockets.spec.md` with the specification to be implemented.

Ask for any additional context if needed.

### Code Implementation Guidelines

- Use ES modules (import/export) instead of CommonJS (require/module.exports).
- Use strict typing and avoid using `any` type.
- Declare `types` for data structures and `interfaces` for class contracts.
- Avoid `null` and `undefined` where possible, use `Option` or `Result` types for better error handling.
- Leverage TypeScript's utility types (e.g., `Partial`, `Pick`, `Omit`) to create flexible and reusable types.

## Steps to follow

1. **Understand the Specification**:
    - Read the context to grasp the requirements and constraints.
2. **Break it down**:
    - Divide the problem into smaller, manageable tasks.
3. **Have a plan**:
    - Generate the steps to implement (without coding details).
4. **Prepare Git**:
    - Commit existing changes.
    - Create a new branch named `feat/rockets-api`.
5. **Write the code**:
    - Write the minimun code necessary to fulfill the plan.

## Output Checklist

- [ ] A new branch named `feat/rockets-api` with the implemented functionality.
- [ ] Modified or newly created code files as specified in the implementation plan.