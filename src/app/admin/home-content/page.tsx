'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Plus, Edit, Trash2, X, Save, Image as ImageIcon, 
  Layout, Grid, FileText, Eye, EyeOff, GripVertical,
  Clock, Calendar, Heart, Users, Book, Star, Info, Upload
} from 'lucide-react';

type HomeService = {
  id: number;
  title: string;
  description: string;
  icon: string;
  link_url: string;
  display_order: number;
  is_active: boolean;
};

type InterestPage = {
  id: number;
  title: string;
  description: string;
  image_url: string;
  link_url: string;
  display_order: number;
  is_active: boolean;
};

const ICONS = [
  { value: 'clock', label: 'Reloj', icon: Clock },
  { value: 'calendar', label: 'Calendario', icon: Calendar },
  { value: 'heart', label: 'Corazón', icon: Heart },
  { value: 'users', label: 'Usuarios', icon: Users },
  { value: 'book', label: 'Libro', icon: Book },
  { value: 'star', label: 'Estrella', icon: Star },
  { value: 'info', label: 'Info', icon: Info },
];

const emptyService: Omit<HomeService, 'id'> = {
  title: '',
  description: '',
  icon: 'info',
  link_url: '',
  display_order: 1,
  is_active: true,
};

const emptyPage: Omit<InterestPage, 'id'> = {
  title: '',
  description: '',
  image_url: '',
  link_url: '',
  display_order: 1,
  is_active: true,
};

