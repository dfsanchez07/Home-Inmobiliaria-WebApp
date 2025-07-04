import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { X, MapPin, Bed, Bath, Tag, ChevronLeft, ChevronRight, Phone } from 'lucide-react';

export const PropertyModal: React.FC = () => {
  const { isPropertyModalOpen, selectedProperty, closePropertyModal, requestVisit, config } = useAppStore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (selectedProperty) {
      setCurrentImageIndex(0);
    }
  }, [selectedProperty]);

  if (!isPropertyModalOpen || !selectedProperty) {
    return null;
  }

  const allImages = selectedProperty.images && selectedProperty.images.length > 0 
    ? selectedProperty.images 
    : [selectedProperty.mainImage];

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % allImages.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + allImages.length) % allImages.length);
  };
  
  const handleThumbnailClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setCurrentImageIndex(index);
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={closePropertyModal}>
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col lg:flex-row animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image Gallery */}
        <div className="w-full lg:w-1/2 flex-shrink-0 bg-gray-200">
          <div className="relative">
            <img 
              src={allImages[currentImageIndex]} 
              alt={selectedProperty.title} 
              className="w-full h-64 lg:h-[55vh] object-cover rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none"
            />
            {allImages.length > 1 && (
              <>
                <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition">
                  <ChevronLeft size={24} />
                </button>
                <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition">
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>
          {allImages.length > 1 && (
            <div className="flex space-x-2 p-2 bg-gray-100 overflow-x-auto">
              {allImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  onClick={(e) => handleThumbnailClick(e, index)}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 ${
                    index === currentImageIndex ? 'border-blue-500' : 'border-transparent'
                  } transition flex-shrink-0`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Property Details */}
        <div className="p-6 flex-grow flex flex-col">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedProperty.title}</h2>
            <button onClick={closePropertyModal} className="text-gray-400 hover:text-gray-600">
              <X size={28} />
            </button>
          </div>
          <div className="flex items-center text-gray-500 mb-4">
            <MapPin size={16} className="mr-2" />
            <span>{selectedProperty.location}</span>
          </div>
          
          <div className="text-3xl font-extrabold mb-4" style={{ color: config.primaryColor }}>
            {formatPrice(selectedProperty.price)}
          </div>

          <div className="flex-grow overflow-y-auto pr-2 space-y-4 text-gray-700">
            <p>{selectedProperty.description}</p>
            
            <div className="grid grid-cols-2 gap-4 border-t pt-4">
              <div className="flex items-center"><Bed size={20} className="mr-2 text-blue-500" /> {selectedProperty.bedrooms} Habitaciones</div>
              <div className="flex items-center"><Bath size={20} className="mr-2 text-blue-500" /> {selectedProperty.bathrooms} Baños</div>
              <div className="flex items-center"><Tag size={20} className="mr-2 text-blue-500" /> {selectedProperty.type}</div>
              <div className="flex items-center font-semibold">{selectedProperty.modality}</div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2">Más detalles:</h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {Object.entries(selectedProperty.details).map(([key, value]) => (
                  (value !== undefined && value !== null && value !== '') && (
                    <div key={key} className="text-sm">
                      <span className="font-semibold">{key}:</span> {String(value)}
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 border-t pt-4">
            <button 
              onClick={() => {
                requestVisit(selectedProperty.title);
                closePropertyModal();
              }}
              className="w-full text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              style={{ backgroundColor: config.secondaryColor }}
            >
              <Phone size={20} />
              <span>Solicitar Visita / Más Información</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
