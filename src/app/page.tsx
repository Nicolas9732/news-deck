import { getNews } from '@/lib/mock-data';
import { DashboardLayout } from '@/components/custom/dashboard-layout';
import { SettingsPanel } from '@/components/custom/settings-panel';

export default async function Home() {
  const news = await getNews();

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
        <DashboardLayout news={news} />
      </div>

      <SettingsPanel />
    </main>
  );
}
