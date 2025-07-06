import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppConfig, Property, ChatMessage, Category } from '../types';
import { ApiService } from '../services/api';

interface AppStore {
  config: AppConfig;
  chatMessages: ChatMessage[];
  isLoading: boolean;
  isSendingMessage: boolean;  // Flag específico para envío de mensajes
  error: string | null;
  isAuthenticated: boolean;
  chatSessionId: string;
  selectedProperty: Property | null;
  isPropertyModalOpen: boolean;
  isImageModalOpen: boolean;
  imageModalUrl: string | null;
  isChatOpen: boolean;
  
  // Actions
  fetchAndSetConfig: () => Promise<void>;
  updateAndSaveConfig: (config: Partial<AppConfig>) => Promise<void>;
  setCategories: (categories: Category[]) => void;
  setCategoryProperties: (categoryId: string, properties: Property[]) => void;
  addChatMessage: (message: ChatMessage) => void;
  initializeChat: () => void;
  clearChat: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addCategory: (category: Category) => Promise<void>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  requestVisit: (propertyTitle: string) => void;
  openPropertyModal: (property: Property) => void;
  closePropertyModal: () => void;
  openImageModal: (url: string) => void;
  closeImageModal: () => void;
  sendMessage: (text: string) => Promise<void>;
  toggleChat: () => void;
}

