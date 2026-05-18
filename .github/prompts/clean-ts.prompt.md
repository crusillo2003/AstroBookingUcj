---
name: clean
description: Clean the code at the specified file or folder. Do not write any new feature or tests, just the refactor.
argument-hint: Provide the file or folder path to clean.
agent: agent
model: Auto (copilot)
tools: [read, agent, edit, search, web, todo]
---

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
5. **Execute the cleaning**: 
  - Apply the planned changes to clean the code.
6. **Test the changes**:
  - Ensure that the cleanned code functions as expected without introducing new issues.

## Output checklist

- [ ] The code at the specified file or folder is cleaned.
- [ ] All test pass successfully.