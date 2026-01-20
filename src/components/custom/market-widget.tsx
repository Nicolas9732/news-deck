import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getMarketData } from '@/lib/mock-data';
import { TrendingUp, TrendingDown } from 'lucide-react';

const Sparkline = ({ data, color }: { data: number[]; color: string }) => {
  const width = 60;
  const height = 20;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((val, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        points={points}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export async function MarketWidget() {
  const data = await getMarketData();

  return (
    <Card className="border-border/40 bg-card shadow-sm rounded-xl overflow-hidden">
      <CardHeader className="p-4 pb-2 border-b border-border/40">
        <CardTitle className="text-sm font-semibold tracking-tight text-foreground uppercase">
          Markets
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/40">
          {data.map((item) => (
            <div key={item.symbol} className="flex items-center justify-between p-3 hover:bg-muted/30 transition-colors">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">{item.name}</span>
                <span className="text-xs text-muted-foreground">{item.symbol}</span>
              </div>
              
              <div className="flex items-center gap-4">
                <Sparkline 
                  data={item.history} 
                  color={item.isPositive ? '#22c55e' : '#ef4444'} 
                />
                
                <div className="flex flex-col items-end min-w-[60px]">
                  <span className="text-sm font-medium tabular-nums">
                    {item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <div className={`flex items-center gap-0.5 text-xs font-medium tabular-nums ${
                    item.isPositive ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {item.isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                    <span>{item.isPositive ? '+' : ''}{item.change}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
