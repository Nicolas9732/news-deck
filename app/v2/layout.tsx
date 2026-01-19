import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/app/v2/contexts/theme-context";
import { TopicProvider } from "@/app/v2/contexts/topic-context";

export const metadata: Metadata = {
  title: "News Monitoring Platform",
  description: "Real-time intelligence briefing and news monitoring",
};

export default function V2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <TopicProvider>
        {children}
      </TopicProvider>
    </ThemeProvider>
  );
}
