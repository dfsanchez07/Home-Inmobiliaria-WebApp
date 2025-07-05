import axios from 'axios';
import { AppConfig, ChatResponse, NocoDBProperty, Property } from '../types';

// --- Conexión para la tabla de Configuración ---
// Estas credenciales son para la tabla AppConfig y se leen desde el archivo .env
const CONFIG_NOCODB_URL = import.meta.env.VITE_APP_CONFIG_NOCODB_URL;
const CONFIG_NOCODB_API_KEY = import.meta.env.VITE_APP_CONFIG_NOCODB_API_KEY;
const CONFIG_TABLE_NAME = import.meta.env.VITE_APP_CONFIG_NOCODB_ID_TABLE;
const CONFIG_RECORD_ID = 'main';

export class ApiService {
  /**
   * Fetches the main application configuration from the AppConfig table.
   * Uses dedicated credentials from environment variables.
   * Now handles both object and stringified JSON responses from NocoDB.
   */
  static async fetchConfig(): Promise<AppConfig> {
    try {
      if (!CONFIG_NOCODB_URL || !CONFIG_NOCODB_API_KEY) {
        throw new Error('Las credenciales para la configuración (VITE_APP_CONFIG_...) no están definidas en el archivo .env.');
      }
      const url = `${CONFIG_NOCODB_URL}/api/v2/tables/${CONFIG_TABLE_NAME}/records`;
      const response = await axios.get(url, {
        headers: { 'xc-token': CONFIG_NOCODB_API_KEY },
        params: {
          where: `(key,eq,${CONFIG_RECORD_ID})`
        }
      });
      if (response.data.list && response.data.list.length > 0) {
        const value = response.data.list[0].value;
        // Handle case where value is a stringified JSON or a direct object
        if (typeof value === 'string') {
          try {
            return JSON.parse(value);
          } catch (e) {
            console.error("Failed to parse config JSON from string:", e);
            throw new Error("La configuración almacenada parece tener un formato JSON inválido.");
          }
        }
        return value;
      }
      throw new Error('Configuration not found in NocoDB');
    } catch (error) {
      console.error('NocoDB Config API Error:', error);
      throw new Error('Error al cargar la configuración');
    }
  }

  /**
   * Updates the main application configuration in the AppConfig table.
   * Uses dedicated credentials from environment variables.
   * Now stringifies the config to ensure it's saved correctly.
   * Also creates the config record if it doesn't exist.
   * @param config The full configuration object to save.
   */
  static async updateConfig(config: AppConfig): Promise<void> {
    try {
      if (!CONFIG_NOCODB_URL || !CONFIG_NOCODB_API_KEY) {
        throw new Error('Las credenciales para la configuración (VITE_APP_CONFIG_...) no están definidas en el archivo .env.');
      }
      
      const findUrl = `${CONFIG_NOCODB_URL}/api/v2/tables/${CONFIG_TABLE_NAME}/records`;
      const findResponse = await axios.get(findUrl, {
        headers: { 'xc-token': CONFIG_NOCODB_API_KEY },
        params: { where: `(key,eq,${CONFIG_RECORD_ID})` }
      });

      const configAsString = JSON.stringify(config);

      // If record doesn't exist, create it.
      if (!findResponse.data.list || findResponse.data.list.length === 0) {
        console.log("Configuration record not found. Creating a new one...");
        const createUrl = `${CONFIG_NOCODB_URL}/api/v2/tables/${CONFIG_TABLE_NAME}/records`;
        await axios.post(createUrl, {
          key: CONFIG_RECORD_ID,
          value: configAsString
        }, {
          headers: { 'xc-token': CONFIG_NOCODB_API_KEY }
        });
        return;
      }
      
      // If record exists, update it.
      const recordToUpdate = findResponse.data.list[0];
      // FIX: Make the primary key detection robust (handles 'Id' and 'id')
      const recordId = recordToUpdate.Id || recordToUpdate.id;
      const pkColumnName = 'Id' in recordToUpdate ? 'Id' : 'id';

      if (!recordId) {
        throw new Error("El registro de configuración existe pero no tiene una clave primaria ('Id' o 'id').");
      }

      const updateUrl = `${CONFIG_NOCODB_URL}/api/v2/tables/${CONFIG_TABLE_NAME}/records`;

      const payload = {
        [pkColumnName]: recordId,
        value: configAsString
      };

      // --- DEBUGGING LOGS ---
      console.log("--- NocoDB Update Debug ---");
      console.log("Record ID to update:", recordId);
      console.log("Request URL (PATCH):", updateUrl);
      console.log("Request Payload:", payload);
      console.log("---------------------------");

      // FIX: Use single object for PATCH, which is more standard than a bulk array for a single update.
      await axios.patch(updateUrl, payload, {
        headers: { 'xc-token': CONFIG_NOCODB_API_KEY }
      });

    } catch (error) {
      console.error('NocoDB Update Config API Error:', error);
      throw new Error('Error al actualizar la configuración');
    }
  }

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

  /**
   * Fetches properties from the properties table.
   * Uses dynamic credentials provided from the application config.
   */
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
