import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Users, CheckCircle2, Activity as ActivityIcon, UserPlus, Loader2 } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000';

const ActivityManagement = () => {
    const [activities, setActivities] = useState([]);
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [currentActivity, setCurrentActivity] = useState({ name: '', description: '', capacity: '' });
    
    // Enrollment Modal State
    const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
    const [selectedActivityId, setSelectedActivityId] = useState(null);
    const [enrollStudentId, setEnrollStudentId] = useState('');
    const [enrolledStudents, setEnrolledStudents] = useState([]);

    const loggedInUser = JSON.parse(localStorage.getItem('user')) || {};
    const schoolId = loggedInUser.school_id || null;

    useEffect(() => {
        if (schoolId) {
            fetchActivities();
            fetchStudents();
        }
    }, [schoolId]);

    const fetchActivities = async () => {
        setIsLoading(true);
        try {
            const resp = await fetch(`${API_BASE_URL}/activities/?school_id=${schoolId}`);
            if (resp.ok) {
                setActivities(await resp.json());
            }
        } catch (error) {
            console.error('Failed to fetch activities', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchStudents = async () => {
        try {
            const resp = await fetch(`${API_BASE_URL}/students/?school_id=${schoolId}`);
            if (resp.ok) {
                setStudents(await resp.json());
            }
        } catch (error) {
            console.error('Failed to fetch students', error);
        }
    };

    const handleOpenModal = (mode, act = null) => {
        setModalMode(mode);
        if (act) {
            setCurrentActivity({ ...act, capacity: act.capacity || '' });
        } else {
            setCurrentActivity({ school_id: schoolId, name: '', description: '', capacity: '' });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const url = modalMode === 'add' ? `${API_BASE_URL}/activities/` : `${API_BASE_URL}/activities/${currentActivity.id}`;
            const method = modalMode === 'add' ? 'POST' : 'PUT';
            
            const payload = {
                ...currentActivity,
                capacity: currentActivity.capacity ? parseInt(currentActivity.capacity) : null
            };

            const resp = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (resp.ok) {
                fetchActivities();
                setIsModalOpen(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this activity? All student enrollments will be wiped.")) {
            try {
                const resp = await fetch(`${API_BASE_URL}/activities/${id}`, { method: 'DELETE' });
                if (resp.ok) fetchActivities();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleOpenEnrollments = async (actId) => {
        setSelectedActivityId(actId);
        setIsEnrollModalOpen(true);
        try {
            const resp = await fetch(`${API_BASE_URL}/activities/${actId}/students`);
            if (resp.ok) {
                setEnrolledStudents(await resp.json());
            }
        } catch (err) {
            console.error("Failed to load enrolled students", err);
        }
    };

    const handleEnrollStudent = async (e) => {
        e.preventDefault();
        if (!enrollStudentId) return;
        
        try {
            const resp = await fetch(`${API_BASE_URL}/activities/enroll`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ activity_id: selectedActivityId, student_id: parseInt(enrollStudentId) })
            });
            
            if (resp.ok) {
                setEnrollStudentId('');
                handleOpenEnrollments(selectedActivityId); // Refresh list
                fetchActivities(); // Refresh counts
            } else {
                const err = await resp.json();
                alert(err.detail || "Failed to enroll student.");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleRemoveEnrollment = async (studentId) => {
        try {
            const resp = await fetch(`${API_BASE_URL}/activities/enroll/${selectedActivityId}/${studentId}`, { method: 'DELETE' });
            if (resp.ok) {
                handleOpenEnrollments(selectedActivityId);
                fetchActivities();
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="animate-fade-in">
            <header className="page-header">
                <div className="title-group">
                    <h1>Extracurricular Activities</h1>
                    <p>Manage clubs, sports, and after-school programs along with student enrollments.</p>
                </div>
                <button className="btn btn-primary" onClick={() => handleOpenModal('add')}>
                    <Plus size={20} />
                    <span>Create Activity</span>
                </button>
            </header>

            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><Loader2 className="animate-spin" size={40} color="var(--primary)" /></div>
            ) : (
                <div className="grid grid-3">
                    {activities.length === 0 ? (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem' }} className="glass-card">
                            <ActivityIcon size={48} style={{ margin: '0 auto 1rem', color: 'var(--text-muted)' }} />
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Activities Found</h3>
                            <p style={{ color: 'var(--text-muted)' }}>Start by creating an extracurricular club or sport.</p>
                        </div>
                    ) : (
                        activities.map(act => (
                            <div key={act.id} className="glass-card relative" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{act.name}</h3>
                                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                                        <button className="btn" style={{ padding: '0.5rem', background: 'transparent' }} onClick={() => handleOpenModal('edit', act)}>
                                            <Edit2 size={16} />
                                        </button>
                                        <button className="btn" style={{ padding: '0.5rem', background: 'transparent', color: '#ef4444' }} onClick={() => handleDelete(act.id)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', flex: 1, marginBottom: '1.5rem' }}>
                                    {act.description || 'No description provided.'}
                                </p>
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                                    <div>
                                        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Enrollment</span>
                                        <p style={{ fontWeight: 600, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <Users size={16} />
                                            {act.enrolled_count} {act.capacity ? `/ ${act.capacity}` : ''}
                                        </p>
                                    </div>
                                    <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }} onClick={() => handleOpenEnrollments(act.id)}>
                                        Manage Roster
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Activity Create/Edit Modal */}
            {isModalOpen && (
                <div className="overlay">
                    <div className="modal-card" style={{ maxWidth: '450px' }}>
                        <div className="modal-header">
                            <h2>{modalMode === 'add' ? 'Create Activity' : 'Edit Activity'}</h2>
                            <button className="close-btn" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
                        </div>
                        <div className="modal-content">
                            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div className="input-group">
                                    <label>Activity Name*</label>
                                    <input type="text" required className="form-input" value={currentActivity.name} onChange={e => setCurrentActivity({...currentActivity, name: e.target.value})} placeholder="e.g. Basketball Team" />
                                </div>
                                <div className="input-group">
                                    <label>Description</label>
                                    <textarea className="form-input" rows={3} value={currentActivity.description} onChange={e => setCurrentActivity({...currentActivity, description: e.target.value})} />
                                </div>
                                <div className="input-group">
                                    <label>Max Capacity (Optional)</label>
                                    <input type="number" className="form-input" min="1" value={currentActivity.capacity} onChange={e => setCurrentActivity({...currentActivity, capacity: e.target.value})} placeholder="Leave blank for unlimited" />
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Save Activity</button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Enrollment Management Modal */}
            {isEnrollModalOpen && (
                <div className="overlay">
                    <div className="modal-card" style={{ maxWidth: '600px' }}>
                        <div className="modal-header">
                            <div>
                                <h2>Enrollment Roster</h2>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Manage students associated with this activity.</p>
                            </div>
                            <button className="close-btn" onClick={() => setIsEnrollModalOpen(false)}><X size={20} /></button>
                        </div>
                        <div className="modal-content">
                            <form onSubmit={handleEnrollStudent} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                <select 
                                    className="form-input" 
                                    style={{ flex: 1 }} 
                                    value={enrollStudentId} 
                                    onChange={e => setEnrollStudentId(e.target.value)}
                                    required
                                >
                                    <option value="">-- Choose Student to Enroll --</option>
                                    {students.map(s => (
                                        <option key={s.id} value={s.id}>{s.name} (Class {s.current_class}-{s.section} - {s.admission_number})</option>
                                    ))}
                                </select>
                                <button type="submit" className="btn btn-primary"><UserPlus size={18} /> Add</button>
                            </form>

                            <div className="table-container" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Student Name</th>
                                            <th>Class</th>
                                            <th style={{ textAlign: 'right' }}>Remove</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {enrolledStudents.length === 0 ? (
                                            <tr><td colSpan="3" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No students currently enrolled.</td></tr>
                                        ) : (
                                            enrolledStudents.map(s => (
                                                <tr key={s.id}>
                                                    <td style={{ fontWeight: 600 }}>{s.name} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({s.admission_number})</span></td>
                                                    <td>{s.current_class}-{s.section}</td>
                                                    <td style={{ textAlign: 'right' }}>
                                                        <button className="btn" style={{ padding: '0.25rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }} onClick={() => handleRemoveEnrollment(s.id)}>
                                                            <X size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActivityManagement;
