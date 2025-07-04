import React, { useState, useEffect } from 'react';
import { Property } from '../../types';
import { X, Save, Upload, Plus, Trash2 } from 'lucide-react';

interface PropertyFormModalProps {
  property: Property | null;
  onClose: () => void;
  onSave: (property: Property) => void;
}

export const PropertyFormModal: React.FC<PropertyFormModalProps> = ({ property, onClose, onSave }) => {
  const [formData, setFormData] = useState<Property | null>(null);
  const [newImageUrl, setNewImageUrl] = useState('');

  useEffect(() => {
    if (property) {
      setFormData({
        ...property,
        images: property.images || [],
        details: property.details || {}
      });
    }
  }, [property]);

  if (!formData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('details.')) {
      const detailKey = name.split('.')[1];
      setFormData({
        ...formData,
        details: {
          ...formData.details,
          [detailKey]: value
        }
      });
    } else if (name === 'price' || name === 'bedrooms' || name === 'bathrooms') {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          setFormData({
            ...formData,
            mainImage: imageUrl
          });
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleAddImage = () => {
    if (newImageUrl && !formData.images.includes(newImageUrl)) {
      setFormData({
        ...formData,
        images: [...formData.images, newImageUrl]
      });
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    setFormData({
      ...formData,
      images: updatedImages
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim()) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl my-8">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">{formData.id ? 'Editar Propiedad' : 'Nueva Propiedad'}</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Información Básica</h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input 
                  type="text" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleChange} 
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" 
                  required 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
                <input 
                  type="text" 
                  name="location" 
                  value={formData.location} 
                  onChange={handleChange} 
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <input 
                  type="text" 
                  name="category" 
                  value={formData.category} 
                  onChange={handleChange} 
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                  <input 
                    type="number" 
                    name="price" 
                    value={formData.price} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Habitaciones</label>
                  <input 
                    type="number" 
                    name="bedrooms" 
                    value={formData.bedrooms} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Baños</label>
                  <input 
                    type="number" 
                    name="bathrooms" 
                    value={formData.bathrooms || 0} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                  <input 
                    type="text" 
                    name="details.Tipo" 
                    value={formData.details?.Tipo || ''} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Modalidad</label>
                <select 
                  name="details.Modalidad" 
                  value={formData.details?.Modalidad || ''} 
                  onChange={handleChange} 
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seleccionar...</option>
                  <option value="Venta">Venta</option>
                  <option value="Alquiler">Alquiler</option>
                  <option value="Venta/Alquiler">Venta/Alquiler</option>
                </select>
              </div>
            </div>
            
            {/* Images and Description */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Imágenes y Descripción</h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Imagen Principal</label>
                <div className="flex items-center space-x-4">
                  {formData.mainImage && (
                    <img 
                      src={formData.mainImage} 
                      alt="Imagen principal" 
                      className="h-20 w-20 object-cover rounded-lg border border-gray-200" 
                      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://via.placeholder.com/80?text=Error'; }}
                    />
                  )}
                  <div className="flex-1">
                    <input 
                      type="text" 
                      name="mainImage" 
                      value={formData.mainImage} 
                      onChange={handleChange} 
                      placeholder="URL de la imagen" 
                      className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" 
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={handleImageUpload} 
                    className="p-2 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    <Upload className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Imágenes Adicionales</label>
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <input 
                      type="text" 
                      value={newImageUrl} 
                      onChange={(e) => setNewImageUrl(e.target.value)} 
                      placeholder="URL de la imagen" 
                      className="flex-1 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" 
                    />
                    <button 
                      type="button" 
                      onClick={handleAddImage} 
                      className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {formData.images.map((img, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={img} 
                          alt={`Imagen ${index + 1}`} 
                          className="h-16 w-full object-cover rounded-md border border-gray-200" 
                          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://via.placeholder.com/64?text=Error'; }}
                        />
                        <button 
                          type="button" 
                          onClick={() => handleRemoveImage(index)} 
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange} 
                  rows={4} 
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
            </div>
          </div>
          
          {/* Additional Details */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Detalles Adicionales</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['Área', 'Parqueadero', 'Jardín', 'Patio', 'Piso', 'Ascensor'].map((detail) => (
                <div key={detail}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{detail}</label>
                  <input 
                    type="text" 
                    name={`details.${detail}`} 
                    value={formData.details?.[detail] || ''} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" 
                  />
                </div>
              ))}
            </div>
          </div>
        </form>
        
        <div className="p-4 bg-gray-50 border-t flex justify-end space-x-3">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            onClick={handleSubmit} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>Guardar Cambios</span>
          </button>
        </div>
      </div>
    </div>
  );
};
