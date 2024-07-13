import { Stock } from '../types.ts';

export const okayStockData: Stock[] = [
    {
      ticker: 'AAPL',
      title: 'Apple Inc.',
      price: 150.25,
      pe: 175.67,
      dcf: 0,
      roe: 0
    },
    {
      ticker: 'MSFT',
      title: 'Microsoft Corporation',
      price: 300.50,
      pe: 315.5,
      dcf: 280.25,
      roe: 0.00
    },
    {
      ticker: 'GOOGL',
      title: 'Alphabet Inc.',
      price: 2500.75,
      pe: 30.20,
      dcf: 2600.50,
      roe: 2000.45
    }
  ];

  export const goodStockData: Stock[] = [
    {
      ticker: 'AMZN',
      title: 'Amazon.com, Inc.',
      price: 3500.00,
      pe: 4309.64,
      dcf: 3800.75,
      roe: 1010.91
    },
    {
      ticker: 'FB',
      title: 'Facebook, Inc.',
      price: 350.50,
      pe: 0.00,
      dcf: 400.25,
      roe: 617.32
    },
    {
      ticker: 'NFLX',
      title: 'Netflix, Inc.',
      price: 550.75,
      pe: 550.90,
      dcf: 600.50,
      roe: -50.50
    }
  ];

  export const greatStockData: Stock[] = [
    {
      ticker: 'TSLA',
      title: 'Tesla, Inc.',
      price: 800.00,
      pe: 1014.68,
      dcf: 900.75,
      roe: 916.09
    },
    {
      ticker: 'NVDA',
      title: 'NVIDIA Corporation',
      price: 600.50,
      pe: 780.67,
      dcf: 700.25,
      roe: 2001.00
    },
    {
      ticker: 'PYPL',
      title: 'PayPal Holdings, Inc.',
      price: 250.75,
      pe: 425.20,
      dcf: 300.50,
      roe: 345.18
    }
  ];