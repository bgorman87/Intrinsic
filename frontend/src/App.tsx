import { useState, useEffect } from 'react'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from "./pages/Home";
import StockPage from "./pages/StockPage";
import HowItWorks from "./pages/HowItWorks";

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

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home theme={theme} switchTheme={switchTheme} />,
    },
    {
      path: "/stock/:exchange/:symbol",
      element: <StockPage theme={theme} switchTheme={switchTheme}/>,
    },
    {
      path: "/how-it-works",
      element: <HowItWorks theme={theme} switchTheme={switchTheme}/>,
    },
  ]);
  
  return <RouterProvider router={router} />;
}

export default App