export default function HomeContentPage() {
  const [activeTab, setActiveTab] = useState<'services' | 'interest'>('services');
  
  // Servicios
  const [services, setServices] = useState<HomeService[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<HomeService | null>(null);
  const [serviceFormData, setServiceFormData] = useState(emptyService);
  
  // Páginas de interés
  const [interestPages, setInterestPages] = useState<InterestPage[]>([]);
  const [isLoadingPages, setIsLoadingPages] = useState(true);
  const [isPageModalOpen, setIsPageModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<InterestPage | null>(null);
  const [pageFormData, setPageFormData] = useState(emptyPage);
  
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchServices();
    fetchInterestPages();
  }, []);

  // === SERVICIOS ===
  const fetchServices = async () => {
    try {
      const res = await fetch('/api/admin/home-services');
      const data = await res.json();
      if (data.success) setServices(data.data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoadingServices(false);
    }
  };

  const openCreateServiceModal = () => {
    setEditingService(null);
    setServiceFormData({ ...emptyService, display_order: services.length + 1 });
    setIsServiceModalOpen(true);
  };

  const openEditServiceModal = (service: HomeService) => {
    setEditingService(service);
    setServiceFormData({
      title: service.title,
      description: service.description || '',
      icon: service.icon || 'info',
      link_url: service.link_url || '',
      display_order: service.display_order,
      is_active: service.is_active,
    });
    setIsServiceModalOpen(true);
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const url = editingService 
        ? `/api/admin/home-services/${editingService.id}` 
        : '/api/admin/home-services';
      const res = await fetch(url, {
        method: editingService ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceFormData),
      });

      if (res.ok) {
        fetchServices();
        setIsServiceModalOpen(false);
      } else {
        const error = await res.json();
        alert(error.message || 'Error al guardar');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteService = async (id: number) => {
    if (!confirm('¿Eliminar este servicio?')) return;
    
    try {
      const res = await fetch(`/api/admin/home-services/${id}`, { method: 'DELETE' });
      if (res.ok) fetchServices();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // === PÁGINAS DE INTERÉS ===
  const fetchInterestPages = async () => {
    try {
      const res = await fetch('/api/admin/interest-pages');
      const data = await res.json();
      if (data.success) setInterestPages(data.data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoadingPages(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('folder', 'interest-pages');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const data = await response.json();
      if (data.success) {
        setPageFormData(prev => ({ ...prev, image_url: data.url }));
        // Limpiar el input file
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        alert(data.error || 'Error al subir la imagen');
      }
    } catch (error) {
      console.error('Error al subir imagen:', error);
      alert('Error al subir la imagen');
    } finally {
      setIsUploading(false);
      // Limpiar el input file
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const openCreatePageModal = () => {
    setEditingPage(null);
    setPageFormData({ ...emptyPage, display_order: interestPages.length + 1 });
    setIsPageModalOpen(true);
  };

  const openEditPageModal = (page: InterestPage) => {
    setEditingPage(page);
    setPageFormData({
      title: page.title,
      description: page.description || '',
      image_url: page.image_url || '',
      link_url: page.link_url || '',
      display_order: page.display_order,
      is_active: page.is_active,
    });
    setIsPageModalOpen(true);
  };

  const handlePageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const url = editingPage 
        ? `/api/admin/interest-pages/${editingPage.id}` 
        : '/api/admin/interest-pages';
      const res = await fetch(url, {
        method: editingPage ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pageFormData),
      });

      if (res.ok) {
        fetchInterestPages();
        setIsPageModalOpen(false);
      } else {
        const error = await res.json();
        alert(error.message || 'Error al guardar');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePage = async (id: number) => {
    if (!confirm('¿Eliminar esta página de interés?')) return;
    
    try {
      const res = await fetch(`/api/admin/interest-pages/${id}`, { method: 'DELETE' });
      if (res.ok) fetchInterestPages();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getIconComponent = (iconName: string) => {
    const iconData = ICONS.find(i => i.value === iconName);
    return iconData ? iconData.icon : Info;
  };

  return (
    <div>
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Contenido del Home</h1>
            <p className="text-gray-500 mt-1">Gestiona los servicios y páginas de interés</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-6">
          <button
            onClick={() => setActiveTab('services')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'services'
                ? 'bg-emerald-100 text-emerald-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Grid className="w-4 h-4" />
            Servicios ({services.length})
          </button>
          <button
            onClick={() => setActiveTab('interest')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'interest'
                ? 'bg-emerald-100 text-emerald-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            Páginas de Interés ({interestPages.length})
          </button>
        </div>
      </div>

      {/* Tab Content: Servicios */}
      {activeTab === 'services' && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="font-semibold text-gray-900">Servicios del Home</h2>
            <button
              onClick={openCreateServiceModal}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nuevo Servicio
            </button>
          </div>

          {isLoadingServices ? (
            <div className="p-8 text-center text-gray-500">Cargando...</div>
          ) : services.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No hay servicios. Crea uno nuevo.
            </div>
          ) : (
            <div className="divide-y">
              {services.map((service) => {
                const IconComponent = getIconComponent(service.icon);
                return (
                  <div key={service.id} className="p-4 flex items-center gap-4 hover:bg-gray-50">
                    <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900">{service.title}</h3>
                        {!service.is_active && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">
                            Inactivo
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">{service.description}</p>
                      <p className="text-xs text-gray-400 mt-1">Enlace: {service.link_url || 'Sin enlace'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditServiceModal(service)}
                        className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteService(service.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Páginas de Interés */}
      {activeTab === 'interest' && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="font-semibold text-gray-900">Páginas de Interés</h2>
            <button
              onClick={openCreatePageModal}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nueva Página
            </button>
          </div>

          {isLoadingPages ? (
            <div className="p-8 text-center text-gray-500">Cargando...</div>
          ) : interestPages.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No hay páginas de interés. Crea una nueva.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
              {interestPages.map((page) => (
                <div 
                  key={page.id} 
                  className="relative group rounded-lg overflow-hidden shadow-md"
                >
                  <div className="aspect-video bg-gray-100 relative">
                    {page.image_url ? (
                      <img 
                        src={page.image_url} 
                        alt={page.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-gray-300" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="px-4 text-white font-semibold">{page.title}</span>
                    </div>
                    {!page.is_active && (
                      <div className="absolute top-2 right-2 px-2 py-1 bg-gray-900/70 text-white text-xs rounded">
                        Inactivo
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => openEditPageModal(page)}
                      className="p-2 bg-white rounded-lg text-emerald-600 hover:bg-emerald-50"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePage(page.id)}
                      className="p-2 bg-white rounded-lg text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal: Servicio */}
      {isServiceModalOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={() => setIsServiceModalOpen(false)}
        >
          <div 
            className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-lg font-semibold">
                {editingService ? 'Editar Servicio' : 'Nuevo Servicio'}
              </h2>
              <button
                onClick={() => setIsServiceModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleServiceSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título *
                </label>
                <input
                  type="text"
                  required
                  value={serviceFormData.title}
                  onChange={(e) => setServiceFormData({ ...serviceFormData, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  rows={3}
                  value={serviceFormData.description}
                  onChange={(e) => setServiceFormData({ ...serviceFormData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icono
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {ICONS.map((icon) => {
                    const IconComp = icon.icon;
                    return (
                      <button
                        key={icon.value}
                        type="button"
                        onClick={() => setServiceFormData({ ...serviceFormData, icon: icon.value })}
                        className={`p-3 rounded-lg border-2 flex flex-col items-center gap-1 transition-all ${
                          serviceFormData.icon === icon.value
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <IconComp className="w-5 h-5" />
                        <span className="text-xs">{icon.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enlace (URL)
                </label>
                <input
                  type="text"
                  value={serviceFormData.link_url}
                  onChange={(e) => setServiceFormData({ ...serviceFormData, link_url: e.target.value })}
                  placeholder="/horarios"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Orden
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={serviceFormData.display_order}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, display_order: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div className="flex items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={serviceFormData.is_active}
                      onChange={(e) => setServiceFormData({ ...serviceFormData, is_active: e.target.checked })}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <span className="text-sm text-gray-700">Activo</span>
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsServiceModalOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Página de Interés */}
      {isPageModalOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={() => setIsPageModalOpen(false)}
        >
          <div 
            className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-lg font-semibold">
                {editingPage ? 'Editar Página' : 'Nueva Página de Interés'}
              </h2>
              <button
                onClick={() => setIsPageModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handlePageSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título *
                </label>
                <input
                  type="text"
                  required
                  value={pageFormData.title}
                  onChange={(e) => setPageFormData({ ...pageFormData, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  rows={2}
                  value={pageFormData.description}
                  onChange={(e) => setPageFormData({ ...pageFormData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Imagen
                </label>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={pageFormData.image_url}
                    onChange={(e) => setPageFormData({ ...pageFormData, image_url: e.target.value })}
                    placeholder="URL de la imagen (https://...)"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">o</span>
                    <label className="flex-1">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={isUploading}
                      />
                      <div className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg cursor-pointer transition-colors border border-gray-300">
                        <Upload className="w-4 h-4" />
                        {isUploading ? 'Subiendo...' : 'Subir desde el equipo'}
                      </div>
                    </label>
                  </div>
                </div>
                {pageFormData.image_url && (
                  <div className="mt-2 rounded-lg overflow-hidden h-32 bg-gray-100">
                    <img 
                      src={pageFormData.image_url} 
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enlace (URL)
                </label>
                <input
                  type="text"
                  value={pageFormData.link_url}
                  onChange={(e) => setPageFormData({ ...pageFormData, link_url: e.target.value })}
                  placeholder="/pagina o https://..."
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Orden
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={pageFormData.display_order}
                    onChange={(e) => setPageFormData({ ...pageFormData, display_order: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div className="flex items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pageFormData.is_active}
                      onChange={(e) => setPageFormData({ ...pageFormData, is_active: e.target.checked })}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <span className="text-sm text-gray-700">Activo</span>
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsPageModalOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
