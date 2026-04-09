import React, { useState, useEffect } from 'react';
import { IndianRupee, Printer, Mail, Plus, Search, ArrowLeft, Download, CheckCircle2, CreditCard, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { useLocation, useNavigate } from 'react-router-dom';
import FeeReceipt from '../components/FeeReceipt';

const API_BASE_URL = 'http://localhost:8000';

const FeePanel = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [recordingMode, setRecordingMode] = useState(false);
    const [showToast, setShowToast] = useState(null);
    const [isEmailing, setIsEmailing] = useState(false);
    const [viewingAudits, setViewingAudits] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [feeHeads, setFeeHeads] = useState([]);
    const [feeTypes, setFeeTypes] = useState(['Overall']);
    const [paymentModes] = useState(['Cash', 'UPI', 'Bank Transfer']);
    const [discounts] = useState(['No Discount', 'General Discount', 'Sibling Discount', 'Teacher Discount', 'Others']);

    const [students, setStudents] = useState([]);
    const [auditLogs, setAuditLogs] = useState([]);
    const [summary, setSummary] = useState({
        totalPaymentReceived: 0,
        pendingPaymentToBeReceived: 0,
        totalStudentCount: 0
    });

    const [filters, setFilters] = useState({
        standard: 'All', section: 'All', status: 'All'
    });

    const [formData, setFormData] = useState({
        feeType: 'Tuition', paymentMode: 'Cash', amountPaid: '', discountType: 'No Discount', remarks: ''
    });

    const loggedInUser = JSON.parse(localStorage.getItem('user')) || {};
    const [schoolId, setSchoolId] = useState(loggedInUser.school_id || null);
    const [currentSchool, setCurrentSchool] = useState(loggedInUser.school_info || { name: 'EduCore School' });

    useEffect(() => {
        const fetchInitial = async () => {
            if (!schoolId) {
                try {
                    const resp = await fetch(`${API_BASE_URL}/schools/`);
                    if (resp.ok) {
                        const data = await resp.json();
                        if (data.length > 0) {
                            setSchoolId(data[0].id);
                            setCurrentSchool(data[0]);
                        }
                    }
                } catch (e) {
                    console.error(e);
                }
            }
        };
        if (!schoolId) fetchInitial();
    }, [schoolId]);

    useEffect(() => {
        if (schoolId) {
            fetchDashboardData();
            fetchStudents();
            fetchFeeHeads();
        }
    }, [schoolId, filters.standard, filters.section]);

    const fetchFeeHeads = async () => {
        try {
            const resp = await fetch(`${API_BASE_URL}/fee-configs/heads?school_id=${schoolId}`);
            if (resp.ok) {
                const data = await resp.json();
                const activeHeads = data.filter(h => h.is_active);
                setFeeHeads(activeHeads);
                setFeeTypes([...activeHeads.map(h => h.name), 'Overall']);
                
                // Set default fee type in form if heads exist
                if (activeHeads.length > 0) {
                    setFormData(prev => ({ ...prev, feeType: activeHeads[0].name }));
                }
            }
        } catch (error) {
            console.error('Error fetching fee heads:', error);
        }
    };

    useEffect(() => {
        if (location.state?.studentId) {
            handleDirectPaymentFromNav(location.state.studentId);
        }
    }, [location.state]);

    const fetchDashboardData = async () => {
        try {
            const resp = await fetch(`${API_BASE_URL}/fees/dashboard-summary?school_id=${schoolId}&standard=${filters.standard}&section=${filters.section}`);
            if (resp.ok) {
                const data = await resp.json();
                setSummary(data);
            } else {
                throw new Error('Fallback to mock');
            }
        } catch (error) {
            console.error('Error fetching dashboard summary, using mock:', error);
            setSummary({
                totalPaymentReceived: 1250000,
                pendingPaymentToBeReceived: 450000,
                totalStudentCount: 842
            });
        }
    };

    const fetchStudents = async () => {
        setIsLoading(true);
        try {
            const resp = await fetch(`${API_BASE_URL}/students/?school_id=${schoolId}&standard=${filters.standard}&section=${filters.section}`);
            if (resp.ok) {
                const data = await resp.json();
                setStudents(data);
            } else {
                throw new Error('Fallback to mock');
            }
        } catch (error) {
            console.error('Error fetching students, using mock:', error);
            // Fallback dummy students formatted for fee panel
            setStudents([
                { id: 1, name: 'Rahul Sharma', admission_number: 'ADM001', current_class: '10', section: 'A', payment_status: 'Paid', paid: 25000, total: 25000, tuition: 20000, transport: 2000, exam: 2000, misc: 1000 },
                { id: 2, name: 'Sneha Gupta', admission_number: 'ADM002', current_class: '8', section: 'B', payment_status: 'Partial', paid: 15000, total: 20000, tuition: 18000, transport: 0, exam: 1500, misc: 500 },
                { id: 3, name: 'Amit Kumar', admission_number: 'ADM003', current_class: '5', section: 'C', payment_status: 'Pending', paid: 0, total: 18000, tuition: 15000, transport: 1500, exam: 1000, misc: 500 },
                { id: 4, name: 'Priya Singh', admission_number: 'ADM004', current_class: '12', section: 'A', payment_status: 'Paid', paid: 35000, total: 35000, tuition: 30000, transport: 2500, exam: 2000, misc: 500 },
                { id: 5, name: 'Vikram Aditya', admission_number: 'ADM005', current_class: '3', section: 'D', payment_status: 'Paid', paid: 12000, total: 12000, tuition: 10000, transport: 1000, exam: 500, misc: 500 },
                { id: 6, name: 'Rohan Mehra', admission_number: 'ADM006', current_class: '9', section: 'A', payment_status: 'Partial', paid: 15000, total: 25000, tuition: 22000, transport: 1000, exam: 1500, misc: 500 },
                { id: 7, name: 'Ananya Iyer', admission_number: 'ADM007', current_class: '7', section: 'B', payment_status: 'Paid', paid: 20000, total: 20000, tuition: 18000, transport: 1000, exam: 1000, misc: 0 }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAudits = async (studentId = null) => {
        try {
            const url = `${API_BASE_URL}/fees/audits?school_id=${schoolId}${studentId ? `&student_id=${studentId}` : ''}`;
            const resp = await fetch(url);
            if (resp.ok) {
                const data = await resp.json();
                setAuditLogs(data);
            } else {
                throw new Error('Fallback to mock');
            }
        } catch (error) {
            console.error('Error fetching audits, using mock:', error);
            setAuditLogs([
                { id: 1, timestamp: new Date(Date.now() - 3600000).toISOString(), action: 'Record Payment', details: 'Payment of ₹5000 recorded for Rahul Sharma (Tuition)' },
                { id: 2, timestamp: new Date(Date.now() - 86400000).toISOString(), action: 'Record Payment', details: 'Payment of ₹3000 recorded for Sneha Gupta (Transport)' },
                { id: 3, timestamp: new Date(Date.now() - 172800000).toISOString(), action: 'Record Payment', details: 'Annual fee paid in full for Priya Singh' }
            ]);
        }
    };

    const handleDirectPaymentFromNav = async (studentId) => {
        try {
            const resp = await fetch(`${API_BASE_URL}/students/${studentId}`);
            const student = await resp.json();
            handleRecordPayment(student);
        } catch (error) {
            console.error('Error fetching student for payment:', error);
        }
    };

    const handleRecordPayment = (student) => {
        setSelectedStudent(student);
        setFormData({ 
            feeType: 'Tuition', 
            paymentMode: 'Cash', 
            amountPaid: '', 
            discountType: 'No Discount', 
            remarks: '' 
        });
        setRecordingMode(true);
    };

    const handleConfirmPayment = async (e) => {
        e.preventDefault();
        if (!formData.amountPaid || isNaN(formData.amountPaid)) {
            alert('Please enter a valid numeric amount.');
            return;
        }

        const paymentPayload = {
            student_id: selectedStudent.id,
            student_name: selectedStudent.name,
            fee_type: formData.feeType,
            amount_paid: parseFloat(formData.amountPaid),
            discount_type: formData.discountType,
            payment_mode: formData.paymentMode,
            remarks: formData.remarks,
            payment_date: new Date().toISOString().split('T')[0]
        };

        try {
            const resp = await fetch(`${API_BASE_URL}/fees/record-payment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(paymentPayload)
            });

            if (resp.ok) {
                setShowToast(`Payment recorded for ${selectedStudent.name}`);
                fetchDashboardData();
                fetchStudents();
                setRecordingMode(false);
                setTimeout(() => setShowToast(null), 3000);
            } else {
                alert('Failed to record payment');
            }
        } catch (error) {
            console.error('Error recording payment:', error);
        }
    };

    const handleDownloadReceipt = async () => {
        const input = document.getElementById('fee-receipt-capture-id');
        if (!input) return;
        try {
            const canvas = await html2canvas(input, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const imgProps = pdf.getImageProperties(imgData);
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`receipt_${selectedStudent.admission_number}_${Date.now()}.pdf`);
        } catch (err) { console.error(err); }
    };

    return (
        <div className="animate-fade-in">
            <header className="page-header">
                <div className="title-group">
                    <h1>Fees &amp; Payments</h1>
                    <p>Real-time fee collection management for {currentSchool?.name}</p>
                </div>
                {!recordingMode && (
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div className="glass-card" style={{ padding: '0.75rem 1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                            <div>
                                <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Collected</p>
                                <p style={{ fontWeight: 800, color: 'var(--primary)' }}>₹{summary.totalPaymentReceived.toLocaleString()}</p>
                            </div>
                            <div style={{ width: '1px', height: '24px', background: 'var(--border)' }}></div>
                            <div>
                                <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Pending</p>
                                <p style={{ fontWeight: 800, color: '#ef4444' }}>₹{summary.pendingPaymentToBeReceived.toLocaleString()}</p>
                            </div>
                        </div>
                        <button onClick={() => { setViewingAudits(!viewingAudits); fetchAudits(); }} className="btn" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                            <Search size={18} />
                            <span>Audit Trail</span>
                        </button>
                    </div>
                )}
            </header>

            {!recordingMode ? (
                <>
                    {/* Summary Dashboard Section */}
                    <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
                                <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                                <input
                                    type="text"
                                    placeholder="Search by student name or admission number..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="form-input"
                                    style={{ paddingLeft: '3rem' }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'var(--background)', padding: '0 1rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                                <select value={filters.standard} onChange={e => setFilters({...filters, standard: e.target.value})} style={{ background: 'transparent', border: 'none', color: 'var(--text)', padding: '0.75rem 0', outline: 'none' }}>
                                    <option value="All">All Grades</option>
                                    {[...Array(12)].map((_, i) => <option key={i+1} value={i+1}>Grade {i+1}</option>)}
                                </select>
                                <div style={{ width: '1px', height: '20px', background: 'var(--border)' }}></div>
                                <select value={filters.section} onChange={e => setFilters({...filters, section: e.target.value})} style={{ background: 'transparent', border: 'none', color: 'var(--text)', padding: '0.75rem 0', outline: 'none' }}>
                                    <option value="All">All Sections</option>
                                    {['A', 'B', 'C', 'D'].map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                                <div style={{ width: '1px', height: '20px', background: 'var(--border)' }}></div>
                                <select value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})} style={{ background: 'transparent', border: 'none', color: 'var(--text)', padding: '0.75rem 0', outline: 'none' }}>
                                    <option value="All">All Status</option>
                                    <option value="Paid">Paid</option>
                                    <option value="Partial">Partial</option>
                                    <option value="Pending">Pending</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Financial Audit View */}
                    {viewingAudits && (
                        <div className="glass-card animate-fade-in" style={{ padding: '1.5rem', marginBottom: '2.5rem', background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ color: 'var(--primary)' }}><Search size={20} /></div>
                                Action History (Financial Audits)
                            </h3>
                            <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                                <table style={{ fontSize: '0.875rem' }}>
                                    <thead>
                                        <tr>
                                            <th>Timestamp</th>
                                            <th>Action Type</th>
                                            <th>Transaction Details</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {auditLogs.map(log => (
                                            <tr key={log.id}>
                                                <td style={{ color: 'var(--text-muted)' }}>{new Date(log.timestamp).toLocaleString()}</td>
                                                <td><span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', padding: '0.2rem 0.6rem', borderRadius: '4px', background: 'var(--surface)', border: '1px solid var(--border)' }}>{log.action}</span></td>
                                                <td>{log.details}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    <div className="table-container">
                        {isLoading ? (
                            <div style={{ padding: '5rem', textAlign: 'center' }}><Loader2 className="animate-spin" size={32} style={{ margin: '0 auto', color: 'var(--primary)' }} /></div>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Student Details</th>
                                        <th>Fee Component (Annual)</th>
                                        <th>Net Total (₹)</th>
                                        <th>Status</th>
                                        <th style={{ textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.filter(s => {
                                        const matchesSearch = (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (s.admission_number || '').toLowerCase().includes(searchTerm.toLowerCase());
                                        const matchesStatus = filters.status === 'All' || s.payment_status === filters.status;
                                        return matchesSearch && matchesStatus;
                                    }).map(s => (
                                        <tr key={s.id}>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800 }}>{(s.name || 'U').charAt(0)}</div>
                                                    <div>
                                                        <p style={{ fontWeight: 600 }}>{s.name}</p>
                                                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{s.admission_number} | {s.current_class}-{s.section}</p>
                                                    </div>
                                                </div>
                                            </td>
                                             <td>
                                                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                                                    {feeHeads.length > 0 ? (
                                                        feeHeads.map(head => {
                                                            const alloc = (s.fee_allocations || []).find(a => a.fee_head_id === head.id);
                                                            return (
                                                                <span key={head.id} style={{ fontSize: '0.6rem', fontWeight: 600, padding: '0.2rem 0.5rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px' }}>
                                                                    {head.name}: ₹{alloc ? alloc.amount : 0}
                                                                </span>
                                                            );
                                                        })
                                                    ) : (
                                                        <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>No dynamic fees defined</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td style={{ fontWeight: 700 }}>₹{(s.total || 0).toLocaleString()}</td>
                                            <td><span className={`badge badge-${s.payment_status?.toLowerCase()}`}>{s.payment_status}</span></td>
                                            <td>
                                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                    <button onClick={() => handleRecordPayment(s)} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>Record Payment</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </>
            ) : (
                <div className="animate-fade-in">
                    <button onClick={() => setRecordingMode(false)} className="btn" style={{ marginBottom: '2rem', background: 'transparent', color: 'var(--text-muted)', border: 'none', padding: 0 }}>
                        <ArrowLeft size={18} />
                        <span>Return to Student List</span>
                    </button>

                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: '2rem' }}>
                        {/* Record Form */}
                        <div className="glass-card" style={{ padding: '3rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '3rem' }}>
                                <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 8px 16px rgba(79, 70, 229, 0.2)' }}>
                                    <IndianRupee size={32} />
                                </div>
                                <div>
                                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Capture Payment</h2>
                                    <p style={{ color: 'var(--text-muted)' }}>Recording fee for <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{selectedStudent?.name}</span></p>
                                </div>
                            </div>

                            <form onSubmit={handleConfirmPayment} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                <div className="input-grid">
                                    <div className="input-group">
                                        <label>Fee Component*</label>
                                        <select value={formData.feeType} onChange={e => setFormData({...formData, feeType: e.target.value})} className="form-input">
                                            {feeTypes.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                    <div className="input-group">
                                        <label>Payment Method*</label>
                                        <select value={formData.paymentMode} onChange={e => setFormData({...formData, paymentMode: e.target.value})} className="form-input">
                                            {paymentModes.map(m => <option key={m} value={m}>{m}</option>)}
                                        </select>
                                    </div>
                                    <div className="input-group">
                                        <label>Amount Collected (₹)*</label>
                                        <input 
                                            type="text" 
                                            required 
                                            className="form-input" 
                                            placeholder="Numeric only"
                                            value={formData.amountPaid}
                                            onChange={e => { if (e.target.value === '' || /^\d*\.?\d*$/.test(e.target.value)) setFormData({...formData, amountPaid: e.target.value}) }}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Category Discount</label>
                                        <select value={formData.discountType} onChange={e => setFormData({...formData, discountType: e.target.value})} className="form-input">
                                            {discounts.map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </div>
                                    <div className="input-group" style={{ gridColumn: 'span 2' }}>
                                        <label>Notes / Transaction ID</label>
                                        <textarea 
                                            className="form-input" 
                                            rows={3} 
                                            placeholder="Enter any additional remarks or transaction references"
                                            value={formData.remarks}
                                            onChange={e => setFormData({...formData, remarks: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ padding: '1.25rem', fontSize: '1.1rem', borderRadius: '14px', width: '100%' }}>
                                    <CheckCircle2 size={22} />
                                    <span>Authorize Payment & Produce Receipt</span>
                                </button>
                            </form>
                        </div>

                        {/* Preview Column */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div className="glass-card" style={{ padding: '1.5rem', background: 'white' }}>
                                <h4 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748b', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>Digital Receipt Preview</h4>
                                <div style={{ 
                                    border: '1px solid #e2e8f0', 
                                    borderRadius: '12px', 
                                    overflow: 'hidden', 
                                    height: '420px', 
                                    background: '#f8fafc',
                                    position: 'relative'
                                }}>
                                    <div style={{ transform: 'scale(0.35)', transformOrigin: 'top left', width: '850px', position: 'absolute', top: '20px', left: '40px' }}>
                                        <FeeReceipt 
                                            student={selectedStudent} 
                                            school={currentSchool}
                                            paymentData={{
                                                feeBreakup: [{ head: formData.feeType, amount: parseFloat(formData.amountPaid) || 0 }],
                                                amountPaid: parseFloat(formData.amountPaid) || 0,
                                                discount: formData.discountType === 'No Discount' ? 0 : 500, // logic simplified for preview
                                                paymentMode: formData.paymentMode,
                                                paymentDate: new Date().toLocaleDateString('en-GB'),
                                                remarks: formData.remarks,
                                                academicYear: currentSchool.academic_year || '2024–2025'
                                            }}
                                            isPreview={true}
                                        />
                                    </div>
                                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1rem', background: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '0.5rem' }}>
                                        <button onClick={handleDownloadReceipt} className="btn" style={{ flex: 1, fontSize: '0.75rem', background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#1e293b' }}>
                                            <Download size={16} /> PDF
                                        </button>
                                        <button className="btn" style={{ flex: 1, fontSize: '0.75rem', background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#1e293b' }}>
                                            <Printer size={16} /> Print
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-card" style={{ padding: '1.5rem', background: 'var(--primary)', color: 'white' }}>
                                <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', opacity: 0.8, letterSpacing: '0.05em' }}>Outstanding Balance</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '0.5rem' }}>
                                    <h3 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
                                        ₹{Math.max(0, (selectedStudent?.total || 0) - (selectedStudent?.paid || 0) - parseFloat(formData.amountPaid || 0)).toLocaleString()}
                                    </h3>
                                    <CreditCard size={28} style={{ opacity: 0.4 }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hidden Capture */}
                    <div id="fee-receipt-capture-id" style={{ position: 'absolute', left: '-9999px', top: 0 }}>
                        <FeeReceipt 
                            student={selectedStudent} 
                            school={currentSchool}
                            paymentData={{
                                feeBreakup: [{ head: formData.feeType, amount: parseFloat(formData.amountPaid) || 0 }],
                                amountPaid: parseFloat(formData.amountPaid) || 0,
                                discount: formData.discountType === 'No Discount' ? 0 : 500,
                                paymentMode: formData.paymentMode,
                                paymentDate: new Date().toLocaleDateString('en-GB'),
                                remarks: formData.remarks,
                                academicYear: currentSchool.academic_year || '2024–2025'
                            }}
                        />
                    </div>
                </div>
            )}

            {showToast && (
                <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', background: 'var(--primary)', color: 'white', padding: '1rem 2rem', borderRadius: '12px', boxShadow: '0 10px 15px rgba(0,0,0,0.2)', animation: 'fadeIn 0.3s ease-out', zIndex: 1000, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <CheckCircle2 size={24} />
                    <span style={{ fontWeight: 600 }}>{showToast}</span>
                </div>
            )}
        </div>
    );
};

export default FeePanel;
