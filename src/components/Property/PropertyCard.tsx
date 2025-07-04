import React from 'react';
import { MapPin, ArrowRight, Bed, Bath, Maximize } from 'lucide-react';
import { Property } from '../../types';
import { useAppStore } from '../../store/useAppStore';

interface PropertyCardProps {
  property: Property;
  onCardClick?: (property: Property) => void;
  hideScheduleButton?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onCardClick,
  hideScheduleButton = false,
}) => {
  const { config, requestVisit } = useAppStore(state => ({
    config: state.config,
    requestVisit: state.requestVisit,
  }));

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(property);
    }
  };

  const handleScheduleVisitClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    requestVisit(property.title);
    
    setTimeout(() => {
      const chatHeader = document.querySelector('#chat h2') as HTMLElement;
      if (chatHeader) {
        chatHeader.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div 
      className="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1 group cursor-pointer flex flex-col h-full"
      onClick={handleCardClick}
    >
      <div className="relative overflow-hidden">
        <img
          src={property.mainImage || 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
          alt={property.title}
          className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0"></div>
        <div 
          className="absolute top-4 left-4 text-white px-3 py-1 rounded-full text-sm font-semibold"
          style={{ backgroundColor: config.primaryColor }}
        >
          {property.modality || 'Venta'}
        </div>
        <div className="absolute bottom-4 left-4">
          <h3 className="text-white text-xl font-bold shadow-2xl line-clamp-1">{property.title}</h3>
          <div className="flex items-center text-gray-200 text-sm mt-1">
            <MapPin className="h-4 w-4 mr-1.5" />
            <span className="line-clamp-1">{property.location}</span>
          </div>
        </div>
      </div>
      
      <div className="p-5 flex-grow flex flex-col">
        <div className="flex justify-around items-center text-center my-4 text-gray-700">
          <div className="flex items-center space-x-2">
            <Bed size={20} className="text-gray-500" />
            <span className="font-semibold">{property.bedrooms}</span>
          </div>
          <div className="text-gray-300">|</div>
          <div className="flex items-center space-x-2">
            <Bath size={20} className="text-gray-500" />
            <span className="font-semibold">{property.bathrooms}</span>
          </div>
          <div className="text-gray-300">|</div>
          <div className="flex items-center space-x-2">
            <Maximize size={20} className="text-gray-500" />
            <span className="font-semibold">{property.details['Metros 2'] || 'N/A'} m²</span>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-5 line-clamp-3 flex-grow">
          {property.description || 'No hay descripción disponible para esta propiedad.'}
        </p>
        
        <div className="flex items-center justify-between pt-4 border-t mt-auto">
          <div className="font-extrabold text-xl" style={{ color: config.primaryColor }}>
            {formatPrice(property.price)}
          </div>
          
          {!hideScheduleButton && (
            <button
              onClick={handleScheduleVisitClick}
              className="text-white px-5 py-2.5 rounded-lg font-semibold hover:opacity-90 transition-all flex items-center shadow-sm hover:shadow-md"
              style={{ backgroundColor: config.primaryColor }}
            >
              <span>Agendar Visita</span>
              <ArrowRight className="h-5 w-5 ml-2 transform transition-transform group-hover:translate-x-1" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
