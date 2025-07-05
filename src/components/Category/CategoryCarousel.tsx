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
    <section className="mb-16">
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
      <div ref={scrollRef} className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
        {properties.map((property) => (
          <div key={property.id} className="flex-shrink-0 w-full sm:w-[380px]">
            <PropertyCard 
              property={property} 
              onCardClick={onCardClick}
              hideScheduleButton
            />
          </div>
        ))}
      </div>
    </section>
  );
};
