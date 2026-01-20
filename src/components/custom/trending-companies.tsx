import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTrendingCompanies } from '@/lib/mock-data';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

export async function TrendingCompanies() {
  const companies = await getTrendingCompanies();

  return (
    <Card className="border-border/40 bg-card shadow-sm rounded-xl overflow-hidden">
      <CardHeader className="p-4 pb-2 border-b border-border/40 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold tracking-tight text-foreground uppercase">
          Trending
        </CardTitle>
        <ArrowRight size={14} className="text-muted-foreground/50" />
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/40">
          {companies.map((company) => (
            <div key={company.id} className="flex items-center justify-between p-3 hover:bg-muted/30 transition-colors group">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{company.symbol}</span>
                  <span className="text-[10px] text-muted-foreground px-1.5 py-0.5 bg-muted rounded">
                    US
                  </span>
                </div>
                <span className="text-xs text-muted-foreground group-hover:text-foreground/80 transition-colors">
                  {company.name}
                </span>
              </div>
              
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium tabular-nums">
                  {company.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <div className={`flex items-center gap-0.5 text-xs font-medium tabular-nums ${
                  company.isPositive ? 'text-green-500' : 'text-red-500'
                }`}>
                  {company.isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  <span>{Math.abs(company.change)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
