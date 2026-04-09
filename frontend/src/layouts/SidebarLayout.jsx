import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  School, 
  UserCog, 
  LogOut,
  Settings
} from 'lucide-react';

const SidebarLayout = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, roles: ['Super Admin', 'Corporate User', 'Administrator'] },
    { name: 'Students', path: '/students', icon: Users, roles: ['Super Admin', 'Corporate User', 'Administrator'] },
    { name: 'Fees & Payments', path: '/fees', icon: CreditCard, roles: ['Super Admin', 'Corporate User', 'Administrator'] },
    { name: 'Schools', path: '/schools', icon: School, roles: ['Super Admin'] },
    { name: 'User Management', path: '/users', icon: UserCog, roles: ['Super Admin'] },
    { name: 'Fee Settings', path: '/fee-settings', icon: Settings, roles: ['Super Admin', 'Corporate User', 'Administrator'] },
  ];

  const allowedNav = navItems.filter(item => item.roles.includes(user.role));

  return (
    <div className="layout-container">
      <aside className="sidebar">
        <div className="sidebar-brand">
          EduCore<sup>+</sup>
        </div>
        
        <div className="sidebar-user" style={{ padding: '0 1rem 1rem 1rem', borderBottom: '1px solid var(--border)', marginBottom: '1rem' }}>
          <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user.profile_name}</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{user.role}</p>
        </div>

        <nav>
          {allowedNav.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path} 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div style={{ marginTop: 'auto' }}>
          <button onClick={handleLogoutClick} className="nav-link" style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default SidebarLayout;
