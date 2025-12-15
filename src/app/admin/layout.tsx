'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Image,
  FileText,
  Settings,
  Clock,
  Church,
  Menu,
  X,
  LogOut,
  ArrowLeft,
  MessageSquare,
  UsersRound,
  Share2,
  Bell,
  Search,
  Home,
  Heart,
} from 'lucide-react';

type NavItem = {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

const navigationGroups: NavGroup[] = [
  {
    title: 'Principal',
    items: [
      { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { name: 'Mensajes', href: '/admin/messages', icon: MessageSquare },
    ],
  },
  {
    title: 'Gestión de Misas',
    items: [
      { name: 'Reservas de Misas', href: '/admin/reservations', icon: Calendar },
      { name: 'Horarios de Misas', href: '/admin/mass-times', icon: Clock },
    ],
  },
  {
    title: 'Contenido',
    items: [
      { name: 'Contenido Home', href: '/admin/home-content', icon: Home },
      { name: 'Galería', href: '/admin/gallery', icon: Image },
      { name: 'Banners', href: '/admin/banners', icon: FileText },
      { name: 'Donaciones', href: '/admin/donation-info', icon: Heart },
    ],
  },
  {
    title: 'Comunidad',
    items: [
      { name: 'Equipo Pastoral', href: '/admin/team', icon: Users },
      { name: 'Grupos Parroquiales', href: '/admin/parish-groups', icon: UsersRound },
    ],
  },
  {
    title: 'Configuración',
    items: [
      { name: 'Redes Sociales', href: '/admin/social-media', icon: Share2 },
      { name: 'Ajustes', href: '/admin/settings', icon: Settings },
    ],
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications] = useState(3);
  const [currentTime, setCurrentTime] = useState('');
  const pathname = usePathname();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const getPageTitle = () => {
    for (const group of navigationGroups) {
      for (const item of group.items) {
        if (pathname === item.href) {
          return item.name;
        }
      }
    }
    return 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl transform transition-all duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${sidebarCollapsed ? 'lg:w-20' : 'w-72'}`}
      >
        {/* Logo Header */}
        <div className="flex items-center justify-between h-20 px-6 bg-slate-900/50 border-b border-slate-700/50">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Church className="w-6 h-6 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col">
                <span className="text-white font-bold text-lg tracking-tight">Parroquia</span>
                <span className="text-slate-400 text-xs">Panel Admin</span>
              </div>
            )}
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-6 overflow-y-auto">
          {/* Back to Website Button */}
          <Link
            href="/"
            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-xl transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 ${sidebarCollapsed ? 'justify-center' : ''}`}
          >
            <ArrowLeft className="w-5 h-5" />
            {!sidebarCollapsed && <span>Volver al Sitio</span>}
          </Link>

          {/* Navigation Groups */}
          {navigationGroups.map((group) => (
            <div key={group.title}>
              {!sidebarCollapsed && (
                <h3 className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  {group.title}
                </h3>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                      } ${sidebarCollapsed ? 'justify-center' : ''}`}
                      onClick={() => setSidebarOpen(false)}
                      title={sidebarCollapsed ? item.name : undefined}
                    >
                      <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-emerald-400' : ''}`} />
                      {!sidebarCollapsed && (
                        <>
                          <span>{item.name}</span>
                          {item.badge && item.badge > 0 && (
                            <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold animate-pulse">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-slate-700/50 bg-slate-900/50">
          <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-violet-500/25">
                A
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full"></span>
            </div>
            {!sidebarCollapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">Administrador</p>
                  <p className="text-xs text-slate-500 truncate">admin@parroquia.com</p>
                </div>
                <button
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'}`}>
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden lg:flex p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                title={sidebarCollapsed ? 'Expandir menú' : 'Colapsar menú'}
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-slate-800">{getPageTitle()}</h1>
                <p className="text-xs text-slate-500">Panel de Administración</p>
              </div>
            </div>

            {/* Center - Search */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-0 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              {/* Time Display */}
              <div className="hidden lg:flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-xl">
                <Clock className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700">{currentTime}</span>
              </div>

              {/* Notifications */}
              <button className="relative p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors">
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                    {notifications}
                  </span>
                )}
              </button>

              {/* Ver Sitio Button */}
              <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200">
                <Link
                  href="/"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-xl transition-all shadow-md hover:shadow-lg"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden lg:inline">Ver Sitio</span>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="py-6 px-4 lg:px-8 border-t border-slate-200 bg-white/50">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
            <p>© 2025 Parroquia Inmaculado Corazón de María</p>
            <p className="flex items-center gap-1">
              Hecho con <span className="text-red-500">♥</span> para la comunidad
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
