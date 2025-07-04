import React, { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { ApiService } from '../services/api';
import { PropertyCard } from './PropertyCard';
import { Loader, AlertTriangle } from 'lucide-react';

export const Home: React.FC = () => {
  const { 
    config, 
    categories, 
    setCategoryProperties, 
    isLoading, 
    setLoading, 
    error, 
    setError 
  } = useAppStore(state => state);

  useEffect(() => {
    const fetchAllProperties = async () => {
      if (!config.nocodbUrl || !config.nocodbApiKey || !config.nocodbTable) {
        setError("La configuración de NocoDB no está completa. Por favor, configúrala en el panel de administración.");
        return;
      }
      
      setLoading(true);
      setError(null);

      try {
        const categoryPromises = categories.map(category => 
          ApiService.fetchPropertiesByCategory(
            config.nocodbUrl,
            config.nocodbApiKey,
            config.nocodbDatabase,
            config.nocodbTable,
            category.name
          )
        );

        const propertiesByCategories = await Promise.all(categoryPromises);

        propertiesByCategories.forEach((properties, index) => {
          setCategoryProperties(categories[index].id, properties);
        });

      } catch (err: any) {
        setError(err.message || 'Ocurrió un error al cargar las propiedades.');
      } finally {
        setLoading(false);
      }
    };

    if (categories.length > 0) {
      fetchAllProperties();
    }
  }, [config.nocodbUrl, config.nocodbApiKey, config.nocodbTable, config.nocodbDatabase, JSON.stringify(categories.map(c => c.id))]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold mr-2">Error:</strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {categories.map(category => (
        (category.properties && category.properties.length > 0) && (
          <section key={category.id} className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 border-l-4 pl-4" style={{ borderColor: category.color || config.primaryColor }}>
              {category.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {category.properties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </section>
        )
      ))}
      {categories.every(c => !c.properties || c.properties.length === 0) && !isLoading && (
        <div className="text-center py-16 text-gray-500">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold">No se encontraron propiedades</h3>
          <p className="mt-2">Asegúrate de haber creado categorías en el panel de administración que coincidan con las de tu base de datos.</p>
        </div>
      )}
    </div>
  );
};
