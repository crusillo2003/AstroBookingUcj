# Semantic Versioning (SemVer)

A versioning scheme that uses a three-part version number: `MAJOR.MINOR.PATCH`.

- **MAJOR** version when you make incompatible API changes,
- **MINOR** version when you add functionality in a backwards-compatible manner, and
- **PATCH** version when you make backwards-compatible bug fixes.

## Principles

- Read commit history to determine the type of changes made (breaking, feature, fix).
- Messages should follow this convention:
  - `<type>[optional scope][optional !]: <description>`
- Change version numbers based on the nature of changes:
  - Increment MAJOR version for breaking changes `<type>!`.
  - Increment MINOR version for new features `feat:`.
  - Increment PATCH version for bug fixes `fix:`.
  - Ignore other types of commits for versioning increments.