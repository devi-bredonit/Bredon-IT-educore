import React, { useState } from 'react';
import { IndianRupee, Printer, Mail, Plus, Search, ArrowLeft, Download, CheckCircle2, CreditCard } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import FeeReceipt from '../components/FeeReceipt';

const FeePanel = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [recordingMode, setRecordingMode] = useState(false);
    const [showToast, setShowToast] = useState(null);
    const [isEmailing, setIsEmailing] = useState(false);
    const [viewingAudits, setViewingAudits] = useState(false);

    const [feeTypes, setFeeTypes] = useState(['Tuition', 'Transportation', 'Exam', 'Misc']);
    const [paymentModes] = useState(['Cash', 'UPI', 'Bank Transfer']);
    const [discounts] = useState(['No Discount', 'General Discount', 'Sibling Discount', 'Teacher Discount', 'Others']);

    const [students, setStudents] = useState([
        { id: 1,  name: 'Aryan Verma',   admissionNo: 'ADM/2024/001', class: '10', section: 'A', tuition: 15000, transport: 3500, exam: 2000, misc: 1500, total: 22000, paid: 18000, joiningDate: '2024-04-01' },
        { id: 2,  name: 'Isika Reddy',   admissionNo: 'ADM/2024/002', class: '9',  section: 'B', tuition: 15000, transport: 0,    exam: 2000, misc: 1000, total: 18000, paid: 15000, joiningDate: '2024-04-02' },
        { id: 3,  name: 'Vikram Singh',  admissionNo: 'ADM/2024/003', class: '11', section: 'C', tuition: 18000, transport: 4000, exam: 2500, misc: 2000, total: 26500, paid: 0,     joiningDate: '2024-04-05' },
        { id: 4,  name: 'Suhani Bose',   admissionNo: 'ADM/2024/004', class: '8',  section: 'A', tuition: 12000, transport: 2500, exam: 1500, misc: 1000, total: 17000, paid: 17000, joiningDate: '2024-03-15' },
        { id: 5,  name: 'Rahul Khanna',  admissionNo: 'ADM/2024/005', class: '10', section: 'A', tuition: 15000, transport: 3500, exam: 2000, misc: 1500, total: 22000, paid: 5000,  joiningDate: '2024-05-10' },
        { id: 6,  name: 'Megha Sharma',  admissionNo: 'ADM/2024/006', class: '7',  section: 'B', tuition: 11000, transport: 2000, exam: 1500, misc: 1000, total: 15500, paid: 0,     joiningDate: '2024-01-20' },
        { id: 7,  name: 'Tanmay Jain',   admissionNo: 'ADM/2024/007', class: '12', section: 'C', tuition: 20000, transport: 5000, exam: 3000, misc: 2500, total: 30500, paid: 10000, joiningDate: '2024-06-05' },
        { id: 8,  name: 'Pooja Hegde',   admissionNo: 'ADM/2024/008', class: '10', section: 'B', tuition: 15000, transport: 3500, exam: 2000, misc: 1500, total: 22000, paid: 22000, joiningDate: '2024-04-12' },
        { id: 9,  name: 'Arnab Gope',    admissionNo: 'ADM/2024/009', class: '9',  section: 'A', tuition: 14000, transport: 3000, exam: 1800, misc: 1200, total: 20000, paid: 0,     joiningDate: '2024-05-25' },
        { id: 10, name: 'Aditi Rao',     admissionNo: 'ADM/2024/010', class: '11', section: 'B', tuition: 18000, transport: 0,    exam: 2500, misc: 2000, total: 22500, paid: 12500, joiningDate: '2024-02-14' },
        { id: 11, name: 'Kabir Das',     admissionNo: 'ADM/2024/011', class: '6',  section: 'A', tuition: 10000, transport: 2000, exam: 1500, misc: 1000, total: 14500, paid: 14500, joiningDate: '2024-03-30' },
        { id: 12, name: 'Mira Nair',     admissionNo: 'ADM/2024/012', class: '10', section: 'C', tuition: 15000, transport: 3500, exam: 2000, misc: 1500, total: 22000, paid: 2000,  joiningDate: '2024-04-20' },
    ]);

    const [auditLogs, setAuditLogs] = useState([
        { id: 101, studentName: 'Aryan Verma', admNo: 'ADM/2024/001', amount: 5000, feeType: 'Tuition', date: '01/04/2026, 10:30 AM', action: 'Payment Recorded' },
        { id: 102, studentName: 'Isika Reddy', admNo: 'ADM/2024/002', amount: 2000, feeType: 'Exam',    date: '02/04/2026, 02:15 PM', action: 'Payment Recorded' },
        { id: 103, studentName: 'Vikram Singh', admNo: 'ADM/2024/003', amount: 4000, feeType: 'Transportation', date: '05/04/2026, 11:00 AM', action: 'Payment Recorded' }
    ]);

    const [filters, setFilters] = useState({
        standard: 'All', section: 'All', feeType: 'All', status: 'All', startDate: '', endDate: ''
    });

    const [formData, setFormData] = useState({
        feeType: 'Tuition', paymentMode: 'Cash', amountPaid: '', discountType: 'No Discount', remarks: ''
    });

    const currentSchool = {
        name: 'Bredon IT Academy',
        address: '45/A, Education Street, Cyber City - 500081',
        phone: '+91 99887 76655',
        email: 'billing@bredonit.com'
    };

    // Summary stats
    const totalReceived = students.reduce((acc, s) => acc + s.paid, 0);
    const totalFees = students.reduce((acc, s) => acc + s.total, 0);
    const pendingPayment = totalFees - totalReceived;
    const totalStudentCount = students.length;

    // Filter logic
    const filtered = students.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              s.admissionNo.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStandard = filters.standard === 'All' || s.class === filters.standard;
        const matchesSection = filters.section === 'All' || s.section === filters.section;

        let matchesDate = true;
        if (filters.startDate) matchesDate = matchesDate && s.joiningDate >= filters.startDate;
        if (filters.endDate)   matchesDate = matchesDate && s.joiningDate <= filters.endDate;

        let status = 'Pending';
        if (s.paid === 0) status = 'Pending';
        else if (s.paid < s.total) status = 'Partial';
        else status = 'Paid';

        const matchesStatus = filters.status === 'All' || status === filters.status;
        return matchesSearch && matchesStandard && matchesSection && matchesDate && matchesStatus;
    });

    const handleRecordPayment = (student) => {
        setSelectedStudent(student);
        setFormData({ feeType: 'Tuition', paymentMode: 'Cash', amountPaid: (student.total - student.paid).toString(), discountType: 'No Discount', remarks: '' });
        setRecordingMode(true);
    };

    const handleConfirmPayment = (e) => {
        e.preventDefault();
        if (!formData.amountPaid || isNaN(formData.amountPaid)) {
            alert('Please enter a valid numeric amount.');
            return;
        }
        const amount = parseFloat(formData.amountPaid);

        setStudents(students.map(s => {
            if (s.id === selectedStudent.id) {
                return { ...s, paid: Math.min(s.paid + amount, s.total) };
            }
            return s;
        }));

        const newAudit = {
            id: Date.now(),
            studentName: selectedStudent.name,
            admNo: selectedStudent.admissionNo,
            amount,
            feeType: formData.feeType,
            date: new Date().toLocaleString(),
            action: 'Payment Recorded'
        };
        setAuditLogs([newAudit, ...auditLogs]);
        alert(`Payment of ₹${amount} recorded for ${selectedStudent.name}`);
        setRecordingMode(false);
    };

    const handleDownloadReceipt = async () => {
        const input = document.getElementById('fee-receipt-capture-id');
        if (!input) return;
        try {
            const canvas = await html2canvas(input, { scale: 2, useCORS: true, logging: false, backgroundColor: '#ffffff' });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`fee_receipt_${selectedStudent.name.replace(/\s+/g, '_').toLowerCase()}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate receipt. Please try again.');
        }
    };

    const handleEmailReceipt = async () => {
        setIsEmailing(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsEmailing(false);
        setShowToast(`Receipt emailed successfully to ${selectedStudent?.email || 'parent'}!`);
        setTimeout(() => setShowToast(null), 3000);
    };

    const handleAddFeeType = () => {
        const newType = prompt('Enter new Fee Type (e.g. Library Fee):');
        if (newType && !feeTypes.includes(newType)) {
            setFeeTypes([...feeTypes, newType]);
        }
    };

    return (
        <div className="animate-fade-in">
            <header className="page-header">
                <div className="title-group">
                    <h1>Fees &amp; Payments</h1>
                    <p>Manage collection and record student payments with detailed annual structures</p>
                </div>
                {!recordingMode && (
                    <div className="glass-card" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Collection</p>
                            <p style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--primary)' }}>₹{totalReceived.toLocaleString()}</p>
                        </div>
                    </div>
                )}
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={handleAddFeeType} className="btn" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }}>
                        <Plus size={18} />
                        <span>Add Fee Type</span>
                    </button>
                    <button onClick={() => setViewingAudits(!viewingAudits)} className="btn" style={{ background: viewingAudits ? 'var(--primary)' : 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }}>
                        <Search size={18} />
                        <span>{viewingAudits ? 'Close Audits' : 'Audit Logs'}</span>
                    </button>
                </div>
            </header>

            {!recordingMode ? (
                <>
                    {/* Summary Cards */}
                    <div className="grid grid-3" style={{ marginBottom: '2rem' }}>
                        <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #10b981' }}>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total Payment Received</p>
                            <h2 style={{ fontSize: '1.75rem', marginTop: '0.5rem' }}>₹{totalReceived.toLocaleString()}</h2>
                        </div>
                        <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #ef4444' }}>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Pending Payment</p>
                            <h2 style={{ fontSize: '1.75rem', marginTop: '0.5rem' }}>₹{pendingPayment.toLocaleString()}</h2>
                        </div>
                        <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #6366f1' }}>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total Student Count</p>
                            <h2 style={{ fontSize: '1.75rem', marginTop: '0.5rem' }}>{totalStudentCount}</h2>
                        </div>
                    </div>

                    {/* Audit Logs */}
                    {viewingAudits && (
                        <div className="glass-card animate-fade-in" style={{ padding: '1.5rem', marginBottom: '2rem', background: 'rgba(99, 102, 241, 0.05)' }}>
                            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Search size={18} /> Audit Trail (Recent Actions)
                            </h3>
                            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                {auditLogs.length === 0 ? (
                                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No audits captured yet.</p>
                                ) : (
                                    <table style={{ fontSize: '0.875rem' }}>
                                        <thead>
                                            <tr>
                                                <th>Action</th>
                                                <th>Student</th>
                                                <th>Amount</th>
                                                <th>Type</th>
                                                <th>Date &amp; Time</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {auditLogs.map(log => (
                                                <tr key={log.id}>
                                                    <td>{log.action}</td>
                                                    <td>{log.studentName} ({log.admNo})</td>
                                                    <td style={{ color: '#10b981', fontWeight: 600 }}>₹{log.amount}</td>
                                                    <td>{log.feeType}</td>
                                                    <td style={{ color: 'var(--text-muted)' }}>{log.date}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Filters */}
                    <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
                                <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                                <input
                                    type="text"
                                    placeholder="Search student or Adm No..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 3rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white', outline: 'none' }}
                                />
                            </div>
                            <select value={filters.standard} onChange={(e) => setFilters({...filters, standard: e.target.value})} style={{ padding: '0.75rem 1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }}>
                                <option value="All">All Classes</option>
                                <option value="6">Class 6</option>
                                <option value="7">Class 7</option>
                                <option value="8">Class 8</option>
                                <option value="9">Class 9</option>
                                <option value="10">Class 10</option>
                                <option value="11">Class 11</option>
                                <option value="12">Class 12</option>
                            </select>
                            <select value={filters.section} onChange={(e) => setFilters({...filters, section: e.target.value})} style={{ padding: '0.75rem 1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }}>
                                <option value="All">All Sections</option>
                                <option value="A">Section A</option>
                                <option value="B">Section B</option>
                                <option value="C">Section C</option>
                            </select>
                            <select value={filters.feeType} onChange={(e) => setFilters({...filters, feeType: e.target.value})} style={{ padding: '0.75rem 1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }}>
                                <option value="All">All Fee Types</option>
                                {feeTypes.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                            <select value={filters.status} onChange={(e) => setFilters({...filters, status: e.target.value})} style={{ padding: '0.75rem 1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }}>
                                <option value="All">All Status</option>
                                <option value="Paid">Paid</option>
                                <option value="Partial">Partial</option>
                                <option value="Pending">Pending</option>
                            </select>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>From:</span>
                                <input type="date" value={filters.startDate} onChange={(e) => setFilters({...filters, startDate: e.target.value})} style={{ padding: '0.65rem 0.75rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }} />
                                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>To:</span>
                                <input type="date" value={filters.endDate} onChange={(e) => setFilters({...filters, endDate: e.target.value})} style={{ padding: '0.65rem 0.75rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }} />
                            </div>
                        </div>
                    </div>

                    {/* Students Table */}
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Student Details</th>
                                    <th>Fee Breakdown</th>
                                    <th>Total (₹)</th>
                                    <th>Collected (₹)</th>
                                    <th>Pending (₹)</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'right' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((s) => {
                                    let status = 'Pending';
                                    let color = '#ef4444';
                                    let bg = 'rgba(239, 68, 68, 0.1)';
                                    if (s.paid >= s.total) { status = 'Paid'; color = '#10b981'; bg = 'rgba(16, 185, 129, 0.1)'; }
                                    else if (s.paid > 0)   { status = 'Partial'; color = '#f59e0b'; bg = 'rgba(245, 158, 11, 0.1)'; }

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
                                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                    <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: 'rgba(139, 92, 246, 0.1)', color: '#a78bfa', borderRadius: '4px' }}>Tuition: ₹{s.tuition}</span>
                                                    <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: 'rgba(236, 72, 153, 0.1)', color: '#f472b6', borderRadius: '4px' }}>Exam: ₹{s.exam}</span>
                                                    {s.transport > 0 && <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', borderRadius: '4px' }}>Trans: ₹{s.transport}</span>}
                                                </div>
                                            </td>
                                            <td style={{ fontWeight: 600 }}>₹{s.total.toLocaleString()}</td>
                                            <td style={{ color: '#10b981', fontWeight: 600 }}>₹{s.paid.toLocaleString()}</td>
                                            <td style={{ color: s.total - s.paid > 0 ? '#ef4444' : '#10b981', fontWeight: 700 }}>₹{(s.total - s.paid).toLocaleString()}</td>
                                            <td>
                                                <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.75rem', background: bg, color: color, borderRadius: '99px', fontWeight: 600 }}>{status}</span>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                    <button
                                                        onClick={() => handleRecordPayment(s)}
                                                        disabled={s.paid >= s.total}
                                                        className="btn btn-primary"
                                                        style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', opacity: s.paid >= s.total ? 0.5 : 1 }}>
                                                        Record Payment
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
                        {/* Payment Form */}
                        <section className="glass-card" style={{ padding: '3rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2.5rem' }}>
                                <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 10px 20px rgba(99, 102, 241, 0.2)' }}>
                                    <IndianRupee size={28} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Record Payment</h3>
                                    <p style={{ color: 'var(--text-muted)' }}>Student: <strong>{selectedStudent?.name}</strong> ({selectedStudent?.admissionNo})</p>
                                </div>
                            </div>

                            <form onSubmit={handleConfirmPayment} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Fee Type</label>
                                        <select value={formData.feeType} onChange={(e) => setFormData({...formData, feeType: e.target.value})} style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }}>
                                            {feeTypes.map(t => <option key={t}>{t}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Payment Mode</label>
                                        <select value={formData.paymentMode} onChange={(e) => setFormData({...formData, paymentMode: e.target.value})} style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }}>
                                            {paymentModes.map(m => <option key={m}>{m}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Amount (₹)</label>
                                        <input
                                            type="text"
                                            placeholder="Enter numeric amount"
                                            value={formData.amountPaid}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (val === '' || /^\d*\.?\d*$/.test(val)) {
                                                    setFormData({...formData, amountPaid: val});
                                                }
                                            }}
                                            style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Discount</label>
                                        <select value={formData.discountType} onChange={(e) => setFormData({...formData, discountType: e.target.value})} style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }}>
                                            {discounts.map(d => <option key={d}>{d}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Remarks</label>
                                    <textarea
                                        placeholder="Add optional remarks..."
                                        rows={3}
                                        value={formData.remarks}
                                        onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                                        style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white', resize: 'none' }}
                                    />
                                </div>

                                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '1rem', borderRadius: '14px', fontSize: '1rem' }}>
                                    <CheckCircle2 size={20} />
                                    <span>Confirm and Issue Receipt</span>
                                </button>
                            </form>
                        </section>

                        {/* Receipt Sidebar */}
                        <aside className="animate-fade-in">
                            <div className="glass-card" style={{ padding: '2.5rem', height: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <h4 style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>Receipt Preview</h4>
                                    <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.75rem', position: 'relative' }}>
                                        <div style={{ background: 'var(--primary)', height: '4px', position: 'absolute', top: 0, left: '10%', right: '10%', borderRadius: '0 0 2px 2px' }}></div>
                                        <div style={{ marginBottom: '1.5rem', borderBottom: '1px dashed var(--border)', paddingBottom: '1rem' }}>
                                            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>EDUCORE+ RECEIPT</h2>
                                            <p style={{ fontSize: '0.65rem', color: '#64748b' }}>#{Math.floor(Math.random() * 1000000)} • {new Date().toLocaleDateString('en-GB')}</p>
                                        </div>
                                        <div style={{ textAlign: 'left', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ color: '#64748b' }}>Student Name:</span>
                                                <span style={{ fontWeight: 600 }}>{selectedStudent?.name}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ color: '#64748b' }}>Admission No:</span>
                                                <span style={{ fontWeight: 600 }}>{selectedStudent?.admissionNo}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ color: '#64748b' }}>Fee Type:</span>
                                                <span style={{ fontWeight: 600 }}>{formData.feeType}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
                                                <span style={{ fontWeight: 700, color: '#1e293b' }}>TOTAL PAID</span>
                                                <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.125rem' }}>₹{parseFloat(formData.amountPaid || 0).toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                                            <button className="btn" style={{ flex: 1, padding: '0.5rem', fontSize: '0.75rem', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#1e293b' }} onClick={() => window.print()}>
                                                <Printer size={16} />
                                                <span>Print</span>
                                            </button>
                                            <button className="btn" style={{ flex: 1, padding: '0.5rem', fontSize: '0.75rem', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#1e293b' }} onClick={handleDownloadReceipt}>
                                                <Download size={16} />
                                                <span>PDF</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="glass-card" style={{ padding: '1.5rem', background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
                                    <h5 style={{ fontSize: '0.75rem', color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '1rem' }}>Pending Balance</h5>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
                                            ₹{Math.max(0, (selectedStudent?.total || 0) - (selectedStudent?.paid || 0) - parseFloat(formData.amountPaid || 0)).toLocaleString()}
                                        </p>
                                        <CreditCard size={24} style={{ opacity: 0.3 }} />
                                    </div>
                                    <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                                        Remaining balance after this payment.
                                    </p>
                                </div>

                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    <button onClick={handleDownloadReceipt} className="btn btn-primary" style={{ flex: 1, padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                                        <Download size={18} />
                                        <span>Download PDF</span>
                                    </button>
                                    <button onClick={handleEmailReceipt} disabled={isEmailing} className="btn" style={{ flex: 1, padding: '0.5rem 1rem', fontSize: '0.875rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white' }}>
                                        <Mail size={18} />
                                        <span>{isEmailing ? 'Sending...' : 'Email'}</span>
                                    </button>
                                </div>
                            </div>
                        </aside>
                    </div>

                    {/* Hidden full-size receipt for PDF capture */}
                    <div className="fee-receipt-capture" id="fee-receipt-capture-id" style={{ position: 'absolute', left: '-9999px', top: 0 }}>
                        <FeeReceipt
                            student={selectedStudent}
                            school={currentSchool}
                            receiptNo={`REC/${new Date().getFullYear()}/00${selectedStudent?.id}`}
                            date={new Date().toLocaleDateString('en-GB')}
                            paymentData={{
                                feeBreakup: [{ head: formData.feeType, amount: parseFloat(formData.amountPaid) || 0 }],
                                amountPaid: parseFloat(formData.amountPaid) || 0,
                                discount: formData.discountType === 'No Discount' ? 0 : 1000,
                                paymentMode: formData.paymentMode,
                                paymentDate: new Date().toLocaleDateString('en-GB'),
                                remarks: formData.remarks
                            }}
                        />
                    </div>
                </div>
            )}

            {showToast && (
                <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', background: '#10b981', color: 'white', padding: '1rem 2rem', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '1rem', zIndex: 9999, animation: 'fadeIn 0.3s ease-out' }}>
                    <Mail size={20} />
                    <span>{showToast}</span>
                </div>
            )}
        </div>
    );
};

export default FeePanel;
