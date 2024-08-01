import { useState } from "react";

const PECalc = () => {
    const [pe, setPE] = useState<number>(0);
    const [eps, setEPS] = useState<number>(0);
    const [historicalPE, setHistoricalPE] = useState<number>(0);
    const [growthRate, setGrowthRate] = useState<number>(0);
    const [marginOfSafety, setMarginOfSafety] = useState<number>(0);
    const [discountRate, setDiscountRate] = useState<number>(0);
    
    const calculatePE = () => {
        setPE(eps);
    };
    const conservativeGrowthRate = (((growthRate/100) * ( 1 - (marginOfSafety/100)))*100);
    const fiveYearValue = (eps * (1 + conservativeGrowthRate/100)**5) * historicalPE;
    console.log(conservativeGrowthRate, eps, growthRate, marginOfSafety);
    return (
        <div className="card short-card">
            <h2>Price-Earnings (PE)</h2>
            <p>
              To calculate the <abbr>NPV</abbr> of the PE Multiple, we need the historical 
              (<abbr title="Trailing Twelve Months">TTM</abbr>) <abbr title="Earnings Per Share">EPS</abbr>, 
              the median historical PE, and the future expected growth rate.
            </p>
            <form>
              <div className="form-group">
                <label htmlFor="eps">EPS:</label>
                <input type="number" id="eps" name="eps" value={eps} onChange={(e) => setEPS(parseFloat(e.target.value))}/>
              </div>
              <div className="form-group">
                <label htmlFor="historical-pe">Historical PE:</label>
                <input type="number" id="historical-pe" name="historical-pe" value={historicalPE} onChange={(e) => setHistoricalPE(parseFloat(e.target.value))}/>
              </div>
              <div className="form-group">
                <label htmlFor="growth-rate">Growth Rate:</label>
                <input type="number" id="growth-rate" name="growth-rate" value={growthRate} onChange={(e) => setGrowthRate(parseFloat(e.target.value))}/>
              </div>
              <div className="form-group">
                <label htmlFor="margin-of-safety">Margin of Safety:</label>
                <input type="number" id="margin-of-safety" name="margin-of-safety" value={marginOfSafety} onChange={(e) => setMarginOfSafety(parseFloat(e.target.value))}/>
              </div>
              <div className="form-group">
                <label htmlFor="conservative-growth-rate">Conservative Growth Rate:</label>
                <input type="number" id="conservative-growth-rate" name="conservative-growth-rate" disabled value={conservativeGrowthRate.toFixed(2)}/>
              </div>
              <div className="form-group">
                <label htmlFor="discount-rate">Discount Rate:</label>
                <input type="number" id="discount-rate" name="discount-rate" value={discountRate} onChange={(e) => setDiscountRate(parseFloat(e.target.value))}/>
              </div>
              <div className="form-group">
                <label htmlFor="five-year-value">5-Year Value:</label>
                <input type="number" id="five-year-value" name="five-year-value" disabled value={fiveYearValue.toFixed(2)}/>
              </div>
              <div className="form-group">
                <label htmlFor="npv-pe">NPV PE:</label>
                <input type="number" id="npv-pe" name="npv-pe" disabled value={(fiveYearValue/((1+discountRate/100)**5)).toFixed(2)}/>
              </div>
            </form>
          </div>
    );
    }

export default PECalc;