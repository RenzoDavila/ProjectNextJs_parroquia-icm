'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Save, UsersRound, Filter } from 'lucide-react';

type ParishGroup = {
  id: number;
  name: string;
  description: string;
  meeting_day: string;
  meeting_time: string;
  category: string;
  contact_person: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  display_order: number;
  is_active: boolean;
};

const categories = [
  { value: 'parroquiales', label: 'Grupos Parroquiales' },
  { value: 'movimientos', label: 'Movimientos' },
  { value: 'pastorales', label: 'Pastorales' },
  { value: 'otros', label: 'Otros' },
];

const emptyGroup: Omit<ParishGroup, 'id'> = {
  name: '',
  description: '',
  meeting_day: '',
  meeting_time: '',
  category: 'parroquiales',
  contact_person: '',
  contact_email: '',
  contact_phone: '',
  display_order: 1,
  is_active: true,
};

export default function ParishGroupsPage() {
  const [groups, setGroups] = useState<ParishGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<ParishGroup | null>(null);
  const [formData, setFormData] = useState(emptyGroup);
  const [isSaving, setIsSaving] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await fetch('/api/admin/parish-groups');
      const data = await response.json();
      if (data.success) {
        setGroups(data.data || []);
      }
    } catch (error) {
      console.error('Error al cargar grupos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingGroup(null);
    setFormData({ ...emptyGroup, display_order: groups.length + 1 });
    setIsModalOpen(true);
  };

  const openEditModal = (group: ParishGroup) => {
    setEditingGroup(group);
    setFormData({
      name: group.name,
      description: group.description || '',
      meeting_day: group.meeting_day || '',
      meeting_time: group.meeting_time || '',
      category: group.category,
      contact_person: group.contact_person || '',
      contact_email: group.contact_email || '',
      contact_phone: group.contact_phone || '',
      display_order: group.display_order,
      is_active: group.is_active,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const url = editingGroup ? `/api/admin/parish-groups/${editingGroup.id}` : '/api/admin/parish-groups';
      const response = await fetch(url, {
        method: editingGroup ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchGroups();
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

  const deleteGroup = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este grupo?')) return;

    try {
      const response = await fetch(`/api/admin/parish-groups/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setGroups(groups.filter(g => g.id !== id));
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const toggleActive = async (group: ParishGroup) => {
    try {
      const response = await fetch(`/api/admin/parish-groups/${group.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...group, is_active: !group.is_active }),
      });

      if (response.ok) {
        setGroups(groups.map(g => g.id === group.id ? { ...g, is_active: !g.is_active } : g));
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const filteredGroups = categoryFilter === 'all' 
    ? groups 
    : groups.filter(g => g.category === categoryFilter);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando grupos...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Grupos Parroquiales</h1>
            <p className="text-gray-600 mt-1">Gestiona los grupos y movimientos de la parroquia</p>
          </div>
          <button onClick={openCreateModal} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-5 h-5" />
            Agregar Grupo
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="text-gray-400 w-5 h-5" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todas las categorías</option>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredGroups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGroups.sort((a, b) => a.display_order - b.display_order).map((group) => (
            <div key={group.id} className={`bg-white rounded-lg shadow-sm overflow-hidden ${!group.is_active ? 'opacity-60' : ''}`}>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <UsersRound className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full capitalize">
                    {group.category}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{group.name}</h3>
                {group.description && <p className="text-gray-600 text-sm mb-4 line-clamp-2">{group.description}</p>}
                
                {(group.meeting_day || group.meeting_time) && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Reunión:</span> {group.meeting_day} {group.meeting_time && `a las ${group.meeting_time}`}
                    </p>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => toggleActive(group)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${group.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}
                  >
                    {group.is_active ? 'Activo' : 'Inactivo'}
                  </button>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEditModal(group)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button onClick={() => deleteGroup(group.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <UsersRound className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay grupos</h3>
          <p className="text-gray-600 mb-4">Agrega el primer grupo parroquial</p>
          <button onClick={openCreateModal} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-5 h-5" />
            Agregar Grupo
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
                <h2 className="text-xl font-bold text-gray-900">{editingGroup ? 'Editar Grupo' : 'Agregar Grupo'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Día de Reunión</label>
                    <input type="text" value={formData.meeting_day} onChange={(e) => setFormData({ ...formData, meeting_day: e.target.value })} placeholder="Ej: Domingos" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                    <input type="text" value={formData.meeting_time} onChange={(e) => setFormData({ ...formData, meeting_time: e.target.value })} placeholder="Ej: 3:00 p.m." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Persona de Contacto</label>
                  <input type="text" value={formData.contact_person || ''} onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Contacto</label>
                    <input type="email" value={formData.contact_email || ''} onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                    <input type="text" value={formData.contact_phone || ''} onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Orden</label>
                  <input type="number" value={formData.display_order} onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })} min="1" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm font-medium text-gray-700">Grupo activo</span>
                </label>
              </div>

              <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Cancelar</button>
                <button type="submit" disabled={isSaving} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2">
                  {isSaving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save className="w-4 h-4" />}
                  {editingGroup ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
