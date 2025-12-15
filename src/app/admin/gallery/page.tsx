'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Save, Image, FolderOpen, Eye, Upload } from 'lucide-react';

type Album = {
  id: number;
  title: string;
  description: string;
  cover_image_url: string;
  event_date: string;
  display_order: number;
  is_active: boolean;
  image_count?: number;
};

type GalleryImage = {
  id: number;
  album_id: number;
  image_url: string;
  title: string;
  description: string;
  display_order: number;
};

const emptyAlbum: Omit<Album, 'id'> = {
  title: '',
  description: '',
  cover_image_url: '',
  event_date: '',
  display_order: 1,
  is_active: true,
};

export default function GalleryPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [formData, setFormData] = useState(emptyAlbum);
  const [imageFormData, setImageFormData] = useState({ image_url: '', title: '', description: '' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      const response = await fetch('/api/admin/gallery/albums');
      const data = await response.json();
      if (data.success) {
        setAlbums(data.data || []);
      }
    } catch (error) {
      console.error('Error al cargar álbumes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchImages = async (albumId: number) => {
    try {
      const response = await fetch(`/api/admin/gallery/albums/${albumId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success && data.data?.images) {
        setImages(data.data.images);
      }
    } catch (error) {
      console.error('Error al cargar imágenes:', error);
      setImages([]);
    }
  };

  const openAlbumDetails = (album: Album) => {
    setSelectedAlbum(album);
    fetchImages(album.id);
  };

  const openCreateModal = () => {
    setEditingAlbum(null);
    setFormData({ ...emptyAlbum, display_order: albums.length + 1 });
    setIsModalOpen(true);
  };

  const openEditModal = (album: Album, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingAlbum(album);
    setFormData({
      title: album.title,
      description: album.description || '',
      cover_image_url: album.cover_image_url || '',
      event_date: album.event_date || '',
      display_order: album.display_order,
      is_active: album.is_active,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const url = editingAlbum ? `/api/admin/gallery/albums/${editingAlbum.id}` : '/api/admin/gallery/albums';
      const response = await fetch(url, {
        method: editingAlbum ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchAlbums();
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

  const deleteAlbum = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('¿Estás seguro de eliminar este álbum y todas sus imágenes?')) return;

    try {
      const response = await fetch(`/api/admin/gallery/albums/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setAlbums(albums.filter(a => a.id !== id));
        if (selectedAlbum?.id === id) {
          setSelectedAlbum(null);
          setImages([]);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const addImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAlbum) return;
    setIsSaving(true);

    try {
      const response = await fetch(`/api/admin/gallery/albums/${selectedAlbum.id}/images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...imageFormData,
          display_order: images.length + 1,
        }),
      });

      if (response.ok) {
        fetchImages(selectedAlbum.id);
        setIsImageModalOpen(false);
        setImageFormData({ image_url: '', title: '', description: '' });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteImage = async (imageId: number) => {
    if (!selectedAlbum || !confirm('¿Eliminar esta imagen?')) return;

    try {
      const response = await fetch(`/api/admin/gallery/images/${imageId}`, { method: 'DELETE' });
      if (response.ok) {
        setImages(images.filter(img => img.id !== imageId));
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
          <p className="mt-4 text-gray-600">Cargando galería...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Galería de Fotos</h1>
            <p className="text-gray-600 mt-1">
              {selectedAlbum ? `Álbum: ${selectedAlbum.title}` : 'Gestiona los álbumes y fotos de la parroquia'}
            </p>
          </div>
          {selectedAlbum ? (
            <div className="flex gap-2">
              <button onClick={() => { setSelectedAlbum(null); setImages([]); }} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                ← Volver a Álbumes
              </button>
              <button onClick={() => setIsImageModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Upload className="w-5 h-5" />
                Agregar Imagen
              </button>
            </div>
          ) : (
            <button onClick={openCreateModal} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-5 h-5" />
              Nuevo Álbum
            </button>
          )}
        </div>
      </div>

      {!selectedAlbum ? (
        // Vista de álbumes
        albums.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.sort((a, b) => a.display_order - b.display_order).map((album) => (
              <div key={album.id} onClick={() => openAlbumDetails(album)} className={`bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow ${!album.is_active ? 'opacity-60' : ''}`}>
                <div className="aspect-video bg-gray-100 relative">
                  {album.cover_image_url ? (
                    <img src={album.cover_image_url} alt={album.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <FolderOpen className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  {!album.is_active && (
                    <span className="absolute top-2 right-2 px-2 py-1 bg-gray-900 bg-opacity-70 text-white text-xs rounded">
                      Inactivo
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{album.title}</h3>
                  {album.description && <p className="text-gray-600 text-sm line-clamp-2 mb-2">{album.description}</p>}
                  <div className="flex items-center justify-between mt-3">
                    <span className="flex items-center gap-1 text-sm text-gray-500">
                      <Image className="w-4 h-4" />
                      {album.image_count || 0} fotos
                    </span>
                    <div className="flex items-center gap-1">
                      <button onClick={(e) => openEditModal(album, e)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={(e) => deleteAlbum(album.id, e)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay álbumes</h3>
            <p className="text-gray-600 mb-4">Crea el primer álbum de fotos</p>
            <button onClick={openCreateModal} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus className="w-5 h-5" />
              Nuevo Álbum
            </button>
          </div>
        )
      ) : (
        // Vista de imágenes del álbum
        images.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.sort((a, b) => a.display_order - b.display_order).map((image) => (
              <div key={image.id} className="bg-white rounded-lg shadow-sm overflow-hidden group">
                <div className="aspect-square bg-gray-100 relative">
                  <img src={image.image_url} alt={image.title || 'Imagen'} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => deleteImage(image.id)} className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                {image.title && <p className="p-2 text-sm text-gray-700 truncate">{image.title}</p>}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Álbum vacío</h3>
            <p className="text-gray-600 mb-4">Agrega fotos a este álbum</p>
            <button onClick={() => setIsImageModalOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Upload className="w-5 h-5" />
              Agregar Imagen
            </button>
          </div>
        )
      )}

      {/* Modal de Álbum */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">{editingAlbum ? 'Editar Álbum' : 'Nuevo Álbum'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL de Portada</label>
                  <input type="url" value={formData.cover_image_url} onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })} placeholder="https://..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha del Evento</label>
                  <input type="date" value={formData.event_date} onChange={(e) => setFormData({ ...formData, event_date: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Orden</label>
                  <input type="number" value={formData.display_order} onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })} min="1" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm font-medium text-gray-700">Álbum activo</span>
                </label>
              </div>

              <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancelar</button>
                <button type="submit" disabled={isSaving} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
                  {isSaving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save className="w-4 h-4" />}
                  {editingAlbum ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Imagen */}
      {isImageModalOpen && (
        <div 
          className="fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div 
            className="bg-white rounded-lg max-w-lg w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Agregar Imagen</h2>
                <button onClick={() => setIsImageModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={addImage}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL de la Imagen *</label>
                  <input type="url" value={imageFormData.image_url} onChange={(e) => setImageFormData({ ...imageFormData, image_url: e.target.value })} required placeholder="https://..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                  <input type="text" value={imageFormData.title} onChange={(e) => setImageFormData({ ...imageFormData, title: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea value={imageFormData.description} onChange={(e) => setImageFormData({ ...imageFormData, description: e.target.value })} rows={2} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                <button type="button" onClick={() => setIsImageModalOpen(false)} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancelar</button>
                <button type="submit" disabled={isSaving} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
                  {isSaving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Upload className="w-4 h-4" />}
                  Agregar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
