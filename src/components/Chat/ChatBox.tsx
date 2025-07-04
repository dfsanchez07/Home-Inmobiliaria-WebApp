import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, Loader2, X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { ApiService } from '../../services/api';
import { ChatMessage } from '../../types';
import { PropertyCard } from '../Property/PropertyCard';

export const ChatBox: React.FC = () => {
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
    if (chatMessages.length === 0 && config.initialChatMessage) {
      const initialMessage: ChatMessage = {
        id: 'initial',
        type: 'assistant',
        content: config.initialChatMessage,
        timestamp: new Date(),
      };
      addChatMessage(initialMessage);
    }
  }, [config.initialChatMessage, addChatMessage, chatMessages.length]);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

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

      if (response && response.output && response.output.text) {
        const textMessage: ChatMessage = {
          id: Date.now().toString() + '_text',
          type: 'assistant',
          content: response.output.text,
          timestamp: new Date(),
        };
        addChatMessage(textMessage);
      }

      if (response && response.output && response.output.properties && response.output.properties.length > 0) {
        const propertiesMessage: ChatMessage = {
          id: Date.now().toString() + '_properties',
          type: 'assistant',
          content: '',
          timestamp: new Date(),
          properties: response.output.properties,
        };
        addChatMessage(propertiesMessage);
      }

			if (!response?.output?.text && (!response?.output?.properties || response?.output?.properties.length === 0)) {
        const errorMessage: ChatMessage = {
          id: Date.now().toString() + '_empty',
          type: 'assistant',
          content: 'Entre al flujo pero no hay datos.',
          timestamp: new Date(),
        };
        addChatMessage(errorMessage);
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
    <div className="fixed bottom-6 right-6 z-50">
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-105"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}

      {isExpanded && (
        <div className="bg-white rounded-2xl shadow-2xl w-96 h-[500px] flex flex-col border border-gray-200 transition-all duration-300">
          <div className="bg-blue-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
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

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((message) => (
              <div key={message.id}>
                <div
                  className={`flex ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.content && (
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      {message.content}
                    </div>
                  )}
                </div>
                
                {message.properties && (
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-start">
                      <div className="bg-gray-100 p-2 rounded-lg text-sm text-gray-600">
                        Propiedades encontradas:
                      </div>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
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
                <div className="bg-gray-100 text-gray-900 p-3 rounded-2xl flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Escribiendo...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Escribe tu mensaje..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
