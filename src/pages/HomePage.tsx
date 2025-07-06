import React, { useEffect } from 'react';
import { Header } from '../components/Layout/Header';
import { EmbeddedChat } from '../components/Chat/EmbeddedChat';
import { CategoryCarousel } from '../components/Category/CategoryCarousel';
import { useAppStore } from '../store/useAppStore';
import { ApiService } from '../services/api';
import { PropertyModal } from '../components/Property/PropertyModal';
import { ImageModal } from '../components/ImageModal';
import { ChatWidget } from '../components/Layout/ChatWidget';

export const HomePage: React.FC = () => {
  const { 
    config, 
    setCategories, 
    setLoading, 
    setError,
    openPropertyModal,
    setCategoryProperties
  } = useAppStore();

  // Correctly get categories from the config object
  const { categories } = config;

  useEffect(() => {
    const loadPropertiesForCategories = async () => {
      // The store ensures `categories` is always an array, so we can safely use it.
      if (!config.nocodbUrl || !config.nocodbApiKey || !config.nocodbTable) {
        // Set mock data for demonstration when no database is configured
        if (categories && categories.length === 0) {
          const mockCategories = [
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
          ];
          setCategories(mockCategories);
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
    };

    loadPropertiesForCategories();
  }, [config.nocodbUrl, config.nocodbApiKey, config.nocodbTable, categories, setCategories, setError, setLoading, setCategoryProperties]);

  const safeCategories = Array.isArray(categories) ? categories : [];

  return (
    <div className="min-h-screen bg-white">
      <ImageModal />
      <Header />
      
      {config.chatDisplayMode === 'embedded' && <EmbeddedChat />}
      {config.chatDisplayMode === 'widget' && <ChatWidget />}
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div id="propiedades">
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

      <footer
  className="py-12"
  style={{
    backgroundColor: config.footerBgColor,
    color: config.footerTextColor,
  }}
  id="contacto"
>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid md:grid-cols-3 gap-8 md:items-start">
      {/* Columna 1: Logo + descripción + redes */}
      <div>
        <div className="flex items-center space-x-3 mb-4">
          {config.logo ? (
            <img
              src={config.logo}
              alt={config.footerCompanyName}
              className="h-10 w-10 object-contain"
            />
          ) : (
            <div className="w-10 h-10 bg-blue-600 rounded-lg"></div>
          )}
          <h3 className="text-2xl font-bold">{config.footerCompanyName}</h3>
        </div>
        <p className="opacity-80 mb-6">{config.footerDescription}</p>
        <div className="flex space-x-4 mt-4">
          {config.socialLinks?.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-75 transition-opacity"
              style={{ color: config.footerTextColor }}
              title={link.name}
            >
              <span className="sr-only">{link.name}</span>
              {link.icon === 'facebook' && <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>}
                    {link.icon === 'instagram' && <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" /></svg>}
                    {link.icon === 'twitter' && <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>}
                    {link.icon === 'linkedin' && <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>}
                    {link.icon === 'youtube' && <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>}
                    {link.icon === 'email' && <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>}
            </a>
          ))}
        </div>
      </div>

      {/* Columna 2: Enlaces Rápidos */}
      <div className="md:pl-8">
        <h4 className="text-lg font-semibold mb-4">Enlaces Rápidos</h4>
        <div className="space-y-2">
          {config.footerLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              className="block opacity-80 hover:opacity-100 transition-opacity"
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>

      {/* Columna 3: Contacto */}
      <div className="md:pl-8">
        <h4 className="text-lg font-semibold mb-4">Contacto</h4>
        <div className="space-y-2 opacity-80">
          <p>📧 info@homeinmobiliaria.co</p>
          <p>📱 +57 315 353 7131</p>
          <p>📍 Popayán, Cauca, Colombia</p>
        </div>
      </div>
    </div>

    <div className="border-t border-opacity-20 mt-8 pt-8 text-center opacity-60">
      <p>
        &copy; {new Date().getFullYear()} {config.footerCompanyName}. Todos los
        derechos reservados.
      </p>
    </div>
  </div>
</footer>

      <PropertyModal />
    </div>
  );
};
