import React, { useState } from 'react';
import { Search, Plus, Filter, MoreVertical, Download, UserPlus, Eye, Edit3, Trash2 } from 'lucide-react';

const StudentDirectory = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const students = [
        { id: 1, name: 'Aryan Verma', class: '10', section: 'A', status: 'Paid', joined: '2023-06-15' },
        { id: 2, name: 'Isika Reddy', class: '9', section: 'B', status: 'Partial', joined: '2023-08-01' },
        { id: 3, name: 'Vikram Singh', class: '11', section: 'C', status: 'Pending', joined: '2022-09-10' },
        { id: 4, name: 'Simran Kaur', class: '12', section: 'A', status: 'Paid', joined: '2021-04-22' },
        { id: 5, name: 'Akash Sharma', class: '8', section: 'B', status: 'Pending', joined: '2024-01-05' },
    ];

    const filtered = students.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="animate-fade-in">
            <header className="page-header">
                <div className="title-group">
                    <h1>Student Directory</h1>
                    <p>Manage and onboard new student records</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-primary">
                        <UserPlus size={20} />
                        <span>Add Student</span>
                    </button>
                    <button className="btn" style={{ background: 'var(--surface-hover)', border: '1px solid var(--border)' }}>
                        <Download size={20} />
                        <span>Export Data</span>
                    </button>
                </div>
            </header>

            <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                    <input 
                        type="text" 
                        placeholder="Search student by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.75rem 1rem 0.75rem 3rem',
                            borderRadius: '12px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--border)',
                            color: 'white',
                            outline: 'none'
                        }}
                    />
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <select style={{ padding: '0.75rem 1rem', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'white' }}>
                        <option>Class</option>
                        <option>Class 10</option>
                        <option>Class 11</option>
                    </select>
                    <select style={{ padding: '0.75rem 1rem', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'white' }}>
                        <option>Section</option>
                        <option>A</option>
                        <option>B</option>
                    </select>
                </div>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>Class</th>
                            <th>Section</th>
                            <th>Payment Status</th>
                            <th>Joining Date</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((s) => (
                            <tr key={s.id}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                                            {s.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: 600 }}>{s.name}</p>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: ADM-{2400 + s.id}</p>
                                        </div>
                                    </div>
                                </td>
                                <td>{s.class}</td>
                                <td>{s.section}</td>
                                <td>
                                    <span className={`badge badge-${s.status.toLowerCase()}`}>
                                        {s.status}
                                    </span>
                                </td>
                                <td>{s.joined}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                        <button title="View Details" style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}>
                                            <Eye size={18} />
                                        </button>
                                        <button title="Edit" style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}>
                                            <Edit3 size={18} />
                                        </button>
                                        <button title="Delete" style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', cursor: 'pointer' }}>
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

export default StudentDirectory;
