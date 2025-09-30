import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { ArrowDownLeft, Building, Smartphone, CreditCard, MapPin, Check } from 'lucide-react';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDepositComplete: (depositData: any) => void;
}

export function DepositModal({ isOpen, onClose, onDepositComplete }: DepositModalProps) {
  const [step, setStep] = useState<'method' | 'form' | 'receipt'>('method');
  const [depositMethod, setDepositMethod] = useState<'local' | 'transfer'>('local');
  const [localType, setLocalType] = useState<'pagofacil' | 'banco'>('pagofacil');
  const [amount, setAmount] = useState('');
  const [depositData, setDepositData] = useState<any>(null);

  const handleMethodSelect = (method: 'local' | 'transfer') => {
    setDepositMethod(method);
    setStep('form');
  };

  const handleDeposit = () => {
    const deposit = {
      id: Date.now().toString(),
      method: depositMethod,
      localType: depositMethod === 'local' ? localType : null,
      amount: parseFloat(amount),
      date: new Date().toISOString(),
      status: 'completed'
    };
    
    setDepositData(deposit);
    setStep('receipt');
    onDepositComplete(deposit);
  };

  const handleClose = () => {
    setStep('method');
    setAmount('');
    setDepositData(null);
    onClose();
  };

  const getMethodName = () => {
    if (depositMethod === 'transfer') return 'Transferencia bancaria';
    return localType === 'pagofacil' ? 'Pago Fácil' : 'Banco';
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        {step === 'method' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <ArrowDownLeft className="w-5 h-5 text-blue-600" />
                <span>Depositar dinero</span>
              </DialogTitle>
              <DialogDescription>
                Selecciona el método para agregar dinero a tu cuenta
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <p className="text-gray-600 text-sm">
                Selecciona el método para agregar dinero a tu cuenta
              </p>
              
              {/* Local/Bank Option */}
              <Button
                variant="outline"
                className="w-full h-auto p-6 flex flex-col items-start space-y-3 hover:bg-blue-50 hover:border-blue-300"
                onClick={() => handleMethodSelect('local')}
              >
                <div className="flex items-center space-x-3 w-full">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-gray-900">Depósito desde local/banco</h3>
                    <p className="text-sm text-gray-600">Pago Fácil o Banco</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs">
                    <MapPin className="w-3 h-3 mr-1" />
                    Presencial
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    Inmediato
                  </Badge>
                </div>
              </Button>

              {/* Transfer Option */}
              <Button
                variant="outline"
                className="w-full h-auto p-6 flex flex-col items-start space-y-3 hover:bg-green-50 hover:border-green-300"
                onClick={() => handleMethodSelect('transfer')}
              >
                <div className="flex items-center space-x-3 w-full">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-gray-900">A través de transferencia</h3>
                    <p className="text-sm text-gray-600">Desde tu banco</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs">
                    <Smartphone className="w-3 h-3 mr-1" />
                    Online
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    24/7
                  </Badge>
                </div>
              </Button>
            </div>
          </>
        )}

        {step === 'form' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <ArrowDownLeft className="w-5 h-5 text-blue-600" />
                <span>Depósito - {getMethodName()}</span>
              </DialogTitle>
              <DialogDescription>
                Completa los datos para tu depósito
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {depositMethod === 'local' && (
                <div className="space-y-3">
                  <Label>Tipo de local</Label>
                  <div className="flex space-x-2">
                    <Button
                      variant={localType === 'pagofacil' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setLocalType('pagofacil')}
                      className="flex-1"
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      Pago Fácil
                    </Button>
                    <Button
                      variant={localType === 'banco' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setLocalType('banco')}
                      className="flex-1"
                    >
                      <Building className="w-4 h-4 mr-2" />
                      Banco
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="amount">Monto a depositar</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="bg-gray-50 pl-8"
                  />
                </div>
              </div>

              {depositMethod === 'local' && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">
                    Instrucciones para {getMethodName()}
                  </h4>
                  <div className="text-sm text-blue-700 space-y-1">
                    <p>• Dirígete al local más cercano</p>
                    <p>• Menciona que es un depósito para Neexa</p>
                    <p>• Proporciona tu número de cuenta: 8803290841959166</p>
                    <p>• El dinero estará disponible inmediatamente</p>
                  </div>
                </div>
              )}

              {depositMethod === 'transfer' && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-900 mb-2">
                    Datos para transferencia
                  </h4>
                  <div className="text-sm text-green-700 space-y-1">
                    <p><strong>CBU:</strong> 0000003100088032908419</p>
                    <p><strong>Alias:</strong> NEEXA.USUARIO.WALLET</p>
                    <p><strong>Titular:</strong> Neexa Usuario</p>
                    <p><strong>CUIT:</strong> 20-12345678-9</p>
                  </div>
                </div>
              )}

              <Button
                onClick={handleDeposit}
                disabled={!amount || parseFloat(amount) <= 0}
                className="w-full bg-blue-600 hover:bg-blue-700 h-12"
              >
                <ArrowDownLeft className="w-4 h-4 mr-2" />
                Confirmar depósito de ${amount ? parseFloat(amount).toLocaleString() : '0'}
              </Button>
            </div>
          </>
        )}

        {step === 'receipt' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2 text-center">
                <Check className="w-5 h-5 text-green-600" />
                <span>Depósito procesado</span>
              </DialogTitle>
              <DialogDescription>
                Tu depósito se ha procesado exitosamente
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  ¡Depósito confirmado!
                </h3>
                <p className="text-gray-600">
                  Se procesó exitosamente ${depositData?.amount.toLocaleString()}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Método</span>
                  <span className="text-sm font-medium">{getMethodName()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Monto</span>
                  <span className="text-sm font-medium">${depositData?.amount.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Fecha</span>
                  <span className="text-sm font-medium">
                    {new Date(depositData?.date).toLocaleString('es-AR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Estado</span>
                  <Badge className="bg-green-100 text-green-700">
                    <Check className="w-3 h-3 mr-1" />
                    Procesado
                  </Badge>
                </div>
              </div>

              <Button onClick={handleClose} className="w-full">
                Finalizar
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}