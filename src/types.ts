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
  footerLinks: { name: string; url: string }[];
  adminUsername: string;
  adminPassword: string;
  quickReplies: string[];
  visibleDetails: string[];
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
  properties?: Property[];
  color?: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  properties?: Property[];
}

export interface ChatResponse {
  text: string;
  properties?: Property[];
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
    thumbnails?: {
      card_cover?: {
        signedUrl: string;
      };
    };
  }[];
  'Fotos de la Propiedad'?: {
    signedUrl: string;
  }[];
  'Descripción Semantica'?: string;
  'Categoría'?: string;
  'Tipo de Propiedad'?: string;
  'Modalidad'?: string;
  'Disponibilidad'?: string;
}
