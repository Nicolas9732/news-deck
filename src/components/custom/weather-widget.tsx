import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { getWeatherData } from '@/lib/mock-data';
import { Cloud, CloudRain, CloudSnow, Sun, CloudLightning, MapPin, Droplets, Wind } from 'lucide-react';
import { WeatherForecast } from '@/types';

const ConditionIcon = ({ condition, size = 16, className = "" }: { condition: string, size?: number, className?: string }) => {
  switch (condition) {
    case 'sunny': return <Sun size={size} className={className} />;
    case 'cloudy': return <Cloud size={size} className={className} />;
    case 'rain': return <CloudRain size={size} className={className} />;
    case 'snow': return <CloudSnow size={size} className={className} />;
    case 'storm': return <CloudLightning size={size} className={className} />;
    default: return <Sun size={size} className={className} />;
  }
};

export async function WeatherWidget() {
  const data = await getWeatherData();

  return (
    <Card className="border-border/40 bg-card shadow-sm rounded-xl overflow-hidden">
      <CardContent className="p-4">
        {/* Header / Current Status */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
              <MapPin size={12} />
              <span className="text-xs font-medium uppercase tracking-wider">{data.location}</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-light tracking-tighter text-foreground">
                {data.currentTemp}°
              </span>
              <div className="flex flex-col mb-1.5">
                <ConditionIcon condition={data.condition} size={20} className="text-muted-foreground" />
              </div>
            </div>
            <span className="text-sm text-muted-foreground capitalize mt-1">
              {data.condition}
            </span>
          </div>

          <div className="flex flex-col gap-2 items-end">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Droplets size={12} />
              <span>{data.humidity}%</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Wind size={12} />
              <span>{data.windSpeed} km/h</span>
            </div>
          </div>
        </div>

        {/* Forecast */}
        <div className="grid grid-cols-5 gap-2 pt-4 border-t border-border/40">
          {data.forecast.map((day: WeatherForecast) => (
            <div key={day.day} className="flex flex-col items-center gap-2">
              <span className="text-[10px] text-muted-foreground uppercase font-medium">
                {day.day}
              </span>
              <ConditionIcon condition={day.condition} size={16} className="text-foreground/70" />
              <div className="flex flex-col items-center text-[10px] font-medium tabular-nums">
                <span className="text-foreground">{day.tempMax}°</span>
                <span className="text-muted-foreground/60">{day.tempMin}°</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
