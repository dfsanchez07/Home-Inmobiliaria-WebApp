import React from 'react';
import { ChatInterface } from './ChatInterface';
import { useAppStore } from '../../store/useAppStore';

export const EmbeddedChat: React.FC = () => {
  const { config } = useAppStore();

  const sectionStyle: React.CSSProperties = {
    transition: 'background 0.3s ease',
  };

  if (config.chatSectionBgImage) {
    sectionStyle.backgroundImage = `url(${config.chatSectionBgImage})`;
    sectionStyle.backgroundSize = 'cover';
    sectionStyle.backgroundPosition = 'center';
  } else {
    sectionStyle.backgroundColor = config.chatSectionBgColor || '#F3F4F6';
  }

  return (
    <section id="embedded-chat" className="py-12 md:py-20" style={sectionStyle}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-[85vh] md:h-[70vh] max-h-[900px] md:max-h-[700px]">
          <ChatInterface />
        </div>
      </div>
    </section>
  );
};
