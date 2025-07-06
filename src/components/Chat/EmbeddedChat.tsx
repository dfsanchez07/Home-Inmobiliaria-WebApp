import React, { useEffect } from 'react';
import { ChatInterface } from './ChatInterface';
import { useAppStore } from '../../store/useAppStore';

export const EmbeddedChat: React.FC = () => {
  const { config } = useAppStore();

  // Prevent scrolling issues when embedded chat is visible
  useEffect(() => {
    const chatSection = document.getElementById('embedded-chat');
    if (chatSection) {
      const handleWheel = (e: WheelEvent) => {
        // Check if the wheel event originated from inside the chat container
        const chatContainer = chatSection.querySelector('.overflow-y-auto');
        if (chatContainer && !chatContainer.contains(e.target as Node)) {
          return; // Allow normal scrolling if not inside chat
        }
        
        // If we're at the top or bottom of the chat container, allow page scrolling
        if (chatContainer) {
          const { scrollTop, scrollHeight, clientHeight } = chatContainer as HTMLElement;
          const isAtTop = scrollTop <= 0;
          const isAtBottom = scrollTop + clientHeight >= scrollHeight;
          
          if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
            return; // Allow page scrolling at boundaries
          }
          
          // Otherwise prevent page scrolling
          e.stopPropagation();
        }
      };
      
      chatSection.addEventListener('wheel', handleWheel, { passive: false });
      return () => {
        chatSection.removeEventListener('wheel', handleWheel);
      };
    }
  }, []);

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
