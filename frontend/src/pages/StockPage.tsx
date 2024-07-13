import '../styles/StockPage.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Stock } from '../types'

interface Props {
  stock: Stock
  theme: string;
  switchTheme: () => void;
}

const StockPage = ({ stock, theme, switchTheme }: Props) => {
  return (
    <div className="stock" data-theme={theme}>
      <Header theme={theme} switchTheme={switchTheme}/>
      <h1>{stock.title}</h1>
      <Footer/>
    </div>
  )
}

export default StockPage
