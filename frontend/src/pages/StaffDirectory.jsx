import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Users, Mail, Phone, Loader2, Camera, ShieldAlert } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000';

const StaffDirectory = () => {
    const [staffList, setStaffList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [currentStaff, setCurrentStaff] = useState({
        name: '', role: 'Teacher', contact_info: '', skills_details: '', photo_url: '', joining_date: new Date().toISOString().split('T')[0], salary: '', is_active: true
    });
    
    const loggedInUser = JSON.parse(localStorage.getItem('user')) || {};
    const schoolId = loggedInUser.school_id || null;

    useEffect(() => {
        if (schoolId) fetchStaff();
    }, [schoolId]);

    const fetchStaff = async () => {
        setIsLoading(true);
        try {
            const resp = await fetch(`${API_BASE_URL}/staff/?school_id=${schoolId}`);
            if (resp.ok) {
                setStaffList(await resp.json());
            }
        } catch (error) {
            console.error('Error fetching staff:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (mode, staff = null) => {
        setModalMode(mode);
        if (staff) {
            setCurrentStaff(staff);
        } else {
            setCurrentStaff({
                school_id: schoolId,
                name: '', role: 'Teacher', contact_info: '', skills_details: '', photo_url: '', 
                joining_date: new Date().toISOString().split('T')[0], salary: '', is_active: true
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const url = modalMode === 'add' ? `${API_BASE_URL}/staff/` : `${API_BASE_URL}/staff/${currentStaff.id}`;
            const method = modalMode === 'add' ? 'POST' : 'PUT';
            const payload = {
                ...currentStaff,
                salary: currentStaff.salary ? parseFloat(currentStaff.salary) : null
            };

            const resp = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (resp.ok) {
                fetchStaff();
                setIsModalOpen(false);
            } else {
                alert("Failed to save staff data");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to completely remove this staff member?")) {
            try {
                const resp = await fetch(`${API_BASE_URL}/staff/${id}`, { method: 'DELETE' });
                if (resp.ok) fetchStaff();
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <div className="animate-fade-in">
            <header className="page-header">
                <div className="title-group">
                    <h1>Faculty & Staff Directory</h1>
                    <p>Manage profile records for teachers, administration, and support staff.</p>
                </div>
                <button className="btn btn-primary" onClick={() => handleOpenModal('add')}>
                    <Plus size={20} />
                    <span>Add Staff Member</span>
                </button>
            </header>

            <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.05)', display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border)' }}>
                    <ShieldAlert size={20} className="text-primary" />
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Note: Adding staff here does not grant them login access. User accounts must be created under "User Management".</p>
                </div>
                
                {isLoading ? (
                    <div style={{ padding: '4rem', textAlign: 'center' }}><Loader2 className="animate-spin" size={32} style={{ margin: '0 auto', color: 'var(--primary)' }} /></div>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Profile</th>
                                    <th>Role & Skills</th>
                                    <th>Contact Info</th>
                                    <th>Salary (₹)</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {staffList.length === 0 ? (
                                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No staff profiles found.</td></tr>
                                ) : (
                                    staffList.map(emp => (
                                        <tr key={emp.id}>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--surface-hover)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        {emp.photo_url ? <img src={emp.photo_url} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Users size={20} color="var(--primary)" />}
                                                    </div>
                                                    <div>
                                                        <span style={{ fontWeight: 600, display: 'block' }}>{emp.name}</span>
                                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Joined: {emp.joining_date || 'N/A'}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', marginBottom: '0.25rem', display: 'inline-block' }}>{emp.role}</span>
                                                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{emp.skills_details || 'No skills listed'}</p>
                                            </td>
                                            <td>
                                                <div style={{ fontSize: '0.875rem', color: 'var(--text)' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}><Phone size={14} className="text-muted" /> {emp.contact_info || '--'}</div>
                                                </div>
                                            </td>
                                            <td style={{ fontWeight: 600, color: '#10b981' }}>{emp.salary ? `₹${emp.salary.toLocaleString()}` : '--'}</td>
                                            <td>
                                                <span className={`badge badge-${emp.is_active ? 'paid' : 'pending'}`}>
                                                    {emp.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                                    <button onClick={() => handleOpenModal('edit', emp)} className="btn" style={{ padding: '0.5rem', background: 'transparent', border: '1px solid var(--border)' }}>
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button onClick={() => handleDelete(emp.id)} className="btn" style={{ padding: '0.5rem', background: 'rgba(239, 68, 68, 0.05)', color: '#ef4444' }}>
                                                        <Trash2 size={16} />
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
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="overlay">
                    <div className="modal-card" style={{ maxWidth: '600px' }}>
                        <div className="modal-header">
                            <h2>{modalMode === 'add' ? 'Add Staff Member' : 'Edit Staff Record'}</h2>
                            <button className="close-btn" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
                        </div>
                        <div className="modal-content">
                            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--background)', border: '2px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                        {currentStaff.photo_url ? <img src={currentStaff.photo_url} alt="pic" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Camera size={24} style={{ color: 'var(--text-muted)' }} />}
                                    </div>
                                    <div style={{ flex: 1 }} className="input-group">
                                        <label>Photo URL</label>
                                        <input type="text" className="form-input" placeholder="Paste image link here..." value={currentStaff.photo_url || ''} onChange={e => setCurrentStaff({...currentStaff, photo_url: e.target.value})} />
                                    </div>
                                </div>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="input-group">
                                        <label>Full Name*</label>
                                        <input type="text" required className="form-input" value={currentStaff.name} onChange={e => setCurrentStaff({...currentStaff, name: e.target.value})} />
                                    </div>
                                    <div className="input-group">
                                        <label>Role / Position*</label>
                                        <input type="text" required className="form-input" placeholder="e.g. Science Teacher, Janitor" value={currentStaff.role} onChange={e => setCurrentStaff({...currentStaff, role: e.target.value})} />
                                    </div>
                                    <div className="input-group">
                                        <label>Contact Info (Email/Phone)</label>
                                        <input type="text" className="form-input" value={currentStaff.contact_info || ''} onChange={e => setCurrentStaff({...currentStaff, contact_info: e.target.value})} />
                                    </div>
                                    <div className="input-group">
                                        <label>Date of Joining</label>
                                        <input type="date" className="form-input" value={currentStaff.joining_date || ''} onChange={e => setCurrentStaff({...currentStaff, joining_date: e.target.value})} />
                                    </div>
                                    <div className="input-group">
                                        <label>Salary (₹)</label>
                                        <input type="number" step="0.01" className="form-input" placeholder="e.g. 50000" value={currentStaff.salary || ''} onChange={e => setCurrentStaff({...currentStaff, salary: e.target.value})} />
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label>Skills & Qualifications</label>
                                    <textarea className="form-input" rows={2} placeholder="e.g. M.Sc Physics, B.Ed, 10 yrs experience" value={currentStaff.skills_details || ''} onChange={e => setCurrentStaff({...currentStaff, skills_details: e.target.value})} />
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <input type="checkbox" id="isActive" checked={currentStaff.is_active} onChange={e => setCurrentStaff({...currentStaff, is_active: e.target.checked})} />
                                    <label htmlFor="isActive" style={{ fontWeight: 600 }}>Staff member is currently active</label>
                                </div>

                                <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Save Record</button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffDirectory;
