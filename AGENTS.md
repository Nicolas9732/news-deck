# AGENTS.md - News Dashboard Project

This document serves as the shared memory and rulebook for all autonomous agents operating in this repository.

## 🚀 Project Overview
A "Perplexity-style" personal news dashboard. Focus on high information density, minimalist design, and modularity.

## 🛠 Tech Stack
- **Framework:** Next.js (App Router), TypeScript
- **Styling:** Tailwind CSS (v4)
- **UI Components:** shadcn/ui (Radix UI)
- **Icons:** Lucide React

## 📏 Coding Standards & Style
1. **Perplexity Aesthetic:**
   - Use a "Muted" background (`bg-muted/50` or similar).
   - Cards should have subtle borders and light shadows.
   - Typography is key: Use clean sans-serif (Inter/Geist).
   - Information density over white space.
2. **Imports:**
   - Use absolute imports with `@/`.
   - Component imports: `@/components/ui/...` or `@/components/custom/...`.
3. **TypeScript:**
   - Strict typing is mandatory. No `any`.
   - Use interfaces for API responses and component props.
4. **State Management:**
   - Use React Context for global dashboard settings (widget visibility, order).
   - Local state for widget-specific data fetching.
5. **Error Handling:**
   - Every widget MUST have a loading skeleton (using `@/components/ui/skeleton`).
   - Every widget MUST have a graceful error state.

## 🔄 The "Ralph Loop" Workflow (Autonomous)
1. **Sync:** Read `TASKS.md` to identify the next `pending` task.
2. **Execute:** Implement the task following the standards above.
3. **Verify:** Run `npm run lint` and `npm run build` (or `next lint`).
4. **Git:** Commit changes with a descriptive message: `feat: <description>` or `fix: <description>`.
5. **Update:** Mark task as `completed` in `TASKS.md`.

## 📂 Directory Structure
- `src/app`: Routes and layouts
- `src/components`: UI components (ui/ for shadcn, custom/ for project-specific)
- `src/lib`: Utilities and API services
- `src/hooks`: Custom React hooks
- `src/types`: Shared TypeScript interfaces
