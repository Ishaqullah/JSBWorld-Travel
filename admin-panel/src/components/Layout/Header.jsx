import { Bell, Search } from 'lucide-react';
import './Layout.css';

const Header = ({ collapsed }) => {
  return (
    <header className={`header ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="header-left">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="input"
            placeholder="Search..."
          />
        </div>
      </div>
      
      <div className="header-right">
        <button className="header-btn">
          <Bell size={20} />
          <span className="badge"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
