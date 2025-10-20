import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { TransferModal } from './TransferModal';
import { DepositModal } from './DepositModal';
import { TransactionHistory } from './TransactionHistory';
import { ArrowUpRight, ArrowDownLeft, Clock, CreditCard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Dashboard() {
  const { user } = useAuth();
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [balance, setBalance] = useState(150000);
  
  const userName = user?.first_name || 'Usuario';

  const handleTransferComplete = (transferData: any) => {
    setTransactions(prev => [transferData, ...prev]);
    setBalance(prev => prev - transferData.amount);
  };

  const handleDepositComplete = (depositData: any) => {
    setTransactions(prev => [depositData, ...prev]);
    setBalance(prev => prev + depositData.amount);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="text-center bg-white dark:bg-slate-100 p-6 rounded-lg border border-gray-200 dark:border-gray-300">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-900 mb-2">Mi billetera</h1>
        <p className="text-gray-600 dark:text-gray-700">¡Hola, {userName}! Bienvenido a <span className="text-purple-600 dark:text-blue-400 font-medium">NEEXA</span></p>
      </div>

      {/* Balance Card */}
      <Card className="bg-gradient-to-br from-purple-600 to-purple-700 dark:from-blue-600 dark:to-blue-800 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
        
        <CardHeader className="relative z-10">
          <CardTitle className="text-lg text-purple-100 dark:text-blue-100">Saldo disponible</CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-4xl font-bold mb-2">$ {balance.toLocaleString()},00</div>
          <div className="text-purple-200 dark:text-blue-200">ARS</div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow bg-white dark:bg-slate-100 border-gray-200 dark:border-gray-300"
          onClick={() => setShowTransferModal(true)}
        >
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
              <ArrowUpRight className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            </div>
            <h3 className="font-medium text-gray-900 dark:text-gray-900 mb-2">Transferir</h3>
            <p className="text-sm text-gray-600 dark:text-gray-700">Envía dinero</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow bg-white dark:bg-slate-100 border-gray-200 dark:border-gray-300"
          onClick={() => setShowDepositModal(true)}
        >
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
              <ArrowDownLeft className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-medium text-gray-900 dark:text-gray-900 mb-2">Depositar</h3>
            <p className="text-sm text-gray-600 dark:text-gray-700">Agregar dinero</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow bg-white dark:bg-slate-100 border-gray-200 dark:border-gray-300"
          onClick={() => setShowHistoryModal(true)}
        >
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-medium text-gray-900 dark:text-gray-900 mb-2">Historial</h3>
            <p className="text-sm text-gray-600 dark:text-gray-700">Ver movimientos</p>
          </CardContent>
        </Card>
      </div>

      {/* Virtual Card */}
      <Card className="bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-700 dark:to-gray-800 text-white overflow-hidden border-gray-700">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-8">
            <div className="w-8 h-6 bg-orange-500 rounded"></div>
            <div className="text-right">
              <div className="text-sm opacity-75">NEEXA</div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="text-xl tracking-wider">8803 2908 4195 9166</div>
            <div className="flex justify-between items-end">
              <div>
                <div className="text-xs opacity-75 mb-1">TARJETA VIRTUAL</div>
                <div className="text-sm">NEEXA USUARIO</div>
              </div>
              <div className="text-xs opacity-75">12/28</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA for Savings */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-slate-200 dark:to-slate-300 border border-purple-200 dark:border-gray-400">
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-900 mb-2">
            ¿Listo para comenzar a ahorrar?
          </h3>
          <p className="text-gray-600 dark:text-gray-700 mb-4">
            Descubre nuestras herramientas de ahorro inteligente con NEEXA
          </p>
          <Button className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600">
            Explorar Ahorros
          </Button>
        </CardContent>
      </Card>

      {/* Modals */}
      <TransferModal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        onTransferComplete={handleTransferComplete}
      />
      
      <DepositModal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        onDepositComplete={handleDepositComplete}
      />
      
      <TransactionHistory
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        transactions={transactions}
      />
    </div>
  );
}