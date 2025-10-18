// Servicio para obtener tasas de cambio en tiempo real
export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

export interface ExchangeRates {
  [key: string]: {
    [key: string]: number;
  };
}

export interface CurrencyConversion {
  from: string;
  to: string;
  amount: number;
  result: number;
  rate: number;
  timestamp: Date;
}

class CurrencyService {
  private baseUrl = 'https://api.exchangerate-api.com/v4/latest';
  private fallbackRates: ExchangeRates = {
    ARS: {
      USD: 0.0011,
      EUR: 0.0010,
      CLP: 1.08,
      BRL: 0.0055
    },
    USD: {
      ARS: 900,
      EUR: 0.85,
      CLP: 980,
      BRL: 5.2
    },
    EUR: {
      ARS: 1050,
      USD: 1.18,
      CLP: 1150,
      BRL: 6.1
    }
  };

  public currencies: Currency[] = [
    { code: 'ARS', name: 'Peso Argentino', symbol: '$', flag: '🇦🇷' },
    { code: 'USD', name: 'Dólar Estadounidense', symbol: '$', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
    { code: 'CLP', name: 'Peso Chileno', symbol: '$', flag: '🇨🇱' },
    { code: 'BRL', name: 'Real Brasileño', symbol: 'R$', flag: '🇧🇷' }
  ];

  async getExchangeRates(baseCurrency: string = 'USD'): Promise<ExchangeRates> {
    try {
      const response = await fetch(`${this.baseUrl}/${baseCurrency}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch exchange rates');
      }

      const data = await response.json();
      
      // Convierto la respuesta de la API a mi formato
      const rates: ExchangeRates = {};
      rates[baseCurrency] = data.rates;

      return rates;
    } catch (error) {
      console.warn('Usando tasas de respaldo:', error);
      return this.fallbackRates;
    }
  }

  convertCurrency(amount: number, from: string, to: string, rates?: ExchangeRates): CurrencyConversion {
    const exchangeRates = rates || this.fallbackRates;
    
    if (from === to) {
      return {
        from,
        to,
        amount,
        result: amount,
        rate: 1,
        timestamp: new Date()
      };
    }

    let rate: number;
    let result: number;

    // Direct conversion if available
    if (exchangeRates[from] && exchangeRates[from][to]) {
      rate = exchangeRates[from][to];
      result = amount * rate;
    }
    // Reverse conversion
    else if (exchangeRates[to] && exchangeRates[to][from]) {
      rate = 1 / exchangeRates[to][from];
      result = amount * rate;
    }
    // Convert through USD as base currency
    else {
      const fromToUSD = exchangeRates[from]?.USD || (1 / exchangeRates.USD?.[from] || 1);
      const usdToTo = exchangeRates.USD?.[to] || (1 / exchangeRates[to]?.USD || 1);
      
      rate = fromToUSD * usdToTo;
      result = amount * rate;
    }

    return {
      from,
      to,
      amount,
      result,
      rate,
      timestamp: new Date()
    };
  }

  getCurrencyByCode(code: string): Currency | undefined {
    return this.currencies.find(currency => currency.code === code);
  }

  formatCurrency(amount: number, currencyCode: string): string {
    const currency = this.getCurrencyByCode(currencyCode);
    const symbol = currency?.symbol || currencyCode;
    
    return `${symbol}${amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }

  // Get historical rates (mock implementation)
  async getHistoricalRates(from: string, to: string, days: number = 7) {
    // In a real implementation, this would fetch historical data
    // For now, we'll return mock data with some variation
    const baseRate = this.convertCurrency(1, from, to).rate;
    const historicalRates = [];
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Add some random variation to simulate real market fluctuations
      const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
      const rate = baseRate * (1 + variation);
      
      historicalRates.push({
        date: date.toISOString().split('T')[0],
        rate: rate
      });
    }
    
    return historicalRates;
  }

  // Get currency trends
  async getCurrencyTrend(from: string, to: string): Promise<'up' | 'down' | 'stable'> {
    try {
      const historicalRates = await this.getHistoricalRates(from, to, 7);
      
      if (historicalRates.length < 2) return 'stable';
      
      const firstRate = historicalRates[0].rate;
      const lastRate = historicalRates[historicalRates.length - 1].rate;
      const change = ((lastRate - firstRate) / firstRate) * 100;
      
      if (change > 1) return 'up';
      if (change < -1) return 'down';
      return 'stable';
    } catch (error) {
      console.error('Error getting currency trend:', error);
      return 'stable';
    }
  }
}

// Create and export a singleton instance
export const currencyService = new CurrencyService();
export default CurrencyService;
