import Header from '../components/Header';
import '../styles/HowItWorks.css';
import PECalc from '../components/PECalc';

interface Props {
  theme: string;
  switchTheme: () => void;
}

const HowItWorks = ({ theme, switchTheme }: Props) => {
  return (
    <div className="how-it-works" data-theme={theme}>
      <Header theme={theme} switchTheme={switchTheme} />
      <div className="content">
        <div className="card long-card">
          <h1>How It Works</h1>
          <p>
            Stock information is updated every evening using the <a href="https://github.com/dpguthrie/yahooquery" target="_blank">YahooQuery</a> package 
            along with some web scraping of <a href="https://www.morningstar.com/" target="_blank">MorningStar</a> using selenium.
          </p>
          <p>
            The data is then processed to determine the <abbr title="Net Present Value">NPV</abbr> for Price-Earnings (<abbr>PE</abbr>), 
            Discounted Cash Flow (<abbr>DCF</abbr>), and Return on Equity (<abbr>ROE</abbr>) evaluations. Much of this evaluation process 
            follows the <a href="https://www.valuespreadsheet.com/" target="_blank">ValueSpreadsheet</a> process by Nick Kraakman.
          </p>
        </div>
        <div className="calc-container">
          <PECalc />
          <div className="card short-card">
            <h2>Return on Equity (ROE)</h2>
            <p>Description of how ROE is calculated.</p>
          </div>
          <div className="card short-card">
            <h2>Discounted Cash Flow (DCF)</h2>
            <p>Description of how DCF is calculated.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HowItWorks;
