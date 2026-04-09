import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  School, 
  UserCog, 
  LogOut,
  ShieldCheck,
  Settings
} from 'lucide-react';

const SidebarLayout = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/');
  };

  const navItems = [
    { 
      name: 'Dashboard', path: '/', icon: LayoutDashboard, 
      perms: ['always']
    },
    { 
      name: 'Students', path: '/students', icon: Users, 
      perms: ['view_students', 'edit_students'] 
    },
    { 
      name: 'Fees & Payments', path: '/fees', icon: CreditCard, 
      perms: ['record_payments', 'print_receipts'] 
    },
    { 
      name: 'Schools', path: '/schools', icon: School, 
      perms: ['create_school', 'enable_features'] 
    },
    { 
      name: 'Role Management', path: '/roles', icon: ShieldCheck, 
      perms: ['create_roles'] 
    },
    { 
      name: 'User Management', path: '/users', icon: UserCog, 
      perms: ['create_user', 'create_corporate'] 
    },
    { 
      name: 'Fee Settings', path: '/fee-settings', icon: Settings, 
      perms: ['always'] // Set to always or a specific perm if needed, using always to mimic roles: ['Super Admin', 'Corporate User', 'Administrator']
    }
  ];

  const allowedNav = navItems.filter(item => {
    // Super Admin gets everything
    if (user?.role === 'Super Admin') return true;
    
    if (item.perms.includes('always')) return true;

    // Fetch the role's permissions from local storage configs
    const storedRoles = localStorage.getItem('customRoles');
    let userPerms = [];
    if (storedRoles) {
      const parsedRoles = JSON.parse(storedRoles);
      const matchedRole = parsedRoles.find(r => r.name === user?.role);
      if (matchedRole && matchedRole.permissions) {
        userPerms = matchedRole.permissions;
      }
    }

    // Check if the user's role has ANY of the permissions required for this tab
    return item.perms.some(p => userPerms.includes(p));
  });

  const roleLabel = {
    'Super Admin': 'Super Admin',
    'Corporate User': 'Corporate User'
  };

  return (
    <div className="layout-container">
      <aside className="sidebar">
        <div className="sidebar-brand">
          EduCore<sup>+</sup>
        </div>
        
        <div className="sidebar-user" style={{ padding: '0 1rem 1rem 1rem', borderBottom: '1px solid var(--border)', marginBottom: '1rem' }}>
          <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user?.profile_name || user?.username}</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{roleLabel[user?.role] || user?.role}</p>
        </div>

        <nav>
          {allowedNav.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path} 
              end={item.path === '/'}
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
