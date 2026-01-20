# NewsDash Optimization Plan

**Created:** January 2026  
**Status:** Ready for Implementation  
**Priority:** High

---

## Executive Summary

This plan addresses 12 key improvements to transform NewsDash into a polished, functional news dashboard with real data integrations, improved visual design, and full mobile support.

---

## Phase 1: Visual Design Overhaul

### 1.1 Category Color System
**Priority:** High | **Effort:** Low

Add distinct accent colors per category to break the monochromatic look while maintaining the dark theme elegance.

| Category | Color | Hex (Dark Mode) |
|----------|-------|-----------------|
| Tech | Blue | `#3b82f6` |
| Finance | Emerald | `#10b981` |
| Crypto | Amber | `#f59e0b` |
| Geopolitics | Rose | `#f43f5e` |
| Climate | Teal | `#14b8a6` |
| AI | Violet | `#8b5cf6` |
| Macro | Slate | `#64748b` |

**Implementation:**
- Create `src/lib/category-colors.ts` with color mapping
- Update `NewsCard` to apply category color to badges
- Update sidebar feed items with colored icons
- Apply colored left-border accent to cards

### 1.2 News Card Image Enhancement
**Priority:** High | **Effort:** Medium

Ensure all news cards display article images prominently.

**Tasks:**
- Improve RSS image extraction in `news-service.ts`:
  - Parse `<media:content>` and `<media:thumbnail>` tags
  - Extract `og:image` from article content if available
  - Add fallback placeholder images per category
- Update `NewsCard` component:
  - Standard cards: Show thumbnail on right side (1/3 width)
  - Featured card: Keep current hero image layout
  - Add `next/image` for optimization with blur placeholder

### 1.3 Remove Redundant Header Pills (Desktop)
**Priority:** Medium | **Effort:** Low

**Tasks:**
- Hide `TopicSelector` on `lg:` breakpoint and above
- Keep it visible on mobile/tablet as the primary navigation
- Sidebar already provides category navigation on desktop

---

## Phase 2: Mobile Experience

### 2.1 Mobile Navigation
**Priority:** High | **Effort:** Medium

Add bottom navigation bar for mobile users.

**Implementation:**
- Create `src/components/custom/mobile-nav.tsx`
- Fixed bottom bar with icons: Home, Discover, Markets, Settings
- Show only on `< lg` breakpoint
- Use Sheet component for expandable category menu

### 2.2 Responsive Layout Adjustments
**Priority:** Medium | **Effort:** Low

**Tasks:**
- Adjust main grid from `xl:grid-cols-12` to `lg:grid-cols-12`
- Stack widgets below feed on mobile (already works)
- Reduce card padding on mobile (`p-3` vs `p-4`)

---

## Phase 3: Functional Improvements

### 3.1 Working Search Bar
**Priority:** High | **Effort:** Medium

Implement real-time search across news articles.

**Tasks:**
- Add search state to `DashboardContext`
- Create `/api/search` endpoint that queries cached news
- Filter news feed client-side for instant results
- Add keyboard shortcut (`/` or `Cmd+K`) to focus search
- Show search results in dropdown or filter current feed

### 3.2 Remove Weather Widget
**Priority:** Low | **Effort:** Low

**Tasks:**
- Delete `src/components/custom/weather-widget.tsx`
- Remove from `page.tsx`
- Delete weather types and mock data

---

## Phase 4: OSINT Wire Fix

### 4.1 Fix Tweet URL Linking
**Priority:** High | **Effort:** Low

**Current Issue:** Links go to profile page, not specific tweets.

**Root Cause:** Nitter RSS returns URLs like `https://nitter.net/username/status/123` but the `convertUrl` function doesn't preserve the full path.

**Fix:**
```typescript
// In osint-ticker.tsx - Update convertUrl function
function convertUrl(url: string | undefined) {
  if (!url) return '#';
  
  // Already a valid Twitter/X URL
  if (url.includes('twitter.com') || url.includes('x.com')) {
    return url;
  }
  
  // Convert Nitter URLs to X.com
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes('nitter')) {
      // Preserve the FULL path (including /status/xxx)
      return `https://x.com${urlObj.pathname}`;
    }
    return url;
  } catch {
    return url;
  }
}
```

### 4.2 Improve Data Freshness
**Priority:** High | **Effort:** Medium

**Current Issue:** Old tweets recycled due to Nitter scraping failures.

**Solution:** Implement RSSHub as primary source with multi-instance fallback.

**Tasks:**
- Add RSSHub instances to `OSINT_SOURCES` array:
  ```typescript
  const RSSHUB_INSTANCES = [
    'https://rsshub.app',
    'https://rsshub.rssforever.com',
    'https://hub.slarker.me'
  ];
  ```
- Update fetch logic to try RSSHub first: `${instance}/twitter/user/${username}`
- Keep Nitter as fallback
- Reduce cache duration to 2 minutes for fresher data
- Add visual indicator when data is stale (> 10 min old)

---

## Phase 5: Polymarket Integration

### 5.1 Real Polymarket API
**Priority:** High | **Effort:** Medium

**API Endpoint:** `https://clob.polymarket.com/markets`

**Tasks:**
- Create `src/lib/polymarket-service.ts`:
  ```typescript
  interface PolymarketMarket {
    condition_id: string;
    question: string;
    tokens: Array<{ outcome: string; price: number }>;
    volume: string;
    active: boolean;
  }
  ```
