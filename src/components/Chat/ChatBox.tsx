import React, { useState, useEffect } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { ChatInterface } from './ChatInterface';

export const ChatBox: React.FC = () => {
  const { isChatOpen, toggleChat } = useAppStore(state => ({
    isChatOpen: state.isChatOpen,
    toggleChat: state.toggleChat,
  }));

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isChatOpen && (
        <button
          onClick={toggleChat}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-105"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}

      {isChatOpen && (
        <div className="bg-white rounded-2xl shadow-2xl w-96 h-[600px] max-h-[80vh] flex flex-col border border-gray-200 transition-all duration-300">
          <div className="bg-blue-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span className="font-semibold">Asistente Virtual</span>
            </div>
            <button
              onClick={toggleChat}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <ChatInterface />
        </div>
      )}
    </div>
  );
};
