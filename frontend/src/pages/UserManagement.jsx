import React, { useState } from 'react';
import { UserPlus, Search, Shield, ToggleLeft, ToggleRight, MoreVertical, Edit3, Trash2 } from 'lucide-react';

const UserManagement = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const users = [
        { id: 1, name: 'superadmin', profile: 'System Root', role: 'Super Admin', school: 'System Wide', active: true },
        { id: 2, name: 'mumbai_admin', profile: 'Mumbai Branch Principal', role: 'Corporate User', school: 'Bright Academy', active: true },
        { id: 3, name: 'delhi_clerk', profile: 'Delhi Office', role: 'Administrator', school: 'EduCore Public School', active: false },
    ];

    const filtered = users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.profile.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="animate-fade-in">
            <header className="page-header">
                <div className="title-group">
                    <h1>User Management</h1>
                    <p>Assign roles and manage access control for your staff</p>
                </div>
                <button className="btn btn-primary">
                    <UserPlus size={20} />
                    <span>Onboard User</span>
                </button>
            </header>

            <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                    <input 
                        type="text" 
                        placeholder="Search users by name or profile..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.75rem 1rem 0.75rem 3rem',
                            borderRadius: '12px',
                            background: 'var(--surface)',
                            border: '1px solid var(--border)',
                            color: 'var(--text)',
                            outline: 'none'
                        }}
                    />
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <select style={{ padding: '0.75rem 1rem', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}>
                        <option>Role Filter</option>
                        <option>Super Admin</option>
                        <option>Corporate User</option>
                        <option>Administrator</option>
                    </select>
                </div>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>User Details</th>
                            <th>Role & Permissions</th>
                            <th>School Instance</th>
                            <th>Status</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((u) => (
                            <tr key={u.id}>
                                <td>
                                    <p style={{ fontWeight: 600 }}>{u.profile}</p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>@{u.name}</p>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: u.role === 'Super Admin' ? 'var(--secondary)' : 'var(--primary)' }}>
                                        <Shield size={16} />
                                        <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{u.role}</span>
                                    </div>
                                </td>
                                <td>
                                    <p style={{ fontSize: '0.875rem' }}>{u.school}</p>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: u.active ? 'var(--success)' : 'var(--error)', cursor: 'pointer' }}>
                                        {u.active ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                                        <span style={{ fontSize: '0.875rem' }}>{u.active ? 'Active' : 'Disabled'}</span>
                                    </div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                        <button title="Edit" style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}>
                                            <Edit3 size={18} />
                                        </button>
                                        <button title="Delete" style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.1)', background: 'transparent', color: '#ef4444', cursor: 'pointer' }}>
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;
