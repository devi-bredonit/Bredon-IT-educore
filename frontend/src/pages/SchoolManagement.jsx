import React, { useState } from 'react';
import { Plus, Building2, MapPin, Phone, Mail, Globe, Calendar, Clock, Edit2, Trash2, X, School as SchoolIcon, Layers, Settings, Users } from 'lucide-react';

const SchoolManagement = () => {
    const [schools, setSchools] = useState([
        { id: 1, name: 'EduCore Public School', logo: '', branch: 'Main', code: 'EPS-001', address: '123 Education Lane', city: 'New Delhi', state: 'Delhi', pin: '110001', contact: '011-2345678', email: 'info@eps.edu.in', website: 'www.eps.edu.in', affiliation: 'CBSE', type: 'Co-ed', academicYear: 'April - March', timezone: 'IST' },
        { id: 2, name: 'Bright Academy', logo: '', branch: 'West', code: 'BA-002', address: '45 Bright St', city: 'Mumbai', state: 'Maharashtra', pin: '400001', contact: '022-9876543', email: 'admin@brightacademy.com', website: 'www.brightacademy.com', affiliation: 'ICSE', type: 'Day', academicYear: 'June - May', timezone: 'IST' },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [currentSchool, setCurrentSchool] = useState({
        name: '', logo: '', branch: '', code: '', address: '', city: '', state: '', pin: '', 
        contact: '', email: '', website: '', affiliation: 'CBSE', type: 'Co-ed', 
        academicYear: 'April - March', timezone: 'IST'
    });

    const handleOpenModal = (mode, school = null) => {
        setModalMode(mode);
        if (school) {
            setCurrentSchool(school);
        } else {
            setCurrentSchool({
                name: '', logo: '', branch: '', code: '', address: '', city: '', state: '', pin: '', 
                contact: '', email: '', website: '', affiliation: 'CBSE', type: 'Co-ed', 
                academicYear: 'April - March', timezone: 'IST'
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (modalMode === 'add') {
            setSchools([...schools, { ...currentSchool, id: Date.now() }]);
        } else {
            setSchools(schools.map(s => s.id === currentSchool.id ? currentSchool : s));
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this school?')) {
            setSchools(schools.filter(s => s.id !== id));
        }
    };

    return (
        <div className="animate-fade-in">
            <header className="page-header">
                <div className="title-group">
                    <h1>School Management</h1>
                    <p>Onboard and manage schools under your jurisdiction</p>
                </div>
                <button className="btn btn-primary" onClick={() => handleOpenModal('add')}>
                    <Plus size={20} />
                    <span>Create New School</span>
                </button>
            </header>

            <div className="grid grid-2">
                {schools.map((school) => (
                    <div key={school.id} className="glass-card" style={{ padding: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', gap: '1.25rem' }}>
                                <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'var(--surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                    {school.logo ? <img src={school.logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Building2 size={32} />}
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
                                <span>{school.city}, {school.state}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                <Phone size={18} />
                                <span>{school.contact}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                <Mail size={18} />
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{school.email}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                <Layers size={18} />
                                <span>{school.affiliation}</span>
                            </div>
                        </div>
                        
                        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                            <button className="btn" style={{ flex: 1, border: '1px solid var(--border)', background: 'var(--surface-hover)', fontSize: '0.875rem' }}>
                                <Settings size={16} />
                                <span>Features</span>
                            </button>
                            <button className="btn" style={{ flex: 1, border: '1px solid var(--border)', background: 'var(--surface-hover)', fontSize: '0.875rem' }}>
                                <Users size={16} />
                                <span>Users</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

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
                                                    value={currentSchool.logo} 
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
                                        <input type="text" required className="form-input" value={currentSchool.branch} onChange={e => setCurrentSchool({...currentSchool, branch: e.target.value})} />
                                    </div>
                                    <div className="input-group">
                                        <label>School Code / ID*</label>
                                        <input type="text" required className="form-input" value={currentSchool.code} onChange={e => setCurrentSchool({...currentSchool, code: e.target.value})} />
                                    </div>
                                    <div className="input-group">
                                        <label>Affiliation*</label>
                                        <select required className="form-input" value={currentSchool.affiliation} onChange={e => setCurrentSchool({...currentSchool, affiliation: e.target.value})}>
                                            <option value="CBSE">CBSE</option>
                                            <option value="ICSE">ICSE</option>
                                            <option value="State Board">State Board</option>
                                            <option value="IB">IB</option>
                                        </select>
                                    </div>
                                    <div className="input-group">
                                        <label>School Type*</label>
                                        <select required className="form-input" value={currentSchool.type} onChange={e => setCurrentSchool({...currentSchool, type: e.target.value})}>
                                            <option value="Co-ed">Co-ed</option>
                                            <option value="Boys Only">Boys Only</option>
                                            <option value="Girls Only">Girls Only</option>
                                            <option value="Boarding">Boarding</option>
                                        </select>
                                    </div>
                                    <div className="input-group">
                                        <label>Academic Year*</label>
                                        <input type="text" required className="form-input" placeholder="e.g. April - March" value={currentSchool.academicYear} onChange={e => setCurrentSchool({...currentSchool, academicYear: e.target.value})} />
                                    </div>
                                </div>

                                <div style={{ margin: '1.5rem 0', padding: '1.5rem', background: 'var(--background)', borderRadius: '16px' }}>
                                    <h4 style={{ marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--primary)', textTransform: 'uppercase' }}>Contact & Location</h4>
                                    <div className="input-grid">
                                        <div className="input-group">
                                            <label>Email ID*</label>
                                            <input type="email" required className="form-input" value={currentSchool.email} onChange={e => setCurrentSchool({...currentSchool, email: e.target.value})} />
                                        </div>
                                        <div className="input-group">
                                            <label>Contact Number(s)*</label>
                                            <input type="text" required className="form-input" value={currentSchool.contact} onChange={e => setCurrentSchool({...currentSchool, contact: e.target.value})} />
                                        </div>
                                        <div className="input-group">
                                            <label>City*</label>
                                            <input type="text" required className="form-input" value={currentSchool.city} onChange={e => setCurrentSchool({...currentSchool, city: e.target.value})} />
                                        </div>
                                        <div className="input-group">
                                            <label>State & PIN*</label>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <input type="text" required className="form-input" placeholder="State" value={currentSchool.state} onChange={e => setCurrentSchool({...currentSchool, state: e.target.value})} />
                                                <input type="text" required className="form-input" placeholder="PIN" style={{ width: '100px' }} value={currentSchool.pin} onChange={e => setCurrentSchool({...currentSchool, pin: e.target.value})} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="input-group" style={{ marginTop: '1rem' }}>
                                        <label>Full Address*</label>
                                        <textarea required className="form-input" rows={2} style={{ resize: 'none' }} value={currentSchool.address} onChange={e => setCurrentSchool({...currentSchool, address: e.target.value})} />
                                    </div>
                                </div>

                                <div className="input-grid">
                                    <div className="input-group">
                                        <label>Website</label>
                                        <input type="text" className="form-input" placeholder="www.example.com" value={currentSchool.website} onChange={e => setCurrentSchool({...currentSchool, website: e.target.value})} />
                                    </div>
                                    <div className="input-group">
                                        <label>Time Zone</label>
                                        <input type="text" className="form-input" value={currentSchool.timezone} onChange={e => setCurrentSchool({...currentSchool, timezone: e.target.value})} />
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
