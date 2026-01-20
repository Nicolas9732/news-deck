import { Suspense } from 'react';
import { getNews } from '@/lib/mock-data';
import { MainLayout } from '@/components/custom/main-layout';
import { TopicSelector } from '@/components/custom/topic-selector';
import { NewsCard } from '@/components/custom/news-card';
import { MarketWidget } from '@/components/custom/market-widget';
import { WeatherWidget } from '@/components/custom/weather-widget';
import { TrendingCompanies } from '@/components/custom/trending-companies';
import { Skeleton } from '@/components/ui/skeleton';

export default async function Home() {
  const news = await getNews();
  const featuredNews = news[0];
  const standardNews = news.slice(1);

  return (
    <MainLayout>
      <div className="flex flex-col min-h-screen pb-20">
         <header className="sticky top-0 z-20 border-b border-border/40 bg-background/80 backdrop-blur-md px-4 md:px-8 h-16 flex items-center justify-between">
           <h1 className="text-xl font-bold tracking-tight">Discover</h1>
           <TopicSelector />
         </header>

         <div className="p-4 md:p-8 max-w-[1800px] mx-auto w-full">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
               {/* Center Column - Feed */}
               <div className="xl:col-span-8 space-y-8">
                  {featuredNews && (
                    <section>
                      <NewsCard item={featuredNews} variant="featured" />
                    </section>
                  )}
                  
                  <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {standardNews.map(item => (
                      <NewsCard key={item.id} item={item} />
                    ))}
                  </section>
               </div>

               {/* Right Column - Widgets */}
               <div className="xl:col-span-4 space-y-6">
                 <Suspense fallback={<Skeleton className="h-[200px] w-full rounded-xl" />}>
                   <WeatherWidget />
                 </Suspense>
                 <Suspense fallback={<Skeleton className="h-[300px] w-full rounded-xl" />}>
                   <MarketWidget />
                 </Suspense>
                 <Suspense fallback={<Skeleton className="h-[300px] w-full rounded-xl" />}>
                   <TrendingCompanies />
                 </Suspense>
               </div>
            </div>
         </div>
      </div>
    </MainLayout>
  );
}
