import React, { useState } from 'react';
import { IndianRupee, Printer, Mail, Search, ArrowLeft, CheckCircle2, Download, CreditCard, LayoutDashboard } from 'lucide-react';

const FeePanel = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [recordingMode, setRecordingMode] = useState(false);
    
    // Synced with Student Directory structure
    const [students, setStudents] = useState([
        { 
            id: 1, 
            name: 'Aryan Verma', 
            admissionNo: 'ADM-1001', 
            class: '10', 
            section: 'A', 
            feeStructure: { tuition: 15000, transport: 5000, exam: 2000, misc: 1000 },
            paid: 18000 
        },
        { 
            id: 2, 
            name: 'Isika Reddy', 
            admissionNo: 'ADM-1002', 
            class: '9', 
            section: 'B', 
            feeStructure: { tuition: 15000, transport: 0, exam: 2000, misc: 1000 },
            paid: 15000 
        },
    ]);

    const [paymentForm, setPaymentForm] = useState({
        type: 'Tuition', mode: 'Cash', amount: '', discount: 'No Discount', remarks: ''
    });

    const calculateTotalFee = (student) => {
        return Object.values(student.feeStructure).reduce((a, b) => a + b, 0);
    };

    const filtered = students.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.admissionNo.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleRecordPayment = (student) => {
        const total = calculateTotalFee(student);
        setSelectedStudent(student);
        setPaymentForm({ ...paymentForm, amount: (total - student.paid).toString() });
        setRecordingMode(true);
    };

    const handleConfirmPayment = (e) => {
        e.preventDefault();
        const amount = parseFloat(paymentForm.amount);
        if (isNaN(amount) || amount <= 0) return alert('Invalid amount');

        setStudents(students.map(s => {
            if (s.id === selectedStudent.id) {
                return { ...s, paid: s.paid + amount };
            }
            return s;
        }));
        
        alert(`Success! Receipt generated for ₹${amount} paid by ${selectedStudent.name}`);
        setRecordingMode(false);
    };

    return (
        <div className="animate-fade-in">
            <header className="page-header">
                <div className="title-group">
                    <h1>Fees & Payments</h1>
                    <p>Manage collection and record student payments with detailed annual structures</p>
                </div>
                {!recordingMode && (
                    <div className="glass-card" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Collection</p>
                            <p style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--primary)' }}>₹{students.reduce((acc, s) => acc + s.paid, 0).toLocaleString()}</p>
                        </div>
                    </div>
                )}
            </header>

            {!recordingMode ? (
                <>
                    <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                            <input 
                                type="text" 
                                placeholder="Search by name or admission number..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="form-input"
                                style={{ paddingLeft: '3rem' }}
                            />
                        </div>
                    </div>

                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Student Details</th>
                                    <th>Fee Structure (Total)</th>
                                    <th>Collected (₹)</th>
                                    <th>Pending (₹)</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'right' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((s) => {
                                    const total = calculateTotalFee(s);
                                    const pending = total - s.paid;
                                    const status = s.paid === 0 ? 'unpaid' : pending > 0 ? 'partial' : 'paid';
                                    return (
                                        <tr key={s.id}>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--background)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--primary)' }}>{s.name.charAt(0)}</div>
                                                    <div>
                                                        <p style={{ fontWeight: 600 }}>{s.name}</p>
                                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.admissionNo} • CL {s.class}-{s.section}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <p style={{ fontWeight: 700 }}>₹{total.toLocaleString()}</p>
                                                <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Annual Breakdown SET</p>
                                            </td>
                                            <td style={{ color: 'var(--success)', fontWeight: 600 }}>₹{s.paid.toLocaleString()}</td>
                                            <td style={{ color: pending > 0 ? 'var(--error)' : 'var(--success)', fontWeight: 700 }}>
                                                ₹{pending.toLocaleString()}
                                            </td>
                                            <td><span className={`badge badge-${status}`}>{status.toUpperCase()}</span></td>
                                            <td>
                                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                    <button 
                                                        disabled={pending <= 0}
                                                        onClick={() => handleRecordPayment(s)}
                                                        className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', opacity: pending <= 0 ? 0.5 : 1 }}>
                                                        Collect Fee
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                <div className="animate-fade-in">
                    <button onClick={() => setRecordingMode(false)} className="btn" style={{ marginBottom: '2rem', background: 'transparent', color: 'var(--text-muted)', border: 'none', padding: 0 }}>
                        <ArrowLeft size={18} />
                        <span>Back to Fee Directory</span>
                    </button>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2.5rem' }}>
                        <section className="glass-card" style={{ padding: '3rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2.5rem' }}>
                                <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 10px 20px rgba(99, 102, 241, 0.2)' }}>
                                    <IndianRupee size={28} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Record Payment</h3>
                                    <p style={{ color: 'var(--text-muted)' }}>Student: <strong>{selectedStudent.name}</strong> ({selectedStudent.admissionNo})</p>
                                </div>
                            </div>
                            
                            <form onSubmit={handleConfirmPayment}>
                                <div className="input-grid">
                                    <div className="input-group">
                                        <label>Fee Type*</label>
                                        <select className="form-input" value={paymentForm.type} onChange={e => setPaymentForm({...paymentForm, type: e.target.value})}>
                                            <option>Tuition Fee</option>
                                            <option>Transport Fee</option>
                                            <option>Exam Fee</option>
                                            <option>Library Fee</option>
                                            <option>Annual Charge</option>
                                        </select>
                                    </div>
                                    <div className="input-group">
                                        <label>Payment Mode*</label>
                                        <select className="form-input" value={paymentForm.mode} onChange={e => setPaymentForm({...paymentForm, mode: e.target.value})}>
                                            <option>Cash</option>
                                            <option>UPI / Online</option>
                                            <option>Bank Transfer</option>
                                            <option>Cheque</option>
                                        </select>
                                    </div>
                                    <div className="input-group">
                                        <label>Amount Recieved (₹)*</label>
                                        <input type="number" required className="form-input" value={paymentForm.amount} onChange={e => setPaymentForm({...paymentForm, amount: e.target.value})} style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--primary)' }} />
                                    </div>
                                    <div className="input-group">
                                        <label>Early Bird / Discount Category</label>
                                        <select className="form-input" value={paymentForm.discount} onChange={e => setPaymentForm({...paymentForm, discount: e.target.value})}>
                                            <option>No Discount</option>
                                            <option>Sibling (10%)</option>
                                            <option>Staff Ward (50%)</option>
                                            <option>Special Scholarship</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="input-group" style={{ marginTop: '1rem' }}>
                                    <label>Payment Remarks / Transaction ID</label>
                                    <textarea className="form-input" rows={2} style={{ resize: 'none' }} value={paymentForm.remarks} onChange={e => setPaymentForm({...paymentForm, remarks: e.target.value})} />
                                </div>

                                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '2.5rem', padding: '1.25rem', borderRadius: '14px', fontSize: '1rem' }}>
                                    <CheckCircle2 size={20} />
                                    <span>Confirm and Issue Receipt</span>
                                </button>
                            </form>
                        </section>

                        <aside className="animate-fade-in">
                            <div className="glass-card" style={{ padding: '2.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                                    <h4 style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>Receipt Preview</h4>
                                    <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.75rem', position: 'relative' }}>
                                        <div style={{ background: 'var(--primary)', height: '4px', position: 'absolute', top: 0, left: '10%', right: '10%', borderRadius: '0 0 2px 2px' }}></div>
                                        <div style={{ marginBottom: '1.5rem', borderBottom: '1px dashed var(--border)', paddingBottom: '1rem' }}>
                                            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>EDUCORE+ RECEIPT</h2>
                                            <p style={{ fontSize: '0.65rem', color: '#64748b' }}>#{Math.floor(Math.random()*1000000)} • MVP VERSION</p>
                                        </div>
                                        
                                        <div style={{ textAlign: 'left', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ color: '#64748b' }}>Student Name:</span>
                                                <span style={{ fontWeight: 600 }}>{selectedStudent.name}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ color: '#64748b' }}>Admission No:</span>
                                                <span style={{ fontWeight: 600 }}>{selectedStudent.admissionNo}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ color: '#64748b' }}>Payment Type:</span>
                                                <span style={{ fontWeight: 600 }}>{paymentForm.type}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
                                                <span style={{ fontWeight: 700, color: '#1e293b' }}>TOTAL PAID</span>
                                                <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.125rem' }}>₹{parseFloat(paymentForm.amount || 0).toLocaleString()}</span>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                                            <button className="btn" style={{ flex: 1, padding: '0.5rem', fontSize: '0.75rem', background: '#f8fafc', border: '1px solid #e2e8f0' }} onClick={() => window.print()}>
                                                <Printer size={16} />
                                                <span>Print</span>
                                            </button>
                                            <button className="btn" style={{ flex: 1, padding: '0.5rem', fontSize: '0.75rem', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                                                <Download size={16} />
                                                <span>PDF</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="glass-card" style={{ padding: '1.5rem', background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
                                    <h5 style={{ fontSize: '0.75rem', color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '1rem' }}>Pending Balance</h5>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>₹{(calculateTotalFee(selectedStudent) - selectedStudent.paid - parseFloat(paymentForm.amount || 0)).toLocaleString()}</p>
                                        <CreditCard size={24} style={{ opacity: 0.3 }} />
                                    </div>
                                    <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Post completion, student will have ₹{(calculateTotalFee(selectedStudent) - selectedStudent.paid - parseFloat(paymentForm.amount || 0)).toLocaleString()} pending.</p>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeePanel;
