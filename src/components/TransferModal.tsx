import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { ArrowUpRight, Check, Copy, User, Phone, CreditCard } from 'lucide-react';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransferComplete: (transferData: any) => void;
}

export function TransferModal({ isOpen, onClose, onTransferComplete }: TransferModalProps) {
  const [step, setStep] = useState<'form' | 'receipt'>('form');
  const [transferType, setTransferType] = useState<'cvu' | 'phone'>('cvu');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [transferData, setTransferData] = useState<any>(null);

  const handleTransfer = () => {
    const transfer = {
      id: Date.now().toString(),
      type: transferType,
      recipient,
      amount: parseFloat(amount),
      description,
      date: new Date().toISOString(),
      status: 'completed'
    };
    
    setTransferData(transfer);
    setStep('receipt');
    onTransferComplete(transfer);
  };

  const handleClose = () => {
    setStep('form');
    setRecipient('');
    setAmount('');
    setDescription('');
    setTransferData(null);
    onClose();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        {step === 'form' ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <ArrowUpRight className="w-5 h-5 text-teal-600" />
                <span>Transferir dinero</span>
              </DialogTitle>
              <DialogDescription>
                Completa los datos para realizar tu transferencia
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Transfer Type Selection */}
              <div className="space-y-3">
                <Label>Tipo de transferencia</Label>
                <div className="flex space-x-2">
                  <Button
                    variant={transferType === 'cvu' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTransferType('cvu')}
                    className="flex-1"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    CVU/Alias
                  </Button>
                  <Button
                    variant={transferType === 'phone' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTransferType('phone')}
                    className="flex-1"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Teléfono
                  </Button>
                </div>
              </div>

              {/* Recipient */}
              <div className="space-y-2">
                <Label htmlFor="recipient">
                  {transferType === 'cvu' ? 'CVU/Alias' : 'Número de teléfono'}
                </Label>
                <Input
                  id="recipient"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder={
                    transferType === 'cvu' 
                      ? 'CVU o alias del destinatario' 
                      : 'Número de teléfono'
                  }
                  className="bg-gray-50"
                />
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount">Monto a transferir</Label>
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

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Descripción (opcional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Concepto de la transferencia"
                  className="bg-gray-50 resize-none"
                  rows={3}
                />
              </div>

              {/* Transfer Button */}
              <Button
                onClick={handleTransfer}
                disabled={!recipient || !amount || parseFloat(amount) <= 0}
                className="w-full bg-teal-600 hover:bg-teal-700 h-12"
              >
                <ArrowUpRight className="w-4 h-4 mr-2" />
                Transferir ${amount ? parseFloat(amount).toLocaleString() : '0'}
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2 text-center">
                <Check className="w-5 h-5 text-green-600" />
                <span>Transferencia exitosa</span>
              </DialogTitle>
              <DialogDescription>
                Tu transferencia se ha completado exitosamente
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Success Icon */}
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  ¡Transferencia completada!
                </h3>
                <p className="text-gray-600">
                  Se transfirió exitosamente ${transferData?.amount.toLocaleString()}
                </p>
              </div>

              {/* Receipt Details */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Número de operación</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-mono">#{transferData?.id}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(transferData?.id)}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Destinatario</span>
                  <span className="text-sm font-medium">{transferData?.recipient}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Monto</span>
                  <span className="text-sm font-medium">${transferData?.amount.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Fecha</span>
                  <span className="text-sm font-medium">
                    {new Date(transferData?.date).toLocaleString('es-AR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                
                {transferData?.description && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Descripción</span>
                    <span className="text-sm font-medium">{transferData.description}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Estado</span>
                  <Badge className="bg-green-100 text-green-700">
                    <Check className="w-3 h-3 mr-1" />
                    Completada
                  </Badge>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <Button variant="outline" className="flex-1">
                  <Copy className="w-4 h-4 mr-2" />
                  Compartir comprobante
                </Button>
                <Button onClick={handleClose} className="flex-1">
                  Finalizar
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}