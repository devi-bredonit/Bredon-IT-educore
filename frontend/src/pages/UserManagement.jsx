import React, { useState, useEffect } from 'react';
import { UserPlus, Search, Shield, ToggleLeft, ToggleRight, Edit3, Trash2, X } from 'lucide-react';

const API = 'http://localhost:8000';

const emptyUser = {
    username: '', password: '', profile_name: '', role: 'Administrator',
    phone: '', email: '', school_id: '', permissions: '', is_active: true
};

const UserManagement = ({ user }) => {
    const isSuperAdmin = user?.role === 'Super Admin';
    const [users, setUsers] = useState([]);
    const [schools, setSchools] = useState([]);
    const [roles, setRoles] = useState(['Super Admin']);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [currentUser, setCurrentUser] = useState(emptyUser);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchUsers();
        fetchSchools();
        
        // Load custom roles created in Role Management
        const storedRoles = localStorage.getItem('customRoles');
        if (storedRoles) {
            const parsed = JSON.parse(storedRoles);
            const customNames = parsed.map(r => r.name);
            const uniqueRoles = Array.from(new Set(['Super Admin', ...customNames]));
            setRoles(uniqueRoles);
        }
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch(`${API}/users/`);
            if (res.ok) setUsers(await res.json());
        } catch (e) { console.error('Failed to fetch users:', e); }
    };

    const fetchSchools = async () => {
        try {
            const res = await fetch(`${API}/schools/`);
            if (res.ok) setSchools(await res.json());
        } catch (e) { console.error('Failed to fetch schools:', e); }
    };

    const filtered = users.filter(u => {
        const matchSearch = u.profile_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.username?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchRole = roleFilter === '' || u.role === roleFilter;
        return matchSearch && matchRole;
    });

    const handleOpenModal = (mode, user = null) => {
        setModalMode(mode);
        setCurrentUser(user ? {
            ...user,
            password: '',
            school_id: user.school_id || ''
        } : { ...emptyUser });
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...currentUser,
                school_id: currentUser.school_id ? parseInt(currentUser.school_id) : null,
            };
            // Remove empty password on edit
            if (modalMode === 'edit' && !payload.password) {
                delete payload.password;
            }

            const url = modalMode === 'add' ? `${API}/users/` : `${API}/users/${currentUser.id}`;
            const method = modalMode === 'add' ? 'POST' : 'PUT';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                fetchUsers();
                setIsModalOpen(false);
            } else {
                const err = await res.json();
                alert(`Error: ${JSON.stringify(err.detail || err)}`);
            }
        } catch (e) {
            alert('Connection error. Please check the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            const res = await fetch(`${API}/users/${id}`, { method: 'DELETE' });
            if (res.ok) fetchUsers();
            else alert('Failed to delete user.');
        } catch (e) { alert('Connection error.'); }
    };

    const handleToggle = async (id) => {
        try {
            const res = await fetch(`${API}/users/${id}/toggle`, { method: 'PATCH' });
            if (res.ok) fetchUsers();
            else alert('Failed to toggle user status.');
        } catch (e) { alert('Connection error.'); }
    };

    const roleColor = (role) => {
        if (role === 'Super Admin') return 'var(--secondary)';
        if (role === 'Corporate User') return '#8b5cf6';
        return 'var(--primary)';
    };

    return (
        <div className="animate-fade-in">
            <header className="page-header">
                <div className="title-group">
                    <h1>User Management</h1>
                    <p>{isSuperAdmin ? 'Global system users and corporate onboarding' : 'Manage your school staff and access rights'}</p>
                </div>
                <button className="btn btn-primary" onClick={() => handleOpenModal('add')}>
                    <UserPlus size={20} />
                    <span>Onboard User</span>
                </button>
            </header>

            {/* Search & Filter */}
            <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                    <input
                        type="text"
                        placeholder="Search users by name or profile..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-input"
                        style={{ paddingLeft: '3rem' }}
                    />
                </div>
                <select
                    className="form-input"
                    style={{ width: 'auto' }}
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                >
                    <option value="">All Roles</option>
                    {roles.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
            </div>

            {/* Users Table */}
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>User Details</th>
                            <th>Role &amp; Permissions</th>
                            <th>School Instance</th>
                            <th>Status</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                                    No users found. Click "Onboard User" to add one.
                                </td>
                            </tr>
                        ) : filtered.map((u) => {
                            const school = schools.find(s => s.id === u.school_id);
                            return (
                                <tr key={u.id}>
                                    <td>
                                        <p style={{ fontWeight: 600 }}>{u.profile_name}</p>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>@{u.username}</p>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: roleColor(u.role) }}>
                                            <Shield size={16} />
                                            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{u.role}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <p style={{ fontSize: '0.875rem' }}>
                                            {school ? school.name : u.school_id ? `School #${u.school_id}` : 'System Wide'}
                                        </p>
                                    </td>
                                    <td>
                                        <div
                                            onClick={() => handleToggle(u.id)}
                                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: u.is_active ? 'var(--success, #10b981)' : '#ef4444', cursor: 'pointer' }}
                                        >
                                            {u.is_active ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                                            <span style={{ fontSize: '0.875rem' }}>{u.is_active ? 'Active' : 'Disabled'}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            <button
                                                title="Edit"
                                                onClick={() => handleOpenModal('edit', u)}
                                                style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}
                                            >
                                                <Edit3 size={18} />
                                            </button>
                                            <button
                                                title="Delete"
                                                onClick={() => handleDelete(u.id)}
                                                style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)', color: '#ef4444', cursor: 'pointer' }}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Create / Edit Modal */}
            {isModalOpen && (
                <div className="overlay">
                    <div className="modal-card" style={{ maxWidth: '600px' }}>
                        <div className="modal-header">
                            <div>
                                <h2>{modalMode === 'add' ? 'Onboard New User' : 'Edit User'}</h2>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                    {modalMode === 'add' ? 'Create a new staff account' : 'Update user details and permissions'}
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                <button className="btn" style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid var(--border)' }} onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button className="close-btn" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
                            </div>
                        </div>

                        <div className="modal-content animate-fade-in">
                            <form onSubmit={handleSave}>
                                <div className="input-grid">
                                    <div className="input-group">
                                        <label>Full Name / Profile Name*</label>
                                        <input
                                            type="text" required className="form-input"
                                            value={currentUser.profile_name}
                                            onChange={e => setCurrentUser({ ...currentUser, profile_name: e.target.value })}
                                            placeholder="e.g. John Principal"
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Username*</label>
                                        <input
                                            type="text" required className="form-input"
                                            value={currentUser.username}
                                            onChange={e => setCurrentUser({ ...currentUser, username: e.target.value })}
                                            placeholder="e.g. john_principal"
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>{modalMode === 'add' ? 'Password*' : 'New Password (leave blank to keep)'}</label>
                                        <input
                                            type="password"
                                            required={modalMode === 'add'}
                                            className="form-input"
                                            value={currentUser.password}
                                            onChange={e => setCurrentUser({ ...currentUser, password: e.target.value })}
                                            placeholder={modalMode === 'edit' ? 'Leave blank to keep current' : ''}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Role*</label>
                                        <select required className="form-input" value={currentUser.role} onChange={e => setCurrentUser({ ...currentUser, role: e.target.value })}>
                                            <option value="" disabled>Select a role</option>
                                            {roles.map(r => <option key={r} value={r}>{r}</option>)}
                                        </select>
                                    </div>
                                    <div className="input-group">
                                        <label>Email</label>
                                        <input
                                            type="email" className="form-input"
                                            value={currentUser.email}
                                            onChange={e => setCurrentUser({ ...currentUser, email: e.target.value })}
                                            placeholder="user@school.com"
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Phone</label>
                                        <input
                                            type="text" className="form-input"
                                            value={currentUser.phone}
                                            onChange={e => setCurrentUser({ ...currentUser, phone: e.target.value })}
                                            placeholder="9876543210"
                                        />
                                    </div>
                                    <div className="input-group" style={{ gridColumn: 'span 2' }}>
                                        <label>Assign School</label>
                                        <select className="form-input" value={currentUser.school_id} onChange={e => setCurrentUser({ ...currentUser, school_id: e.target.value })}>
                                            <option value="">System Wide (No specific school)</option>
                                            {schools.map(s => <option key={s.id} value={s.id}>{s.name} — {s.branch || 'Main'}</option>)}
                                        </select>
                                    </div>
                                    <div className="input-group" style={{ gridColumn: 'span 2' }}>
                                        <label>Permissions (comma-separated)</label>
                                        <input
                                            type="text" className="form-input"
                                            value={currentUser.permissions || ''}
                                            onChange={e => setCurrentUser({ ...currentUser, permissions: e.target.value })}
                                            placeholder="e.g. view_students, edit_fees"
                                        />
                                    </div>
                                    <div className="input-group" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <label style={{ margin: 0 }}>Active Status</label>
                                        <div
                                            onClick={() => setCurrentUser({ ...currentUser, is_active: !currentUser.is_active })}
                                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: currentUser.is_active ? '#10b981' : '#ef4444' }}
                                        >
                                            {currentUser.is_active ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                                            <span>{currentUser.is_active ? 'Active' : 'Disabled'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                    <button type="button" className="btn" style={{ flex: 1, background: 'var(--surface-hover)', border: '1px solid var(--border)' }} onClick={() => setIsModalOpen(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={loading}>
                                        {loading ? 'Saving...' : modalMode === 'add' ? 'Create User' : 'Update User'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
