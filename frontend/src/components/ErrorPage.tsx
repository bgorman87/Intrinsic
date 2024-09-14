import { useNavigate } from 'react-router-dom';
import '../styles/ErrorPage.css';
import Header from './Header';
import Footer from './Footer';

interface Props {
  theme: string;
  switchTheme: () => void;
  exchange?: string;
  symbol?: string;
}

const ErrorPage = ({ theme, switchTheme, exchange, symbol }: Props) => {
  const navigate = useNavigate();

  return (
    <div className="error-page" data-theme={theme}>
      <Header theme={theme} switchTheme={switchTheme} />
      <div className="error-page__content">
        <h1>Stock Not Found</h1>
        {exchange && symbol ? (
          <p>
            The stock with symbol <strong>{symbol.toUpperCase()}</strong> on exchange{' '}
            <strong>{exchange.toUpperCase()}</strong> was not found.
          </p>
        ) : (
          <p>The stock you are looking for was not found.</p>
        )}
        <button onClick={() => navigate('/')} className="error-page__button">
          Return to Home
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default ErrorPage;
