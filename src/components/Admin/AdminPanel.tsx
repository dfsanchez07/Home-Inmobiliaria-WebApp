import React, { useState, useEffect } from 'react';
import { Settings, Database, Palette, Save, Key, Home, LogOut, Upload, Trash2, Edit, Plus, MessageSquare, ListChecks } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { ApiService } from '../../services/api';
import { Category, AppConfig } from '../../types';
import { CategoryFormModal } from './CategoryFormModal';
import { QuickQuestionFormModal } from './QuickQuestionFormModal';

const AdminPanel = () => {
  // Destructure all required state and actions from the store
  const {
    config,
    updateAndSaveConfig,
    logout,
    setError,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useAppStore(state => ({
    config: state.config,
    updateAndSaveConfig: state.updateAndSaveConfig,
    logout: state.logout,
    setError: state.setError,
    addCategory: state.addCategory,
    updateCategory: state.updateCategory,
    deleteCategory: state.deleteCategory,
  }));
  
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState<AppConfig>(config);
  const [isLoading, setIsLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<{ id: string; text: string } | null>(null);
  const [newDetail, setNewDetail] = useState('');

  // Get categories from the config object
  const categories = config.categories || [];

  useEffect(() => {
    setFormData(config);
  }, [config]);

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'database', label: 'Base de Datos', icon: Database },
    { id: 'categories', label: 'Categorías', icon: Home },
    { id: 'appearance', label: 'Apariencia', icon: Palette },
    { id: 'content', label: 'Contenido', icon: Edit }
  ];

  const handleSave = async () => {
    // Now, when we save, the config object in the store (which was updated by category actions)
    // has been synced to formData by the useEffect. So we save the complete, updated config.
    await updateAndSaveConfig(formData); 
    alert('¡Configuración guardada con éxito!');
  };

  const handleTestConnection = async () => {
    if (!formData.nocodbUrl || !formData.nocodbApiKey || !formData.nocodbTable) {
      alert('Por favor completa todos los campos de NocoDB');
      return;
    }

    setIsLoading(true);
    try {
      await ApiService.fetchProperties(
        formData.nocodbUrl,
        formData.nocodbApiKey,
        formData.nocodbDatabase,
        formData.nocodbTable,
        undefined,
        1
      );
      
      alert(`¡Conexión exitosa!`);
    } catch (error: any) {
      setError('Error al conectar con NocoDB: ' + error.message);
      alert('Error al conectar con NocoDB: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (field: keyof typeof formData) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFormData({ ...formData, [field]: e.target?.result as string });
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleSaveCategory = (categoryToSave: Category) => {
    // These actions now update the config object in the store
    if (categoryToSave.id.startsWith('manual-cat-')) {
      const newId = `cat-${categoryToSave.name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`;
      addCategory({ ...categoryToSave, id: newId });
    } else {
      updateCategory(categoryToSave.id, categoryToSave);
    }
    setEditingCategory(null);
  };

  const handleSaveQuickQuestion = (question: { id: string; text: string }) => {
    const existing = formData.quickQuestions.find(q => q.id === question.id);
    let updatedQuestions;
    if (existing) {
      updatedQuestions = formData.quickQuestions.map(q => q.id === question.id ? question : q);
    } else {
      updatedQuestions = [...formData.quickQuestions, question];
    }
    setFormData({ ...formData, quickQuestions: updatedQuestions });
    setEditingQuestion(null);
  };

  const handleDeleteQuickQuestion = (id: string) => {
    const updatedQuestions = formData.quickQuestions.filter(q => q.id !== id);
    setFormData({ ...formData, quickQuestions: updatedQuestions });
  };

  const handleAddDetail = () => {
    if (newDetail && !formData.visibleDetails.includes(newDetail)) {
      const updatedDetails = [...formData.visibleDetails, newDetail];
      setFormData({ ...formData, visibleDetails: updatedDetails });
      setNewDetail('');
    }
  };

  const handleDeleteDetail = (detail: string) => {
    const updatedDetails = formData.visibleDetails.filter(d => d !== detail);
    setFormData({ ...formData, visibleDetails: updatedDetails });
  };

  const renderGeneralTab = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Configuración General</h4>
        <p className="text-blue-700 text-sm">
          Configura los aspectos básicos de tu aplicación inmobiliaria.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL del Webhook (n8n)
          </label>
          <input
            type="url"
            value={formData.webhookUrl}
            onChange={(e) => setFormData({ ...formData, webhookUrl: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://tu-n8n-instance.com/webhook/chat"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Título de la Empresa
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Título del Encabezado
          </label>
          <input
            type="text"
            value={formData.headerTitle}
            onChange={(e) => setFormData({ ...formData, headerTitle: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Usuario Administrador
          </label>
          <input
            type="text"
            value={formData.adminUsername}
            onChange={(e) => setFormData({ ...formData, adminUsername: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contraseña Administrador
          </label>
          <input
            type="password"
            value={formData.adminPassword}
            onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mensaje Inicial del Chat
        </label>
        <textarea
          value={formData.initialChatMessage}
          onChange={(e) => setFormData({ ...formData, initialChatMessage: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        />
      </div>
    </div>
  );

  const renderDatabaseTab = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 text-yellow-800">
          <Key className="h-5 w-5" />
          <span className="font-medium">Configuración de NocoDB</span>
        </div>
        <p className="text-yellow-700 mt-2">
          Configura la conexión a tu base de datos NocoDB para cargar las propiedades automáticamente.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL de NocoDB
          </label>
          <input
            type="url"
            value={formData.nocodbUrl}
            onChange={(e) => setFormData({ ...formData, nocodbUrl: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://tu-nocodb-instance.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            API Key de NocoDB
          </label>
          <input
            type="password"
            value={formData.nocodbApiKey}
            onChange={(e) => setFormData({ ...formData, nocodbApiKey: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tu API Key de NocoDB"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre de la Base de Datos
          </label>
          <input
            type="text"
            value={formData.nocodbDatabase}
            onChange={(e) => setFormData({ ...formData, nocodbDatabase: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="inmobiliaria (opcional)"
          />
          <p className="text-xs text-gray-500 mt-1">
            Deja vacío si usas la base de datos por defecto
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre de la Tabla
          </label>
          <input
            type="text"
            value={formData.nocodbTable}
            onChange={(e) => setFormData({ ...formData, nocodbTable: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="propiedades"
          />
        </div>
      </div>

      <button
        onClick={handleTestConnection}
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
      >
        <Database className="h-5 w-5" />
        <span>{isLoading ? 'Probando conexión...' : 'Probar Conexión'}</span>
      </button>
    </div>
  );

  const renderCategoriesTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Gestión de Categorías de Filtro</h3>
        <button
          onClick={() => setEditingCategory({ id: `manual-cat-${Date.now()}`, name: '', color: '#2563EB' })}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Nueva Categoría</span>
        </button>
      </div>
      <p className="text-sm text-gray-600">
        Estas categorías se usarán para filtrar las propiedades en la página principal. El nombre de la categoría debe coincidir con el valor en el campo 'Categoría' de tu tabla en NocoDB.
      </p>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Color
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {category.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: category.color }}></div>
                      <span className="text-sm text-gray-500">{category.color}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => setEditingCategory(category)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteCategory(category.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {categories.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Home className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No hay categorías definidas. Añade una para empezar a filtrar propiedades.</p>
        </div>
      )}
    </div>
  );
	
const renderAppearanceTab = () => (
  <div className="space-y-8">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h4 className="font-medium text-purple-900 mb-2">Personalización Visual</h4>
        <p className="text-purple-700 text-sm">
          Personaliza la apariencia de tu sitio web para que refleje la identidad de tu marca.
        </p>
      </div>

      {/* Logo Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Logo y Marca</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo de la Empresa
            </label>
            <div className="flex items-center space-x-4">
              {formData.logo && (
                <img src={formData.logo} alt="Logo" className="h-16 w-16 object-contain border border-gray-200 rounded-lg" />
              )}
              <button
                onClick={() => handleImageUpload('logo')}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
              >
                <Upload className="h-4 w-4" />
                <span>Subir Logo</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Display Mode Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Modo de Visualización del Chat</h4>
        <div className="space-y-2">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="chatDisplayMode"
              value="embedded"
              checked={formData.chatDisplayMode === 'embedded'}
              onChange={(e) => setFormData({ ...formData, chatDisplayMode: e.target.value as any })}
              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="text-gray-700">Incrustado (Protagonista en la página)</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="chatDisplayMode"
              value="widget"
              checked={formData.chatDisplayMode === 'widget'}
              onChange={(e) => setFormData({ ...formData, chatDisplayMode: e.target.value as any })}
              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="text-gray-700">Widget (Burbuja flotante)</span>
          </label>
        </div>
      </div>

      {/* Colors Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Esquema de Colores</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color Primario
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={formData.primaryColor}
                onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={formData.primaryColor}
                onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color Secundario
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={formData.secondaryColor}
                onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={formData.secondaryColor}
                onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color de Fondo del Encabezado
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={formData.headerBgColor}
                onChange={(e) => setFormData({ ...formData, headerBgColor: e.target.value })}
                className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={formData.headerBgColor}
                onChange={(e) => setFormData({ ...formData, headerBgColor: e.target.value })}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color de Items del Menú
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={formData.menuItemColor}
                onChange={(e) => setFormData({ ...formData, menuItemColor: e.target.value })}
                className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={formData.menuItemColor}
                onChange={(e) => setFormData({ ...formData, menuItemColor: e.target.value })}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color Hover del Menú
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={formData.menuItemHoverColor}
                onChange={(e) => setFormData({ ...formData, menuItemHoverColor: e.target.value })}
                className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={formData.menuItemHoverColor}
                onChange={(e) => setFormData({ ...formData, menuItemHoverColor: e.target.value })}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color de Fondo del Pie de Página
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={formData.footerBgColor}
                onChange={(e) => setFormData({ ...formData, footerBgColor: e.target.value })}
                className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={formData.footerBgColor}
                onChange={(e) => setFormData({ ...formData, footerBgColor: e.target.value })}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Configuración del Pie de Página</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la Empresa
            </label>
            <input
              type="text"
              value={formData.footerCompanyName}
              onChange={(e) => setFormData({ ...formData, footerCompanyName: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción de la Empresa
            </label>
            <textarea
              value={formData.footerDescription}
              onChange={(e) => setFormData({ ...formData, footerDescription: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color del Texto del Pie de Página
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={formData.footerTextColor}
                onChange={(e) => setFormData({ ...formData, footerTextColor: e.target.value })}
                className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={formData.footerTextColor}
                onChange={(e) => setFormData({ ...formData, footerTextColor: e.target.value })}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
		
    {/* Social Media Section */}
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">Redes Sociales</h4>
      <p className="text-sm text-gray-600 mb-4">
        Configura los enlaces a tus redes sociales que aparecerán en el encabezado y pie de página.
      </p>

      <div className="space-y-4">
        {formData.socialLinks.map((link, index) => (
          <div key={link.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
            <select
              value={link.icon}
              onChange={(e) => {
                const updatedLinks = [...formData.socialLinks];
                updatedLinks[index] = { ...updatedLinks[index], icon: e.target.value };
                setFormData({ ...formData, socialLinks: updatedLinks });
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="facebook">Facebook</option>
              <option value="instagram">Instagram</option>
              <option value="twitter">Twitter</option>
              <option value="linkedin">LinkedIn</option>
              <option value="youtube">YouTube</option>
              <option value="email">Email</option>
            </select>
            <input
              type="text"
              value={link.name}
              onChange={(e) => {
                const updatedLinks = [...formData.socialLinks];
                updatedLinks[index] = { ...updatedLinks[index], name: e.target.value };
                setFormData({ ...formData, socialLinks: updatedLinks });
              }}
              placeholder="Nombre"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="url"
              value={link.url}
              onChange={(e) => {
                const updatedLinks = [...formData.socialLinks];
                updatedLinks[index] = { ...updatedLinks[index], url: e.target.value };
                setFormData({ ...formData, socialLinks: updatedLinks });
              }}
              placeholder="URL"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => {
                const updatedLinks = formData.socialLinks.filter((_, i) => i !== index);
                setFormData({ ...formData, socialLinks: updatedLinks });
              }}
              className="text-red-600 hover:text-red-900 p-2"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        ))}

        <button
          onClick={() => {
            const newLink = {
              id: `social-${Date.now()}`,
              name: '',
              url: '',
              icon: 'facebook'
            };
            setFormData({ 
              ...formData, 
              socialLinks: [...formData.socialLinks, newLink] 
            });
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Añadir Red Social</span>
        </button>
      </div>
    </div>
  </div>
);

  const renderContentTab = () => (
    <div className="space-y-8">
      {/* Quick Questions Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <MessageSquare className="h-6 w-6 text-blue-600" />
            <h4 className="text-lg font-semibold text-gray-900">Preguntas Rápidas del Chat</h4>
          </div>
          <button
            onClick={() => setEditingQuestion({ id: `qq-${Date.now()}`, text: '' })}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Nueva Pregunta</span>
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Gestiona las preguntas que aparecen como sugerencias debajo del campo de texto del chat.
        </p>
        <div className="space-y-3">
          {formData.quickQuestions.map((q) => (
            <div key={q.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <p className="text-gray-800">{q.text}</p>
              <div className="space-x-2">
                <button onClick={() => setEditingQuestion(q)} className="text-blue-600 hover:text-blue-900"><Edit className="h-4 w-4" /></button>
                <button onClick={() => handleDeleteQuickQuestion(q.id)} className="text-red-600 hover:text-red-900"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
          {formData.quickQuestions.length === 0 && <p className="text-gray-500 text-center py-4">No hay preguntas rápidas.</p>}
        </div>
      </div>

      {/* Visible Details Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <ListChecks className="h-6 w-6 text-green-600" />
          <h4 className="text-lg font-semibold text-gray-900">Detalles Visibles en Propiedades</h4>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Define qué campos del objeto de detalles de una propiedad se mostrarán en las tarjetas. El nombre debe coincidir exactamente con el campo en NocoDB.
        </p>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newDetail}
            onChange={(e) => setNewDetail(e.target.value)}
            placeholder="Ej: Área, Parqueadero, Piso"
            className="flex-grow border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddDetail}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Añadir</span>
          </button>
        </div>
        <div className="space-y-3">
          {formData.visibleDetails.map((detail) => (
            <div key={detail} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <p className="text-gray-800 font-mono text-sm">{detail}</p>
              <button onClick={() => handleDeleteDetail(detail)} className="text-red-600 hover:text-red-900"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
          {formData.visibleDetails.length === 0 && <p className="text-gray-500 text-center py-4">No hay detalles visibles configurados.</p>}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Panel de Administración</h1>
                <p className="text-gray-300 mt-2">
                  Configura y gestiona tu aplicación inmobiliaria
                </p>
              </div>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Sidebar */}
            <div className="w-full md:w-64 bg-gray-100 p-6 border-b md:border-b-0 md:border-r">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  {tabs.find(tab => tab.id === activeTab)?.label}
                </h2>
              </div>

              {activeTab === 'general' && renderGeneralTab()}
              {activeTab === 'database' && renderDatabaseTab()}
              {activeTab === 'categories' && renderCategoriesTab()}
              {activeTab === 'appearance' && renderAppearanceTab()}
              {activeTab === 'content' && renderContentTab()}

              <div className="mt-8 flex justify-end space-x-4">
                <button
                  onClick={handleSave}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Save className="h-5 w-5" />
                  <span>Guardar Cambios</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {editingCategory && (
        <CategoryFormModal
          category={editingCategory}
          onClose={() => setEditingCategory(null)}
          onSave={handleSaveCategory}
        />
      )}
      {editingQuestion && (
        <QuickQuestionFormModal
          question={editingQuestion}
          onClose={() => setEditingQuestion(null)}
          onSave={handleSaveQuickQuestion}
        />
      )}
    </div>
  );
};

export default AdminPanel;
