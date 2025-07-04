import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { X, ChevronLeft, ChevronRight, MapPin, Bed, Bath, Maximize } from 'lucide-react';
import { Property } from '../../types';

export const PropertyModal: React.FC = () => {
  const { 
    isPropertyModalOpen, 
    selectedProperty, 
    closePropertyModal,
    config,
    requestVisit,
  } = useAppStore();
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPropertyModalOpen) return;
      if (e.key === 'Escape') {
        closePropertyModal();
      }
      if (e.key === 'ArrowRight') {
        nextImage();
      }
      if (e.key === 'ArrowLeft') {
        prevImage();
      }
    };

    if (isPropertyModalOpen) {
      document.body.style.overflow = 'hidden';
      setCurrentImageIndex(0);
    } else {
      document.body.style.overflow = 'auto';
    }
    
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPropertyModalOpen]);

  if (!isPropertyModalOpen || !selectedProperty) {
    return null;
  }

  const property = selectedProperty as Property;
  const images = property.images && property.images.length > 0 
    ? property.images 
    : [property.mainImage || 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'];

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleScheduleVisit = () => {
    requestVisit(property.title);
    closePropertyModal();
    
    // Scroll to chat header after a small delay
    setTimeout(() => {
      const chatHeader = document.querySelector('#chat h2') as HTMLElement;
      if (chatHeader) {
        chatHeader.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
  };

  const visibleDetails = config.visibleDetails || [];
  const additionalDetails = Object.entries(property.details || {})
    .filter(([key]) => visibleDetails.includes(key) && !['Área', 'Metros 2', 'Habitaciones', 'Baños'].includes(key));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="bg-white rounded-none sm:rounded-2xl shadow-2xl w-full h-full sm:max-w-5xl sm:h-full sm:max-h-[90vh] relative overflow-y-auto">
        <button 
          onClick={closePropertyModal}
          className="absolute top-4 right-4 z-20 bg-white/70 p-2 rounded-full text-gray-800 hover:bg-white transition-all"
        >
          <X size={24} />
        </button>

        <div className="h-1/2 md:h-3/5 relative group">
          <img 
            src={images[currentImageIndex]} 
            alt={`${property.title} - image ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>

          {images.length > 1 && (
            <>
              <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full text-gray-800 hover:bg-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100">
                <ChevronLeft size={28} />
              </button>
              <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full text-gray-800 hover:bg-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100">
                <ChevronRight size={28} />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between md:items-start">
            <div>
              <div 
                className="text-white px-3 py-1 rounded-full text-sm font-semibold inline-block mb-2"
                style={{ backgroundColor: config.primaryColor }}
              >
                {property.modality || 'Venta'}
              </div>
              <h2 className="text-3xl font-bold text-gray-900">{property.title}</h2>
              <div className="flex items-center text-gray-500 text-md mt-2">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{property.location}</span>
              </div>
            </div>
            <div className="mt-4 md:mt-0 text-left md:text-right flex-shrink-0">
              <div className="font-extrabold text-3xl" style={{ color: config.primaryColor }}>
                {formatPrice(property.price)}
              </div>
              <div className="text-gray-500 text-sm">{property.type || 'Propiedad'}</div>
            </div>
          </div>

          <div className="flex justify-around items-center text-center my-6 py-4 border-y">
            <div className="flex items-center space-x-2 text-gray-700">
              <Bed size={24} className="text-gray-500" />
              <div>
                <span className="font-bold text-lg">{property.bedrooms}</span>
                <span className="text-sm block">Habitaciones</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-gray-700">
              <Bath size={24} className="text-gray-500" />
              <div>
                <span className="font-bold text-lg">{property.bathrooms}</span>
                <span className="text-sm block">Baños</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-gray-700">
              <Maximize size={24} className="text-gray-500" />
              <div>
                <span className="font-bold text-lg">{property.details['Metros 2'] || 'N/A'}</span>
                <span className="text-sm block">m²</span>
              </div>
            </div>
          </div>

          <p className="text-gray-700 leading-relaxed mb-6">{property.description}</p>

          {additionalDetails.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Detalles Adicionales</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {additionalDetails.map(([key, value]) => (
                  <div key={key} className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-semibold text-gray-800">{key}</p>
                    <p className="text-gray-600">{String(value)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-6 border-t">
            <button
              onClick={handleScheduleVisit}
              className="w-full text-white px-6 py-3 rounded-lg font-semibold text-lg hover:opacity-90 transition-all flex items-center justify-center shadow-lg"
              style={{ backgroundColor: config.primaryColor }}
            >
              Agendar Visita
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
