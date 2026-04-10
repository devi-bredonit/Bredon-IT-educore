import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SidebarLayout from './layouts/SidebarLayout';
import Dashboard from './pages/Dashboard';
import StudentDirectory from './pages/StudentDirectory';
import FeePanel from './pages/FeePanel';
import SchoolManagement from './pages/SchoolManagement';
import UserManagement from './pages/UserManagement';
import RoleManagement from './pages/RoleManagement';
import FeeSettings from './pages/FeeSettings';
import RegisterSchool from './pages/RegisterSchool';
import Login from './pages/Login';

import SchoolDeepDive from './pages/SchoolDeepDive';
import ActivityManagement from './pages/ActivityManagement';
import StaffDirectory from './pages/StaffDirectory';

const App = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  const handleLogin = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  if (!user) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<RegisterSchool />} />
          <Route path="*" element={<Login onLogin={handleLogin} />} />
        </Routes>
      </BrowserRouter>
    );
  }

  // Role-based default redirect after login
  const defaultPath = user.role === 'Administrator' || user.role === 'Teacher' || user.role === 'Staff'
    ? '/students'
    : '/';

  const hasPermission = (perms) => {
    if (user.role === 'Super Admin') return true;
    const storedRoles = localStorage.getItem('customRoles');
    if (storedRoles) {
      const parsedRoles = JSON.parse(storedRoles);
      const matchedRole = parsedRoles.find(r => r.name === user.role);
      if (matchedRole && matchedRole.permissions) {
        return perms.some(p => matchedRole.permissions.includes(p));
      }
    }
    return false;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SidebarLayout user={user} onLogout={handleLogout} />}>
          <Route index element={<Dashboard user={user} />} />
          <Route path="students" element={
            hasPermission(['view_students', 'edit_students']) ? <StudentDirectory user={user} /> : <Navigate to="/" replace />
          } />
          <Route path="fees" element={
            hasPermission(['record_payments', 'print_receipts']) ? <FeePanel user={user} /> : <Navigate to="/" replace />
          } />
          <Route path="schools" element={
            hasPermission(['create_school', 'enable_features']) ? <SchoolManagement user={user} /> : <Navigate to="/" replace />
          } />
          <Route path="schools/:id" element={
            hasPermission(['create_school', 'enable_features']) ? <SchoolDeepDive user={user} /> : <Navigate to="/" replace />
          } />
          <Route path="roles" element={
            hasPermission(['create_roles']) || user.role === 'Corporate User' ? <RoleManagement user={user} /> : <Navigate to="/" replace />
          } />
          <Route path="users" element={
            hasPermission(['create_user', 'create_corporate']) || user.role === 'Corporate User' ? <UserManagement user={user} /> : <Navigate to="/" replace />
          } />
          <Route path="fee-settings" element={
            hasPermission(['fee_settings']) || user.role === 'Super Admin' || user.role === 'Administrator' ? <FeeSettings user={user} /> : <Navigate to="/" replace />
          } />
          <Route path="activities" element={
            hasPermission(['edit_students']) || user.role === 'Administrator' ? <ActivityManagement user={user} /> : <Navigate to="/" replace />
          } />
          <Route path="staff" element={
            hasPermission(['create_user']) || user.role === 'Administrator' ? <StaffDirectory user={user} /> : <Navigate to="/" replace />
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
