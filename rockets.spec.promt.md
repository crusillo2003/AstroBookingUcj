# Spec

## Role

Act as a software analyst.

## Task

Generate a specification to implement the functionality described below.
Do not write any code or tests, just the especification.

## Context

- An API endpoint to manage rocketsin the AstroBookings travel application.
- Each rocket has:
    - name,
    - range ("suborbital", "orbital", "moon", "mars"),
    - capacity (1 to 10 passengers).

Ask fpr any additional context if needed.

## SpecificationTemplate

Follow this template for writting the specification file `specs/rockets.spec.md`:

````markdown
# Rocket Management API Specification
## Problem Description
- As {role} . I want to **{goal}** so that {reason}.
## Solution Overview
- {Simple approach to solve the problem, no technical details.}
## Acceptance Criteria
- [ ] EARS format
````

## Steps to follow

1. **Define the problem**:
    - Clearly outline the problem with up to 3 user stories.
2. **Outline the solution**:
    - Simplest approach for application, logic and infraestructure.
3. **Set Acceptance Criteria**:
    - Up to 9 acceptance criteria in EARS format.

## Output Checklist

- [ ] The output should be a markdown file named `specs/rockets.spec.md`.
- [ ] The specification with:
    - Problem description,
    - Solution Overview,
    - Acceptance Criteria.