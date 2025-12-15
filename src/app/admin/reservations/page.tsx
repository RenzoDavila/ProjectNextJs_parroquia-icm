'use client';

import { useState, useEffect } from 'react';
import { Eye, X, Check, Clock, XCircle, Search, Filter, Calendar, User, Phone, Mail, ChevronDown, DollarSign, FileCheck } from 'lucide-react';

type Reservation = {
  id: number;
  reservation_date: string;
  reservation_time: string;
  location: string;
  nombre: string;
  apellidos: string;
  dni: string;
  telefono: string;
  email: string;
  tipo_misa: string;
  intencion: string;
  difuntos: string;
  observaciones: string;
  precio: number;
  metodo_pago: string;
  comprobante_url: string;
  pago_verificado: boolean;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  admin_notes: string;
  confirmation_code: string;
  created_at: string;
};

const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  cancelled: 'Cancelada',
  completed: 'Completada',
};

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  completed: 'bg-blue-100 text-blue-800',
};

const tipoMisaLabels: Record<string, string> = {
  accion_gracias: 'Acción de Gracias',
  difuntos: 'Por los Difuntos',
  salud: 'Por Salud',
  especial: 'Intención Especial',
};

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await fetch('/api/admin/reservations');
      const data = await response.json();
      if (data.success) {
        setReservations(data.data || []);
      }
    } catch (error) {
      console.error('Error al cargar reservaciones:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: number, newStatus: string) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/admin/reservations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setReservations(reservations.map(r => r.id === id ? { ...r, status: newStatus as Reservation['status'] } : r));
        if (selectedReservation?.id === id) {
          setSelectedReservation({ ...selectedReservation, status: newStatus as Reservation['status'] });
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const verifyPayment = async (id: number) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/admin/reservations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pago_verificado: true }),
      });

      if (response.ok) {
        setReservations(reservations.map(r => r.id === id ? { ...r, pago_verificado: true } : r));
        if (selectedReservation?.id === id) {
          setSelectedReservation({ ...selectedReservation, pago_verificado: true });
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredReservations = reservations.filter(r => {
    const matchesSearch = searchTerm === '' || 
      `${r.nombre} ${r.apellidos}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.dni.includes(searchTerm) ||
      r.confirmation_code?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-PE', { 
      year: 'numeric', month: 'short', day: 'numeric' 
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando reservaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reservas de Misas</h1>
            <p className="text-gray-600 mt-1">Gestiona las solicitudes de misas</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nombre, email, DNI o código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400 w-5 h-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos los estados</option>
              {Object.entries(statusLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredReservations.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solicitante</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Misa</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredReservations.map((reservation) => (
                  <tr key={reservation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm text-gray-900">
                        {reservation.confirmation_code || `#${reservation.id}`}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{reservation.nombre} {reservation.apellidos}</div>
                      <div className="text-sm text-gray-500">{reservation.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{tipoMisaLabels[reservation.tipo_misa] || reservation.tipo_misa}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(reservation.reservation_date)}</div>
                      <div className="text-sm text-gray-500">{reservation.reservation_time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{formatCurrency(reservation.precio)}</div>
                      <div className="flex items-center gap-1">
                        {reservation.pago_verificado ? (
                          <span className="inline-flex items-center gap-1 text-xs text-green-600">
                            <FileCheck className="w-3 h-3" /> Verificado
                          </span>
                        ) : (
                          <span className="text-xs text-yellow-600">Pendiente verificar</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[reservation.status]}`}>
                        {statusLabels[reservation.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => setSelectedReservation(reservation)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Ver detalles"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay reservaciones</h3>
          <p className="text-gray-600">Las reservaciones aparecerán aquí cuando se registren</p>
        </div>
      )}

      {/* Modal de detalles */}
      {selectedReservation && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedReservation(null)}
        >
          <div 
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Reservación #{selectedReservation.confirmation_code || selectedReservation.id}</h2>
                  <p className="text-sm text-gray-500">Registrada el {formatDate(selectedReservation.created_at)}</p>
                </div>
                <button onClick={() => setSelectedReservation(null)} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Estado y Pago */}
              <div className="flex flex-wrap gap-4">
                <div>
                  <label className="text-sm text-gray-500">Estado</label>
                  <select
                    value={selectedReservation.status}
                    onChange={(e) => updateStatus(selectedReservation.id, e.target.value)}
                    disabled={isUpdating}
                    className={`mt-1 px-3 py-1 rounded-lg border ${statusColors[selectedReservation.status]} font-medium text-sm`}
                  >
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Pago</label>
                  <div className="mt-1">
                    {selectedReservation.pago_verificado ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-lg text-sm font-medium">
                        <FileCheck className="w-4 h-4" /> Verificado
                      </span>
                    ) : (
                      <button
                        onClick={() => verifyPayment(selectedReservation.id)}
                        disabled={isUpdating}
                        className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-medium hover:bg-yellow-200 transition-colors"
                      >
                        Verificar Pago
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Datos del solicitante */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <User className="w-5 h-5" /> Datos del Solicitante
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><span className="text-gray-500">Nombre:</span> <span className="font-medium">{selectedReservation.nombre} {selectedReservation.apellidos}</span></div>
                  <div><span className="text-gray-500">DNI:</span> <span className="font-medium">{selectedReservation.dni}</span></div>
                  <div className="flex items-center gap-1"><Mail className="w-4 h-4 text-gray-400" /> <span className="font-medium">{selectedReservation.email}</span></div>
                  <div className="flex items-center gap-1"><Phone className="w-4 h-4 text-gray-400" /> <span className="font-medium">{selectedReservation.telefono}</span></div>
                </div>
              </div>

              {/* Datos de la misa */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5" /> Datos de la Misa
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><span className="text-gray-500">Fecha:</span> <span className="font-medium">{formatDate(selectedReservation.reservation_date)}</span></div>
                  <div><span className="text-gray-500">Hora:</span> <span className="font-medium">{selectedReservation.reservation_time}</span></div>
                  <div><span className="text-gray-500">Lugar:</span> <span className="font-medium">{selectedReservation.location}</span></div>
                  <div><span className="text-gray-500">Tipo:</span> <span className="font-medium">{tipoMisaLabels[selectedReservation.tipo_misa] || selectedReservation.tipo_misa}</span></div>
                </div>
              </div>

              {/* Intención */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Intención</h3>
                <p className="text-gray-700 bg-gray-50 rounded-lg p-3">{selectedReservation.intencion}</p>
              </div>

              {selectedReservation.difuntos && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Difuntos</h3>
                  <p className="text-gray-700 bg-gray-50 rounded-lg p-3">{selectedReservation.difuntos}</p>
                </div>
              )}

              {selectedReservation.observaciones && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Observaciones</h3>
                  <p className="text-gray-700 bg-gray-50 rounded-lg p-3">{selectedReservation.observaciones}</p>
                </div>
              )}

              {/* Pago */}
              <div className="bg-amber-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" /> Información de Pago
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><span className="text-gray-500">Monto:</span> <span className="font-bold text-lg">{formatCurrency(selectedReservation.precio)}</span></div>
                  <div><span className="text-gray-500">Método:</span> <span className="font-medium capitalize">{selectedReservation.metodo_pago}</span></div>
                </div>
                {selectedReservation.comprobante_url && (
                  <div className="mt-3">
                    <a href={selectedReservation.comprobante_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                      Ver comprobante de pago →
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setSelectedReservation(null)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
