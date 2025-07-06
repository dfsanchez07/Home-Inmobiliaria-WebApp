import { String } from "aws-sdk/clients/acm";

export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  mainImage: string;
  images: string[];
  description: string;
  category: string;
  type: string;
  modality: string;
  details: Record<string, any>;
}

export interface NocoDBProperty {
  Id?: number;
  id?: number;
  'Nombre de la Propiedad': string;
  'Ubicación (Ciudad - Zona - Sector - Barrio)': string;
  'Número de Habitaciones'?: number;
  'Número de Baños'?: number;
  'Precio de Venta'?: number;
  'Precio de Alquiler'?: number;
  'Foto Destacada'?: { signedUrl: string; thumbnails?: { card_cover?: { signedUrl: string } } }[];
  'Fotos de la Propiedad'?: { signedUrl: string }[];
  'Descripción Semantica'?: string;
  'Categoría'?: string;
  'Tipo de Propiedad'?: string;
  'Modalidad'?: string;
  Disponibilidad?: string;
  Title?: string;
  CreatedAt?: string;
  UpdatedAt?: string;
  [key: string]: any;
}

export interface Category {
  id: string;
  name: string;
  color?: string;
  properties?: Property[];
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  properties?: Property[];
  isTyping?: boolean;
  timestamp: Date;
}

export interface ChatResponse {
  output: {
    text: string;
    properties?: Property[];
  };
}

export interface SocialLink {
  id: string;
  name: string;
  url: string;
  icon: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'youtube' | 'email';
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
  footerLinks: { name: string; url: string }[];
  quickQuestions: { id: string; text: string }[];
  visibleDetails: string[];
  adminUsername: string;
  adminPassword: string;
  chatDisplayMode: 'embedded' | 'widget';
  socialLinks: SocialLink[];
  categories: Category[];
}
