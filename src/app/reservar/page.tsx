"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import PublicLayout from "@/components/layout/PublicLayout";
import { 
  Calendar, 
  Clock, 
  User, 
  FileText, 
  CreditCard, 
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Loader2,
  AlertCircle,
  X
} from "lucide-react";

type Step = 1 | 2 | 3 | 4 | 5;

type FormData = {
  reservationDate: string;
  reservationTime: string;
  location: string;
  nombre: string;
  apellidos: string;
  dni: string;
  telefono: string;
  email: string;
  tipoMisa: string;
  intencion: string;
  difuntos: string;
  observaciones: string;
  metodoPago: string;
  comprobante: File | null;
};

type FieldErrors = {
  [key: string]: string;
};

type MassType = {
  value: string;
  label: string;
  price: number;
  description: string;
};

type PaymentMethod = {
  type: string;
  name: string;
  description: string;
  banco?: string;
  cuenta?: string;
  cci?: string;
  titular?: string;
  instructions: string;
};

type AvailableTime = {
  time: string;
  isAvailable: boolean;
  reservationsCount: number;
};

// Componente de Input con validación
interface ValidatedInputProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  error?: string;
  required?: boolean;
  maxLength?: number;
  placeholder?: string;
  icon?: React.ReactNode;
  helpText?: string;
}

function ValidatedInput({ 
  label, 
  name, 
  type = "text", 
  value, 
  onChange, 
  onBlur,
  error, 
  required, 
  maxLength,
  placeholder,
  icon,
  helpText
}: ValidatedInputProps) {
  const hasError = !!error;
  
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          maxLength={maxLength}
          placeholder={placeholder}
          className={`w-full ${icon ? 'pl-10' : 'px-4'} pr-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 ${
            hasError 
              ? 'border-red-500 bg-red-50 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300 focus:ring-[#002F57] focus:border-[#002F57]'
          }`}
        />
        {hasError && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
        )}
      </div>
      {hasError && (
        <p className="text-sm text-red-600 flex items-center gap-1 animate-fadeIn">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
      {helpText && !hasError && (
        <p className="text-xs text-gray-500">{helpText}</p>
      )}
    </div>
  );
}

// Componente de Textarea con validación
interface ValidatedTextareaProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: () => void;
  error?: string;
  required?: boolean;
  rows?: number;
  placeholder?: string;
  helpText?: string;
}

