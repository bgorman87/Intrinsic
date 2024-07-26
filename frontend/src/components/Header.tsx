import { useState } from 'react';
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

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  }

  return (
    <header className="header">
      <div className="header__logo">
        <img src={headerLogo} alt="Logo" />
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
