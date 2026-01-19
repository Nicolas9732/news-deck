"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Topic } from '@/v2/lib/types';
import { DEFAULT_TOPICS } from '@/v2/lib/default-topics';
import { saveToLocal, loadFromLocal } from '@/v2/lib/utils';

interface TopicContextType {
  topics: Topic[];
  selectedTopic: Topic | null;
  selectTopic: (topic: Topic | null) => void;
  addTopic: (topic: Omit<Topic, 'id'>) => void;
  removeTopic: (id: string) => void;
  updateTopic: (id: string, updates: Partial<Topic>) => void;
}

const TopicContext = createContext<TopicContextType | undefined>(undefined);

export function TopicProvider({ children }: { children: React.ReactNode }) {
  const [topics, setTopics] = useState<Topic[]>(DEFAULT_TOPICS);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load custom topics from localStorage
  useEffect(() => {
    const customTopics = loadFromLocal<Topic[]>('news-deck-custom-topics', []);
    if (customTopics.length > 0) {
      setTopics([...DEFAULT_TOPICS, ...customTopics]);
    }
    setIsInitialized(true);
  }, []);

  // Save custom topics to localStorage
  useEffect(() => {
    if (isInitialized) {
      const customTopics = topics.filter(t => t.type === 'custom');
      saveToLocal('news-deck-custom-topics', customTopics);
    }
  }, [topics, isInitialized]);

  const selectTopic = (topic: Topic | null) => {
    setSelectedTopic(topic);
    if (topic) {
      saveToLocal('news-deck-last-topic', topic.id);
    }
  };

  const addTopic = (topicData: Omit<Topic, 'id'>) => {
    const newTopic: Topic = {
      ...topicData,
      id: `custom-${Date.now()}`,
    };
    setTopics([...topics, newTopic]);
  };

  const removeTopic = (id: string) => {
    setTopics(topics.filter(t => t.id !== id));
    if (selectedTopic?.id === id) {
      setSelectedTopic(null);
    }
  };

  const updateTopic = (id: string, updates: Partial<Topic>) => {
    setTopics(topics.map(t => t.id === id ? { ...t, ...updates } : t));
    if (selectedTopic?.id === id) {
      setSelectedTopic({ ...selectedTopic, ...updates });
    }
  };

  return (
    <TopicContext.Provider value={{
      topics,
      selectedTopic,
      selectTopic,
      addTopic,
      removeTopic,
      updateTopic,
    }}>
      {children}
    </TopicContext.Provider>
  );
}

export function useTopic() {
  const context = useContext(TopicContext);
  if (context === undefined) {
    throw new Error('useTopic must be used within a TopicProvider');
  }
  return context;
}
