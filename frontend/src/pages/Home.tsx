import '../styles/Home.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import StockList from '../components/StockList'
import { Stock } from '../types'

interface Props {
    theme: string;
    switchTheme: () => void;
}

function Home({ theme, switchTheme }: Props) {

  

  return (
    <div className="home" data-theme={theme}>
      <Header theme={theme} switchTheme={switchTheme}/>
      <div className="home__stock-lists">
        <div className="home__stock-list great">
          <StockList title="great" stockData={greatStockData}/>
        </div>
        <div className="home__stock-list good">
          <StockList title="good" stockData={goodStockData}/>
        </div>
        <div className="home__stock-list okay">
          <StockList title="okay" stockData={okayStockData}/>
        </div>
      </div>
      <Footer/>
    </div>
  )
}

export default Home
