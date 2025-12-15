'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Save, Share2, ExternalLink } from 'lucide-react';

type SocialMedia = {
  id: number;
  platform: string;
  platform_name: string;
  url: string;
  icon_name: string;
  display_order: number;
  is_active: boolean;
  show_in_header: boolean;
  show_in_footer: boolean;
};

const PLATFORMS = [
  { value: 'facebook', label: 'Facebook', icon: '📘' },
  { value: 'instagram', label: 'Instagram', icon: '📸' },
  { value: 'youtube', label: 'YouTube', icon: '📺' },
  { value: 'tiktok', label: 'TikTok', icon: '🎵' },
  { value: 'twitter', label: 'Twitter/X', icon: '🐦' },
  { value: 'whatsapp', label: 'WhatsApp', icon: '💬' },
  { value: 'linkedin', label: 'LinkedIn', icon: '💼' },
  { value: 'otro', label: 'Otro', icon: '��' },
];

const emptySocial: Omit<SocialMedia, 'id'> = {
  platform: 'facebook',
  platform_name: 'Facebook',
  url: '',
  icon_name: 'facebook',
  display_order: 1,
  is_active: true,
  show_in_header: true,
  show_in_footer: true,
};

export default function SocialMediaPage() {
  const [socials, setSocials] = useState<SocialMedia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSocial, setEditingSocial] = useState<SocialMedia | null>(null);
  const [formData, setFormData] = useState(emptySocial);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSocials();
  }, []);

  const fetchSocials = async () => {
    try {
      const response = await fetch('/api/admin/social-media');
      const data = await response.json();
      if (data.success) {
        setSocials(data.data || []);
      }
    } catch (error) {
      console.error('Error al cargar redes sociales:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingSocial(null);
    setFormData({ ...emptySocial, display_order: socials.length + 1 });
    setIsModalOpen(true);
  };

  const openEditModal = (social: SocialMedia) => {
    setEditingSocial(social);
    setFormData({
      platform: social.platform,
      platform_name: social.platform_name || PLATFORMS.find(p => p.value === social.platform)?.label || '',
      url: social.url,
      icon_name: social.icon_name || social.platform,
      display_order: social.display_order,
      is_active: social.is_active,
      show_in_header: social.show_in_header ?? true,
      show_in_footer: social.show_in_footer ?? true,
    });
    setIsModalOpen(true);
  };

  const handlePlatformChange = (platform: string) => {
    const platformInfo = PLATFORMS.find(p => p.value === platform);
    setFormData({ 
      ...formData, 
      platform, 
      platform_name: platformInfo?.label || platform,
      icon_name: platform 
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const url = editingSocial ? `/api/admin/social-media/${editingSocial.id}` : '/api/admin/social-media';
      const response = await fetch(url, {
        method: editingSocial ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchSocials();
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

  const deleteSocial = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta red social?')) return;

    try {
      const response = await fetch(`/api/admin/social-media/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setSocials(socials.filter(s => s.id !== id));
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const toggleActive = async (social: SocialMedia) => {
    try {
      const response = await fetch(`/api/admin/social-media/${social.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...social, is_active: !social.is_active }),
      });

      if (response.ok) {
        setSocials(socials.map(s => s.id === social.id ? { ...s, is_active: !s.is_active } : s));
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getPlatformIcon = (platform: string) => {
    return PLATFORMS.find(p => p.value === platform)?.icon || '🔗';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando redes sociales...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Redes Sociales</h1>
            <p className="text-gray-600 mt-1">Gestiona los enlaces de redes sociales de la parroquia</p>
          </div>
          <button onClick={openCreateModal} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-5 h-5" />
            Agregar Red Social
          </button>
        </div>
      </div>

      {socials.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plataforma</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ubicación</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orden</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {socials.sort((a, b) => a.display_order - b.display_order).map((social) => (
                <tr key={social.id} className={!social.is_active ? 'bg-gray-50 opacity-60' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getPlatformIcon(social.platform)}</span>
                      <span className="font-medium text-gray-900">{social.platform_name || social.platform}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <a href={social.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:text-blue-800 truncate max-w-xs">
                      {social.url}
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div className="flex gap-2">
                      {social.show_in_header && <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">Header</span>}
                      {social.show_in_footer && <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs">Footer</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{social.display_order}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button onClick={() => toggleActive(social)} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${social.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                      {social.is_active ? 'Activo' : 'Inactivo'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button onClick={() => openEditModal(social)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors mr-1" title="Editar">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button onClick={() => deleteSocial(social.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Share2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay redes sociales</h3>
          <p className="text-gray-600 mb-4">Agrega los enlaces de redes sociales</p>
          <button onClick={openCreateModal} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-5 h-5" />
            Agregar Red Social
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
                <h2 className="text-xl font-bold text-gray-900">{editingSocial ? 'Editar Red Social' : 'Agregar Red Social'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Plataforma</label>
                  <select value={formData.platform} onChange={(e) => handlePlatformChange(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    {PLATFORMS.map(p => (
                      <option key={p.value} value={p.value}>{p.icon} {p.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL *</label>
                  <input type="url" value={formData.url} onChange={(e) => setFormData({ ...formData, url: e.target.value })} required placeholder="https://..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Orden de visualización</label>
                  <input type="number" value={formData.display_order} onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })} min="1" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.show_in_header} onChange={(e) => setFormData({ ...formData, show_in_header: e.target.checked })} className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm font-medium text-gray-700">Mostrar en header</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.show_in_footer} onChange={(e) => setFormData({ ...formData, show_in_footer: e.target.checked })} className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm font-medium text-gray-700">Mostrar en footer</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm font-medium text-gray-700">Red social activa</span>
                  </label>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Cancelar</button>
                <button type="submit" disabled={isSaving} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2">
                  {isSaving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save className="w-4 h-4" />}
                  {editingSocial ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
