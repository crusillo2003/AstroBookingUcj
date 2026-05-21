---
name: releasing-version
description: >
  Updates documentation, generate changelogs, and handles versioning.
  To be used for automating release tasks.
---

# Releasing Version Skill

Automate the process of managing releases, including:
- Updating documentation files with new version information.
- Generating changelogs based on commit history.
- And handling versioning in code files.

Use terminal git commands as needed.

## Step 1: Update Documentation

- [ ] [AGENTS.md](/AGENTS.md): Update to reflect changes.
  - tech stack,
  - setup/dev instructions,
  - folder structure are accutate.
- [ ] Other relevant project files (`package.json`...).

## Step 2: Generate Changelog

- [ ] Use commit all pending changes grouping them by type of change.
- [ ] Use [Semantic Versioning (SemVer)](./sem-ver) principles,
- [ ] [CHANGELOG.md](./CHANGELOG.md): Add entries to based on commit history.

## Step 3: Versioning

- [ ] If there is an issue/ticket id in the context, commit with `Close #ID`.
- [ ] Merge it into default branch.
- [ ] Generate a git tag for the new version.

