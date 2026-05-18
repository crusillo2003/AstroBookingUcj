# Agents Instructions

## Product Overview

- AstroBookings is a backend API demo for rockets, launches, customers, and seat bookings.
- It manages in-memory data for rocket inventory, launch lifecycle, customer identity, and booking availability.
- The app is a training project and not intended for production use.

## Technical Implementation

### Tech Stack

- Language: **TypeScript 5.5+**
- Framework: **Express 4.x**
- Database: **In-memory objects only**
- Security: **No authentication or production security implemented**
- Testing: **Playwright test for smoke tests**
- Logging: **Stdout/stderr console logs**

### Development workflow

```bash
npm install
npm run build
npm run dev
npm start
npm run typecheck
npm run test:smoke
```

### Folder Structure

```text
.                   # Project root
├── AGENTS.md       # This file with instructions for IA agents
├── README.md       # The main human-readable documentation
├── package.json    # npm metadata and scripts
├── tsconfig.json   # TypeScript compiler configuration
├── src/            # Application source code
├── tests/          # Playwright smoke tests
├── specs/          # Project specification notes
├── dist/           # Compiled build output
├── playwright.config.cjs # Playwright test config
```

## Environment

- Code and documentation are in English.
- Chat responses should follow the user prompt language.
- Use concise sentences and short statements.
- This is a Windows environment using git bash terminal.
- Default branch is `main`.
