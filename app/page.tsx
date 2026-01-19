import { CommandCenterShell } from "@/components/layout/command-center-shell";
import { GeoQuadrant } from "@/components/quadrants/geo-quadrant";
import { FinanceQuadrant } from "@/components/quadrants/finance-quadrant";
import { TechQuadrant } from "@/components/quadrants/tech-quadrant";
import { OddsQuadrant } from "@/components/quadrants/odds-quadrant";

export default function Home() {
  return (
    <CommandCenterShell
      geoQuadrant={<GeoQuadrant />}
      financeQuadrant={<FinanceQuadrant />}
      techQuadrant={<TechQuadrant />}
      oddsQuadrant={<OddsQuadrant />}
    />
  );
}
