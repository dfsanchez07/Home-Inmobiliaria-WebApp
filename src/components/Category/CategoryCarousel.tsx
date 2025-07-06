import React from 'react';
import { Property } from '../../types';
import { PropertyCard } from '../Property/PropertyCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CategoryCarouselProps {
  title: string;
  properties?: Property[];
  onCardClick: (property: Property) => void;
}

export const CategoryCarousel: React.FC<CategoryCarouselProps> = ({ title, properties = [], onCardClick }) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!properties || properties.length === 0) {
    return null;
  }

  return (
    <section className="relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
        <div className="hidden sm:flex space-x-2">
          <button onClick={() => scroll('left')} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </button>
          <button onClick={() => scroll('right')} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
            <ChevronRight className="h-6 w-6 text-gray-600" />
          </button>
        </div>
      </div>
      <div className="relative">
        <div 
          ref={scrollRef} 
          className="flex overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2"
          style={{
            WebkitOverflowScrolling: 'touch', /* Para mejor desplazamiento en iOS */
            scrollSnapType: 'x mandatory'
          }}
        >
          {properties.map((property) => (
            <div 
              key={property.id} 
              className="flex-shrink-0 w-[90%] sm:w-[380px] px-2"
              style={{ scrollSnapAlign: 'start' }}
            >
              <PropertyCard 
                property={property} 
                onCardClick={onCardClick}
                hideScheduleButton
              />
            </div>
          ))}
        </div>
        {properties.length > 1 && (
          <div 
            className="absolute inset-y-0 right-0 -mr-4 sm:-mr-6 lg:-mr-8 w-16 bg-gradient-to-l from-white to-transparent pointer-events-none sm:hidden" 
            aria-hidden="true" 
          />
        )}
      </div>
    </section>
  );
};
