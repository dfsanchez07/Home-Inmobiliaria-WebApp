import React, { useCallback, useEffect, useRef } from 'react';
import { Property } from '../../types';
import { PropertyCard } from '../Property/PropertyCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CategoryCarouselProps {
  title: string;
  properties?: Property[];
  onCardClick: (property: Property) => void;
}

export const CategoryCarousel: React.FC<CategoryCarouselProps> = ({ 
  title, 
  properties = [], 
  onCardClick 
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = React.useState(false);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);

  // Safari-compatible scroll function
  const scroll = useCallback((direction: 'left' | 'right') => {
    if (!scrollRef.current || isScrolling) return;
    
    setIsScrolling(true);
    
    const container = scrollRef.current;
    const { scrollLeft, clientWidth, scrollWidth } = container;
    const scrollAmount = clientWidth * 0.8;
    
    const targetScroll = direction === 'left' 
      ? Math.max(0, scrollLeft - scrollAmount)
      : Math.min(scrollWidth - clientWidth, scrollLeft + scrollAmount);

    // Use requestAnimationFrame for smooth scrolling in Safari
    const startTime = performance.now();
    const startScroll = scrollLeft;
    const scrollDistance = targetScroll - startScroll;
    const duration = 500; // 500ms duration

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      
      const newScrollLeft = startScroll + (scrollDistance * easeOutCubic);
      container.scrollLeft = newScrollLeft;
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        setIsScrolling(false);
      }
    };

    requestAnimationFrame(animateScroll);
  }, [isScrolling]);

  // Check scroll position to update button states
  const checkScrollPosition = useCallback(() => {
    if (!scrollRef.current) return;
    
    const { scrollLeft, clientWidth, scrollWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  }, []);

  // Handle scroll events
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    checkScrollPosition();

    // Safari-compatible scroll event listener
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          checkScrollPosition();
          ticking = false;
        });
        ticking = true;
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    
    // Check scroll position after images load
    const images = container.querySelectorAll('img');
    let loadedImages = 0;
    
    const checkImageLoad = () => {
      loadedImages++;
      if (loadedImages === images.length) {
        setTimeout(checkScrollPosition, 100);
      }
    };

    images.forEach(img => {
      if (img.complete) {
        checkImageLoad();
      } else {
        img.addEventListener('load', checkImageLoad);
        img.addEventListener('error', checkImageLoad);
      }
    });

    return () => {
      container.removeEventListener('scroll', handleScroll);
      images.forEach(img => {
        img.removeEventListener('load', checkImageLoad);
        img.removeEventListener('error', checkImageLoad);
      });
    };
  }, [checkScrollPosition, properties]);

  // Handle resize events
  useEffect(() => {
    const handleResize = () => {
      setTimeout(checkScrollPosition, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [checkScrollPosition]);

  if (!properties || properties.length === 0) {
    return null;
  }

  return (
    <section className="relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
        <div className="hidden sm:flex space-x-2">
          <button 
            onClick={() => scroll('left')}
            disabled={!canScrollLeft || isScrolling}
            className={`p-2 rounded-full transition-colors ${
              canScrollLeft && !isScrolling
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                : 'bg-gray-50 text-gray-300 cursor-not-allowed'
            }`}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button 
            onClick={() => scroll('right')}
            disabled={!canScrollRight || isScrolling}
            className={`p-2 rounded-full transition-colors ${
              canScrollRight && !isScrolling
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                : 'bg-gray-50 text-gray-300 cursor-not-allowed'
            }`}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>
      
      <div className="relative">
        <div 
          ref={scrollRef} 
          className="flex overflow-x-auto pb-4 space-x-4 scroll-smooth"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch' // Enable momentum scrolling on iOS Safari
          }}
        >
          {properties.map((property) => (
            <div 
              key={property.id} 
              className="flex-shrink-0 w-[90%] sm:w-[380px]"
            >
              <PropertyCard 
                property={property} 
                onCardClick={onCardClick}
                hideScheduleButton
              />
            </div>
          ))}
        </div>
        
        {/* Safari-compatible gradient overlay */}
        {properties.length > 1 && canScrollRight && (
          <div 
            className="absolute top-0 right-0 bottom-4 w-16 pointer-events-none sm:hidden"
            style={{
              background: 'linear-gradient(to left, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%)'
            }}
            aria-hidden="true" 
          />
        )}
      </div>
      
      {/* Add custom scrollbar styles for Safari */}
      <style jsx>{`
        .overflow-x-auto::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};