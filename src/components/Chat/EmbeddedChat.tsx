import React from 'react';
import { ChatInterface } from './ChatInterface';
import { useAppStore } from '../../store/useAppStore';

export const EmbeddedChat: React.FC = () => {
  const { config } = useAppStore();

  return (
    <section id="chat" className="py-12 bg-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">{config.headerTitle}</h2>
          <p className="text-gray-600 mt-2">{config.initialChatMessage}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-[85vh] md:h-[70vh] max-h-[900px] md:max-h-[700px]">
          <ChatInterface />
        </div>
      </div>
    </section>
  );
};
