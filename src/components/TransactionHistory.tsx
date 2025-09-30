import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Clock, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  Filter,
  Calendar,
  Download,
  Eye
} from 'lucide-react';

interface Transaction {
  id: string;
  type: 'transfer' | 'deposit' | 'withdrawal';
  amount: number;
  description: string;
  recipient?: string;
  method?: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

interface TransactionHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
}

export function TransactionHistory({ isOpen, onClose, transactions }: TransactionHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // Mock data para demostración
  const mockTransactions: Transaction[] = [
    {
      id: '1703875200000',
      type: 'transfer',
      amount: -15000,
      description: 'Transferencia a Juan Pérez',
      recipient: 'juan.perez.wallet',
      date: '2024-01-15T14:30:00Z',
      status: 'completed'
    },
    {
      id: '1703788800000',
      type: 'deposit',
      amount: 50000,
      description: 'Depósito Pago Fácil',
      method: 'Pago Fácil',
      date: '2024-01-14T10:15:00Z',
      status: 'completed'
    },
    {
      id: '1703702400000',
      type: 'transfer',
      amount: -8500,
      description: 'Pago servicios',
      recipient: '11-5555-4321',
      date: '2024-01-13T16:45:00Z',
      status: 'completed'
    },
    {
      id: '1703616000000',
      type: 'deposit',
      amount: 25000,
      description: 'Transferencia bancaria',
      method: 'Transferencia',
      date: '2024-01-12T09:20:00Z',
      status: 'completed'
    },
    {
      id: '1703529600000',
      type: 'transfer',
      amount: -3200,
      description: 'Compra online',
      recipient: 'tienda.virtual',
      date: '2024-01-11T18:10:00Z',
      status: 'completed'
    }
  ];

  const allTransactions = [...mockTransactions, ...transactions];

  const filteredTransactions = allTransactions.filter(transaction => 
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.recipient?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'transfer':
        return <ArrowUpRight className="w-4 h-4 text-red-600" />;
      case 'deposit':
        return <ArrowDownLeft className="w-4 h-4 text-green-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-700">Completada</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700">Pendiente</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-700">Fallida</Badge>;
      default:
        return <Badge variant="secondary">Desconocida</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const TransactionDetail = ({ transaction }: { transaction: Transaction }) => (
    <Dialog open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {getTransactionIcon(transaction.type)}
            <span>Detalle de transacción</span>
          </DialogTitle>
          <DialogDescription>
            Información completa de la transacción seleccionada
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">ID de transacción</span>
              <span className="text-sm font-mono">#{transaction.id}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Tipo</span>
              <span className="text-sm font-medium capitalize">{transaction.type}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Monto</span>
              <span className={`text-sm font-medium ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${Math.abs(transaction.amount).toLocaleString()}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Descripción</span>
              <span className="text-sm font-medium">{transaction.description}</span>
            </div>
            
            {transaction.recipient && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Destinatario</span>
                <span className="text-sm font-medium">{transaction.recipient}</span>
              </div>
            )}
            
            {transaction.method && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Método</span>
                <span className="text-sm font-medium">{transaction.method}</span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Fecha</span>
              <span className="text-sm font-medium">{formatDate(transaction.date)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Estado</span>
              {getStatusBadge(transaction.status)}
            </div>
          </div>
          
          <Button onClick={() => setSelectedTransaction(null)} className="w-full">
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-purple-600" />
              <span>Historial de transacciones</span>
            </DialogTitle>
            <DialogDescription>
              Revisa todas tus transacciones y movimientos
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-hidden flex flex-col space-y-4">
            {/* Search and Filters */}
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar transacciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Calendar className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Download className="w-4 h-4" />
              </Button>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="all" className="flex-1 overflow-hidden flex flex-col">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">Todas</TabsTrigger>
                <TabsTrigger value="transfers">Transferencias</TabsTrigger>
                <TabsTrigger value="deposits">Depósitos</TabsTrigger>
                <TabsTrigger value="withdrawals">Retiros</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="flex-1 overflow-auto mt-4">
                <TransactionsList 
                  transactions={filteredTransactions} 
                  onSelectTransaction={setSelectedTransaction}
                />
              </TabsContent>
              
              <TabsContent value="transfers" className="flex-1 overflow-auto mt-4">
                <TransactionsList 
                  transactions={filteredTransactions.filter(t => t.type === 'transfer')} 
                  onSelectTransaction={setSelectedTransaction}
                />
              </TabsContent>
              
              <TabsContent value="deposits" className="flex-1 overflow-auto mt-4">
                <TransactionsList 
                  transactions={filteredTransactions.filter(t => t.type === 'deposit')} 
                  onSelectTransaction={setSelectedTransaction}
                />
              </TabsContent>
              
              <TabsContent value="withdrawals" className="flex-1 overflow-auto mt-4">
                <TransactionsList 
                  transactions={filteredTransactions.filter(t => t.type === 'withdrawal')} 
                  onSelectTransaction={setSelectedTransaction}
                />
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
      
      {selectedTransaction && <TransactionDetail transaction={selectedTransaction} />}
    </>
  );
}

function TransactionsList({ 
  transactions, 
  onSelectTransaction 
}: { 
  transactions: Transaction[]; 
  onSelectTransaction: (transaction: Transaction) => void;
}) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-gray-900 font-medium mb-2">No hay transacciones</h3>
        <p className="text-gray-600 text-sm">
          No se encontraron transacciones que coincidan con tu búsqueda.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
          onClick={() => onSelectTransaction(transaction)}
        >
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              {transaction.type === 'transfer' ? (
                <ArrowUpRight className="w-5 h-5 text-red-600" />
              ) : (
                <ArrowDownLeft className="w-5 h-5 text-green-600" />
              )}
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900">{transaction.description}</h4>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>{formatDate(transaction.date)}</span>
                {transaction.recipient && (
                  <>
                    <span>•</span>
                    <span>{transaction.recipient}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="text-right flex items-center space-x-3">
            <div>
              <div className={`font-medium ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
              </div>
              {transaction.status === 'completed' && (
                <div className="text-xs text-gray-500">Completada</div>
              )}
            </div>
            <Button variant="ghost" size="sm">
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}