function ValidatedTextarea({ 
  label, 
  name, 
  value, 
  onChange, 
  onBlur,
  error, 
  required, 
  rows = 4,
  placeholder,
  helpText
}: ValidatedTextareaProps) {
  const hasError = !!error;
  
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        rows={rows}
        placeholder={placeholder}
        className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 resize-none ${
          hasError 
            ? 'border-red-500 bg-red-50 focus:ring-red-500 focus:border-red-500' 
            : 'border-gray-300 focus:ring-[#002F57] focus:border-[#002F57]'
        }`}
      />
      {hasError && (
        <p className="text-sm text-red-600 flex items-center gap-1 animate-fadeIn">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
      {helpText && !hasError && (
        <p className="text-xs text-gray-500">{helpText}</p>
      )}
    </div>
  );
}

export default function ReservarPage() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState<string>("");
  
  // Función para obtener la fecha de mañana en formato YYYY-MM-DD
  const getTomorrowDate = useCallback(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }, []);

  // Estados para datos de las APIs
  const [massTypes, setMassTypes] = useState<MassType[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [isLoadingTimes, setIsLoadingTimes] = useState(false);
  
  // Estado de errores por campo
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  
  const [formData, setFormData] = useState<FormData>({
    reservationDate: getTomorrowDate(),
    reservationTime: "",
    location: "",
    nombre: "",
    apellidos: "",
    dni: "",
    telefono: "",
    email: "",
    tipoMisa: "",
    intencion: "",
    difuntos: "",
    observaciones: "",
    metodoPago: "",
    comprobante: null,
  });

  // Validaciones
  const validateField = useCallback((name: string, value: string): string => {
    switch (name) {
      case 'nombre':
        if (!value.trim()) return 'El nombre es obligatorio';
        if (value.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres';
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(value)) return 'El nombre solo puede contener letras';
        return '';
      
      case 'apellidos':
        if (!value.trim()) return 'Los apellidos son obligatorios';
        if (value.trim().length < 2) return 'Los apellidos deben tener al menos 2 caracteres';
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(value)) return 'Los apellidos solo pueden contener letras';
        return '';
      
      case 'dni':
        if (!value.trim()) return 'El DNI es obligatorio';
        if (!/^\d+$/.test(value)) return 'El DNI solo debe contener números';
        if (value.length !== 8) return 'El DNI debe tener exactamente 8 dígitos';
        return '';
      
      case 'telefono':
        if (!value.trim()) return 'El teléfono es obligatorio';
        if (!/^\d+$/.test(value)) return 'El teléfono solo debe contener números';
        if (value.length < 9) return 'El teléfono debe tener al menos 9 dígitos';
        return '';
      
      case 'email':
        if (!value.trim()) return 'El correo electrónico es obligatorio';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Ingresa un correo electrónico válido';
        return '';
      
      case 'intencion':
        if (!value.trim()) return 'La intención de la misa es obligatoria';
        if (value.trim().length < 10) return 'La intención debe tener al menos 10 caracteres';
        return '';
      
      case 'reservationDate':
        if (!value) return 'Selecciona una fecha';
        const selectedDate = new Date(value + 'T00:00:00');
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        if (selectedDate < tomorrow) return 'Solo puedes reservar misas a partir de mañana';
        return '';
      
      case 'reservationTime':
        if (!value) return 'Selecciona una hora';
        return '';
      
      case 'tipoMisa':
        if (!value) return 'Selecciona un tipo de misa';
        return '';
      
      case 'metodoPago':
        if (!value) return 'Selecciona un método de pago';
        return '';
      
      default:
        return '';
    }
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Validar en tiempo real si el campo ya fue tocado
    if (touchedFields.has(name)) {
      const error = validateField(name, value);
      setFieldErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (name: string) => {
    setTouchedFields((prev) => new Set(prev).add(name));
    const error = validateField(name, formData[name as keyof FormData] as string);
    setFieldErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, comprobante: file }));
  };

  // Cargar tipos de misa
  useEffect(() => {
    const fetchMassTypes = async () => {
      try {
        const response = await fetch('/api/mass-types', { cache: 'no-store' });
        const data = await response.json();
        if (data.success) {
          setMassTypes(data.massTypes || data.data);
        }
      } catch (error) {
        console.error('Error al cargar tipos de misa:', error);
      }
    };
    fetchMassTypes();
  }, []);

  // Cargar métodos de pago
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const response = await fetch('/api/payment-methods', { cache: 'no-store' });
        const data = await response.json();
        if (data.success) {
          setPaymentMethods(data.data);
        }
      } catch (error) {
        console.error('Error al cargar métodos de pago:', error);
      }
    };
    fetchPaymentMethods();
  }, []);

  // Cargar horarios disponibles
  useEffect(() => {
    setAvailableTimes([]);
    setFormData((prev) => ({ ...prev, reservationTime: "" }));
    
    if (!formData.reservationDate) return;

    const fetchAvailableTimes = async () => {
      setIsLoadingTimes(true);
      try {
        const response = await fetch(
          `/api/reservations/available-times?date=${formData.reservationDate}`,
          { cache: 'no-store' }
        );
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        
        if (data.data && Array.isArray(data.data)) {
          const times = data.data
            .filter((slot: AvailableTime) => slot.isAvailable)
            .map((slot: AvailableTime) => slot.time);
          
          // Eliminar duplicados usando Set (asegurar tipo string[] para TypeScript)
          const uniqueTimes = Array.from(new Set(times)) as string[];
          setAvailableTimes(uniqueTimes);
        }
      } catch (error) {
        console.error('Error al cargar horarios:', error);
      } finally {
        setIsLoadingTimes(false);
      }
    };
    
    fetchAvailableTimes();
  }, [formData.reservationDate]);

  const nextStep = () => {
    // Marcar todos los campos del paso como tocados
    const stepFields: { [key: number]: string[] } = {
      1: ['reservationDate', 'reservationTime'],
      2: ['nombre', 'apellidos', 'dni', 'telefono', 'email'],
      3: ['tipoMisa', 'intencion'],
      4: ['metodoPago'],
    };
    
    const fields = stepFields[currentStep] || [];
    const newTouchedFields = new Set(touchedFields);
    const newErrors: FieldErrors = {};
    
    fields.forEach(field => {
      newTouchedFields.add(field);
      const error = validateField(field, formData[field as keyof FormData] as string);
      if (error) newErrors[field] = error;
    });
    
    setTouchedFields(newTouchedFields);
    setFieldErrors((prev) => ({ ...prev, ...newErrors }));
    
    if (Object.keys(newErrors).length === 0 && currentStep < 5) {
      setCurrentStep((prev) => (prev + 1) as Step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar campos del paso 4 antes de enviar
    const fields = ['metodoPago'];
    const newErrors: FieldErrors = {};
    fields.forEach(field => {
      const error = validateField(field, formData[field as keyof FormData] as string);
      if (error) newErrors[field] = error;
    });
    
    if (Object.keys(newErrors).length > 0) {
      setFieldErrors((prev) => ({ ...prev, ...newErrors }));
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setSubmitError("");

    try {
      let comprobanteBase64 = null;
      let comprobanteMimeType = null;
      let comprobanteSize = null;

      if (formData.comprobante) {
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(formData.comprobante as File);
        });
        comprobanteBase64 = await base64Promise;
        comprobanteMimeType = formData.comprobante.type;
        comprobanteSize = formData.comprobante.size;
      }

      const requestBody = {
        date: formData.reservationDate,
        time: formData.reservationTime,
        location: formData.location || 'Parroquia Corazón de María',
        nombre: formData.nombre.trim(),
        apellidos: formData.apellidos.trim(),
        dni: formData.dni.trim(),
        telefono: formData.telefono.trim(),
        email: formData.email.trim().toLowerCase(),
        tipoMisa: formData.tipoMisa,
        intencion: formData.intencion.trim(),
        difuntos: formData.difuntos?.trim() || '',
        observaciones: formData.observaciones?.trim() || '',
        metodoPago: formData.metodoPago,
        comprobanteBase64,
        comprobanteMimeType,
        comprobanteSize,
      };

      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (data.success && data.confirmationCode) {
        setSubmitStatus("success");
        setCurrentStep(5);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        throw new Error(data.error || 'Error al crear la reserva');
      }
    } catch (error) {
      console.error('Error al enviar reserva:', error);
      setSubmitStatus("error");
      setSubmitError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedMassType = massTypes.find(t => t.value === formData.tipoMisa);
  const selectedPaymentMethod = paymentMethods.find(p => p.type === formData.metodoPago);

  const steps = [
    { number: 1, title: "Fecha y Hora", icon: Calendar },
    { number: 2, title: "Datos Personales", icon: User },
    { number: 3, title: "Detalles de Misa", icon: FileText },
    { number: 4, title: "Pago", icon: CreditCard },
    { number: 5, title: "Confirmación", icon: CheckCircle },
  ];

  return (
    <PublicLayout>
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[#002F57] mb-2">
              Reservar Misa
            </h1>
            <p className="text-gray-600">
              Complete el formulario para reservar una misa en nuestra parroquia
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between relative">
              {/* Progress Line */}
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10">
                <div 
                  className="h-full bg-[#49AE9C] transition-all duration-500"
                  style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
                />
              </div>
              
              {steps.map((step) => {
                const Icon = step.icon;
                const isCompleted = currentStep > step.number;
                const isCurrent = currentStep === step.number;
                
                return (
                  <div key={step.number} className="flex flex-col items-center">
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isCompleted 
                          ? 'bg-[#49AE9C] text-white' 
                          : isCurrent 
                            ? 'bg-[#002F57] text-white ring-4 ring-[#002F57]/20' 
                            : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <span className={`text-xs mt-2 font-medium hidden sm:block ${
                      isCurrent ? 'text-[#002F57]' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Error Alert */}
          {submitStatus === "error" && submitError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 animate-fadeIn">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-red-800">Error al procesar la reserva</p>
                <p className="text-sm text-red-600">{submitError}</p>
              </div>
              <button 
                onClick={() => setSubmitError("")}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <form onSubmit={handleSubmit}>
              <div className="p-6 md:p-8">
                {/* Step 1: Date & Time */}
                {currentStep === 1 && (
                  <div className="space-y-6 animate-fadeIn">
                    <h2 className="text-2xl font-bold text-[#002F57] mb-6">
                      Selecciona Fecha y Hora
                    </h2>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha de la Misa <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="date"
                          name="reservationDate"
                          value={formData.reservationDate}
                          onChange={handleInputChange}
                          onBlur={() => handleBlur('reservationDate')}
                          min={getTomorrowDate()}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 ${
                            fieldErrors.reservationDate && touchedFields.has('reservationDate')
                              ? 'border-red-500 bg-red-50 focus:ring-red-500' 
                              : 'border-gray-300 focus:ring-[#002F57]'
                          }`}
                        />
                      </div>
                      {fieldErrors.reservationDate && touchedFields.has('reservationDate') && (
                        <p className="text-sm text-red-600 flex items-center gap-1 mt-1 animate-fadeIn">
                          <AlertCircle className="w-4 h-4" />
                          {fieldErrors.reservationDate}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hora de la Misa <span className="text-red-500">*</span>
                      </label>
                      
                      {!formData.reservationDate ? (
                        <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500 border-2 border-dashed border-gray-200">
                          <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                          Por favor, selecciona primero una fecha
                        </div>
                      ) : isLoadingTimes ? (
                        <div className="bg-blue-50 rounded-lg p-4 text-center text-blue-600">
                          <Loader2 className="w-6 h-6 mx-auto mb-2 animate-spin" />
                          Cargando horarios disponibles...
                        </div>
                      ) : availableTimes.length === 0 ? (
                        <div className="bg-yellow-50 rounded-lg p-4 text-center text-yellow-700 border border-yellow-200">
                          <AlertCircle className="w-6 h-6 mx-auto mb-2" />
                          No hay horarios disponibles para esta fecha
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {availableTimes.map((time, index) => (
                            <button
                              key={`${time}-${index}`}
                              type="button"
                              onClick={() => {
                                setFormData((prev) => ({ ...prev, reservationTime: time }));
                                setFieldErrors((prev) => ({ ...prev, reservationTime: '' }));
                              }}
                              className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                                formData.reservationTime === time
                                  ? "border-[#002F57] bg-[#002F57] text-white shadow-lg scale-105"
                                  : "border-gray-200 hover:border-[#49AE9C] hover:bg-gray-50"
                              }`}
                            >
                              <Clock className="w-5 h-5 mx-auto mb-1" />
                              <span className="text-sm font-medium">{time}</span>
                            </button>
                          ))}
                        </div>
                      )}
                      {fieldErrors.reservationTime && touchedFields.has('reservationTime') && (
                        <p className="text-sm text-red-600 flex items-center gap-1 mt-2 animate-fadeIn">
                          <AlertCircle className="w-4 h-4" />
                          {fieldErrors.reservationTime}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 2: Personal Info */}
                {currentStep === 2 && (
                  <div className="space-y-6 animate-fadeIn">
                    <h2 className="text-2xl font-bold text-[#002F57] mb-6">
                      Datos Personales
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <ValidatedInput
                        label="Nombres"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('nombre')}
                        error={touchedFields.has('nombre') ? fieldErrors.nombre : undefined}
                        required
                        placeholder="Ej: Juan Carlos"
                      />
                      <ValidatedInput
                        label="Apellidos"
                        name="apellidos"
                        value={formData.apellidos}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('apellidos')}
                        error={touchedFields.has('apellidos') ? fieldErrors.apellidos : undefined}
                        required
                        placeholder="Ej: Pérez García"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <ValidatedInput
                        label="DNI"
                        name="dni"
                        value={formData.dni}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('dni')}
                        error={touchedFields.has('dni') ? fieldErrors.dni : undefined}
                        required
                        maxLength={8}
                        placeholder="8 dígitos"
                        helpText="Ingresa tu DNI de 8 dígitos"
                      />
                      <ValidatedInput
                        label="Teléfono"
                        name="telefono"
                        type="tel"
                        value={formData.telefono}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('telefono')}
                        error={touchedFields.has('telefono') ? fieldErrors.telefono : undefined}
                        required
                        placeholder="Ej: 987654321"
                        helpText="Número de 9 dígitos"
                      />
                    </div>

                    <ValidatedInput
                      label="Correo Electrónico"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('email')}
                      error={touchedFields.has('email') ? fieldErrors.email : undefined}
                      required
                      placeholder="correo@ejemplo.com"
                      helpText="Recibirás la confirmación en este correo"
                    />
                  </div>
                )}

                {/* Step 3: Mass Details */}
                {currentStep === 3 && (
                  <div className="space-y-6 animate-fadeIn">
                    <h2 className="text-2xl font-bold text-[#002F57] mb-6">
                      Detalles de la Misa
                    </h2>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo de Misa <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {massTypes.map((type) => (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({ ...prev, tipoMisa: type.value }));
                              setFieldErrors((prev) => ({ ...prev, tipoMisa: '' }));
                            }}
                            className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                              formData.tipoMisa === type.value
                                ? "border-[#002F57] bg-[#002F57]/5 shadow-md"
                                : "border-gray-200 hover:border-[#49AE9C] hover:shadow-sm"
                            }`}
                          >
                            <span className="block font-semibold text-[#002F57]">{type.label}</span>
                            <span className="block text-[#49AE9C] font-bold text-lg mt-1">
                              S/ {type.price.toFixed(2)}
                            </span>
                            {type.description && (
                              <span className="block text-xs text-gray-500 mt-1">{type.description}</span>
                            )}
                          </button>
                        ))}
                      </div>
                      {fieldErrors.tipoMisa && touchedFields.has('tipoMisa') && (
                        <p className="text-sm text-red-600 flex items-center gap-1 mt-2 animate-fadeIn">
                          <AlertCircle className="w-4 h-4" />
                          {fieldErrors.tipoMisa}
                        </p>
                      )}
                    </div>

                    <ValidatedTextarea
                      label="Intención de la Misa"
                      name="intencion"
                      value={formData.intencion}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('intencion')}
                      error={touchedFields.has('intencion') ? fieldErrors.intencion : undefined}
                      required
                      rows={3}
                      placeholder="Describe la intención de la misa..."
                      helpText="Mínimo 10 caracteres"
                    />

                    <ValidatedTextarea
                      label="Nombres de Difuntos (si aplica)"
                      name="difuntos"
                      value={formData.difuntos}
                      onChange={handleInputChange}
                      rows={2}
                      placeholder="Nombres de los difuntos por quienes se ofrece la misa"
                    />

                    <ValidatedTextarea
                      label="Observaciones adicionales"
                      name="observaciones"
                      value={formData.observaciones}
                      onChange={handleInputChange}
                      rows={2}
                      placeholder="Cualquier información adicional..."
                    />
                  </div>
                )}

                {/* Step 4: Payment */}
                {currentStep === 4 && (
                  <div className="space-y-6 animate-fadeIn">
                    <h2 className="text-2xl font-bold text-[#002F57] mb-6">
                      Método de Pago
                    </h2>

                    {/* Resumen */}
                    <div className="bg-gradient-to-r from-[#002F57] to-[#003d6d] rounded-xl p-6 text-white">
                      <h3 className="font-semibold mb-4">Resumen de tu reserva</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-white/70">Fecha:</span>
                          <span>{formData.reservationDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Hora:</span>
                          <span>{formData.reservationTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Tipo de Misa:</span>
                          <span>{selectedMassType?.label}</span>
                        </div>
                        <div className="border-t border-white/20 my-3"></div>
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total a pagar:</span>
                          <span className="text-[#6DFFE5]">S/ {selectedMassType?.price.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Selecciona método de pago <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {paymentMethods.map((method) => (
                          <button
                            key={method.type}
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({ ...prev, metodoPago: method.type }));
                              setFieldErrors((prev) => ({ ...prev, metodoPago: '' }));
                            }}
                            className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                              formData.metodoPago === method.type
                                ? "border-[#49AE9C] bg-[#49AE9C]/5 shadow-md"
                                : "border-gray-200 hover:border-[#49AE9C] hover:shadow-sm"
                            }`}
                          >
                            <span className="block font-semibold text-[#002F57]">{method.name}</span>
                            <span className="block text-sm text-gray-500 mt-1">{method.description}</span>
                          </button>
                        ))}
                      </div>
                      {fieldErrors.metodoPago && touchedFields.has('metodoPago') && (
                        <p className="text-sm text-red-600 flex items-center gap-1 mt-2 animate-fadeIn">
                          <AlertCircle className="w-4 h-4" />
                          {fieldErrors.metodoPago}
                        </p>
                      )}
                    </div>

                    {/* Payment Details */}
                    {selectedPaymentMethod && selectedPaymentMethod.type !== 'efectivo' && (
                      <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                        <h4 className="font-semibold text-blue-900 mb-3">Datos para transferencia</h4>
                        <div className="space-y-2 text-sm">
                          {selectedPaymentMethod.banco && (
                            <p><span className="text-blue-700">Banco:</span> {selectedPaymentMethod.banco}</p>
                          )}
                          {selectedPaymentMethod.cuenta && (
                            <p><span className="text-blue-700">Cuenta:</span> {selectedPaymentMethod.cuenta}</p>
                          )}
                          {selectedPaymentMethod.cci && (
                            <p><span className="text-blue-700">CCI:</span> {selectedPaymentMethod.cci}</p>
                          )}
                          {selectedPaymentMethod.titular && (
                            <p><span className="text-blue-700">Titular:</span> {selectedPaymentMethod.titular}</p>
                          )}
                        </div>
                        <p className="text-xs text-blue-600 mt-3">{selectedPaymentMethod.instructions}</p>
                      </div>
                    )}

                    {/* File Upload */}
                    {selectedPaymentMethod && selectedPaymentMethod.type !== 'efectivo' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Comprobante de pago (opcional)
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#49AE9C] transition-colors">
                          <input
                            type="file"
                            onChange={handleFileChange}
                            accept="image/*,.pdf"
                            className="hidden"
                            id="comprobante"
                          />
                          <label htmlFor="comprobante" className="cursor-pointer">
                            {formData.comprobante ? (
                              <div className="text-[#49AE9C]">
                                <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                                <p className="font-medium">{formData.comprobante.name}</p>
                                <p className="text-xs text-gray-500">Click para cambiar</p>
                              </div>
                            ) : (
                              <div className="text-gray-500">
                                <CreditCard className="w-8 h-8 mx-auto mb-2" />
                                <p>Click para subir comprobante</p>
                                <p className="text-xs">PNG, JPG o PDF</p>
                              </div>
                            )}
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 5: Confirmation */}
                {currentStep === 5 && submitStatus === "success" && (
                  <div className="text-center py-8 animate-fadeIn">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#002F57] mb-2">
                      ¡Reserva Confirmada!
                    </h2>
                    <p className="text-gray-600 mb-6">
                      Tu reserva ha sido registrada exitosamente
                    </p>
                    
                    <div className="bg-gray-50 rounded-xl p-6 max-w-md mx-auto mb-8">
                      <h3 className="font-semibold text-[#002F57] mb-4">Detalles de tu reserva</h3>
                      <div className="space-y-2 text-sm text-left">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Fecha:</span>
                          <span className="font-medium">{formData.reservationDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Hora:</span>
                          <span className="font-medium">{formData.reservationTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Tipo:</span>
                          <span className="font-medium">{selectedMassType?.label}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Monto:</span>
                          <span className="font-medium text-[#49AE9C]">S/ {selectedMassType?.price.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Link
                      href="/"
                      className="inline-flex items-center px-8 py-3 bg-[#002F57] text-white font-semibold rounded-lg hover:bg-[#001f3d] transition-colors"
                    >
                      Volver al inicio
                    </Link>
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              {currentStep < 5 && (
                <div className="px-6 md:px-8 py-4 bg-gray-50 border-t flex justify-between items-center">
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      currentStep === 1
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5 mr-1" />
                    Anterior
                  </button>

                  {currentStep < 4 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="flex items-center px-6 py-3 bg-[#002F57] text-white font-semibold rounded-lg hover:bg-[#001f3d] transition-all duration-200 hover:shadow-lg"
                    >
                      Siguiente
                      <ChevronRight className="w-5 h-5 ml-1" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center px-8 py-3 bg-[#49AE9C] text-white font-semibold rounded-lg hover:bg-[#3d9a89] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Procesando...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Confirmar Reserva
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      </main>
    </PublicLayout>
  );
}
