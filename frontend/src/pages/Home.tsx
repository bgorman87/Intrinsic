import '../styles/Home.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import StockList from '../components/StockList'
import { Quality } from '../types';

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
          <StockList theme={theme} quality={1 as Quality}/>
        </div>
        <div className="home__stock-list good">
          <StockList theme={theme} quality={2 as Quality}/>
        </div>
        <div className="home__stock-list okay">
          <StockList theme={theme} quality={3 as Quality}/>
        </div>
      </div>
      <Footer/>
    </div>
  )
}

export default Home
