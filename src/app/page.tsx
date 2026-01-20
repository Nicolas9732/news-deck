import { Suspense } from 'react';
import { MainLayout } from '@/components/custom/main-layout';
import { TopicSelector } from '@/components/custom/topic-selector';
import { NewsFeed } from '@/components/custom/news-feed';
import { MarketWidget } from '@/components/custom/market-widget';
import { PolymarketCard } from '@/components/custom/polymarket-card';
import { OsintTicker } from '@/components/custom/osint-ticker';
import { Skeleton } from '@/components/ui/skeleton';
import { SearchBar } from '@/components/custom/search-bar';

export default function Home() {
  return (
    <MainLayout>
      <div className="flex flex-col min-h-screen pb-20">
        <header className="sticky top-0 z-20 border-b border-border/40 bg-background/80 backdrop-blur-md px-4 md:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold tracking-tight">Discover</h1>
            <SearchBar className="w-64 hidden md:block" />
          </div>
          {/* Topic pills - visible only on mobile/tablet, hidden on desktop where sidebar handles navigation */}
          <TopicSelector className="lg:hidden" />
        </header>

        <div className="p-4 md:p-8 max-w-[1800px] mx-auto w-full">
           <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
              {/* Center Column - Feed */}
              <div className="xl:col-span-8 space-y-8">
                 <NewsFeed />
              </div>

              {/* Right Column - Widgets */}
              <div className="xl:col-span-4 space-y-6">
                <Suspense fallback={<Skeleton className="h-[400px] w-full rounded-xl" />}>
                  <OsintTicker />
                </Suspense>
                 <Suspense fallback={<Skeleton className="h-[300px] w-full rounded-xl" />}>
                   <PolymarketCard />
                 </Suspense>
                 <Suspense fallback={<Skeleton className="h-[300px] w-full rounded-xl" />}>
                   <MarketWidget />
                 </Suspense>
               </div>
            </div>
         </div>
      </div>
    </MainLayout>
  );
}
