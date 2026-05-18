# Release Rocket Management API Feature

## Role

Act as a software release manager.


## Task

Verify the implementation of the rocket feature.

Ensure all changes are properly tested, documented, and tagged for release.

Prepare and execute the release process for the rocket management API feature.


## Context

The current branch `feat/rockets-api` has implementation of `specs/rockets.spec.md`.

## Steps to follow

1. **Verify the implementation**:
    - Write e2e tests to ensure acceptance criteria from `specs/rockets.spec.md`.
    - Run the tests to ensure they pass successfully.
2. **Update documentation**:
    - `package.json` Update version number according to semantic versioning.
    - `CHANGELOG.md` Add a new entry under the "Unreleased" section describing the new feature.
    - `README.md` Update the documentation to include information about the new API endpoints for rocket management.
3. **Manage Version Tag**:
    - Commit changes with a message following the format: `chore: prepare release v{version}`.
    - Create a git tag with message: `Release v{version}`.
    - Merge the `feat/rockets-api` branch into `main`.

## Output Checklist

- [ ] All acceptance criteria are met and verified with tests.
- [ ] Documentation is updated to reflect the new feature.
- [ ] A new git tag is created for the release.