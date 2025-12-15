'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Save, Clock, Calendar } from 'lucide-react';

type MassTime = {
  id: number;
  day_type: string;
  time: string;
  location: string;
  max_reservations: number;
  display_order: number;
  is_active: boolean;
};

const DAY_TYPES = [
  { value: 'weekdays', label: 'Días de Semana (Lun-Vie)' },
  { value: 'saturdays', label: 'Sábados' },
  { value: 'sundays', label: 'Domingos' },
  { value: 'holidays', label: 'Días Festivos' },
];

const emptyMassTime: Omit<MassTime, 'id'> = {
  day_type: 'sundays',
  time: '08:00',
  location: 'Iglesia Principal',
  max_reservations: 1,
  display_order: 1,
  is_active: true,
};

export default function MassTimesPage() {
  const [massTimes, setMassTimes] = useState<MassTime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMassTime, setEditingMassTime] = useState<MassTime | null>(null);
  const [formData, setFormData] = useState(emptyMassTime);
  const [isSaving, setIsSaving] = useState(false);
  const [filterDayType, setFilterDayType] = useState<string>('all');

  useEffect(() => {
    fetchMassTimes();
  }, []);

  const fetchMassTimes = async () => {
    try {
      const response = await fetch('/api/admin/mass-times');
      const data = await response.json();
      if (data.success) {
        setMassTimes(data.data || []);
      }
    } catch (error) {
      console.error('Error al cargar horarios:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingMassTime(null);
    setFormData({ ...emptyMassTime, display_order: massTimes.length + 1 });
    setIsModalOpen(true);
  };

  const openEditModal = (massTime: MassTime) => {
    setEditingMassTime(massTime);
    setFormData({
      day_type: massTime.day_type,
      time: massTime.time,
      location: massTime.location || '',
      max_reservations: massTime.max_reservations || 1,
      display_order: massTime.display_order,
      is_active: massTime.is_active,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const url = editingMassTime ? `/api/admin/mass-times/${editingMassTime.id}` : '/api/admin/mass-times';
      const response = await fetch(url, {
        method: editingMassTime ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchMassTimes();
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

  const deleteMassTime = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este horario?')) return;

    try {
      const response = await fetch(`/api/admin/mass-times/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setMassTimes(massTimes.filter(mt => mt.id !== id));
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const toggleActive = async (massTime: MassTime) => {
    try {
      const response = await fetch(`/api/admin/mass-times/${massTime.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...massTime, is_active: !massTime.is_active }),
      });

      if (response.ok) {
        setMassTimes(massTimes.map(mt => mt.id === massTime.id ? { ...mt, is_active: !mt.is_active } : mt));
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getDayTypeLabel = (dayType: string) => {
    return DAY_TYPES.find(d => d.value === dayType)?.label || dayType;
  };

  const filteredMassTimes = filterDayType === 'all' 
    ? massTimes 
    : massTimes.filter(mt => mt.day_type === filterDayType);

  // Agrupar por day_type
  const groupedMassTimes = filteredMassTimes.reduce((acc, mt) => {
    if (!acc[mt.day_type]) acc[mt.day_type] = [];
    acc[mt.day_type].push(mt);
    return acc;
  }, {} as Record<string, MassTime[]>);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando horarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Horarios de Misas</h1>
            <p className="text-gray-600 mt-1">Gestiona los horarios de las celebraciones eucarísticas</p>
          </div>
          <button onClick={openCreateModal} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-5 h-5" />
            Agregar Horario
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="text-gray-400 w-5 h-5" />
          <select
            value={filterDayType}
            onChange={(e) => setFilterDayType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todos los días</option>
            {DAY_TYPES.map(d => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
        </div>
      </div>

      {Object.keys(groupedMassTimes).length > 0 ? (
        <div className="space-y-6">
          {DAY_TYPES.map(dayType => {
            const timesForDay = groupedMassTimes[dayType.value];
            if (!timesForDay || timesForDay.length === 0) return null;

            return (
              <div key={dayType.value} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="bg-blue-50 px-6 py-3 border-b border-blue-100">
                  <h2 className="text-lg font-semibold text-blue-800">{dayType.label}</h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {timesForDay.sort((a, b) => a.display_order - b.display_order).map((massTime) => (
                    <div key={massTime.id} className={`px-6 py-4 flex items-center justify-between ${!massTime.is_active ? 'bg-gray-50 opacity-60' : ''}`}>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                          <Clock className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-lg">{massTime.time}</div>
                          <div className="text-sm text-gray-600">{massTime.location}</div>
                          {massTime.max_reservations > 0 && (
                            <div className="text-xs text-gray-500">Máx. {massTime.max_reservations} reservación(es)</div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleActive(massTime)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${massTime.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}
                        >
                          {massTime.is_active ? 'Activo' : 'Inactivo'}
                        </button>
                        <button onClick={() => openEditModal(massTime)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                          <Edit className="w-5 h-5" />
                        </button>
                        <button onClick={() => deleteMassTime(massTime.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay horarios</h3>
          <p className="text-gray-600 mb-4">Agrega los horarios de las misas</p>
          <button onClick={openCreateModal} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-5 h-5" />
            Agregar Horario
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
                <h2 className="text-xl font-bold text-gray-900">{editingMassTime ? 'Editar Horario' : 'Agregar Horario'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Día</label>
                  <select value={formData.day_type} onChange={(e) => setFormData({ ...formData, day_type: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    {DAY_TYPES.map(d => (
                      <option key={d.value} value={d.value}>{d.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hora *</label>
                  <input type="time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
                  <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="Ej: Iglesia Principal" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Máximo de Reservaciones</label>
                  <input type="number" value={formData.max_reservations} onChange={(e) => setFormData({ ...formData, max_reservations: parseInt(e.target.value) })} min="0" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  <p className="text-xs text-gray-500 mt-1">0 = sin límite de reservaciones</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Orden de visualización</label>
                  <input type="number" value={formData.display_order} onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })} min="1" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm font-medium text-gray-700">Horario activo</span>
                </label>
              </div>

              <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Cancelar</button>
                <button type="submit" disabled={isSaving} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2">
                  {isSaving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save className="w-4 h-4" />}
                  {editingMassTime ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
