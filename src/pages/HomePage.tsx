import React, { useEffect, useCallback } from 'react';
import { Header } from '../components/Layout/Header';
import { Footer } from '../components/Layout/Footer';
import { EmbeddedChat } from '../components/Chat/EmbeddedChat';
import { CategoryCarousel } from '../components/Category/CategoryCarousel';
import { useAppStore } from '../store/useAppStore';
import { ApiService } from '../services/api';
import { PropertyModal } from '../components/Property/PropertyModal';
import { ImageModal } from '../components/ImageModal';
import { ChatWidget } from '../components/Layout/ChatWidget';
import { HeroSection } from '../components/Hero/HeroSection';

export const HomePage: React.FC = () => {
  const { 
    config, 
    setCategories, 
    setLoading, 
    setError,
    openPropertyModal,
    setCategoryProperties,
    initializeChat
  } = useAppStore();

  // Correctly get categories from the config object
  const { categories } = config;

  // Memoize the mock data to prevent recreation on every render
  const mockCategories = React.useMemo(() => [
    {
      id: 'casas-venta',
      name: 'Casas en Venta',
      color: '#3b82f6',
      properties: [
        {
          id: '1',
          title: 'Casa Moderna en Zona Norte',
          location: 'Popayán, Norte, Villa del Viento',
          bedrooms: 3,
          bathrooms: 2,
          price: 450000000,
          mainImage: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800',
          images: [
            'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800'
          ],
          description: 'Hermosa casa moderna con acabados de lujo, ubicada en una de las mejores zonas de la ciudad.',
          details: { 'Área': '180m²', 'Tipo': 'Casa', 'Modalidad': 'Venta', 'Parqueadero': 'Sí', 'Jardín': 'Sí', 'Habitaciones': 3, 'Baños': 2 }
        },
        {
          id: '2',
          title: 'Casa Familiar en El Centro',
          location: 'Popayán, Centro, Barrio Colonial',
          bedrooms: 4,
          bathrooms: 3,
          price: 380000000,
          mainImage: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
          images: [
            'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800'
          ],
          description: 'Casa tradicional con amplios espacios, perfecta para familias grandes.',
          details: { 'Área': '220m²', 'Tipo': 'Casa', 'Modalidad': 'Venta', 'Parqueadero': 'Sí', 'Patio': 'Sí', 'Habitaciones': 4, 'Baños': 3 }
        }
      ]
    },
    {
      id: 'apartamentos-arriendo',
      name: 'Apartamentos en Arriendo',
      color: '#10b981',
      properties: [
        {
          id: '3',
          title: 'Apartamento Moderno Torre Central',
          location: 'Popayán, Centro, Torre Empresarial',
          bedrooms: 2,
          bathrooms: 2,
          price: 1200000,
          mainImage: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
          images: ['https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800'],
          description: 'Apartamento moderno con excelente ubicación y todas las comodidades.',
          details: { 'Área': '85m²', 'Tipo': 'Apartamento', 'Modalidad': 'Arriendo', 'Piso': '8', 'Ascensor': 'Sí', 'Habitaciones': 2, 'Baños': 2 }
        }
      ]
    }
  ], []);

  // Use useCallback to prevent unnecessary re-renders
  const loadPropertiesForCategories = useCallback(async () => {
    // The store ensures `categories` is always an array, so we can safely use it.
    if (!config.nocodbUrl || !config.nocodbApiKey || !config.nocodbTable) {
      // Set mock data for demonstration when no database is configured
      if (categories && categories.length === 0) {
        // Use requestAnimationFrame to ensure DOM is ready before updating state
        requestAnimationFrame(() => {
          setCategories(mockCategories);
        });
      }
      return;
    }

    const categoriesToFetch = (categories || []).filter(c => !c.properties || c.properties.length === 0);

    if (categoriesToFetch.length > 0) {
      setLoading(true);
      try {
        await Promise.all(categoriesToFetch.map(async (category) => {
          try {
            const properties = await ApiService.fetchPropertiesByCategory(
              config.nocodbUrl,
              config.nocodbApiKey,
              config.nocodbDatabase,
              config.nocodbTable,
              category.name
            );
            setCategoryProperties(category.id, properties);
          } catch (error) {
            console.error(`Error loading properties for category ${category.name}:`, error);
            setCategoryProperties(category.id, []);
          }
        }));
        setError(null);
      } catch (error) {
        console.error('Error loading properties:', error);
        setError('Error al cargar las propiedades');
      } finally {
        setLoading(false);
      }
    }
  }, [config.nocodbUrl, config.nocodbApiKey, config.nocodbTable, categories, setCategories, setError, setLoading, setCategoryProperties, mockCategories]);

  // Initialize chat in Safari-compatible way
  useEffect(() => {
    // Add a small delay to ensure DOM is ready in Safari
    const timer = setTimeout(() => {
      initializeChat();
    }, 100);

    return () => clearTimeout(timer);
  }, [initializeChat]);

  // Load properties with Safari-compatible timing
  useEffect(() => {
    // Use requestAnimationFrame to ensure Safari has finished rendering
    const loadData = () => {
      requestAnimationFrame(() => {
        loadPropertiesForCategories();
      });
    };

    // Add a small delay for Safari
    const timer = setTimeout(loadData, 150);

    return () => clearTimeout(timer);
  }, [loadPropertiesForCategories]);

  const safeCategories = Array.isArray(categories) ? categories : [];

  return (
    <div className="min-h-screen bg-white">
      <ImageModal />
      <Header />
      {/* <HeroSection /> <-- oculta seccion Hero */}
      
      {config.chatDisplayMode === 'embedded' && <EmbeddedChat />}
      {config.chatDisplayMode === 'widget' && <ChatWidget />}
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div id="propiedades" className="space-y-16">
          {safeCategories.map((category) => (
            <CategoryCarousel
              key={category.id}
              title={category.name}
              properties={category.properties}
              onCardClick={openPropertyModal}
            />
          ))}
        </div>

        {safeCategories.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m0 0h2M3 21h4m-4-4h4m0-4H3m5-4h14" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay propiedades disponibles
            </h3>
            <p className="text-gray-500">
              Agrega categorías en el panel de administración para ver propiedades.
            </p>
          </div>
        )}
      </main>

      <Footer />

      <PropertyModal />
    </div>
  );
};