import { Suspense } from 'react';
import { getNews } from '@/lib/mock-data';
import { DashboardLayout } from '@/components/custom/dashboard-layout';
import { SettingsPanel } from '@/components/custom/settings-panel';
import { Skeleton } from '@/components/ui/skeleton';

async function NewsContent() {
  const news = await getNews();
  return <DashboardLayout news={news} />;
}

function NewsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4 md:px-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="rounded-xl border border-border/40 bg-card p-4 space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-2/3" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
          <div className="flex justify-between items-center pt-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-muted/50 pb-20">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-foreground flex items-center justify-center text-background font-bold text-xl">N</div>
            <h1 className="text-xl font-bold tracking-tight">NewsDash</h1>
          </div>
          <div className="hidden md:flex items-center gap-4 text-sm font-medium text-muted-foreground uppercase tracking-widest">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            })}
          </div>
        </div>
      </header>
      
      <div className="mx-auto max-w-7xl py-8">
        <Suspense fallback={<NewsSkeleton />}>
          <NewsContent />
        </Suspense>
      </div>

      <SettingsPanel />
    </main>
  );
}
