export interface SocialLink {
  id: string;
  name: string;
  url: string;
  icon: string;
}

export interface AppConfig {
  webhookUrl: string;
  nocodbApiKey: string;
  nocodbUrl: string;
  nocodbDatabase: string;
  nocodbTable: string;
  logo: string;
  title: string;
  headerTitle: string;
  primaryColor: string;
  secondaryColor: string;
  headerBgColor: string;
  footerBgColor: string;
  footerTextColor: string;
  menuItemColor: string;
  menuItemHoverColor: string;
  initialChatMessage: string;
  footerCompanyName: string;
  footerDescription: string;
  footerLinks?: { name: string; url: string }[];
  adminUsername: string;
  adminPassword: string;
  quickQuestions: { id: string; text: string }[];
  visibleDetails: string[];
  chatDisplayMode: 'widget' | 'embedded';
  chatBackgroundImage?: string;
  chatBgColor?: string;
  chatSectionBgImage?: string;
  chatSectionBgColor?: string;
  socialLinks: SocialLink[];
  socialIconSize?: number;
  menuItemFontSize?: number;
  showMobileMenu: boolean;
  categories: Category[];
}

export interface Property {
  id?: string;
  title: string;
  location: string;
  bedrooms: number;
  bathrooms?: number;
  price: number;
  mainImage: string;
  images: string[];
  description: string;
  category?: string;
  type?: string;
  modality?: string;
  details: Record<string, any>;
}

export interface Category {
  id: string;
  name: string;
  color?: string;
  properties?: Property[];
}

export interface ChatMessage {
  id:string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  properties?: Property[];
  isTyping?: boolean;
}

export interface ChatResponse {
  output: {
    text?: string;
    properties?: Property[];
  }
}

export interface NocoDBProperty {
  Id?: string;
  id?: string;
  'Nombre de la Propiedad': string;
  'Ubicación (Ciudad - Zona - Sector - Barrio)': string;
  'Número de Habitaciones': number;
  'Número de Baños': number;
  'Precio de Venta'?: number;
  'Precio de Alquiler'?: number;
  'Foto Destacada'?: {
    url: string;
    signedUrl: string;
    thumbnails?: {
      card_cover?: {
        url: string;
        signedUrl: string;
      }
    }
  }[];
  'Fotos de la Propiedad'?: {
    url: string;
    signedUrl: string;
  }[];
  'Descripción Semantica'?: string;
  'Categoría'?: string;
  'Tipo de Propiedad'?: string;
  'Modalidad'?: string;
  'Disponibilidad'?: string;
  [key: string]: any;
}
