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

  return (
    <>
      <button
        id="chat-widget"
        onClick={toggleChat}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full text-white shadow-lg z-30 flex items-center justify-center transition-transform transform hover:scale-110"
        style={{ backgroundColor: config.primaryColor }}
        aria-label="Open chat"
      >
        {isChatOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </button>

      {isChatOpen && (
        <div className="fixed bottom-24 right-6 w-full max-w-md h-[70vh] bg-white rounded-2xl shadow-2xl z-30 flex flex-col overflow-hidden animate-fade-in-up">
          <ChatInterface />
        </div>
      )}
    </>
  );
};
