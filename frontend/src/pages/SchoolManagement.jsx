import React from 'react';
import { Plus, School, Building2, MapPin, Phone, Mail, Globe, Calendar, Clock, Edit2, Trash2 } from 'lucide-react';

const SchoolManagement = () => {
    const schools = [
        { id: 1, name: 'EduCore Public School', branch: 'Main', code: 'EPS-001', city: 'New Delhi', state: 'Delhi', contact: '011-2345678', email: 'info@eps.edu.in' },
        { id: 2, name: 'Bright Academy', branch: 'West', code: 'BA-002', city: 'Mumbai', state: 'Maharashtra', contact: '022-9876543', email: 'admin@brightacademy.com' },
    ];

    return (
        <div className="animate-fade-in">
            <header className="page-header">
                <div className="title-group">
                    <h1>School Management</h1>
                    <p>Onboard and manage schools under your jurisdiction</p>
                </div>
                <button className="btn btn-primary">
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
                                    <Building2 size={32} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{school.name}</h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Branch: {school.branch} | Code: #{school.code}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button title="Edit" style={{ width: '40px', height: '40px', borderRadius: '10px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Edit2 size={18} />
                                </button>
                                <button title="Delete" style={{ width: '40px', height: '40px', borderRadius: '10px', border: '1px solid rgba(239, 68, 68, 0.1)', background: 'transparent', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '2rem' }}>
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
                                <span>{school.email}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                <Calendar size={18} />
                                <span>April - March</span>
                            </div>
                        </div>
                        
                        <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem' }}>
                            <button className="btn" style={{ flex: 1, border: '1px solid var(--border)', background: 'var(--surface-hover)', fontSize: '0.875rem' }}>
                                Configure Features
                            </button>
                            <button className="btn" style={{ flex: 1, border: '1px solid var(--border)', background: 'var(--surface-hover)', fontSize: '0.875rem' }}>
                                Manage Users
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SchoolManagement;
