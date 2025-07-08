
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Send, Truck, Clock, User, Phone, Hash, Car } from 'lucide-react';
import { validateForm, FormData, ValidationErrors } from '@/utils/formValidation';
import { sendToTelegram } from '@/utils/telegramService';
import { toast } from '@/hooks/use-toast';

const ElectricianForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    registration: '',
    carPlate: '',
    carOrderNumber: '',
    guardPhone: '',
    arrivalTime: '',
    keyAcquisitionTime: '',
    materialLoadingTime: '',
    departureTime: ''
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast({
        title: "Erro de Validação",
        description: "Por favor, corrija os campos destacados.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await sendToTelegram(formData);
      toast({
        title: "Sucesso!",
        description: "Registro enviado com sucesso para o grupo do Telegram.",
        variant: "default",
      });
      
      // Limpar formulário após sucesso
      setFormData({
        name: '',
        registration: '',
        carPlate: '',
        carOrderNumber: '',
        guardPhone: '',
        arrivalTime: '',
        keyAcquisitionTime: '',
        materialLoadingTime: '',
        departureTime: ''
      });
    } catch (error) {
      console.error('Erro ao enviar para Telegram:', error);
      toast({
        title: "Erro no Envio",
        description: "Falha ao enviar dados. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto">
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-center flex items-center justify-center gap-2 text-xl">
              <Truck className="w-6 h-6" />
              Registro de Saída de Veículo
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-6 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Dados Pessoais */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Dados Pessoais
                </h3>
                
                <div>
                  <Label htmlFor="name" className="text-sm font-medium">Nome *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`mt-1 ${errors.name ? 'border-red-500' : ''}`}
                    placeholder="Digite seu nome completo"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <Label htmlFor="registration" className="text-sm font-medium">Matrícula *</Label>
                  <Input
                    id="registration"
                    type="text"
                    value={formData.registration}
                    onChange={(e) => handleInputChange('registration', e.target.value)}
                    className={`mt-1 ${errors.registration ? 'border-red-500' : ''}`}
                    placeholder="Digite sua matrícula"
                  />
                  {errors.registration && <p className="text-red-500 text-xs mt-1">{errors.registration}</p>}
                </div>
              </div>

              {/* Dados do Veículo */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                  <Car className="w-4 h-4" />
                  Dados do Veículo
                </h3>
                
                <div>
                  <Label htmlFor="carPlate" className="text-sm font-medium">Placa do Carro *</Label>
                  <Input
                    id="carPlate"
                    type="text"
                    value={formData.carPlate}
                    onChange={(e) => handleInputChange('carPlate', e.target.value.toUpperCase())}
                    className={`mt-1 ${errors.carPlate ? 'border-red-500' : ''}`}
                    placeholder="ABC1D23"
                    maxLength={7}
                  />
                  {errors.carPlate && <p className="text-red-500 text-xs mt-1">{errors.carPlate}</p>}
                </div>

                <div>
                  <Label htmlFor="carOrderNumber" className="text-sm font-medium">Nº de Ordem do Carro *</Label>
                  <Input
                    id="carOrderNumber"
                    type="text"
                    value={formData.carOrderNumber}
                    onChange={(e) => handleInputChange('carOrderNumber', e.target.value.replace(/\D/g, '').slice(0, 5))}
                    className={`mt-1 ${errors.carOrderNumber ? 'border-red-500' : ''}`}
                    placeholder="12345 (5 dígitos)"
                    maxLength={5}
                  />
                  {errors.carOrderNumber && <p className="text-red-500 text-xs mt-1">{errors.carOrderNumber}</p>}
                </div>

                <div>
                  <Label htmlFor="guardPhone" className="text-sm font-medium">Tel. da Guarda *</Label>
                  <Input
                    id="guardPhone"
                    type="text"
                    value={formData.guardPhone}
                    onChange={(e) => handleInputChange('guardPhone', e.target.value.replace(/\D/g, '').slice(0, 2))}
                    className={`mt-1 ${errors.guardPhone ? 'border-red-500' : ''}`}
                    placeholder="85 (2 dígitos)"
                    maxLength={2}
                  />
                  {errors.guardPhone && <p className="text-red-500 text-xs mt-1">{errors.guardPhone}</p>}
                </div>
              </div>

              {/* Horários */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Horários
                </h3>
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="arrivalTime" className="text-sm font-medium">Chegada na Base *</Label>
                    <Input
                      id="arrivalTime"
                      type="time"
                      value={formData.arrivalTime}
                      onChange={(e) => handleInputChange('arrivalTime', e.target.value)}
                      className={`mt-1 ${errors.arrivalTime ? 'border-red-500' : ''}`}
                    />
                    {errors.arrivalTime && <p className="text-red-500 text-xs mt-1">{errors.arrivalTime}</p>}
                  </div>

                  <div>
                    <Label htmlFor="keyAcquisitionTime" className="text-sm font-medium">Aquisição de Chaves *</Label>
                    <Input
                      id="keyAcquisitionTime"
                      type="time"
                      value={formData.keyAcquisitionTime}
                      onChange={(e) => handleInputChange('keyAcquisitionTime', e.target.value)}
                      className={`mt-1 ${errors.keyAcquisitionTime ? 'border-red-500' : ''}`}
                    />
                    {errors.keyAcquisitionTime && <p className="text-red-500 text-xs mt-1">{errors.keyAcquisitionTime}</p>}
                  </div>

                  <div>
                    <Label htmlFor="materialLoadingTime" className="text-sm font-medium">Carregamento de Material *</Label>
                    <Input
                      id="materialLoadingTime"
                      type="time"
                      value={formData.materialLoadingTime}
                      onChange={(e) => handleInputChange('materialLoadingTime', e.target.value)}
                      className={`mt-1 ${errors.materialLoadingTime ? 'border-red-500' : ''}`}
                    />
                    {errors.materialLoadingTime && <p className="text-red-500 text-xs mt-1">{errors.materialLoadingTime}</p>}
                  </div>

                  <div>
                    <Label htmlFor="departureTime" className="text-sm font-medium">Saída da Base *</Label>
                    <Input
                      id="departureTime"
                      type="time"
                      value={formData.departureTime}
                      onChange={(e) => handleInputChange('departureTime', e.target.value)}
                      className={`mt-1 ${errors.departureTime ? 'border-red-500' : ''}`}
                    />
                    {errors.departureTime && <p className="text-red-500 text-xs mt-1">{errors.departureTime}</p>}
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Enviar Registro
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ElectricianForm;
