# Clean TypeScript Code

## Role

Act as a software developer.

## Task

Clean the code at the specified file or folder.
Do not write any new feature or tests, just the refactor.

## Context 

The file or folder path to clean must be provided en the input. 

If not, do it for the last modified file in the git history.

## Steps to follow: 

1. **Commit existing changes**: 
  - Commit any existing changes in the codebase before starting new work.
2. **Analyze the code**: 
  - Read the code at the specified file or folder.
3. **Identify areas for improvement**: 
  - Look for code smells, such as:
    - Duplicated code
    - Long functions or methods
    - Large classes or modules
    - Inconsistent naming conventions
    - Lack of comments or documentation
4. **Plan the cleaning**: 
  - Apply the planned changes to clean the code.

## Output checklist

- [ ] The code at the specified file or folder is cleaned and refactored.
- [ ] All test pass successfully.