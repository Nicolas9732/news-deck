"use client";

import { useTopic } from "@/app/v2/contexts/topic-context";
import { LayoutProvider } from "@/app/v2/contexts/layout-context";
import { TopicSelection } from "@/app/v2/components/layout/topic-selection";
import { MonitoringView } from "@/app/v2/components/layout/monitoring-view";

export default function V2Page() {
  const { selectedTopic } = useTopic();

  if (!selectedTopic) {
    return <TopicSelection />;
  }

  return (
    <LayoutProvider topicId={selectedTopic.id}>
      <MonitoringView />
    </LayoutProvider>
  );
}
