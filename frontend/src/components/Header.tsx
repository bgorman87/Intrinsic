import ThemeSwitch from "./ThemeSwitch"
import SearchBar from "./SearchBar";
import '../styles/Header.css';
import headerLogo from '../assets/header-logo.svg';


interface Props {
  theme: string;
  switchTheme: () => void;

} 

const Header = ({theme, switchTheme}: Props) => {
  return (
    <header className="header">
      <div className="header__logo">
        <img src={headerLogo}></img>
      </div>
      <div className="header__spacer"></div>
      <div className="header__search">
        <SearchBar/>
      </div>
      <div className="header__spacer"></div>
      <div className="header__theme-switch">
        <ThemeSwitch theme={theme} switchTheme={switchTheme}/>
      </div>
    </header>
  )
}

export default Header