- Fetch trending/active markets sorted by volume
- Update `/api/polymarket/route.ts` to use real API
- Add error handling with mock fallback

### 5.2 Market Search/Filter
**Priority:** Medium | **Effort:** Medium

**Tasks:**
- Add search input to `PolymarketCard` header
- Implement client-side filtering of markets
- Add category tabs: All, Politics, Crypto, Sports, Finance
- Store user's selected categories in localStorage

---

## Phase 6: Enhanced Market Data

### 6.1 Expand Asset Coverage
**Priority:** High | **Effort:** Medium

Current: S&P 500, NASDAQ, BTC, VIX + 5 trending stocks

**New Coverage:**

| Category | Symbols |
|----------|---------|
| Indices | `^GSPC`, `^IXIC`, `^DJI`, `^VIX`, `^FTSE` |
| Crypto | `BTC-USD`, `ETH-USD`, `SOL-USD`, `XRP-USD` |
| Commodities | `GC=F` (Gold), `SI=F` (Silver), `CL=F` (Oil), `NG=F` (NatGas) |

**Tasks:**
- Update `market-service.ts` with new symbol lists
- Group by asset class in UI
- Add tabbed interface to `MarketWidget`: Indices | Crypto | Commodities
- Keep sparkline charts for each asset

### 6.2 Consolidate Market Widgets
**Priority:** Medium | **Effort:** Low

**Current:** Two widgets - `MarketWidget` + `TrendingCompanies`

**Change:** Merge into single `MarketWidget` with tabs:
- **Overview:** Top movers across all categories
- **Indices:** Major market indices
- **Crypto:** Cryptocurrency prices
- **Commodities:** Commodity futures

---

## Phase 7: Code Quality

### 7.1 Type Safety Improvements
- Add Zod schemas for API responses
- Validate external data before rendering

### 7.2 Error Boundaries
- Add React error boundary around each widget
- Graceful fallback UI for failed components

### 7.3 Performance
- Implement `react-query` or SWR for data fetching
- Add stale-while-revalidate patterns
- Reduce re-renders with proper memoization

---

## Implementation Order

| Phase | Task | Priority | Est. Time |
|-------|------|----------|-----------|
| 1.3 | Remove header pills on desktop | Medium | 15 min |
| 3.2 | Remove weather widget | Low | 10 min |
| 1.1 | Category color system | High | 45 min |
| 4.1 | Fix OSINT tweet URLs | High | 20 min |
| 4.2 | RSSHub integration for OSINT | High | 1 hour |
| 1.2 | News card images | High | 1 hour |
| 2.1 | Mobile navigation | High | 1.5 hours |
| 5.1 | Polymarket real API | High | 1 hour |
| 6.1 | Expand market data | High | 1 hour |
| 6.2 | Consolidate market widgets | Medium | 45 min |
| 3.1 | Working search bar | High | 1.5 hours |
| 5.2 | Polymarket search/filter | Medium | 1 hour |
| 2.2 | Responsive adjustments | Medium | 30 min |
| 7.x | Code quality improvements | Low | 2 hours |

**Total Estimated Time:** ~12 hours

---

## Files to Create

```
src/lib/category-colors.ts          # Color mapping utility
src/lib/polymarket-service.ts       # Real Polymarket API client
src/components/custom/mobile-nav.tsx # Bottom navigation for mobile
src/app/api/search/route.ts         # Search API endpoint
```

## Files to Modify

```
src/app/page.tsx                    # Remove weather, adjust layout
src/app/globals.css                 # Add category color CSS variables
src/components/custom/main-layout.tsx    # Add mobile nav, hide desktop pills
src/components/custom/news-card.tsx      # Enhanced images, category colors
src/components/custom/news-feed.tsx      # Search filtering
src/components/custom/osint-ticker.tsx   # Fix URLs, RSSHub integration
src/components/custom/polymarket-card.tsx # Real API, search
src/components/custom/market-widget.tsx  # Expanded assets, tabs
src/components/custom/topic-selector.tsx # Hide on desktop
src/lib/news-service.ts             # Better image extraction
src/lib/market-service.ts           # More symbols
src/app/api/osint/route.ts          # RSSHub integration
src/app/api/polymarket/route.ts     # Real API
src/context/dashboard-context.tsx   # Add search state
```

## Files to Delete

```
src/components/custom/weather-widget.tsx
src/components/custom/trending-companies.tsx  # Merged into market-widget
```

---

## Success Criteria

- [ ] All news cards display images (real or category fallback)
- [ ] Category badges have distinct colors
- [ ] Mobile users have bottom navigation
- [ ] Desktop users don't see redundant header pills
- [ ] Search bar filters news in real-time
- [ ] OSINT links go to specific tweets (not profiles)
- [ ] OSINT shows fresh tweets (< 5 min old)
- [ ] Polymarket shows real market data
- [ ] Market widget shows indices, crypto, and commodities
- [ ] Weather widget removed
- [ ] Build passes with no TypeScript errors

---

## Notes

- All API integrations should have mock fallbacks for reliability
- Color scheme maintains Perplexity aesthetic while adding visual interest
- Mobile-first responsive design ensures good UX on all devices
- Caching strategies balance freshness with API rate limits

---

*This plan was created during the planning phase. Implementation will proceed after user approval.*
