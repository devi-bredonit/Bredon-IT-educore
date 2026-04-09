import React, { useState, useEffect } from 'react';
import { Plus, Building2, MapPin, Phone, Mail, Globe, Calendar, Clock, Edit2, Trash2, X, School as SchoolIcon, Layers, Settings, Users } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000';

const SchoolManagement = () => {
    const [schools, setSchools] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [currentSchool, setCurrentSchool] = useState({
        name: '', logo: '', branch: '', code: '', address: '', city: '', state: '', pin: '', 
        contact: '', email: '', website: '', affiliation: 'CBSE', type: 'Co-ed', 
        academic_year: '2024–2025', timezone: 'IST'
    });

    useEffect(() => {
        fetchSchools();
    }, []);

    const fetchSchools = async () => {
        try {
            const resp = await fetch(`${API_BASE_URL}/schools/`);
            if (resp.ok) {
                const data = await resp.json();
                setSchools(data);
            } else {
                throw new Error('Fallback to mock');
            }
        } catch (error) {
            console.error('Error fetching schools, using mock:', error);
            // Fallback dummy schools for a rich demo experience
            setSchools([
                { id: 1, name: 'EduCore International School', logo: '', branch: 'Main Campus', code: 'EDU001', address: 'Sector 62, Noida, UP', city: 'Noida', state: 'Uttar Pradesh', pin: '201301', contact: '+91-120-4567890', email: 'info@educore.edu', website: 'www.educore.edu', affiliation: 'CBSE', type: 'Co-ed', academic_year: '2024–2025', timezone: 'IST' },
                { id: 2, name: 'Springfield Academy', logo: '', branch: 'South Delhi', code: 'SPR002', address: 'Hauz Khas, New Delhi', city: 'Delhi', state: 'Delhi', pin: '110016', contact: '+91-11-23456789', email: 'contact@springfield.ac.in', website: 'www.springfield.ac.in', affiliation: 'ICSE', type: 'Co-ed', academic_year: '2024–2025', timezone: 'IST' },
                { id: 3, name: 'St. Xavier High School', logo: '', branch: 'Gurgaon', code: 'SXH003', address: 'Sector 45, Gurgaon, HR', city: 'Gurgaon', state: 'Haryana', pin: '122003', contact: '+91-124-9876543', email: 'admin@stxavier.edu.in', website: 'www.stxavier.edu.in', affiliation: 'CBSE', type: 'Co-ed', academic_year: '2024–2025', timezone: 'IST' }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (mode, school = null) => {
        setModalMode(mode);
        if (school) {
            // Map backend snake_case to frontend camelCase
            setCurrentSchool({
                ...school,
                academicYear: school.academic_year || school.academicYear || 'April - March'
            });
        } else {
            setCurrentSchool({
                name: '', logo: '', branch: '', code: '', address: '', city: '', state: '', pin: '', 
                contact: '', email: '', website: '', affiliation: 'CBSE', type: 'Co-ed', 
                academic_year: '2024–2025', timezone: 'IST'
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const method = modalMode === 'add' ? 'POST' : 'PUT';
            const url = modalMode === 'add' ? `${API_BASE_URL}/schools/` : `${API_BASE_URL}/schools/${currentSchool.id}`;
            
            const resp = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(currentSchool)
            });

            if (resp.ok) {
                fetchSchools();
                setIsModalOpen(false);
            } else {
                alert('Failed to save school details');
            }
        } catch (error) {
            console.error('Error saving school:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this school? This will remove all associated data.')) {
            try {
                const resp = await fetch(`${API_BASE_URL}/schools/${id}`, { method: 'DELETE' });
                if (resp.ok) {
                    fetchSchools();
                }
            } catch (error) {
                console.error('Error deleting school:', error);
            }
        }
    };

    return (
        <div className="animate-fade-in">
            <header className="page-header">
                <div className="title-group">
                    <h1>School Management</h1>
                    <p>Onboard and manage schools under your jurisdiction (Super Admin)</p>
                </div>
                <button className="btn btn-primary" onClick={() => handleOpenModal('add')}>
                    <Plus size={20} />
                    <span>Create New School</span>
                </button>
            </header>

            {isLoading ? (
                <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading schools...</div>
            ) : (
                <div className="grid grid-2">
                    {schools.length === 0 ? (
                        <div style={{ gridColumn: 'span 2', padding: '4rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px dashed var(--border)' }}>
                            <Building2 size={48} style={{ margin: '0 auto 1.5rem', opacity: 0.2 }} />
                            <h3>No Schools Onboarded Yet</h3>
                            <p style={{ color: 'var(--text-muted)' }}>Start by creating the first school entity.</p>
                        </div>
                    ) : (
                        schools.map((school) => (
                            <div key={school.id} className="glass-card" style={{ padding: '2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                    <div style={{ display: 'flex', gap: '1.25rem' }}>
                                        <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'var(--surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                            {school.logo ? <img src={school.logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <SchoolIcon size={32} />}
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{school.name}</h3>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Branch: {school.branch} | Code: #{school.code}</p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button title="Edit" onClick={() => handleOpenModal('edit', school)} className="btn" style={{ padding: '0.5rem', background: 'transparent', border: '1px solid var(--border)' }}>
                                            <Edit2 size={18} />
                                        </button>
                                        <button title="Delete" onClick={() => handleDelete(school.id)} className="btn" style={{ padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                        <MapPin size={18} />
                                        <span>{school.city || 'N/A'}, {school.state || 'N/A'}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                        <Phone size={18} />
                                        <span>{school.contact || 'N/A'}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                        <Mail size={18} />
                                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{school.email || 'N/A'}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                        <Layers size={18} />
                                        <span>{school.affiliation || 'N/A'}</span>
                                    </div>
                                </div>
                                
                                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                                    <button className="btn" style={{ flex: 1, border: '1px solid var(--border)', background: 'var(--surface-hover)', fontSize: '0.875rem' }}>
                                        <Settings size={16} />
                                        <span>Features</span>
                                    </button>
                                    <button className="btn" style={{ flex: 1, border: '1px solid var(--border)', background: 'var(--surface-hover)', fontSize: '0.875rem' }}>
                                        <Users size={16} />
                                        <span>Staff Users</span>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Features Modal */}
            {isFeaturesModalOpen && selectedSchool && (
                <div className="overlay">
                    <div className="modal-card" style={{ maxWidth: '500px' }}>
                        <div className="modal-header">
                            <div>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Manage Modules</h2>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{selectedSchool.name}</p>
                            </div>
                            <button className="close-btn" onClick={() => setIsFeaturesModalOpen(false)}><X size={20} /></button>
                        </div>
                        <div className="modal-content animate-fade-in">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {Object.entries(schoolFeatures).map(([feature, isEnabled]) => (
                                    <div key={feature} className="glass-card" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ textTransform: 'capitalize', fontWeight: 600 }}>{feature} Module</div>
                                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                            <input 
                                                type="checkbox" 
                                                checked={isEnabled} 
                                                onChange={(e) => setSchoolFeatures({...schoolFeatures, [feature]: e.target.checked})} 
                                                style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--primary)' }}
                                            />
                                        </label>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => setIsFeaturesModalOpen(false)} className="btn btn-primary" style={{ width: '100%', marginTop: '2rem' }}>Save Configuration</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Users Modal */}
            {isUsersModalOpen && selectedSchool && (
                <div className="overlay">
                    <div className="modal-card" style={{ maxWidth: '600px' }}>
                        <div className="modal-header">
                            <div>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>School Administrators</h2>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{selectedSchool.name}</p>
                            </div>
                            <button className="close-btn" onClick={() => setIsUsersModalOpen(false)}><X size={20} /></button>
                        </div>
                        <div className="modal-content animate-fade-in">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <input type="text" placeholder="Search users..." className="form-input" style={{ width: '60%' }} />
                                <button className="btn btn-primary" style={{ padding: '0.5rem 1rem' }} onClick={() => navigate('/users')}><Plus size={16} /> Manage Users Page</button>
                            </div>
                            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                        <th style={{ padding: '0.75rem 0', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Name</th>
                                        <th style={{ padding: '0.75rem 0', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Role</th>
                                        <th style={{ padding: '0.75rem 0', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '1rem 0', fontWeight: 500 }}>Admin Principal</td>
                                        <td style={{ padding: '1rem 0' }}><span className="badge" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}>Principal</span></td>
                                        <td style={{ padding: '1rem 0' }}><span className="badge" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>Active</span></td>
                                    </tr>
                                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '1rem 0', fontWeight: 500 }}>IT Support</td>
                                        <td style={{ padding: '1rem 0' }}><span className="badge" style={{ background: 'var(--surface-hover)', color: 'var(--text-muted)' }}>IT Admin</span></td>
                                        <td style={{ padding: '1rem 0' }}><span className="badge" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>Active</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {isModalOpen && (
                <div className="overlay">
                    <div className="modal-card" style={{ maxWidth: '800px' }}>
                        <div className="modal-header">
                            <div>
                                <h2 style={{ textTransform: 'capitalize' }}>{modalMode} School</h2>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Corporate Onboarding Form</p>
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                <button className="btn" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem', background: 'transparent', border: '1px solid var(--border)' }} onClick={() => setIsModalOpen(false)}>
                                    Cancel
                                </button>
                                <button className="close-btn" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
                            </div>
                        </div>

                        <div className="modal-content animate-fade-in">
                            <form onSubmit={handleSave}>
                                <div className="input-grid">
                                    <div className="input-group" style={{ gridColumn: 'span 2' }}>
                                        <label>School Logo</label>
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            <div style={{ 
                                                width: '80px', 
                                                height: '80px', 
                                                borderRadius: '16px', 
                                                background: 'var(--background)', 
                                                border: '2px dashed var(--border)', 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'center',
                                                overflow: 'hidden',
                                                flexShrink: 0
                                            }}>
                                                {currentSchool.logo ? (
                                                    <img src={currentSchool.logo} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <Building2 size={32} style={{ color: 'var(--text-muted)' }} />
                                                )}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <input 
                                                    type="text" 
                                                    className="form-input" 
                                                    placeholder="Enter image URL (e.g. https://...)" 
                                                    value={currentSchool.logo || ''} 
                                                    onChange={e => setCurrentSchool({...currentSchool, logo: e.target.value})} 
                                                />
                                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Paste a link to your school logo image here</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <label>School Name*</label>
                                        <input type="text" required className="form-input" value={currentSchool.name} onChange={e => setCurrentSchool({...currentSchool, name: e.target.value})} />
                                    </div>
                                    <div className="input-group">
                                        <label>Branch Name*</label>
                                        <input type="text" required className="form-input" value={currentSchool.branch || ''} onChange={e => setCurrentSchool({...currentSchool, branch: e.target.value})} />
                                    </div>
                                    <div className="input-group">
                                        <label>School Code / ID*</label>
                                        <input type="text" required className="form-input" value={currentSchool.code || ''} onChange={e => setCurrentSchool({...currentSchool, code: e.target.value})} />
                                    </div>
                                    <div className="input-group">
                                        <label>Affiliation*</label>
                                        <select required className="form-input" value={currentSchool.affiliation || 'CBSE'} onChange={e => setCurrentSchool({...currentSchool, affiliation: e.target.value})}>
                                            <option value="CBSE">CBSE</option>
                                            <option value="ICSE">ICSE</option>
                                            <option value="State Board">State Board</option>
                                            <option value="IB">IB</option>
                                        </select>
                                    </div>
                                    <div className="input-group">
                                        <label>School Type*</label>
                                        <select required className="form-input" value={currentSchool.type || 'Co-ed'} onChange={e => setCurrentSchool({...currentSchool, type: e.target.value})}>
                                            <option value="Co-ed">Co-ed</option>
                                            <option value="Boys Only">Boys Only</option>
                                            <option value="Girls Only">Girls Only</option>
                                            <option value="Boarding">Boarding</option>
                                        </select>
                                    </div>
                                    <div className="input-group">
                                        <label>Academic Year Structure*</label>
                                        <input type="text" required className="form-input" placeholder="e.g. 2024–2025" value={currentSchool.academic_year || ''} onChange={e => setCurrentSchool({...currentSchool, academic_year: e.target.value})} />
                                    </div>
                                </div>

                                <div style={{ margin: '1.5rem 0', padding: '1.5rem', background: 'var(--background)', borderRadius: '16px' }}>
                                    <h4 style={{ marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--primary)', textTransform: 'uppercase' }}>Contact & Location</h4>
                                    <div className="input-grid">
                                        <div className="input-group">
                                            <label>Email ID*</label>
                                            <input type="email" required className="form-input" value={currentSchool.email || ''} onChange={e => setCurrentSchool({...currentSchool, email: e.target.value})} />
                                        </div>
                                        <div className="input-group">
                                            <label>Contact Number(s)*</label>
                                            <input type="text" required className="form-input" value={currentSchool.contact || ''} onChange={e => setCurrentSchool({...currentSchool, contact: e.target.value})} />
                                        </div>
                                        <div className="input-group">
                                            <label>City*</label>
                                            <input type="text" required className="form-input" value={currentSchool.city || ''} onChange={e => setCurrentSchool({...currentSchool, city: e.target.value})} />
                                        </div>
                                        <div className="input-group">
                                            <label>State & PIN*</label>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <input type="text" required className="form-input" placeholder="State" value={currentSchool.state || ''} onChange={e => setCurrentSchool({...currentSchool, state: e.target.value})} />
                                                <input type="text" required className="form-input" placeholder="PIN" style={{ width: '100px' }} value={currentSchool.pin || ''} onChange={e => setCurrentSchool({...currentSchool, pin: e.target.value})} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="input-group" style={{ marginTop: '1rem' }}>
                                        <label>Full Address*</label>
                                        <textarea required className="form-input" rows={2} style={{ resize: 'none' }} value={currentSchool.address || ''} onChange={e => setCurrentSchool({...currentSchool, address: e.target.value})} />
                                    </div>
                                </div>

                                <div className="input-grid">
                                    <div className="input-group">
                                        <label>Website</label>
                                        <input type="text" className="form-input" placeholder="www.example.com" value={currentSchool.website || ''} onChange={e => setCurrentSchool({...currentSchool, website: e.target.value})} />
                                    </div>
                                    <div className="input-group">
                                        <label>Time Zone</label>
                                        <input type="text" className="form-input" value={currentSchool.timezone || 'IST'} onChange={e => setCurrentSchool({...currentSchool, timezone: e.target.value})} />
                                    </div>
                                </div>

                                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                                    <button type="button" className="btn" style={{ flex: 1, background: 'var(--surface-hover)', border: '1px solid var(--border)' }} onClick={() => setIsModalOpen(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{modalMode === 'add' ? 'Create School' : 'Update Profile'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SchoolManagement;
