
import { FormData } from './formValidation';

const TELEGRAM_BOT_TOKEN = '8025653752:AAHiAtKF34J557xzItAjVull0WWoauY6u2g';
const CHAT_ID = '-1002463792044';

export const sendToTelegram = async (data: FormData): Promise<void> => {
  const message = formatMessage(data);
  
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  
  const payload = {
    chat_id: CHAT_ID,
    text: message,
    parse_mode: 'HTML'
  };

  console.log('Enviando para Telegram:', { url, payload });

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Erro da API do Telegram:', errorData);
    throw new Error(`Falha ao enviar mensagem: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  console.log('Resposta do Telegram:', result);
  
  if (!result.ok) {
    throw new Error(`Erro do Telegram: ${result.description}`);
  }
};

const formatMessage = (data: FormData): string => {
  return `🚧 Registro de Saída de Veículo 🚧

👷 Nome: ${data.name}
🆔 Matrícula: ${data.registration}
🚗 Placa do Carro: ${data.carPlate}
🔢 Nº de Ordem do Carro: ${data.carOrderNumber}
📞 Tel. da Guarda: ${data.guardPhone}

⏱️ Horários:
• Chegada na Base: ${data.arrivalTime}
• Aquisição de Chaves: ${data.keyAcquisitionTime}
• Carregamento de Material: ${data.materialLoadingTime}
• Saída da Base: ${data.departureTime}`;
};
