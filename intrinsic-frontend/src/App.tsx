import { useState, useEffect } from 'react'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import StockList from './components/StockList'
import { Stock } from './types'

function App() {

  const defaultDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const storedTheme = localStorage.getItem('theme');
  const initialTheme = storedTheme || (defaultDark ? 'dark' : 'light');
  
  const [theme, setTheme] = useState(initialTheme);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const switchTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  
  const okayStockData: Stock[] = [
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

  const goodStockData: Stock[] = [
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

  const greatStockData: Stock[] = [
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


  return (
    <div className="app" data-theme={theme}>
      <Header theme={theme} switchTheme={switchTheme}/>
      <div className="app__stock-lists">
        <div className="app__stock-list great">
          <StockList title="great" stockData={greatStockData}/>
        </div>
        <div className="app__stock-list good">
          <StockList title="good" stockData={goodStockData}/>
        </div>
        <div className="app__stock-list okay">
          <StockList title="okay" stockData={okayStockData}/>
        </div>
      </div>
      <Footer/>
    </div>
  )
}

export default App
