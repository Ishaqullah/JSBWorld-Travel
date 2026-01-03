import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Map,
  Calendar,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  CreditCard,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './Layout.css';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/tours', icon: Map, label: 'Tours' },
  { path: '/bookings', icon: Calendar, label: 'Bookings' },
  { path: '/pending-payments', icon: CreditCard, label: 'Pending Payments' },
  { path: '/users', icon: Users, label: 'Users' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

const Sidebar = ({ collapsed, onToggle }) => {
  const { logout, user } = useAuth();
  const location = useLocation();

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!collapsed && (
          <div className="sidebar-logo">
            <span className="logo-icon">T</span>
            <span className="logo-text">Travecations</span>
          </div>
        )}
        <button className="sidebar-toggle" onClick={onToggle}>
          {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
            end={item.path === '/'}
          >
            <item.icon size={20} />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        {!collapsed && user && (
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">
              {user.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user.name}</div>
              <div className="sidebar-user-role">Administrator</div>
            </div>
          </div>
        )}
        <button className="sidebar-link logout-btn" onClick={logout}>
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
