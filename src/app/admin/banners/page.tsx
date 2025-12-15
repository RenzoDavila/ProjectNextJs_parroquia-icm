'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Save, Image as ImageIcon, GripVertical, Upload } from 'lucide-react';

type Banner = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image_url: string;
  link_url: string;
  link_text: string;
  display_order: number;
  is_active: boolean;
};

const emptyBanner: Omit<Banner, 'id'> = {
  title: '',
  subtitle: '',
  description: '',
  image_url: '',
  link_url: '',
  link_text: '',
  display_order: 1,
  is_active: true,
};

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState(emptyBanner);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('folder', 'banners');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const data = await response.json();
      if (data.success) {
        setFormData(prev => ({ ...prev, image_url: data.url }));
      } else {
        alert(data.error || 'Error al subir la imagen');
      }
    } catch (error) {
      console.error('Error al subir imagen:', error);
      alert('Error al subir la imagen');
    } finally {
      setIsUploading(false);
    }
  };

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/admin/banners');
      const data = await response.json();
      if (data.success) {
        setBanners(data.data || []);
      }
    } catch (error) {
      console.error('Error al cargar banners:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingBanner(null);
    setFormData({ ...emptyBanner, display_order: banners.length + 1 });
    setIsModalOpen(true);
  };

  const openEditModal = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || '',
      description: banner.description || '',
      image_url: banner.image_url,
      link_url: banner.link_url || '',
      link_text: banner.link_text || '',
      display_order: banner.display_order,
      is_active: banner.is_active,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const url = editingBanner ? `/api/admin/banners/${editingBanner.id}` : '/api/admin/banners';
      const response = await fetch(url, {
        method: editingBanner ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchBanners();
        setIsModalOpen(false);
      } else {
        const error = await response.json();
        alert(error.message || 'Error al guardar');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar');
    } finally {
      setIsSaving(false);
    }
  };

  const deleteBanner = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este banner?')) return;

    try {
      const response = await fetch(`/api/admin/banners/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setBanners(banners.filter(b => b.id !== id));
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const toggleActive = async (banner: Banner) => {
    try {
      const response = await fetch(`/api/admin/banners/${banner.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...banner, is_active: !banner.is_active }),
      });

      if (response.ok) {
        setBanners(banners.map(b => b.id === banner.id ? { ...b, is_active: !b.is_active } : b));
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando banners...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Banners</h1>
            <p className="text-gray-600 mt-1">Gestiona los banners del slider principal</p>
          </div>
          <button onClick={openCreateModal} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-5 h-5" />
            Crear Banner
          </button>
        </div>
      </div>

      {banners.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.sort((a, b) => a.display_order - b.display_order).map((banner) => (
            <div key={banner.id} className={`bg-white rounded-lg shadow-sm overflow-hidden ${!banner.is_active ? 'opacity-60' : ''}`}>
              <div className="relative aspect-video bg-gray-100">
                {banner.image_url ? (
                  <img src={banner.image_url} alt={banner.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-16 h-16 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-2 left-2 flex items-center gap-1 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                  <GripVertical className="w-4 h-4" />
                  {banner.display_order}
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900">{banner.title}</h3>
                {banner.subtitle && <p className="text-sm text-gray-600">{banner.subtitle}</p>}
                {banner.description && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{banner.description}</p>}
              </div>
              
              <div className="px-4 pb-4 flex items-center justify-between">
                <button
                  onClick={() => toggleActive(banner)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${banner.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}
                >
                  {banner.is_active ? 'Activo' : 'Inactivo'}
                </button>
                <div className="flex items-center gap-2">
                  <button onClick={() => openEditModal(banner)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button onClick={() => deleteBanner(banner.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay banners</h3>
          <p className="text-gray-600 mb-4">Crea el primer banner del slider</p>
          <button onClick={openCreateModal} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-5 h-5" />
            Crear Banner
          </button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">{editingBanner ? 'Editar Banner' : 'Crear Banner'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subtítulo</label>
                  <input type="text" value={formData.subtitle} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={2} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Imagen del Banner *</label>
                  
                  <div className="flex gap-2 mb-2">
                    <label className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
                        <Upload className="w-4 h-4" />
                        {isUploading ? 'Subiendo...' : 'Subir Imagen'}
                      </div>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload}
                        disabled={isUploading}
                        className="hidden" 
                      />
                    </label>
                    <span className="flex items-center text-gray-400 px-2">o</span>
                    <div className="flex-1">
                      <input 
                        type="text" 
                        value={formData.image_url} 
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} 
                        placeholder="URL de imagen..." 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      />
                    </div>
                  </div>
                  
                  {formData.image_url && (
                    <div className="mt-2 aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Sube una imagen o pega una URL. Máximo 5MB.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL del Enlace <span className="text-gray-400 text-xs">(opcional)</span>
                    </label>
                    <input type="text" value={formData.link_url} onChange={(e) => setFormData({ ...formData, link_url: e.target.value })} placeholder="/ruta o https://..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Texto del Botón <span className="text-gray-400 text-xs">(opcional)</span>
                    </label>
                    <input type="text" value={formData.link_text} onChange={(e) => setFormData({ ...formData, link_text: e.target.value })} placeholder="Ver más, Reservar, etc." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Orden</label>
                  <input type="number" value={formData.display_order} onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })} min="1" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm font-medium text-gray-700">Banner activo</span>
                </label>
              </div>

              <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Cancelar</button>
                <button type="submit" disabled={isSaving} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2">
                  {isSaving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save className="w-4 h-4" />}
                  {editingBanner ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
