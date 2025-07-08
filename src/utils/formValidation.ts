
export interface FormData {
  name: string;
  registration: string;
  carPlate: string;
  carOrderNumber: string;
  guardPhone: string;
  arrivalTime: string;
  keyAcquisitionTime: string;
  materialLoadingTime: string;
  departureTime: string;
}

export interface ValidationErrors {
  [key: string]: string;
}

const validateBrazilianPlate = (plate: string): boolean => {
  // Padrão brasileiro: ABC1234 ou ABC1D23 (Mercosul)
  const oldPattern = /^[A-Z]{3}[0-9]{4}$/;
  const newPattern = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;
  return oldPattern.test(plate) || newPattern.test(plate);
};

const validateTime = (time: string): boolean => {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

export const validateForm = (data: FormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Nome
  if (!data.name.trim()) {
    errors.name = 'Nome é obrigatório';
  } else if (data.name.trim().length < 2) {
    errors.name = 'Nome deve ter pelo menos 2 caracteres';
  }

  // Matrícula
  if (!data.registration.trim()) {
    errors.registration = 'Matrícula é obrigatória';
  }

  // Placa do carro
  if (!data.carPlate.trim()) {
    errors.carPlate = 'Placa do carro é obrigatória';
  } else if (!validateBrazilianPlate(data.carPlate.trim())) {
    errors.carPlate = 'Formato inválido. Use ABC1234 ou ABC1D23';
  }

  // Número de ordem do carro
  if (!data.carOrderNumber.trim()) {
    errors.carOrderNumber = 'Número de ordem é obrigatório';
  } else if (!/^\d{5}$/.test(data.carOrderNumber.trim())) {
    errors.carOrderNumber = 'Deve conter exatamente 5 dígitos';
  }

  // Telefone da guarda
  if (!data.guardPhone.trim()) {
    errors.guardPhone = 'Telefone da guarda é obrigatório';
  } else if (!/^\d{2}$/.test(data.guardPhone.trim())) {
    errors.guardPhone = 'Deve conter exatamente 2 dígitos';
  }

  // Horários
  if (!data.arrivalTime) {
    errors.arrivalTime = 'Horário de chegada é obrigatório';
  } else if (!validateTime(data.arrivalTime)) {
    errors.arrivalTime = 'Formato de horário inválido';
  }

  if (!data.keyAcquisitionTime) {
    errors.keyAcquisitionTime = 'Horário de aquisição de chaves é obrigatório';
  } else if (!validateTime(data.keyAcquisitionTime)) {
    errors.keyAcquisitionTime = 'Formato de horário inválido';
  }

  if (!data.materialLoadingTime) {
    errors.materialLoadingTime = 'Horário de carregamento é obrigatório';
  } else if (!validateTime(data.materialLoadingTime)) {
    errors.materialLoadingTime = 'Formato de horário inválido';
  }

  if (!data.departureTime) {
    errors.departureTime = 'Horário de saída é obrigatório';
  } else if (!validateTime(data.departureTime)) {
    errors.departureTime = 'Formato de horário inválido';
  }

  return errors;
};
