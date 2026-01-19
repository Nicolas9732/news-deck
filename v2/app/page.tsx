"use client";

import { useTopic } from "@/v2/contexts/topic-context";
import { LayoutProvider } from "@/v2/contexts/layout-context";
import { TopicSelection } from "@/v2/components/layout/topic-selection";
import { MonitoringView } from "@/v2/components/layout/monitoring-view";

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
