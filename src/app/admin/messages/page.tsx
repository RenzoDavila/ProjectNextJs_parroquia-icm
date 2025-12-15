'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Mail, MailOpen, Trash2, X, Clock, User } from 'lucide-react';

type Message = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: string;
  created_at: string;
  read_at: string | null;
};

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/admin/messages');
      const data = await response.json();
      if (data.success) {
        setMessages(data.data || []);
      }
    } catch (error) {
      console.error('Error al cargar mensajes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'read' }),
      });
      if (response.ok) {
        setMessages(messages.map(m => m.id === id ? { ...m, status: 'read' } : m));
        if (selectedMessage?.id === id) {
          setSelectedMessage({ ...selectedMessage, status: 'read' });
        }
      }
    } catch (error) {
      console.error('Error al marcar como leído:', error);
    }
  };

  const deleteMessage = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este mensaje?')) return;
    
    try {
      const response = await fetch(`/api/admin/messages/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setMessages(messages.filter(m => m.id !== id));
        if (selectedMessage?.id === id) {
          setSelectedMessage(null);
        }
      }
    } catch (error) {
      console.error('Error al eliminar mensaje:', error);
    }
  };

  const openMessage = (message: Message) => {
    setSelectedMessage(message);
    if (message.status === 'unread') {
      markAsRead(message.id);
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'unread' && message.status === 'unread') ||
      (statusFilter === 'read' && message.status === 'read');
    
    return matchesSearch && matchesStatus;
  });

  const unreadCount = messages.filter(m => m.status === 'unread').length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando mensajes...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mensajes de Contacto</h1>
            <p className="text-gray-600 mt-1">
              {unreadCount > 0 ? `${unreadCount} mensaje(s) sin leer` : 'Todos los mensajes leídos'}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nombre, email o asunto..."
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
              <option value="all">Todos</option>
              <option value="unread">Sin leer</option>
              <option value="read">Leídos</option>
            </select>
          </div>
        </div>
      </div>

      {filteredMessages.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-200">
            {filteredMessages.map((message) => (
              <div
                key={message.id}
                onClick={() => openMessage(message)}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${message.status === 'unread' ? 'bg-blue-50' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${message.status === 'unread' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      {message.status === 'unread' ? (
                        <Mail className="w-5 h-5 text-blue-600" />
                      ) : (
                        <MailOpen className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`font-medium ${message.status === 'unread' ? 'text-gray-900' : 'text-gray-600'}`}>
                          {message.name}
                        </p>
                        {message.status === 'unread' && (
                          <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">Nuevo</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{message.email}</p>
                      <p className={`mt-1 ${message.status === 'unread' ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                        {message.subject}
                      </p>
                      <p className="text-sm text-gray-500 truncate mt-1">{message.message}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {new Date(message.created_at).toLocaleDateString('es-PE')}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteMessage(message.id); }}
                      className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay mensajes</h3>
          <p className="text-gray-600">Los mensajes de contacto aparecerán aquí</p>
        </div>
      )}

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedMessage(null)}
        >
          <div 
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Detalle del Mensaje</h2>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{selectedMessage.name}</p>
                    <p className="text-sm text-gray-500">{selectedMessage.email}</p>
                    {selectedMessage.phone && <p className="text-sm text-gray-500">{selectedMessage.phone}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <p className="text-sm text-gray-500">
                    {new Date(selectedMessage.created_at).toLocaleString('es-PE')}
                  </p>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{selectedMessage.subject}</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-between">
              <button
                onClick={() => deleteMessage(selectedMessage.id)}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar
              </button>
              <a
                href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Responder por Email
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
