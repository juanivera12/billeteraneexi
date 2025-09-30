import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  ArrowLeftRight, 
  Calculator as CalculatorIcon, 
  DollarSign, 
  Euro, 
  Banknote,
  RefreshCw,
  TrendingUp,
  Clock
} from 'lucide-react';

export function ConverterCalculator() {
  const [activeTab, setActiveTab] = useState<'converter' | 'calculator'>('converter');
  
  // Converter state
  const [amount, setAmount] = useState(1000);
  const [fromCurrency, setFromCurrency] = useState('ARS');
  const [toCurrency, setToCurrency] = useState('USD');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  // Calculator state
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  // Mock exchange rates (in a real app, these would come from an API)
  const exchangeRates = {
    ARS: {
      USD: 0.0011, // 1 ARS = 0.0011 USD (approximate)
      EUR: 0.0010, // 1 ARS = 0.0010 EUR (approximate)
      CLP: 1.08    // 1 ARS = 1.08 CLP (approximate)
    }
  };

  const currencies = [
    { code: 'ARS', name: 'Peso Argentino', symbol: '$', flag: '🇦🇷' },
    { code: 'USD', name: 'Dólar Estadounidense', symbol: '$', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
    { code: 'CLP', name: 'Peso Chileno', symbol: '$', flag: '🇨🇱' }
  ];

  const convertCurrency = (amount: number, from: string, to: string): number => {
    if (from === to) return amount;
    if (from === 'ARS') {
      return amount * (exchangeRates.ARS as any)[to];
    }
    // For reverse conversion, divide by the rate
    if (to === 'ARS') {
      return amount / (exchangeRates.ARS as any)[from];
    }
    // For non-ARS to non-ARS conversion, go through ARS
    const toARS = amount / (exchangeRates.ARS as any)[from];
    return toARS * (exchangeRates.ARS as any)[to];
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  // Calculator functions
  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const result = calculate(currentValue, inputValue, operation);

      setDisplay(String(result));
      setPreviousValue(result);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return firstValue / secondValue;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const result = calculate(previousValue, inputValue, operation);
      setDisplay(String(result));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const clearCalculator = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const clearEntry = () => {
    setDisplay('0');
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  useEffect(() => {
    // Update timestamp every minute to simulate real-time data
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit mx-auto">
        <button
          onClick={() => setActiveTab('converter')}
          className={`px-6 py-2 rounded-md transition-all flex items-center space-x-2 ${
            activeTab === 'converter'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <ArrowLeftRight className="w-4 h-4" />
          <span>Conversor</span>
        </button>
        <button
          onClick={() => setActiveTab('calculator')}
          className={`px-6 py-2 rounded-md transition-all flex items-center space-x-2 ${
            activeTab === 'calculator'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <CalculatorIcon className="w-4 h-4" />
          <span>Calculadora</span>
        </button>
      </div>

      {/* Currency Converter */}
      {activeTab === 'converter' && (
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2">
                <ArrowLeftRight className="w-6 h-6 text-purple-600" />
                <span>Conversor de Monedas</span>
              </CardTitle>
              <p className="text-gray-600">Convierte entre diferentes monedas con tasas actualizadas</p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Exchange Rate Update Info */}
              <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2 text-blue-700">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Última actualización: {lastUpdated.toLocaleTimeString()}</span>
                </div>
                <Button variant="outline" size="sm" className="text-blue-600 border-blue-300">
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Actualizar
                </Button>
              </div>

              {/* Amount Input */}
              <div className="space-y-2">
                <Label htmlFor="amount">Cantidad</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="text-2xl text-center"
                />
              </div>

              {/* From Currency */}
              <div className="space-y-2">
                <Label>Desde</Label>
                <Select value={fromCurrency} onValueChange={setFromCurrency}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        <div className="flex items-center space-x-2">
                          <span>{currency.flag}</span>
                          <span>{currency.code}</span>
                          <span className="text-gray-500">- {currency.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={swapCurrencies}
                  className="rounded-full p-2"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                </Button>
              </div>

              {/* To Currency */}
              <div className="space-y-2">
                <Label>A</Label>
                <Select value={toCurrency} onValueChange={setToCurrency}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        <div className="flex items-center space-x-2">
                          <span>{currency.flag}</span>
                          <span>{currency.code}</span>
                          <span className="text-gray-500">- {currency.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Conversion Result */}
              <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                <CardContent className="p-6 text-center">
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">Resultado</div>
                    <div className="text-3xl font-bold text-purple-600">
                      {currencies.find(c => c.code === toCurrency)?.symbol}
                      {convertCurrency(amount, fromCurrency, toCurrency).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })} {toCurrency}
                    </div>
                    <div className="text-sm text-gray-500">
                      1 {fromCurrency} = 
                      {currencies.find(c => c.code === toCurrency)?.symbol}
                      {convertCurrency(1, fromCurrency, toCurrency).toFixed(4)} {toCurrency}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Convert Buttons */}
              <div className="grid grid-cols-3 gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setAmount(1000)}
                  className="flex items-center space-x-1"
                >
                  <span>$1.000</span>
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setAmount(10000)}
                  className="flex items-center space-x-1"
                >
                  <span>$10.000</span>
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setAmount(100000)}
                  className="flex items-center space-x-1"
                >
                  <span>$100.000</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Calculator */}
      {activeTab === 'calculator' && (
        <div className="max-w-sm mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2">
                <CalculatorIcon className="w-6 h-6 text-purple-600" />
                <span>Calculadora</span>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-4">
              {/* Display */}
              <div className="mb-4">
                <div className="bg-gray-900 text-white p-4 rounded-lg text-right">
                  <div className="text-3xl font-mono break-all">{display}</div>
                </div>
              </div>

              {/* Buttons */}
              <div className="grid grid-cols-4 gap-2">
                {/* Row 1 */}
                <Button variant="outline" onClick={clearCalculator}>C</Button>
                <Button variant="outline" onClick={clearEntry}>CE</Button>
                <Button variant="outline" onClick={() => inputOperation('÷')}>÷</Button>
                <Button variant="outline" onClick={() => inputOperation('×')}>×</Button>

                {/* Row 2 */}
                <Button variant="outline" onClick={() => inputNumber('7')}>7</Button>
                <Button variant="outline" onClick={() => inputNumber('8')}>8</Button>
                <Button variant="outline" onClick={() => inputNumber('9')}>9</Button>
                <Button variant="outline" onClick={() => inputOperation('-')}>-</Button>

                {/* Row 3 */}
                <Button variant="outline" onClick={() => inputNumber('4')}>4</Button>
                <Button variant="outline" onClick={() => inputNumber('5')}>5</Button>
                <Button variant="outline" onClick={() => inputNumber('6')}>6</Button>
                <Button variant="outline" onClick={() => inputOperation('+')}>+</Button>

                {/* Row 4 */}
                <Button variant="outline" onClick={() => inputNumber('1')}>1</Button>
                <Button variant="outline" onClick={() => inputNumber('2')}>2</Button>
                <Button variant="outline" onClick={() => inputNumber('3')}>3</Button>
                <Button 
                  className="row-span-2 bg-purple-600 hover:bg-purple-700 text-white h-auto"
                  onClick={performCalculation}
                >
                  =
                </Button>

                {/* Row 5 */}
                <Button variant="outline" className="col-span-2" onClick={() => inputNumber('0')}>0</Button>
                <Button variant="outline" onClick={inputDecimal}>.</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}