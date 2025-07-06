import React from 'react';
import { MessageSquare, X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { ChatInterface } from '../Chat/ChatInterface';

export const ChatWidget: React.FC = () => {
  const { isChatOpen, toggleChat, config } = useAppStore(state => ({
    isChatOpen: state.isChatOpen,
    toggleChat: state.toggleChat,
    config: state.config,
  }));

  // Prevent body scrolling when chat is open
  React.useEffect(() => {
    if (isChatOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      
      // Apply styles to prevent body scrolling on mobile
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      
      return () => {
        // Restore scrolling when component unmounts or chat closes
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isChatOpen]);

  return (
    <>
      <button
        id="chat-widget"
        onClick={(e) => {
          e.preventDefault(); // Prevent any default behavior
          toggleChat();
        }}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full text-white shadow-lg z-30 flex items-center justify-center transition-transform transform hover:scale-110"
        style={{ backgroundColor: config.primaryColor }}
        aria-label="Open chat"
      >
        {isChatOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </button>

      {isChatOpen && (
        <div 
          className="fixed bottom-24 right-6 w-full max-w-md h-[70vh] bg-white rounded-2xl shadow-2xl z-30 flex flex-col overflow-hidden animate-fade-in-up"
          onClick={(e) => e.stopPropagation()} // Prevent clicks from bubbling up
        >
          <ChatInterface />
        </div>
      )}
    </>
  );
};
