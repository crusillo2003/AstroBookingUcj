---
name: creating-gh-issues
description: >
  Create a GitHub issue based on an provided specification or context.
  To be used to create issues for features, bugs, or tasks in a repository.
----

# Creating GitHub Issues Skill

When asked for creating a GitHub issue, follow these steps:

1. **Capture inputs**: 
  - Draft the issue from the specification or context; if unclear, ask.
  - Identify the repository remote URL from Context or [AGENTS.md](AGENTS.md).
  - If not, identify it by using local git commands to find the remote URL.
    - Save the remote URL at [AGENTS.md](AGENTS.md) for future reference.

2. **Create the GitHub issue**:
  - Use the GitHub MCP tool to create the issue in the current repository.
  - Set the issue title and body based on the provided specification or context.
  - Add a label `bug` or `enhancement` based on the content.
  - Save the created issue URL for reference and the ID for tracking.

3. **Double-link to specification (if applicable)**:
  - If the issue is created based on a specification file:
    - Add the created issue URL back to the file for traceability.
    - Add the github spec file url to the created issue body for context.
    