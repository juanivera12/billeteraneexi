import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { currencyService, ExchangeRates, CurrencyConversion } from '../services/currencyService';
import { 
  ArrowLeftRight, 
  Calculator as CalculatorIcon, 
  DollarSign, 
  Euro, 
  Banknote,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  Star,
  History,
  BarChart3
} from 'lucide-react';

export function ConverterCalculator() {
  const [activeTab, setActiveTab] = useState<'converter' | 'calculator'>('converter');
  
  // Converter state
  const [amount, setAmount] = useState(1000);
  const [fromCurrency, setFromCurrency] = useState('ARS');
  const [toCurrency, setToCurrency] = useState('USD');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({});
  const [isLoadingRates, setIsLoadingRates] = useState(false);
  const [conversionResult, setConversionResult] = useState<CurrencyConversion | null>(null);
  const [currencyTrend, setCurrencyTrend] = useState<'up' | 'down' | 'stable'>('stable');
  const [favoriteCurrencies, setFavoriteCurrencies] = useState<string[]>(['USD', 'EUR']);
  
  // Calculator state
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const currencies = currencyService.currencies;

  const loadExchangeRates = async () => {
    setIsLoadingRates(true);
    try {
      const rates = await currencyService.getExchangeRates('USD');
      setExchangeRates(rates);
      setLastUpdated(new Date());
      
      // Update conversion result
      const result = currencyService.convertCurrency(amount, fromCurrency, toCurrency, rates);
      setConversionResult(result);
      
      // Get currency trend
      const trend = await currencyService.getCurrencyTrend(fromCurrency, toCurrency);
      setCurrencyTrend(trend);
    } catch (error) {
      console.error('Error loading exchange rates:', error);
    } finally {
      setIsLoadingRates(false);
    }
  };

  const performConversion = () => {
    const result = currencyService.convertCurrency(amount, fromCurrency, toCurrency, exchangeRates);
    setConversionResult(result);
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const toggleFavorite = (currencyCode: string) => {
    setFavoriteCurrencies(prev => {
      if (prev.includes(currencyCode)) {
        return prev.filter(code => code !== currencyCode);
      } else {
        return [...prev, currencyCode];
      }
    });
  };

  const setQuickAmount = (quickAmount: number) => {
    setAmount(quickAmount);
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

  // Load exchange rates on component mount
  useEffect(() => {
    loadExchangeRates();
  }, []);

  // Perform conversion when amount or currencies change
  useEffect(() => {
    if (Object.keys(exchangeRates).length > 0) {
      performConversion();
    }
  }, [amount, fromCurrency, toCurrency, exchangeRates]);

  // Update timestamp every minute
  useEffect(() => {
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
                  {currencyTrend !== 'stable' && (
                    <div className="flex items-center space-x-1 ml-2">
                      {currencyTrend === 'up' ? (
                        <TrendingUp className="w-3 h-3 text-green-600" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-600" />
                      )}
                      <span className="text-xs">
                        {currencyTrend === 'up' ? 'Subiendo' : 'Bajando'}
                      </span>
                    </div>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-blue-600 border-blue-300"
                  onClick={loadExchangeRates}
                  disabled={isLoadingRates}
                >
                  <RefreshCw className={`w-3 h-3 mr-1 ${isLoadingRates ? 'animate-spin' : ''}`} />
                  {isLoadingRates ? 'Actualizando...' : 'Actualizar'}
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
                    {conversionResult ? (
                      <>
                        <div className="text-3xl font-bold text-purple-600">
                          {currencyService.formatCurrency(conversionResult.result, toCurrency)}
                        </div>
                        <div className="text-sm text-gray-500">
                          1 {fromCurrency} = {currencyService.formatCurrency(conversionResult.rate, toCurrency)}
                        </div>
                        <div className="text-xs text-gray-400">
                          Convertido el {conversionResult.timestamp.toLocaleTimeString()}
                        </div>
                      </>
                    ) : (
                      <div className="text-lg text-gray-500">
                        Ingresa una cantidad para convertir
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Convert Buttons */}
              <div className="grid grid-cols-3 gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setQuickAmount(1000)}
                  className="flex items-center space-x-1"
                >
                  <span>{currencyService.formatCurrency(1000, fromCurrency)}</span>
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setQuickAmount(10000)}
                  className="flex items-center space-x-1"
                >
                  <span>{currencyService.formatCurrency(10000, fromCurrency)}</span>
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setQuickAmount(100000)}
                  className="flex items-center space-x-1"
                >
                  <span>{currencyService.formatCurrency(100000, fromCurrency)}</span>
                </Button>
              </div>

              {/* Favorite Currencies */}
              <div className="space-y-2">
                <Label>Conversiones Rápidas</Label>
                <div className="flex flex-wrap gap-2">
                  {favoriteCurrencies.map(currencyCode => (
                    <Button
                      key={currencyCode}
                      variant="outline"
                      size="sm"
                      onClick={() => setToCurrency(currencyCode)}
                      className={`flex items-center space-x-1 ${
                        toCurrency === currencyCode ? 'bg-purple-100 border-purple-300' : ''
                      }`}
                    >
                      <span>{currencies.find(c => c.code === currencyCode)?.flag}</span>
                      <span>{currencyCode}</span>
                      <Star 
                        className="w-3 h-3 text-yellow-500 fill-current" 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(currencyCode);
                        }}
                      />
                    </Button>
                  ))}
                </div>
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