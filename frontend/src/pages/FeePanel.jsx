import React, { useState } from 'react';
import { IndianRupee, Printer, Mail, Plus, Trash2, Search, ArrowRight } from 'lucide-react';

const FeePanel = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [recordingMode, setRecordingMode] = useState(false);

    const students = [
        { id: 1, name: 'Aryan Verma', class: '10', section: 'A', tuition: 15000, transport: 3500, exam: 2000, misc: 1500, total: 22000, paid: 18000 },
        { id: 2, name: 'Isika Reddy', class: '9', section: 'B', tuition: 15000, transport: 0, exam: 2000, misc: 1000, total: 18000, paid: 15000 },
        { id: 3, name: 'Vikram Singh', class: '11', section: 'C', tuition: 18000, transport: 4000, exam: 2500, misc: 2000, total: 26500, paid: 0 },
    ];

    const filtered = students.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleRecordPayment = (student) => {
        setSelectedStudent(student);
        setRecordingMode(true);
    };

    return (
        <div className="animate-fade-in">
            <header className="page-header">
                <div className="title-group">
                    <h1>Fees & Payments</h1>
                    <p>Track fee structures and record student payments</p>
                </div>
            </header>

            {!recordingMode ? (
                <>
                    <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                            <input 
                                type="text" 
                                placeholder="Search student for payment recording..."
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
                    </div>

                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Student Name</th>
                                    <th>Fee Type Breakup</th>
                                    <th>Total Fee</th>
                                    <th>Amount Paid</th>
                                    <th>Remaining</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((s) => (
                                    <tr key={s.id}>
                                        <td>
                                            <p style={{ fontWeight: 600 }}>{s.name}</p>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Class {s.class}-{s.section}</p>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: 'rgba(139, 92, 246, 0.1)', color: '#a78bfa', borderRadius: '4px' }}>Tuition: ₹{s.tuition}</span>
                                                <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: 'rgba(236, 72, 153, 0.1)', color: '#f472b6', borderRadius: '4px' }}>Exam: ₹{s.exam}</span>
                                                {s.transport > 0 && <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', borderRadius: '4px' }}>Trans: ₹{s.transport}</span>}
                                            </div>
                                        </td>
                                        <td style={{ fontWeight: 600 }}>₹{s.total}</td>
                                        <td style={{ color: '#10b981', fontWeight: 600 }}>₹{s.paid}</td>
                                        <td style={{ color: s.total - s.paid > 0 ? '#ef4444' : '#10b981', fontWeight: 600 }}>₹{s.total - s.paid}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                <button 
                                                    onClick={() => handleRecordPayment(s)}
                                                    className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                                                    Record Payment
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                <div className="animate-fade-in">
                    <button onClick={() => setRecordingMode(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '1.5rem', fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>&larr; Back to List</span>
                    </button>
                    
                    <div className="grid grid-2">
                        <section className="glass-card" style={{ padding: '2rem' }}>
                            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Payment Recording: <span>{selectedStudent.name}</span></h3>
                            
                            <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Fee Type</label>
                                        <select style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }}>
                                            <option>Tuition Fee</option>
                                            <option>Transport Fee</option>
                                            <option>Exam Fee</option>
                                            <option>Misc Fee</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Payment Mode</label>
                                        <select style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }}>
                                            <option>Cash</option>
                                            <option>UPI</option>
                                            <option>Bank Transfer</option>
                                        </select>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Amount (₹)</label>
                                        <input 
                                            type="number" 
                                            placeholder="Enter numeric amount"
                                            style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }} 
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Discount</label>
                                        <select style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }}>
                                            <option>No Discount</option>
                                            <option>General Discount</option>
                                            <option>Sibling Discount</option>
                                            <option>Teacher Discount</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Remarks</label>
                                    <textarea 
                                        placeholder="Add optional remarks..."
                                        rows={3}
                                        style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white', resize: 'none' }}
                                    ></textarea>
                                </div>

                                <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                                    <IndianRupee size={20} />
                                    <span>Confirm Payment</span>
                                </button>
                            </form>
                        </section>

                        <section className="glass-card" style={{ padding: '2rem' }}>
                            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Receipt Preview</h3>
                            
                            <div className="receipt-preview" style={{ background: 'white', color: '#334155', padding: '2rem', borderRadius: '8px', border: '1px solid var(--border)', fontFamily: 'serif' }}>
                                <div style={{ borderBottom: '2px solid #334155', paddingBottom: '1rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                                    <h4 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, textTransform: 'uppercase' }}>EduCore Public School</h4>
                                    <p style={{ fontSize: '0.75rem', color: '#64748b' }}>123 Education Hub, Knowledge Park, New Delhi</p>
                                    <p style={{ fontSize: '0.875rem', fontWeight: 700, marginTop: '0.5rem', border: '1px solid #334155', display: 'inline-block', padding: '0.2rem 0.75rem' }}>FEE RECEIPT</p>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                                    <div><strong>Student:</strong> {selectedStudent.name}</div>
                                    <div style={{ textAlign: 'right' }}><strong>Receipt No:</strong> RE#2024-0402</div>
                                    <div><strong>Class:</strong> {selectedStudent.class}-{selectedStudent.section}</div>
                                    <div style={{ textAlign: 'right' }}><strong>Date:</strong> 2024-04-06</div>
                                </div>

                                <table style={{ borderCollapse: 'collapse', width: '100%', marginBottom: '1.5rem' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid #cbd5e1' }}>
                                            <th style={{ textAlign: 'left', padding: '0.5rem', color: '#1e293b' }}>Description</th>
                                            <th style={{ textAlign: 'right', padding: '0.5rem', color: '#1e293b' }}>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style={{ padding: '0.5rem' }}>Academic Fees (Quarterly)</td>
                                            <td style={{ textAlign: 'right', padding: '0.5rem' }}>₹0.00</td>
                                        </tr>
                                        <tr style={{ borderTop: '1px solid #e2e8f0', fontWeight: 700 }}>
                                            <td style={{ padding: '0.5rem' }}>TOTAL PAID</td>
                                            <td style={{ textAlign: 'right', padding: '0.5rem' }}>₹0.00</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem', marginTop: '2rem' }}>
                                    <button className="btn" style={{ flex: 1, background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1' }}>
                                        <Printer size={18} />
                                        <span>Print Receipt</span>
                                    </button>
                                    <button className="btn" style={{ flex: 1, background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1' }}>
                                        <Mail size={18} />
                                        <span>Email PDF</span>
                                    </button>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeePanel;