const defaultConfig: AppConfig = {
  webhookUrl: '',
  nocodbApiKey: '',
  nocodbUrl: '',
  nocodbDatabase: '',
  nocodbTable: '',
  logo: '',
  title: 'Inmobiliaria Moderna',
  headerTitle: 'Encuentra tu hogar ideal',
  primaryColor: '#2563EB',
  secondaryColor: '#10B981',
  headerBgColor: '#ffffff',
  footerBgColor: '#1f2937',
  footerTextColor: '#ffffff',
  menuItemColor: '#374151',
  menuItemHoverColor: '#2563EB',
  initialChatMessage: '¡Hola! Soy tu asistente virtual inmobiliario. ¿Qué tipo de propiedad estás buscando hoy? Puedo ayudarte a encontrar casas, apartamentos, locales comerciales y más.',
  footerCompanyName: 'Inmobiliaria Moderna',
  footerDescription: 'Tu hogar ideal te está esperando. Más de 10 años conectando familias con sus sueños.',
  footerLinks: [
    { name: 'Inicio', url: '#inicio' },
    { name: 'Propiedades', url: '#propiedades' },
    { name: 'Contacto', url: '#contacto' },
    { name: 'Nosotros', url: '#nosotros' }
  ],
  footerEmail: 'info@homeinmobiliaria.co',
  footerPhone: '+57 324 780 9184',
  footerAddress: 'Popayán, Cauca, Colombia',
  quickQuestions: [
    { id: 'q1', text: '¿Qué casas hay en venta?' },
    { id: 'q2', text: 'Busco un apartamento en arriendo' },
    { id: 'q3', text: 'Muéstrame propiedades de lujo' },
    { id: 'q4', text: '¿Tienen locales comerciales?' },
  ],
  visibleDetails: ['Área', 'Parqueadero', 'Habitaciones', 'Baños'],
  adminUsername: 'admin',
  adminPassword: 'admin123',
  chatDisplayMode: 'embedded',
  chatBackgroundImage: '',
  chatBgColor: '#ffffff',
  chatSectionBgImage: '',
  chatSectionBgColor: '#F3F4F6',
  socialLinks: [
    { id: 'facebook', name: 'Facebook', url: 'https://facebook.com', icon: 'facebook' },
    { id: 'instagram', name: 'Instagram', url: 'https://instagram.com', icon: 'instagram' }
  ],
  socialIconSize: 20,
  menuItemFontSize: 16,
  showMobileMenu: true,
  categories: [],
  showFooterSocialIcons: true,
  showFooterQuickLinks: true,
  showFooterContactInfo: true,
  showFooterCopyright: true,
};

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      config: defaultConfig,
      chatMessages: [],
      isLoading: false,
      isSendingMessage: false,  // Estado inicial del flag de envío
      error: null,
      isAuthenticated: false,
      chatSessionId: `session-${Date.now()}-${Math.random()}`,
      selectedProperty: null,
      isPropertyModalOpen: false,
      isImageModalOpen: false,
      imageModalUrl: null,
      isChatOpen: false,

      fetchAndSetConfig: async () => {
        set({ isLoading: true });
        try {
          const fetchedConfig = await ApiService.fetchConfig();
          // Ensure categories is always an array
          if (!fetchedConfig.categories) {
            fetchedConfig.categories = [];
          }
          set({ config: { ...defaultConfig, ...fetchedConfig }, isLoading: false });
        } catch (error) {
          console.error("Failed to fetch config:", error);
          set({ 
            error: 'No se pudo cargar la configuración del servidor. Usando configuración por defecto.', 
            isLoading: false,
            config: defaultConfig 
          });
        }
      },

      updateAndSaveConfig: async (newConfig) => {
        const originalConfig = get().config;
        const updatedConfig = { ...originalConfig, ...newConfig };
        
        set({ isLoading: true, config: updatedConfig });

        try {
          await ApiService.updateConfig(updatedConfig);
          set({ isLoading: false });
        } catch (error) {
          console.error("Failed to save config:", error);
          set({ error: 'No se pudo guardar la configuración.', isLoading: false, config: originalConfig });
        }
      },

      login: (username, password) => {
        const { config } = get();
        const expectedUsername = config.adminUsername || 'admin';
        const expectedPassword = config.adminPassword || 'admin123';
        
        if (username === expectedUsername && password === expectedPassword) {
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },

      logout: () => {
        set({ isAuthenticated: false });
      },

      setCategories: (categories) => {
        const config = get().config;
        set({ config: { ...config, categories } });
      },

      addChatMessage: (message) =>
        set((state) => ({
          chatMessages: [...state.chatMessages, message]
        })),
      
      initializeChat: () => {
        const { chatMessages, config, addChatMessage } = get();
        if (chatMessages.length > 0) return;

        const typingMessage: ChatMessage = {
          id: `assistant-typing-${Date.now()}`,
          type: 'assistant',
          content: '',
          isTyping: true,
          timestamp: new Date(),
        };
        addChatMessage(typingMessage);

        setTimeout(() => {
          const welcomeMessage: ChatMessage = {
            id: 'assistant-initial-welcome',
            type: 'assistant',
            content: config.initialChatMessage,
            timestamp: new Date(),
          };
          set(state => ({
            chatMessages: state.chatMessages.filter(m => !m.isTyping).concat([welcomeMessage])
          }));
        }, 1500);
      },

      clearChat: () => set({ chatMessages: [] }),

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      addCategory: async (category) => {
        const { config, updateAndSaveConfig } = get();
        const newCategories = [...config.categories, { ...category, properties: category.properties || [] }];
        set({ config: { ...config, categories: newCategories } });
        await updateAndSaveConfig({ categories: newCategories });
      },

      updateCategory: async (id, updatedCategory) => {
        const { config, updateAndSaveConfig } = get();
        const newCategories = config.categories.map(c => 
          c.id === id ? { ...c, ...updatedCategory } : c
        );
        set({ config: { ...config, categories: newCategories } });
        await updateAndSaveConfig({ categories: newCategories });
      },

      deleteCategory: async (id) => {
        const { config, updateAndSaveConfig } = get();
        const newCategories = config.categories.filter(c => c.id !== id);
        set({ config: { ...config, categories: newCategories } });
        await updateAndSaveConfig({ categories: newCategories });
      },
      
      setCategoryProperties: (categoryId, properties) => {
        const config = get().config;
        const newCategories = config.categories.map(c =>
          c.id === categoryId ? { ...c, properties } : c
        );
        set({ config: { ...config, categories: newCategories } });
      },

      requestVisit: (propertyTitle) => {
        const { sendMessage, config, closePropertyModal } = get();
        const message = `¡Hola! Estoy interesado en la propiedad "${propertyTitle}" y me gustaría agendar una visita.`;
        sendMessage(message);
        
        if (config.chatDisplayMode !== 'embedded') {
          set({ isChatOpen: true });
        }
        
        closePropertyModal();

        setTimeout(() => {
          const chatElement = document.getElementById('chat-widget') || document.getElementById('embedded-chat');
          chatElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      },

      openPropertyModal: (property) => set({ selectedProperty: property, isPropertyModalOpen: true }),
      closePropertyModal: () => set({ selectedProperty: null, isPropertyModalOpen: false }),

      openImageModal: (url) => set({ isImageModalOpen: true, imageModalUrl: url }),
      closeImageModal: () => set({ isImageModalOpen: false, imageModalUrl: null }),

      sendMessage: async (text) => {
        const { addChatMessage, config, chatSessionId } = get();
        
        // Prevenir múltiples envíos simultáneos
        if (get().isSendingMessage) return;

        // Establecer estado de envío para prevenir múltiples envíos
        set({ 
          isSendingMessage: true, 
          isLoading: true 
        });

        const userMessage: ChatMessage = { 
          id: `user-${Date.now()}`, 
          type: 'user', 
          content: text, 
          timestamp: new Date() 
        };
        addChatMessage(userMessage);

        const typingMessage: ChatMessage = {
          id: `assistant-typing-${Date.now()}`,
          type: 'assistant',
          content: '',
          isTyping: true,
          timestamp: new Date(),
        };
        addChatMessage(typingMessage);
  
        try {
          const response = await ApiService.sendChatMessage(config.webhookUrl, text, chatSessionId);
          
          // Remover indicador de escritura
          set(state => ({ 
            chatMessages: state.chatMessages.filter(m => !m.isTyping),
            isSendingMessage: false,
            isLoading: false
          }));

          if (response.output.text) {
            addChatMessage({
              id: `assistant-text-${Date.now()}`,
              type: 'assistant',
              content: response.output.text,
              timestamp: new Date(),
            });
          }

          if (response.output.properties && response.output.properties.length > 0) {
            addChatMessage({
              id: `assistant-props-${Date.now()}`,
              type: 'assistant',
              content: '',
              properties: response.output.properties,
              timestamp: new Date(),
            });
          }

          if (!response.output.text && (!response.output.properties || response.output.properties.length === 0)) {
            addChatMessage({
              id: `assistant-empty-${Date.now()}`,
              type: 'assistant',
              content: 'No he podido procesar tu solicitud.',
              timestamp: new Date(),
            });
          }
        } catch (error) {
          console.error("Chat send message error:", error);
          const errorMessage: ChatMessage = {
            id: `error-${Date.now()}`,
            type: 'assistant',
            content: 'Lo siento, ha ocurrido un error. Por favor, intenta de nuevo.',
            timestamp: new Date(),
          };
          set(state => ({ 
            chatMessages: state.chatMessages.filter(m => !m.isTyping).concat([errorMessage]),
            isSendingMessage: false,
            isLoading: false
          }));
        }
      },

      toggleChat: () => set(state => ({ isChatOpen: !state.isChatOpen })),
    }),
    {
      name: 'real-estate-app-storage',
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated,
        config: { categories: state.config.categories },
      }),
      merge: (persistedState, currentState) => {
        const state = { ...currentState };
        const pState = persistedState as any;
        if (pState) {
          state.isAuthenticated = pState.isAuthenticated || false;
          if (pState.config && pState.config.categories) {
            state.config.categories = pState.config.categories;
          }
        }
        return state;
      },
    }
  )
);