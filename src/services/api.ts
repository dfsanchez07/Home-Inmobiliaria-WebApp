import axios from 'axios';
import { ChatResponse, NocoDBProperty, Property } from '../types';

export class ApiService {
  static async sendChatMessage(
    webhookUrl: string, 
    message: string,
    sessionId: string | null
  ): Promise<ChatResponse> {
    try {
      const response = await axios.post(webhookUrl, {
        message,
        sessionId,
        timestamp: new Date().toISOString()
      });
      
      return response.data;
    } catch (error) {
      console.error('Chat API Error:', error);
      throw new Error('Error al enviar mensaje al chat');
    }
  }

  static async fetchProperties(
    nocodbUrl: string,
    apiKey: string,
    database: string,
    table: string,
    filters?: string,
    limit?: number
  ): Promise<Property[]> {
    try {
      const baseUrl = database 
        ? `${nocodbUrl}/api/v2/tables/${table}/records`
        : `${nocodbUrl}/api/v1/db/data/${table}`;
      
      const params = new URLSearchParams();
      
      if (filters) {
        params.append('where', filters);
      } else {
        params.append('where', '(Disponibilidad,eq,Disponible)');
      }

      if (limit) {
        params.append('limit', limit.toString());
      }
        
      const response = await axios.get(`${baseUrl}?${params.toString()}`, {
        headers: {
          'xc-token': apiKey
        }
      });

      return response.data.list.map((item: NocoDBProperty) => {
        const property: Property = {
          id: (item.Id || item.id || item['Nombre de la Propiedad']).toString(),
          title: item['Nombre de la Propiedad'],
          location: item['Ubicación (Ciudad - Zona - Sector - Barrio)'],
          bedrooms: item['Número de Habitaciones'] || 0,
          bathrooms: item['Número de Baños'] || 0,
          price: item['Precio de Venta'] || item['Precio de Alquiler'] || 0,
          mainImage: item['Foto Destacada']?.[0]?.thumbnails?.card_cover?.signedUrl || item['Foto Destacada']?.[0]?.signedUrl || 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800',
          images: [
            ...(item['Foto Destacada']?.[0]?.signedUrl ? [item['Foto Destacada'][0].signedUrl] : []),
            ...(item['Fotos de la Propiedad']?.map(photo => photo.signedUrl) || [])
          ].filter((value, index, self) => self.indexOf(value) === index),
          description: item['Descripción Semantica'] || '',
          category: item['Categoría'] || 'Sin categoría',
          type: item['Tipo de Propiedad'] || '',
          modality: item['Modalidad'] || '',
          details: {}
        };

        const knownFields = [
          'Id', 'id', 'Nombre de la Propiedad', 'Ubicación (Ciudad - Zona - Sector - Barrio)',
          'Número de Habitaciones', 'Número de Baños', 'Precio de Venta', 'Precio de Alquiler',
          'Foto Destacada', 'Fotos de la Propiedad', 'Descripción Semantica', 'Categoría',
          'Tipo de Propiedad', 'Modalidad', 'Disponibilidad', 'Title', 'CreatedAt', 'UpdatedAt'
        ];

        for (const key in item) {
          if (!knownFields.includes(key) && item[key] !== null && item[key] !== undefined && item[key] !== '') {
            property.details[key] = item[key];
          }
        }
        
        property.details['Habitaciones'] = item['Número de Habitaciones'];
        property.details['Baños'] = item['Número de Baños'];
        property.details['Tipo'] = item['Tipo de Propiedad'];
        property.details['Modalidad'] = item['Modalidad'];

        if (property.images.length === 0) {
          property.images.push(property.mainImage);
        }

        return property;
      });
    } catch (error) {
      console.error('NocoDB API Error:', error);
      throw new Error('Error al cargar propiedades');
    }
  }

  static async fetchPropertiesByCategory(
    nocodbUrl: string,
    apiKey: string,
    database: string,
    table: string,
    category: string
  ): Promise<Property[]> {
    const filter = `(Categoría,eq,${category})~and(Disponibilidad,eq,Disponible)`;
    return this.fetchProperties(nocodbUrl, apiKey, database, table, filter);
  }
}
