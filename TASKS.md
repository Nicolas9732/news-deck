# TASKS.md - News Dashboard Roadmap

## 📋 Status Key
- ⏳ `pending`: Not started
- 🚧 `in_progress`: Currently being worked on
- ✅ `completed`: Finished and verified

---

## 🏗 Phase 1: Foundation
- [✅] Initialize Git & Next.js project
- [✅] Setup shadcn/ui & Theme
- [✅] Create AGENTS.md & TASKS.md

## 🚀 Phase 2: Core MVP
- [✅] Define Shared Types (`src/types/index.ts`)
- [✅] Implement Mock News Data Engine (`src/lib/mock-data.ts`)
- [✅] Build Dashboard Layout (`src/components/custom/dashboard-layout.tsx`)
- [✅] Build Perplexity-style News Card (`src/components/custom/news-card.tsx`)
- [✅] Implement Global Dashboard Context (`src/context/dashboard-context.tsx`)
- [✅] Build Settings Panel (`src/components/custom/settings-panel.tsx`)

## 🎨 Phase 3: Polishing
- [✅] Add Loading Skeletons
- [✅] Implement LocalStorage Persistence
- [✅] Final Aesthetic Pass (Typography & Spacing)
- [✅] Final Assembly: Rebuild Main Feed, Sidebar, & Widgets
- [✅] Final Build Verification

---

## 🔮 Phase 4: Future Improvements (Backlog)
- [⏳] Implement Real API integrations (Polymarket, Twitter, CoinGecko)
- [⏳] Add Search Functionality
- [⏳] Implement Drag-and-Drop for widgets
- [⏳] Add Vitest and Playwright test suites
