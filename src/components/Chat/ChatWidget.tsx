import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, Loader2, X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { ApiService } from '../../services/api';
import { ChatMessage } from '../../types';
import { PropertyCard } from '../Property/PropertyCard';

export const ChatWidget: React.FC = () => {
  const {
    config,
    chatMessages,
    addChatMessage,
    setLoading,
    isLoading,
    chatSessionId,
    visitRequest,
    requestVisit,
    clearVisitRequest,
    openPropertyModal,
  } = useAppStore();
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isExpanded && chatMessages.length === 0 && config.initialChatMessage) {
      const initialMessage: ChatMessage = {
        id: 'initial',
        type: 'assistant',
        content: config.initialChatMessage,
        timestamp: new Date(),
      };
      addChatMessage(initialMessage);
    }
  }, [isExpanded, config.initialChatMessage, addChatMessage, chatMessages.length]);

  useEffect(() => {
    if (isExpanded) {
      scrollToBottom();
    }
  }, [chatMessages, isExpanded]);

  useEffect(() => {
    if (visitRequest) {
      setIsExpanded(true);
      setInputMessage(`Quiero agendar una visita para el inmueble "${visitRequest}"`);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
      clearVisitRequest();
    }
  }, [visitRequest, clearVisitRequest]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !config.webhookUrl) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    addChatMessage(userMessage);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await ApiService.sendChatMessage(
        config.webhookUrl,
        inputMessage,
        chatSessionId
      );

      if (response.text) {
        const textMessage: ChatMessage = {
          id: Date.now().toString() + '_text',
          type: 'assistant',
          content: response.text,
          timestamp: new Date(),
        };
        addChatMessage(textMessage);
      }

      if (response.properties && response.properties.length > 0) {
        const propertiesMessage: ChatMessage = {
          id: Date.now().toString() + '_properties',
          type: 'assistant',
          content: '',
          timestamp: new Date(),
          properties: response.properties,
        };
        addChatMessage(propertiesMessage);
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: Date.now().toString() + '_error',
        type: 'assistant',
        content: 'Lo siento, ocurrió un error. Por favor intenta nuevamente.',
        timestamp: new Date(),
      };
      addChatMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleVisit = (propertyTitle: string) => {
    requestVisit(propertyTitle);
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50">
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
          style={{ backgroundColor: config.primaryColor }}
        >
          <MessageSquare className="h-6 w-6 text-white" />
        </button>
      )}

      {isExpanded && (
        <div className="fixed inset-0 bg-white flex flex-col animate-fade-in md:rounded-2xl md:w-96 md:h-[500px] md:bottom-6 md:right-6 md:inset-auto md:shadow-2xl border border-gray-200">
          <div className="text-white p-4 flex items-center justify-between md:rounded-t-2xl flex-shrink-0" style={{ backgroundColor: config.primaryColor }}>
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span className="font-semibold">Asistente Virtual</span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {chatMessages.map((message) => (
              <div key={message.id}>
                <div
                  className={`flex ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.content && (
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl shadow-sm ${
                        message.type === 'user'
                          ? 'text-white'
                          : 'bg-white text-gray-900'
                      }`}
                      style={{ backgroundColor: message.type === 'user' ? config.primaryColor : '' }}
                    >
                      {message.content}
                    </div>
                  )}
                </div>
                
                {message.properties && (
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-start">
                      <div className="bg-gray-200 p-2 rounded-lg text-sm text-gray-600">
                        Propiedades encontradas:
                      </div>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto p-1">
                      {message.properties.map((property, index) => (
                        <PropertyCard
                          key={index}
                          property={property}
                          onScheduleVisit={handleScheduleVisit}
                          onCardClick={openPropertyModal}
                          compact={true}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-900 p-3 rounded-2xl flex items-center space-x-2 shadow-sm">
                  <Loader2 className="h-4 w-4 animate-spin" style={{ color: config.primaryColor }} />
                  <span>Escribiendo...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Escribe tu mensaje..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:border-transparent"
                style={{'--tw-ring-color': config.primaryColor} as React.CSSProperties}
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="text-white p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: config.primaryColor }}
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
