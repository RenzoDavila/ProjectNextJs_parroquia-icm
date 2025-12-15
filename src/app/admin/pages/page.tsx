'use client';

import { Church, Plus } from 'lucide-react';

export default function PagesPage() {
  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Páginas</h1>
            <p className="text-gray-600 mt-1">Gestiona las páginas del sitio</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-5 h-5" />
            Nueva Página
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <Church className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Próximamente</h3>
        <p className="text-gray-600">
          La gestión de páginas estará disponible pronto
        </p>
      </div>
    </div>
  );
}
