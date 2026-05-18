# Create Agents Instructions

## Role

Act as a software engineer.

## Task

Create a set of instructions for IA agents to understand the project.

## Context

Browse and read the project files to gather context.

### Instructions Template
Ensure a short file (<= 100 sentences) and short sentences (<= 100 characters).
Follow this template and save in markdown file `AGENTS.md`:

```md
# Agents Instructions

## Product Overview

- {What the product is about in 2-3 short sentences.}

## Technical Implementation

### Tech Stack

- Language: **{language and version}**
- Framework: **{framework and version}**
- Database: **{database}**
- Security: **{security strategy}**
- Testing: **{testing framework}**
- Logging: **{logging tool}**

### Development workflow
```bash
# Set up the project
# Build/compile the project
# Run the project
# Test the project
# Deploy the project
```

### Folder Structure
```text

.                   # Project root
├── AGENTS.md       # This file with instructions for IA agents
├── README.md       # The main human-readable documentation
├── {other_files}   # Other relevant files
├── {other_folders} # Other relevant folders
```

## Environment
- Code and documentation are in English.
- Chat resposes should be en the language of the user prompt.
- Sacrifice grammar for conciseness in responses.
- This is a windows environment using git bash terminal.
- My default branch is `main`.
```

## Steps to follow
1. **Product Overview**: 
  - Summarize the product in 2-3 short sentences.
2. **Technical Implementation**:
  - Tech Stack: List main technologies used in the project.
  - Development Workflow: Provide commands to set up, build, run, test, and deploy the project.
  - Folder Structure: Outline the main files and folders in the project.
  - Environment: List relevant environment details and copy default section.
3. **Write the Instructions**: 
  - Follow the template and keep it concise.

## Output Checklist

- [ ] The output should be a markdown file named `AGENTS.md`.