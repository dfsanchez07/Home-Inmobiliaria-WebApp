import React from 'react';
import { Property } from '../types';
import { MapPin, Bed, Bath, Tag } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const { openPropertyModal, config } = useAppStore(state => ({
    openPropertyModal: state.openPropertyModal,
    config: state.config
  }));

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full"
      onClick={() => openPropertyModal(property)}
    >
      <div className="relative">
        <img 
          src={property.mainImage} 
          alt={property.title} 
          className="w-full h-56 object-cover"
        />
        <div 
          className="absolute top-2 right-2 px-3 py-1 rounded-full text-sm font-semibold text-white"
          style={{ backgroundColor: config.primaryColor }}
        >
          {property.modality}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-800 truncate">{property.title}</h3>
        <div className="flex items-center text-gray-500 mt-1">
          <MapPin size={16} className="mr-2" />
          <span className="text-sm">{property.location}</span>
        </div>
        
        <div className="mt-4 text-2xl font-extrabold" style={{ color: config.primaryColor }}>
          {formatPrice(property.price)}
        </div>

        <div className="mt-4 border-t pt-4 flex-grow">
          <p className="text-gray-600 text-sm mb-3">Detalles:</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {config.visibleDetails.map(detailKey => {
              const detailValue = property.details[detailKey];
              if (detailValue !== undefined && detailValue !== null && detailValue !== '') {
                return (
                  <div key={detailKey} className="flex items-center text-sm text-gray-700">
                    <span className="font-semibold mr-2">{detailKey}:</span>
                    <span>{detailValue}</span>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t flex items-center justify-between text-gray-600">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Bed size={20} className="mr-2" />
              <span>{property.bedrooms}</span>
            </div>
            <div className="flex items-center">
              <Bath size={20} className="mr-2" />
              <span>{property.bathrooms}</span>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <Tag size={16} className="mr-2" />
            <span>{property.type}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
