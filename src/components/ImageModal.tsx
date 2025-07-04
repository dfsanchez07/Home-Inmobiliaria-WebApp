import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { X } from 'lucide-react';

export const ImageModal: React.FC = () => {
  const { isImageModalOpen, imageModalUrl, closeImageModal } = useAppStore();

  if (!isImageModalOpen || !imageModalUrl) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
      onClick={closeImageModal}
    >
      <button 
        className="absolute top-4 right-4 text-white hover:text-gray-300"
        onClick={closeImageModal}
      >
        <X size={32} />
      </button>
      <div className="relative max-w-4xl max-h-[90vh] p-4" onClick={(e) => e.stopPropagation()}>
        <img 
          src={imageModalUrl} 
          alt="Full size property view" 
          className="max-w-full max-h-full object-contain rounded-lg"
        />
      </div>
    </div>
  );
};
