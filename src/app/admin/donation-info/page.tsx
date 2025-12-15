'use client';

import { useState, useEffect } from 'react';
import { Save, Upload, Heart, Building2 } from 'lucide-react';

type DonationInfo = {
  id: number;
  title: string;
  subtitle: string;
  bank_name: string;
  account_type: string;
  account_number: string;
  cci: string;
  account_holder: string;
  purpose_title: string | null;
  purpose_description: string | null;
  purpose_image_url: string | null;
  is_active: boolean;
};

export default function DonationInfoPage() {
  const [data, setData] = useState<DonationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState<Partial<DonationInfo>>({});

  useEffect(() => {
    fetchData();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('folder', 'donations');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const data = await response.json();
      if (data.success) {
        setFormData(prev => ({ ...prev, purpose_image_url: data.url }));
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

  const fetchData = async () => {
    try {
      const response = await fetch('/api/admin/donation-info');
      const result = await response.json();
      if (result.success && result.data.length > 0) {
        const info = result.data[0];
        setData(info);
        setFormData(info);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const url = data ? `/api/admin/donation-info/${data.id}` : '/api/admin/donation-info';
      const method = data ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Información guardada correctamente');
        fetchData();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Heart className="w-8 h-8 text-red-500" />
            Información de Donaciones
          </h1>
          <p className="text-gray-600 mt-2">Configura la información bancaria para donaciones</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subtítulo *</label>
              <input
                type="text"
                value={formData.subtitle || ''}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-600" />
              Propósito de las Donaciones
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título del Propósito</label>
                <input
                  type="text"
                  value={formData.purpose_title || ''}
                  onChange={(e) => setFormData({ ...formData, purpose_title: e.target.value })}
                  placeholder="Tu Apoyo Transforma Vidas"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción del Propósito</label>
                <textarea
                  value={formData.purpose_description || ''}
                  onChange={(e) => setFormData({ ...formData, purpose_description: e.target.value })}
                  placeholder="Explica cómo se utilizarán las donaciones..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL de Imagen del Propósito</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.purpose_image_url || ''}
                    onChange={(e) => setFormData({ ...formData, purpose_image_url: e.target.value })}
                    placeholder="/uploads/donations/imagen.jpg"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <label className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    {isUploading ? 'Subiendo...' : 'Subir'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                </div>
                {formData.purpose_image_url && (
                  <div className="mt-2 w-full h-32 rounded-lg overflow-hidden bg-gray-100">
                    <img src={formData.purpose_image_url} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">Sube una imagen que represente el propósito de las donaciones</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              Información Bancaria
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Banco *</label>
                <input
                  type="text"
                  value={formData.bank_name || ''}
                  onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Cuenta *</label>
                  <input
                    type="text"
                    value={formData.account_type || ''}
                    onChange={(e) => setFormData({ ...formData, account_type: e.target.value })}
                    placeholder="Cuenta de Ahorros S/."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Número de Cuenta *</label>
                  <input
                    type="text"
                    value={formData.account_number || ''}
                    onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CCI *</label>
                <input
                  type="text"
                  value={formData.cci || ''}
                  onChange={(e) => setFormData({ ...formData, cci: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titular de la Cuenta *</label>
                <input
                  type="text"
                  value={formData.account_holder || ''}
                  onChange={(e) => setFormData({ ...formData, account_holder: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.is_active ?? true}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-5 h-5 rounded border-gray-300 text-blue-600"
            />
            <span className="text-sm font-medium text-gray-700">Mostrar en la página</span>
          </div>

          <div className="pt-4 border-t">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSaving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save className="w-5 h-5" />}
              {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
