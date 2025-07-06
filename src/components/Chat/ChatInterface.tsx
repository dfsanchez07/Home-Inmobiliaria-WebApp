import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { PropertyCard } from '../Property/PropertyCard';

export const ChatInterface: React.FC = () => {
  const {
    config,
    chatMessages,
    isLoading,
    sendMessage,
    initializeChat,
    openPropertyModal,
    requestVisit,
  } = useAppStore(state => ({
    config: state.config,
    chatMessages: state.chatMessages,
    isLoading: state.isLoading,
    sendMessage: state.sendMessage,
    initializeChat: state.initializeChat,
    openPropertyModal: state.openPropertyModal,
    requestVisit: state.requestVisit,
  }));

  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    initializeChat();
  }, [initializeChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    sendMessage(inputMessage);
    setInputMessage('');
  };

  const handleQuickQuestionClick = (text: string) => {
    sendMessage(text);
  };

  const chatAreaStyle: React.CSSProperties = {
    transition: 'background 0.3s ease',
  };

  if (config.chatBackgroundImage) {
    chatAreaStyle.backgroundImage = `url(${config.chatBackgroundImage})`;
    chatAreaStyle.backgroundSize = 'cover';
    chatAreaStyle.backgroundPosition = 'center';
  } else {
    chatAreaStyle.backgroundColor = config.chatBgColor || '#ffffff';
  }

  return (
    <div className="flex flex-col h-full bg-transparent">
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4" style={chatAreaStyle}>
        {chatMessages.map((message) => (
          <div key={message.id}>
            <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.content && (
                <div
                  className={`max-w-[85%] p-3 rounded-2xl shadow-sm ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white rounded-br-lg'
                      : 'bg-white text-gray-900 rounded-bl-lg'
                  }`}
                >
                  {message.content}
                </div>
              )}
            </div>
            
            {message.properties && message.properties.length > 0 && (
              <div className="mt-2 space-y-2">
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-2 rounded-lg text-sm text-gray-600">
                    Claro, aquí tienes algunas propiedades que coinciden:
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto p-2">
                  {message.properties.map((property, index) => (
                    <PropertyCard
                      key={index}
                      property={property}
                      onScheduleVisit={requestVisit}
                      onCardClick={openPropertyModal}
                      compact={true}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        
        {isLoading && chatMessages[chatMessages.length - 1]?.isTyping && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-900 p-3 rounded-2xl rounded-bl-lg shadow-sm flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
              <span className="text-sm italic">Escribiendo...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {config.quickQuestions && config.quickQuestions.length > 0 && (
        <div className="p-2 md:p-4 border-t border-gray-200 bg-gray-50 overflow-x-auto">
          <div className="flex items-center gap-2">
            {config.quickQuestions.map((q) => (
              <button
                key={q.id}
                onClick={() => handleQuickQuestionClick(q.text)}
                className="flex-shrink-0 bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
              >
                {q.text}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Escribe tu mensaje..."
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
