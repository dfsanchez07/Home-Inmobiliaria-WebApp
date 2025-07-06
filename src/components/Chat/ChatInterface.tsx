import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { PropertyCard } from '../Property/PropertyCard';

const TypingIndicator = () => (
  <div className="flex items-center space-x-1 p-2">
    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
  </div>
);

export const ChatInterface: React.FC = () => {
  const {
    config,
    chatMessages,
    openPropertyModal,
    sendMessage,
    initializeChat,
    isLoading,
  } = useAppStore(state => ({
    config: state.config,
    chatMessages: state.chatMessages,
    openPropertyModal: state.openPropertyModal,
    sendMessage: state.sendMessage,
    initializeChat: state.initializeChat,
    isLoading: state.isLoading,
  }));
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    initializeChat();
  }, [initializeChat]);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSend = async (messageText?: string) => {
    const text = messageText || input;
    if (!text.trim() || isLoading) return;

    setInput('');
    await sendMessage(text);
    inputRef.current?.focus({ preventScroll: true });
  };

  // Configuración del estilo del área de chat
  const chatAreaStyle: React.CSSProperties = {
    transition: 'background 0.3s ease',
  };

  if (config.chatBackgroundImage) {
    chatAreaStyle.backgroundImage = `url(${config.chatBackgroundImage})`;
    chatAreaStyle.backgroundSize = 'cover';
    chatAreaStyle.backgroundPosition = 'center';
  } else {
    chatAreaStyle.backgroundColor = config.chatBgColor || '#f9fafb';
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 border rounded-xl overflow-hidden">
      <div className="py-2 px-4 border-b bg-white flex-shrink-0">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <MessageSquare className="mr-2" style={{ color: config.primaryColor }} />
          Asistente Virtual
        </h3>
      </div>
      <div 
        ref={chatContainerRef}
        className="flex-grow p-4 overflow-y-auto"
        style={chatAreaStyle}
      >
        <div className="space-y-4">
          {chatMessages.map((msg) => (
            <div key={msg.id} className={`flex w-full ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.properties && msg.properties.length > 0 ? (
                <div className="w-full relative">
                  <div className="overflow-x-auto pb-2 scrollbar-hide">
                    <div className="flex space-x-4">
                      {msg.properties.map(prop => (
                        <div key={prop.id} className="flex-shrink-0 w-[80%] sm:w-80">
                          <PropertyCard 
                            property={prop} 
                            onCardClick={openPropertyModal}
                            hideScheduleButton
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  {msg.properties.length > 1 && (
                    <div 
                      className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none sm:hidden"
                      aria-hidden="true"
                    />
                  )}
                </div>
              ) : (
                <div className={`max-w-lg rounded-2xl ${msg.type === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none border'}`}>
                  {msg.isTyping ? <TypingIndicator /> : <p className="text-sm p-3">{msg.content}</p>}
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="py-3 px-4 bg-white border-t flex-shrink-0">
        <div className="flex items-center space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Escribe tu mensaje..."
            className="flex-grow border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled={isLoading}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 rounded-full text-white flex items-center justify-center transition-colors disabled:opacity-50"
            style={{ backgroundColor: config.primaryColor }}
          >
            <Send size={20} />
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {config.quickQuestions.map(q => (
            <button key={q.id} onClick={() => handleSend(q.text)} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full" disabled={isLoading}>
              {q.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};