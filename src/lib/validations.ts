// ============================================
// VALIDACIONES DE FORMULARIOS
// ============================================

/**
 * Valida que un campo no esté vacío
 */
export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

/**
 * Valida que un email tenga formato correcto
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Valida que un DNI peruano sea correcto (8 dígitos)
 */
export const validateDNI = (dni: string): boolean => {
  const dniRegex = /^\d{8}$/;
  return dniRegex.test(dni.trim());
};

/**
 * Valida que un teléfono peruano sea correcto
 * Acepta: 9 dígitos (celular) o 6-7 dígitos (fijo)
 */
export const validatePhone = (phone: string): boolean => {
  // Remover espacios, guiones y paréntesis
  const cleanPhone = phone.replace(/[\s\-()]/g, '');
  
  // Validar que solo contenga números
  if (!/^\d+$/.test(cleanPhone)) {
    return false;
  }
  
  // Validar longitud (6-9 dígitos)
  const length = cleanPhone.length;
  return length >= 6 && length <= 9;
};

/**
 * Valida que un campo solo contenga números
 */
export const validateOnlyNumbers = (value: string): boolean => {
  return /^\d+$/.test(value.trim());
};

/**
 * Valida la longitud máxima de un campo
 */
export const validateMaxLength = (value: string, maxLength: number): boolean => {
  return value.trim().length <= maxLength;
};

/**
 * Valida la longitud mínima de un campo
 */
export const validateMinLength = (value: string, minLength: number): boolean => {
  return value.trim().length >= minLength;
};

/**
 * Valida que un archivo no exceda el tamaño máximo (en MB)
 */
export const validateFileSize = (file: File, maxSizeMB: number): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

/**
 * Valida que un archivo sea del tipo correcto
 */
export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.some(type => file.type.startsWith(type) || file.name.endsWith(type));
};

/**
 * Calcula la diferencia en días entre dos fechas
 */
export const getDaysDifference = (date1: Date, date2: Date): number => {
  const diffTime = date2.getTime() - date1.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Valida que una fecha de reserva tenga al menos X días de anticipación
 */
export const validateMinDaysInAdvance = (reservationDate: string, minDays: number): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const reservation = new Date(reservationDate);
  reservation.setHours(0, 0, 0, 0);
  
  const daysDifference = getDaysDifference(today, reservation);
  
  return daysDifference >= minDays;
};

/**
 * Obtiene el mensaje de error según el tipo de validación
 */
export const getValidationMessage = (field: string, validationType: string, params?: any): string => {
  const messages: Record<string, string> = {
    required: `El campo ${field} es obligatorio`,
    email: 'Ingrese un correo electrónico válido',
    dni: 'El DNI debe tener 8 dígitos',
    phone: 'Ingrese un número de teléfono válido (6-9 dígitos)',
    onlyNumbers: `El campo ${field} solo debe contener números`,
    maxLength: `El campo ${field} no debe exceder los ${params?.max} caracteres`,
    minLength: `El campo ${field} debe tener al menos ${params?.min} caracteres`,
    fileSize: `El archivo no debe exceder los ${params?.max} MB`,
    fileType: `El archivo debe ser de tipo ${params?.types?.join(', ')}`,
    minDays: `La reserva debe hacerse con al menos ${params?.days} días de anticipación`,
  };
  
  return messages[validationType] || 'Error de validación';
};

/**
 * Limpia y formatea un número de teléfono
 */
export const formatPhone = (phone: string): string => {
  return phone.replace(/[\s\-()]/g, '');
};

/**
 * Limpia y formatea un DNI
 */
export const formatDNI = (dni: string): string => {
  return dni.replace(/\D/g, '').slice(0, 8);
};

/**
 * Formatea un email (trim y lowercase)
 */
export const formatEmail = (email: string): string => {
  return email.trim().toLowerCase();
};
