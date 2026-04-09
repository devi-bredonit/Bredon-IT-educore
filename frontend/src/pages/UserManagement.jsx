import React, { useState, useEffect } from 'react';
import { UserPlus, Search, Shield, ToggleLeft, ToggleRight, MoreVertical, Edit3, Trash2, X, School, Mail, Phone, Lock } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [schools, setSchools] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [roleFilter, setRoleFilter] = useState('All');
    
    // Get logged in user context
    const loggedInUser = JSON.parse(localStorage.getItem('user')) || {};
    const isSuperAdmin = loggedInUser.role === 'Super Admin';

    const [currentUser, setCurrentUser] = useState({
        username: '', password: '', profile_name: '', role: 'Admin User', 
        school_id: loggedInUser.school_id || '', phone: '', email: '', is_active: true
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // Fetch users (with school_id filter if not super admin)
            const userUrl = isSuperAdmin ? `${API_BASE_URL}/users/` : `${API_BASE_URL}/users/?school_id=${loggedInUser.school_id}`;
            const userResp = await fetch(userUrl);
            if (userResp.ok) {
                const userData = await userResp.json();
                setUsers(userData);
            } else {
                throw new Error('User fetch failed');
            }

            // Fetch schools if super admin (for user assignment)
            if (isSuperAdmin) {
                const schoolResp = await fetch(`${API_BASE_URL}/schools/`);
                if (schoolResp.ok) {
                    const schoolData = await schoolResp.json();
                    setSchools(schoolData);
                }
            }
        } catch (error) {
            console.error('Error fetching data, using mock:', error);
            // Fallback dummy users for comprehensive demo
            setUsers([
                { id: 1, username: 'admin_main', profile_name: 'Deepak Kumar', role: 'Super Admin', email: 'deepak@educore.edu', phone: '9812345678', is_active: true, school_id: null },
                { id: 2, username: 'school_admin_1', profile_name: 'Anjali Sharma', role: 'Admin User', email: 'anjali@school1.edu', phone: '9812345679', is_active: true, school_id: 1 },
                { id: 3, username: 'corp_user_1', profile_name: 'Vikram Singh', role: 'Corporate User', email: 'vikram@educore.edu', phone: '9812345680', is_active: true, school_id: null },
                { id: 4, username: 'school_admin_2', profile_name: 'Priyanka Verma', role: 'Admin User', email: 'priyanka@springfield.ac.in', phone: '9812345681', is_active: true, school_id: 2 }
            ]);
            // Fallback dummy schools for mapping
            setSchools([
                { id: 1, name: 'EduCore International School' },
                { id: 2, name: 'Springfield Academy' }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (mode, user = null) => {
        setModalMode(mode);
        if (user) {
            setCurrentUser({ ...user, password: '' }); // Don't prepopulate password on edit
        } else {
            setCurrentUser({
                username: '', password: '', profile_name: '', role: isSuperAdmin ? 'Corporate User' : 'Admin User', 
                school_id: loggedInUser.school_id || '', phone: '', email: '', is_active: true
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const method = modalMode === 'add' ? 'POST' : 'PUT';
            const url = modalMode === 'add' ? `${API_BASE_URL}/users/` : `${API_BASE_URL}/users/${currentUser.id}`;
            
            const resp = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(currentUser)
            });

            if (resp.ok) {
                fetchData();
                setIsModalOpen(false);
            } else {
                alert('Failed to save user');
            }
        } catch (error) {
            console.error('Error saving user:', error);
        }
    };

    const handleDelete = async (id) => {
        if (id === loggedInUser.id) {
            alert("You cannot delete your own account.");
            return;
        }
        if (window.confirm('Are you sure you want to remove this user?')) {
            try {
                const resp = await fetch(`${API_BASE_URL}/users/${id}`, { method: 'DELETE' });
                if (resp.ok) fetchData();
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    const filtered = users.filter(u => {
        const matchesSearch = u.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              u.profile_name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'All' || u.role === roleFilter;
        return matchesSearch && matchesRole;
    });

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

            <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                    <input 
                        type="text" 
                        placeholder="Search users by name or username..."
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
                <select 
                    value={roleFilter} 
                    onChange={e => setRoleFilter(e.target.value)}
                    style={{ padding: '0.75rem 1rem', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
                >
                    <option value="All">All Roles</option>
                    <option value="Super Admin">Super Admin</option>
                    <option value="Corporate User">Corporate User</option>
                    <option value="Admin User">Admin User</option>
                </select>
            </div>

            {isLoading ? (
                <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading records...</div>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Profile Detail</th>
                                <th>Role & Account</th>
                                <th>Access Level</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No users found matching your search.</td>
                                </tr>
                            ) : (
                                filtered.map((u) => (
                                    <tr key={u.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>
                                                    {u.profile_name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p style={{ fontWeight: 600 }}>{u.profile_name}</p>
                                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: u.role === 'Super Admin' ? 'var(--secondary)' : 'var(--primary)' }}>
                                                <Shield size={16} />
                                                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{u.role}</span>
                                            </div>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>ID: @{u.username}</p>
                                        </td>
                                        <td>
                                            {u.school_id ? (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                                                    <School size={14} />
                                                    <span style={{ fontSize: '0.875rem' }}>
                                                        {schools.find(s => s.id === u.school_id)?.name || `School ID: ${u.school_id}`}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', borderRadius: '4px', fontWeight: 600 }}>SYSTEM WIDE</span>
                                            )}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: u.is_active ? '#10b981' : '#ef4444' }}>
                                                {u.is_active ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                                                <span style={{ fontSize: '0.875rem' }}>{u.is_active ? 'Active' : 'Disabled'}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                <button title="Edit" onClick={() => handleOpenModal('edit', u)} style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}>
                                                    <Edit3 size={18} />
                                                </button>
                                                <button title="Delete" onClick={() => handleDelete(u.id)} style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.1)', background: 'transparent', color: '#ef4444', cursor: 'pointer' }}>
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {isModalOpen && (
                <div className="overlay">
                    <div className="modal-card" style={{ maxWidth: '600px' }}>
                        <div className="modal-header">
                            <div>
                                <h2 style={{ textTransform: 'capitalize' }}>{modalMode} User</h2>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Configure credentials and access mapping</p>
                            </div>
                            <button className="close-btn" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
                        </div>
                        <div className="modal-content">
                            <form onSubmit={handleSave}>
                                <div className="input-grid">
                                    <div className="input-group">
                                        <label>Full Profile Name*</label>
                                        <input type="text" required className="form-input" value={currentUser.profile_name} onChange={e => setCurrentUser({...currentUser, profile_name: e.target.value})} />
                                    </div>
                                    <div className="input-group">
                                        <label>Username (System ID)*</label>
                                        <input type="text" required className="form-input" placeholder="e.g. jdoe_admin" value={currentUser.username} onChange={e => setCurrentUser({...currentUser, username: e.target.value})} />
                                    </div>
                                    <div className="input-group">
                                        <label>Password*</label>
                                        <div style={{ position: 'relative' }}>
                                            <Lock style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }} size={16} />
                                            <input type="password" required={modalMode === 'add'} className="form-input" style={{ paddingLeft: '2.5rem' }} placeholder={modalMode === 'edit' ? 'Leave blank to keep current' : ''} value={currentUser.password} onChange={e => setCurrentUser({...currentUser, password: e.target.value})} />
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <label>User Role*</label>
                                        <select className="form-input" value={currentUser.role} onChange={e => setCurrentUser({...currentUser, role: e.target.value})}>
                                            {isSuperAdmin && <option value="Super Admin">Super Admin</option>}
                                            {isSuperAdmin && <option value="Corporate User">Corporate User</option>}
                                            <option value="Admin User">Admin User</option>
                                        </select>
                                    </div>
                                    <div className="input-group">
                                        <label>Assign to School*</label>
                                        <select className="form-input" disabled={!isSuperAdmin} value={currentUser.school_id} onChange={e => setCurrentUser({...currentUser, school_id: e.target.value})}>
                                            {!isSuperAdmin && <option value={loggedInUser.school_id}>{loggedInUser.school_info?.name || 'My School'}</option>}
                                            {isSuperAdmin && <option value="">Global (No School)</option>}
                                            {isSuperAdmin && schools.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
                                        </select>
                                    </div>
                                    <div className="input-group">
                                        <label>Email ID*</label>
                                        <input type="email" required className="form-input" value={currentUser.email} onChange={e => setCurrentUser({...currentUser, email: e.target.value})} />
                                    </div>
                                    <div className="input-group" style={{ gridColumn: 'span 2' }}>
                                        <label>Phone Number</label>
                                        <input type="text" className="form-input" value={currentUser.phone} onChange={e => setCurrentUser({...currentUser, phone: e.target.value})} />
                                    </div>
                                </div>

                                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                                    <button type="button" className="btn" style={{ flex: 1, background: 'var(--surface-hover)', border: '1px solid var(--border)' }} onClick={() => setIsModalOpen(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save User Profile</button>
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
