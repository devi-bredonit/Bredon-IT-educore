import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, Edit3, Trash2, X, Check } from 'lucide-react';

const API = 'http://localhost:8000';

const ALL_PERMISSIONS = [
  { key: 'create_school', label: 'Create School' },
  { key: 'enable_features', label: 'Enable Feature Privileges' },
  { key: 'create_roles', label: 'Create User Roles' },
  { key: 'create_user', label: 'Create/Map Users' },
  { key: 'create_corporate', label: 'Create Corporate User' },
  { key: 'view_students', label: 'View Student Directory' },
  { key: 'edit_students', label: 'Edit Students' },
  { key: 'record_payments', label: 'Record Payments' },
  { key: 'print_receipts', label: 'Print Receipts' },
];

const SCHOOL_ROLES = [
  'Administrator',
  'Teacher',
  'Staff',
  'Accountant',
  'Librarian',
  'Transport Manager',
];

const emptyRole = { name: '', permissions: [] };

const RoleManagement = ({ user }) => {
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [schools, setSchools] = useState([]);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState(emptyRole);
  const [editingRoleIdx, setEditingRoleIdx] = useState(null);
  const [assignUser, setAssignUser] = useState(null);
  const [assignRole, setAssignRole] = useState('');
  const [assignSchool, setAssignSchool] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchSchools();
    // Load roles from localStorage (role definitions are config, stored locally)
    const stored = localStorage.getItem('customRoles');
    if (stored) setRoles(JSON.parse(stored));
    else setRoles([
      { name: 'Administrator', permissions: ['view_students', 'edit_students', 'view_fees', 'record_payments', 'print_receipts'] },
      { name: 'Teacher', permissions: ['view_students', 'view_fees'] },
      { name: 'Accountant', permissions: ['view_fees', 'record_payments', 'print_receipts', 'view_reports'] },
    ]);
  }, []);

  const saveRoles = (updated) => {
    setRoles(updated);
    localStorage.setItem('customRoles', JSON.stringify(updated));
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API}/users/`);
      if (res.ok) setUsers(await res.json());
    } catch (e) {}
  };

  const fetchSchools = async () => {
    try {
      const res = await fetch(`${API}/schools/`);
      if (res.ok) setSchools(await res.json());
    } catch (e) {}
  };

  const handleOpenRoleModal = (idx = null) => {
    setEditingRoleIdx(idx);
    setCurrentRole(idx !== null ? { ...roles[idx] } : { ...emptyRole });
    setIsRoleModalOpen(true);
  };

  const handleSaveRole = () => {
    if (!currentRole.name.trim()) return;
    const updated = [...roles];
    if (editingRoleIdx !== null) {
      updated[editingRoleIdx] = currentRole;
    } else {
      updated.push(currentRole);
    }
    saveRoles(updated);
    setIsRoleModalOpen(false);
  };

  const handleDeleteRole = (idx) => {
    if (!window.confirm('Delete this role?')) return;
    const updated = roles.filter((_, i) => i !== idx);
    saveRoles(updated);
  };

  const togglePermission = (key) => {
    const perms = currentRole.permissions.includes(key)
      ? currentRole.permissions.filter(p => p !== key)
      : [...currentRole.permissions, key];
    setCurrentRole({ ...currentRole, permissions: perms });
  };

  const handleOpenAssign = (u) => {
    setAssignUser(u);
    setAssignRole(u.role || '');
    setAssignSchool(u.school_id ? String(u.school_id) : '');
    setIsAssignModalOpen(true);
  };

  const handleSaveAssign = async () => {
    if (!assignUser) return;
    setSaving(true);
    try {
      const updateData = { role: assignRole };
      if (assignSchool) updateData.school_id = parseInt(assignSchool);
      const res = await fetch(`${API}/users/${assignUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      if (res.ok) {
        fetchUsers();
        setIsAssignModalOpen(false);
      } else {
        alert('Failed to update user role.');
      }
    } catch (e) {
      alert('Connection error.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <header className="page-header">
        <div className="title-group">
          <h1>Role Management</h1>
          <p>Define roles, set permissions, and assign users to roles</p>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenRoleModal()}>
          <Plus size={20} />
          <span>Create Role</span>
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Left: Role Definitions */}
        <div>
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Defined Roles
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {roles.map((role, idx) => (
              <div key={idx} className="glass-card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--primary), var(--accent, #a855f7))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ShieldCheck size={18} style={{ color: 'white' }} />
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '1rem' }}>{role.name}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleOpenRoleModal(idx)} style={{ padding: '0.4rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}>
                      <Edit3 size={16} />
                    </button>
                    <button onClick={() => handleDeleteRole(idx)} style={{ padding: '0.4rem', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)', cursor: 'pointer', color: '#ef4444' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {role.permissions.length === 0 ? (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No permissions set</span>
                  ) : role.permissions.map(p => {
                    const label = ALL_PERMISSIONS.find(ap => ap.key === p)?.label || p;
                    return (
                      <span key={p} style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem', borderRadius: '20px', background: 'rgba(99,102,241,0.1)', color: 'var(--primary)', fontWeight: 600 }}>
                        {label}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Assign Roles to Users */}
        <div>
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Assign Roles to Users
          </h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Current Role</th>
                  <th>School</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1.5rem' }}>No users found</td></tr>
                ) : users.map(u => {
                  const school = schools.find(s => s.id === u.school_id);
                  return (
                    <tr key={u.id}>
                      <td>
                        <p style={{ fontWeight: 600 }}>{u.profile_name}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>@{u.username}</p>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', borderRadius: '20px', background: 'rgba(99,102,241,0.1)', color: 'var(--primary)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {school ? school.name : 'System Wide'}
                      </td>
                      <td>
                        <button
                          onClick={() => handleOpenAssign(u)}
                          className="btn btn-primary"
                          style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                        >
                          Assign
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create/Edit Role Modal */}
      {isRoleModalOpen && (
        <div className="overlay">
          <div className="modal-card" style={{ maxWidth: '550px' }}>
            <div className="modal-header">
              <div>
                <h2>{editingRoleIdx !== null ? 'Edit Role' : 'Create New Role'}</h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Define what this role can access</p>
              </div>
              <button className="close-btn" onClick={() => setIsRoleModalOpen(false)}><X size={20} /></button>
            </div>
            <div className="modal-content animate-fade-in">
              <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                <label>Role Name*</label>
                <input
                  type="text" className="form-input"
                  value={currentRole.name}
                  onChange={e => setCurrentRole({ ...currentRole, name: e.target.value })}
                  placeholder="e.g. Accountant, Librarian"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Permissions</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                  {ALL_PERMISSIONS.map(perm => {
                    const checked = currentRole.permissions.includes(perm.key);
                    return (
                      <div
                        key={perm.key}
                        onClick={() => togglePermission(perm.key)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.75rem',
                          padding: '0.7rem 1rem', borderRadius: '10px', cursor: 'pointer',
                          border: `1px solid ${checked ? 'var(--primary)' : 'var(--border)'}`,
                          background: checked ? 'rgba(99,102,241,0.08)' : 'var(--surface)',
                          transition: 'all 0.15s'
                        }}
                      >
                        <div style={{
                          width: '18px', height: '18px', borderRadius: '5px', flexShrink: 0,
                          border: `2px solid ${checked ? 'var(--primary)' : 'var(--border)'}`,
                          background: checked ? 'var(--primary)' : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          {checked && <Check size={11} style={{ color: 'white' }} />}
                        </div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>{perm.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button className="btn" style={{ flex: 1, background: 'var(--surface-hover)', border: '1px solid var(--border)' }} onClick={() => setIsRoleModalOpen(false)}>Cancel</button>
                <button className="btn btn-primary" style={{ flex: 2 }} onClick={handleSaveRole}>
                  {editingRoleIdx !== null ? 'Update Role' : 'Create Role'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Role Modal */}
      {isAssignModalOpen && assignUser && (
        <div className="overlay">
          <div className="modal-card" style={{ maxWidth: '450px' }}>
            <div className="modal-header">
              <div>
                <h2>Assign Role</h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{assignUser.profile_name} (@{assignUser.username})</p>
              </div>
              <button className="close-btn" onClick={() => setIsAssignModalOpen(false)}><X size={20} /></button>
            </div>
            <div className="modal-content animate-fade-in">
              <div className="input-group" style={{ marginBottom: '1rem' }}>
                <label>Role*</label>
                <select className="form-input" value={assignRole} onChange={e => setAssignRole(e.target.value)}>
                  <option value="">Select a role...</option>
                  {roles.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
                  {!roles.some(r => r.name === 'Super Admin') && (
                    <option value="Super Admin">Super Admin</option>
                  )}
                </select>
              </div>
              <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                <label>Assign to School</label>
                <select className="form-input" value={assignSchool} onChange={e => setAssignSchool(e.target.value)}>
                  <option value="">System Wide</option>
                  {schools.map(s => <option key={s.id} value={s.id}>{s.name} — {s.branch || 'Main'}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn" style={{ flex: 1, background: 'var(--surface-hover)', border: '1px solid var(--border)' }} onClick={() => setIsAssignModalOpen(false)}>Cancel</button>
                <button className="btn btn-primary" style={{ flex: 2 }} onClick={handleSaveAssign} disabled={saving || !assignRole}>
                  {saving ? 'Saving...' : 'Save Assignment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleManagement;
