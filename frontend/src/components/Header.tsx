import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeSwitch from "./ThemeSwitch"
import SearchBar from "./SearchBar";
import '../styles/Header.css';
import headerLogo from '../assets/header-logo.svg';

interface Props {
  theme: string;
  switchTheme: () => void;
}

const Header = ({ theme, switchTheme }: Props) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  }

  const handleLogoClick = () => {
    navigate('/');
  }

  return (
    <header className="header">
      <div className="header__logo" onClick={() => handleLogoClick()}>
        <img src={headerLogo} alt="Logo"/>
      </div>
      <div className={`header__menu ${menuOpen ? 'open' : ''}`}>
        <div className="header__search">
          <SearchBar />
        </div>
        <div className="header__theme-switch">
          <ThemeSwitch theme={theme} switchTheme={switchTheme} />
        </div>
      </div>
      <div className="header__burger" onClick={toggleMenu}>
        <div className="burger-bar"></div>
        <div className="burger-bar"></div>
        <div className="burger-bar"></div>
      </div>
    </header>
  )
}

export default Header;
