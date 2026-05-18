---
name: commit
description: Describe when to use this prompt
agent: agent
model: GPT-5 mini (copilot)
tools: [execute, read]
---

# Commit Changes

## Role
Act as a software developer.

## Task

Commit the pending changes.
Use the terminal tool to run git commands.

## Context

Use the `committing-changes` skill as reference.

## Output checklist

- [ ] There are not committed changes in the current branch.