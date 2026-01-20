# AGENTS.md - News Dashboard Project

This document is the **Source of Truth** and **Shared Memory** for all autonomous agents operating in this repository. It defines the architecture, coding standards, and operational protocols required to maintain a high-quality, "Perplexity-style" news dashboard.

---

## 🚀 Project Vision
A personal news monitor that provides high-density, high-signal information overview. It mimics the "Perplexity" aesthetic: clean, minimalist, typography-focused, and modular.

## 🛠 Tech Stack
- **Framework:** Next.js 15+ (App Router)
- **Language:** TypeScript (Strict Mode)
- **Styling:** Tailwind CSS v4
- **Components:** shadcn/ui (Radix UI)
- **Icons:** Lucide React
- **State:** React Context + LocalStorage persistence

---

## 📋 Build & Development Commands
All agents must verify changes using these commands before committing.

- **Development:** `npm run dev`
- **Production Build:** `npm run build`
- **Linting:** `npm run lint`
- **Type Checking:** `npx tsc --noEmit`
- **Clean Install:** `rm -rf node_modules .next && npm install`

### 🧪 Testing Guidelines
*(Note: Vitest/Playwright setup pending in Phase 4)*
- **Unit Tests:** `npm test` (when implemented)
- **Single Test:** `npx vitest src/components/custom/news-card.test.tsx`
- **Watch Mode:** `npm test -- --watch`

---

## 📏 Coding Standards & Style

### 1. Perplexity Aesthetic (Core Rules)
- **Backgrounds:** Use `bg-muted/50` for page backgrounds to make cards pop.
- **Cards:** Subtle borders (`border-border/40`), light shadows (`shadow-sm`), and rounded corners (`rounded-xl`).
- **Typography:** 
  - Titles: `font-semibold tracking-tight text-foreground`.
  - Content: `text-foreground/80 leading-relaxed`.
  - Metadata: `text-muted-foreground/70 text-xs uppercase tracking-wider`.
- **Density:** Favor information density over excessive whitespace. Use compact layouts for data-rich sections.

### 2. Imports & File Organization
- **Absolute Imports:** ALWAYS use `@/` alias.
  - Components: `@/components/ui/...` or `@/components/custom/...`
  - Libs: `@/lib/...`
  - Types: `@/types/...`
  - Context: `@/context/...`
- **Directory Structure:**
  - `src/app`: Page routes and global layouts.
  - `src/components/ui`: Raw shadcn components (don't edit these directly).
  - `src/components/custom`: Project-specific components (edit these).
  - `src/lib`: Logic, API callers, and utilities.
  - `src/types`: Centralized TypeScript interfaces.

### 3. TypeScript & Naming
- **Strict Typing:** No `any`. Use `unknown` if type is truly uncertain.
- **Interfaces:** Prefer `interface` over `type` for object definitions.
- **Naming:**
  - Components: PascalCase (e.g., `NewsCard.tsx`).
  - Functions/Variables: camelCase (e.g., `fetchNewsData`).
  - Types/Interfaces: PascalCase (e.g., `NewsItem`).
  - Files: kebab-case (except components).

### 4. Component Philosophy
- **Stateless UI:** Keep UI components as "dumb" as possible. Pass data via props.
- **Composition:** Use the "Slot" pattern or `children` for flexible layouts.
- **Loading States:** Every data-fetching component MUST have a `Skeleton` counterpart.
- **Error Boundaries:** Use `try/catch` in data fetchers and provide a fallback UI.

### 5. State & Data Persistence
- **Global Settings:** Use `DashboardContext` for user preferences (layout, categories).
- **Persistence:** Sync global state to `localStorage` using the `useDashboard` hook logic.
- **Mock Data:** Use `src/lib/mock-data.ts` until real API keys are provided.

---

## 🔄 The "Ralph Loop" Workflow
Agents must follow this autonomous cycle:

1.  **Read Memory:** Analyze `TASKS.md` to find the next `pending` item.
2.  **Analyze Context:** Read `AGENTS.md` and existing code to understand conventions.
3.  **Plan:** Formulate a step-by-step implementation plan.
4.  **Execute:** Write/Edit files.
5.  **Self-Verify:**
    - Run `npm run build` to catch type/build errors.
    - Run `npm run lint` to ensure style compliance.
6.  **Commit:** Create a Git commit with a descriptive `feat:` or `fix:` message.
7.  **Mark Done:** Update `TASKS.md` status to `completed`.
8.  **Repeat:** Proceed to the next task.

---

## 🛡 Security & Safety
- **Secrets:** NEVER hardcode API keys. Use `.env.local`.
- **Git:** Do not commit `node_modules`, `.next`, or `.env` files (check `.gitignore`).
- **Validation:** Always validate external API responses before rendering.

## 🤖 Handoff Protocol
When finishing a session, an agent should:
1. Update `TASKS.md` with the current state.
2. Ensure the build is passing.
3. Leave a brief summary of accomplishments in the Git log.

---
*Created by opencode for the Ralph Wiggum Autonomous Loop.*
