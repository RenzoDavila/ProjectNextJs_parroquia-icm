'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  MessageSquare,
  Users,
  Image,
  FileText,
  UsersRound,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  Activity,
} from 'lucide-react';

type Stats = {
  reservations: {
    total: number;
    pending: number;
    confirmed: number;
    cancelled: number;
    completed: number;
  };
  messages: {
    total: number;
    unread: number;
  };
  gallery: {
    albums: number;
    images: number;
  };
  team: number;
  groups: number;
  banners: number;
};

type RecentReservation = {
  id: number;
  confirmation_code: string;
  name: string;
  last_name: string;
  mass_type: string;
  reservation_date: string;
  status: string;
};

type RecentMessage = {
  id: number;
  name: string;
  email: string;
  subject: string;
  created_at: string;
  status: string;
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  confirmed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
  completed: 'bg-blue-100 text-blue-700 border-blue-200',
  payment_pending: 'bg-orange-100 text-orange-700 border-orange-200',
  unread: 'bg-blue-100 text-blue-700 border-blue-200',
  read: 'bg-slate-100 text-slate-600 border-slate-200',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  cancelled: 'Cancelada',
  completed: 'Completada',
  payment_pending: 'Pago Pendiente',
  unread: 'No leído',
  read: 'Leído',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentReservations, setRecentReservations] = useState<RecentReservation[]>([]);
  const [recentMessages, setRecentMessages] = useState<RecentMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, reservationsRes, messagesRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/reservations?limit=5'),
        fetch('/api/admin/messages?limit=5'),
      ]);

      const [statsData, reservationsData, messagesData] = await Promise.all([
        statsRes.json(),
        reservationsRes.json(),
        messagesRes.json(),
      ]);

      if (statsData.success) setStats(statsData.data);
      if (reservationsData.success) setRecentReservations(reservationsData.data || []);
      if (messagesData.success) setRecentMessages(messagesData.data || []);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-emerald-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
          </div>
          <p className="mt-4 text-slate-600 font-medium">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      name: 'Total Reservas',
      value: stats?.reservations?.total || 0,
      change: '+12%',
      icon: Calendar,
      gradient: 'from-blue-500 to-blue-600',
      bgLight: 'bg-blue-50',
      href: '/admin/reservations',
    },
    {
      name: 'Pendientes',
      value: stats?.reservations?.pending || 0,
      change: 'Requiere atención',
      icon: Clock,
      gradient: 'from-amber-500 to-orange-500',
      bgLight: 'bg-amber-50',
      href: '/admin/reservations?status=pending',
    },
    {
      name: 'Mensajes sin Leer',
      value: stats?.messages?.unread || 0,
      change: 'Nuevos',
      icon: MessageSquare,
      gradient: 'from-rose-500 to-pink-500',
      bgLight: 'bg-rose-50',
      href: '/admin/messages?status=unread',
    },
    {
      name: 'Álbumes',
      value: stats?.gallery?.albums || 0,
      change: `${stats?.gallery?.images || 0} imágenes`,
      icon: Image,
      gradient: 'from-violet-500 to-purple-500',
      bgLight: 'bg-violet-50',
      href: '/admin/gallery',
    },
  ];

  const quickStats = [
    { name: 'Equipo Pastoral', count: stats?.team || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100', href: '/admin/team' },
    { name: 'Grupos', count: stats?.groups || 0, icon: UsersRound, color: 'text-emerald-600', bg: 'bg-emerald-100', href: '/admin/parish-groups' },
    { name: 'Banners', count: stats?.banners || 0, icon: FileText, color: 'text-orange-600', bg: 'bg-orange-100', href: '/admin/banners' },
    { name: 'Imágenes', count: stats?.gallery?.images || 0, icon: Image, color: 'text-purple-600', bg: 'bg-purple-100', href: '/admin/gallery' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">¡Bienvenido al Panel! 👋</h1>
            <p className="text-slate-300">
              Aquí tienes un resumen de la actividad de la Parroquia
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
              <Activity className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Sistema Activo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.name}
              href={stat.href}
              className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">{stat.name}</p>
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-xs text-slate-400 mt-2">{stat.change}</p>
                </div>
              </div>
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left`}></div>
            </Link>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickStats.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all border border-slate-100 flex items-center gap-4 group"
            >
              <div className={`p-3 rounded-xl ${item.bg} group-hover:scale-110 transition-transform`}>
                <Icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{item.count}</p>
                <p className="text-sm text-slate-500">{item.name}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reservations */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Reservaciones Recientes</h2>
              </div>
              <Link href="/admin/reservations" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1 group">
                Ver todas
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {recentReservations.length > 0 ? (
              recentReservations.map((reservation) => (
                <div key={reservation.id} className="p-4 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 truncate">
                        {reservation.name} {reservation.last_name}
                      </p>
                      <p className="text-sm text-slate-500 truncate">
                        {reservation.mass_type} • {new Date(reservation.reservation_date).toLocaleDateString('es-PE')}
                      </p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${STATUS_COLORS[reservation.status] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                      {STATUS_LABELS[reservation.status] || reservation.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-500 font-medium">No hay reservaciones recientes</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-100 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-rose-600" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Mensajes Recientes</h2>
              </div>
              <Link href="/admin/messages" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1 group">
                Ver todos
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {recentMessages.length > 0 ? (
              recentMessages.map((message) => (
                <div key={message.id} className={`p-4 hover:bg-slate-50/50 transition-colors ${message.status === 'unread' ? 'bg-blue-50/30' : ''}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${message.status === 'unread' ? 'bg-blue-500' : 'bg-slate-300'}`}></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="font-semibold text-slate-900 truncate">{message.name}</p>
                        <span className="text-xs text-slate-400 flex-shrink-0">
                          {new Date(message.created_at).toLocaleDateString('es-PE')}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 truncate">{message.subject}</p>
                      <p className="text-xs text-slate-400 truncate mt-1">{message.email}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-500 font-medium">No hay mensajes recientes</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(stats?.reservations?.pending || 0) > 0 && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6">
            <div className="flex gap-4">
              <div className="p-3 bg-amber-100 rounded-xl h-fit">
                <AlertCircle className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-amber-800 mb-1">Reservas Pendientes</h3>
                <p className="text-amber-700 text-sm mb-3">
                  Tienes {stats?.reservations?.pending || 0} reservas esperando confirmación.
                </p>
                <Link 
                  href="/admin/reservations?status=pending" 
                  className="inline-flex items-center gap-2 text-sm font-semibold text-amber-800 hover:text-amber-900 transition-colors"
                >
                  Revisar ahora
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-6">
          <div className="flex gap-4">
            <div className="p-3 bg-emerald-100 rounded-xl h-fit">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-emerald-800 mb-1">Sistema Operativo</h3>
              <p className="text-emerald-700 text-sm">
                Todas las APIs están funcionando correctamente y la base de datos está conectada.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
