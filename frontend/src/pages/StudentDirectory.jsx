import React, { useState, useEffect } from 'react';
import { Search, Download, UserPlus, Eye, Edit3, Trash2, X, Check, Camera, FileText, CreditCard, IndianRupee, Loader2, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8000';

const StudentDirectory = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterClass, setFilterClass] = useState('All');
    const [filterSection, setFilterSection] = useState('All');
    const [feeHeads, setFeeHeads] = useState([]);
    
    // Auth context
    const loggedInUser = JSON.parse(localStorage.getItem('user')) || {};
    const schoolId = loggedInUser.school_id;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [currentStudent, setCurrentStudent] = useState({
        school_id: schoolId,
        name: '', admission_number: '', roll_number: '', dob: '', gender: 'Male', blood_group: '',
        photo_url: '', current_class: '1', section: 'A', admission_date: new Date().toISOString().split('T')[0],
        joining_date: new Date().toISOString().split('T')[0],
        previous_school: '', father_name: '', father_phone: '', mother_name: '', mother_phone: '',
        guardian_details: '', email: '', permanent_address: '', communication_address: '', 
        aadhar_number: '', transport_required: false, medical_conditions: '', payment_status: 'Pending',
        documents_url: '',
        tuition: 0, transport: 0, exam: 0, misc: 0,
        fee_allocations: []
    });

    useEffect(() => {
        if (schoolId) {
            fetchStudents();
            fetchFeeHeads();
        }
    }, [schoolId, filterClass, filterSection]);

    const fetchFeeHeads = async () => {
        try {
            const resp = await fetch(`${API_BASE_URL}/fee-configs/heads?school_id=${schoolId}`);
            if (resp.ok) {
                const data = await resp.json();
                setFeeHeads(data.filter(h => h.is_active));
            }
        } catch (error) {
            console.error('Error fetching fee heads:', error);
        }
    };

    const fetchStudents = async () => {
        setIsLoading(true);
        try {
            const url = `${API_BASE_URL}/students/?school_id=${schoolId}&standard=${filterClass}&section=${filterSection}`;
            const resp = await fetch(url);
            if (resp.ok) {
                const data = await resp.json();
                setStudents(data);
            } else {
                throw new Error('Fallback to mock');
            }
        } catch (error) {
            console.error('Error fetching students, using mock:', error);
            // Fallback dummy students with diverse profiles
            setStudents([
                { id: 1, name: 'Rahul Sharma', admission_number: 'ADM001', roll_number: '10', dob: '2010-05-15', gender: 'Male', blood_group: 'A+', current_class: '10', section: 'A', father_name: 'Suresh Sharma', father_phone: '9876543210', email: 'rahul@example.com', payment_status: 'Paid', paid: 25000, tuition: 20000, transport: 2000, exam: 2000, misc: 1000, admission_date: '2023-04-01' },
                { id: 2, name: 'Sneha Gupta', admission_number: 'ADM002', roll_number: '12', dob: '2012-08-20', gender: 'Female', blood_group: 'B+', current_class: '8', section: 'B', father_name: 'Rajesh Gupta', father_phone: '9876543211', email: 'sneha@example.com', payment_status: 'Partial', paid: 15000, tuition: 18000, transport: 0, exam: 1500, misc: 500, admission_date: '2023-04-05' },
                { id: 3, name: 'Amit Kumar', admission_number: 'ADM003', roll_number: '05', dob: '2015-02-10', gender: 'Male', blood_group: 'O+', current_class: '5', section: 'C', father_name: 'Vinod Kumar', father_phone: '9876543212', email: 'amit@example.com', payment_status: 'Pending', paid: 0, tuition: 15000, transport: 1500, exam: 1000, misc: 500, admission_date: '2023-04-10' },
                { id: 4, name: 'Priya Singh', admission_number: 'ADM004', roll_number: '21', dob: '2008-11-25', gender: 'Female', blood_group: 'AB-', current_class: '12', section: 'A', father_name: 'Mahendra Singh', father_phone: '9876543213', email: 'priya@example.com', payment_status: 'Paid', paid: 35000, tuition: 30000, transport: 2500, exam: 2000, misc: 500, admission_date: '2022-04-01' },
                { id: 5, name: 'Vikram Aditya', admission_number: 'ADM005', roll_number: '03', dob: '2017-06-30', gender: 'Male', blood_group: 'O-', current_class: '3', section: 'D', father_name: 'Aditya Raj', father_phone: '9876543214', email: 'vikram@example.com', payment_status: 'Paid', paid: 12000, tuition: 10000, transport: 1000, exam: 500, misc: 500, admission_date: '2023-06-15' },
                { id: 6, name: 'Rohan Mehra', admission_number: 'ADM006', roll_number: '15', dob: '2011-03-12', gender: 'Male', blood_group: 'B-', current_class: '9', section: 'A', father_name: 'Sunil Mehra', father_phone: '9876543215', email: 'rohan@example.com', payment_status: 'Partial', paid: 15000, tuition: 22000, transport: 1000, exam: 1500, misc: 500, admission_date: '2023-05-01' },
                { id: 7, name: 'Ananya Iyer', admission_number: 'ADM007', roll_number: '08', dob: '2013-09-22', gender: 'Female', blood_group: 'A+', current_class: '7', section: 'B', father_name: 'Subramanian Iyer', father_phone: '9876543216', email: 'ananya@example.com', payment_status: 'Paid', paid: 20000, tuition: 18000, transport: 1000, exam: 1000, misc: 0, admission_date: '2023-05-10' }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (mode, student = null) => {
        setModalMode(mode);
        if (student) {
            setCurrentStudent({
                ...student,
                school_id: schoolId // Ensure school_id is preserved
            });
        } else {
            setCurrentStudent({
                school_id: schoolId,
                name: '', admission_number: '', roll_number: '', dob: '', gender: 'Male', blood_group: '',
                photo_url: '', current_class: '1', section: 'A', admission_date: new Date().toISOString().split('T')[0],
                joining_date: new Date().toISOString().split('T')[0],
                previous_school: '', father_name: '', father_phone: '', mother_name: '', mother_phone: '',
                guardian_details: '', email: '', permanent_address: '', communication_address: '', 
                aadhar_number: '', transport_required: false, medical_conditions: '', payment_status: 'Pending',
                documents_url: '',
                tuition: 20000, transport: 0, exam: 2000, misc: 1000
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const method = modalMode === 'add' ? 'POST' : 'PUT';
            const url = modalMode === 'add' ? `${API_BASE_URL}/students/` : `${API_BASE_URL}/students/${currentStudent.id}`;
            
            // Sanitize dates: convert empty strings to null for the backend
            const sanitizedStudent = { ...currentStudent };
            ['dob', 'admission_date', 'joining_date'].forEach(field => {
                if (sanitizedStudent[field] === '') {
                    sanitizedStudent[field] = null;
                }
            });

            const resp = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sanitizedStudent)
            });

            if (resp.ok) {
                fetchStudents();
                setIsModalOpen(false);
            } else {
                const errorData = await resp.json().catch(() => ({}));
                const serverMsg = errorData.detail || 'Unknown server error';
                alert(`Failed to save student: ${serverMsg}. Please ensure the database is reachable.`);
            }
        } catch (error) {
            console.error('Error saving student:', error);
            alert(`Network error: ${error.message}. Please check if the backend server is running and the database is connected.`);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this student record?')) {
            try {
                const resp = await fetch(`${API_BASE_URL}/students/${id}`, { method: 'DELETE' });
                if (resp.ok) fetchStudents();
            } catch (error) {
                console.error('Error deleting student:', error);
            }
        }
    };

    const filtered = students.filter(s => {
        return s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
               s.admission_number.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const handleExportData = () => {
        const headers = ['Adm No', 'Name', 'Class', 'Father Name', 'Phone', 'Email', 'Payment Status'];
        const csvContent = [
            headers.join(','),
            ...students.map(s => `${s.admission_number},${s.name},${s.current_class},${s.father_name},${s.father_phone},${s.email},${s.payment_status}`)
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `students_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="animate-fade-in">
            <header className="page-header">
                <div className="title-group">
                    <h1>Student Directory</h1>
                    <p>Onboard and manage academic student profiles for {loggedInUser.school_info?.name || 'your school'}</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-primary" onClick={() => handleOpenModal('add')}>
                        <UserPlus size={20} />
                        <span>Onboard Student</span>
                    </button>
                    <button className="btn" onClick={handleExportData} style={{ background: 'var(--surface-hover)', border: '1px solid var(--border)' }}>
                        <Download size={20} />
                        <span>Export CSV</span>
                    </button>
                </div>
            </header>

            <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                    <input 
                        type="text" 
                        placeholder="Search student by name or admission no..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-input"
                        style={{ paddingLeft: '3rem' }}
                    />
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--surface)', padding: '0 1rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                        <Filter size={16} style={{ color: 'var(--text-muted)' }} />
                        <select 
                            style={{ background: 'transparent', border: 'none', color: 'var(--text)', padding: '0.75rem 0', outline: 'none', fontSize: '0.875rem' }}
                            value={filterClass}
                            onChange={(e) => setFilterClass(e.target.value)}
                        >
                            <option value="All">All Classes</option>
                            {[...Array(12)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>Class {i + 1}</option>
                            ))}
                        </select>
                        <div style={{ width: '1px', height: '20px', background: 'var(--border)' }}></div>
                        <select 
                            style={{ background: 'transparent', border: 'none', color: 'var(--text)', padding: '0.75rem 0', outline: 'none', fontSize: '0.875rem' }}
                            value={filterSection}
                            onChange={(e) => setFilterSection(e.target.value)}
                        >
                            <option value="All">All Sections</option>
                            {['A', 'B', 'C', 'D'].map(sec => <option key={sec} value={sec}>Sec {sec}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div style={{ padding: '4rem', textAlign: 'center' }}>
                    <Loader2 className="animate-spin" size={40} style={{ margin: '0 auto', color: 'var(--primary)' }} />
                    <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Retrieving student records...</p>
                </div>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Adm No.</th>
                                <th>Student Profile</th>
                                <th>Parent Details</th>
                                <th>Class & Sec</th>
                                <th>Payment</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                                        No students found in this school directory.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((s) => (
                                    <tr key={s.id}>
                                        <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{s.admission_number}</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>
                                                    {s.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p style={{ fontWeight: 600 }}>{s.name}</p>
                                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Roll: {s.roll_number || 'N/A'} | {s.gender}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <p style={{ fontSize: '0.875rem' }}>F: {s.father_name}</p>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.father_phone}</p>
                                        </td>
                                        <td>
                                            <span style={{ fontWeight: 600 }}>{s.current_class}-{s.section}</span>
                                        </td>
                                        <td>
                                            <span className={`badge badge-${s.payment_status?.toLowerCase() || 'pending'}`}>
                                                {s.payment_status}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                <button onClick={() => handleOpenModal('view', s)} title="View Profile" className="btn btn-icon">
                                                    <Eye size={18} />
                                                </button>
                                                <button onClick={() => navigate('/fees', { state: { studentId: s.id, studentName: s.name, from: 'directory' } })} title="Collect Fee" className="btn btn-icon" style={{ color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                                                    <IndianRupee size={18} />
                                                </button>
                                                <button onClick={() => handleOpenModal('edit', s)} title="Edit Record" className="btn btn-icon">
                                                    <Edit3 size={18} />
                                                </button>
                                                <button onClick={() => handleDelete(s.id)} title="Delete Record" className="btn btn-icon" style={{ color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                                                    <Trash2 size={18} />
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

            {isModalOpen && (
                <div className="overlay">
                    <div className="modal-card" style={{ maxWidth: '950px' }}>
                        <div className="modal-header">
                            <div>
                                <h2 style={{ textTransform: 'capitalize' }}>{modalMode} Student Profile</h2>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Full Academic & Personal Enrollment Record</p>
                            </div>
                            <button className="close-btn" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
                        </div>

                        <div className="modal-content">
                            <form onSubmit={handleSave}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '2rem' }}>
                                    
                                    {/* Left Column: Extensive Forms */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                        
                                        {/* 1. Basic Identity */}
                                        <section className="glass-card" style={{ padding: '1.5rem', background: 'var(--surface)' }}>
                                            <h4 className="section-title">Identity & Admission</h4>
                                            <div className="input-grid">
                                                <div className="input-group">
                                                    <label>Full Student Name*</label>
                                                    <input type="text" required disabled={modalMode==='view'} className="form-input" value={currentStudent.name} onChange={e => setCurrentStudent({...currentStudent, name: e.target.value})} />
                                                </div>
                                                <div className="input-group">
                                                    <label>DOB*</label>
                                                    <input type="date" required disabled={modalMode==='view'} className="form-input" value={currentStudent.dob} onChange={e => setCurrentStudent({...currentStudent, dob: e.target.value})} />
                                                </div>
                                                <div className="input-group">
                                                    <label>Admission No*</label>
                                                    <input type="text" required disabled={modalMode==='view'} className="form-input" value={currentStudent.admission_number} onChange={e => setCurrentStudent({...currentStudent, admission_number: e.target.value})} />
                                                </div>
                                                <div className="input-group">
                                                    <label>Roll Number</label>
                                                    <input type="text" disabled={modalMode==='view'} className="form-input" value={currentStudent.roll_number || ''} onChange={e => setCurrentStudent({...currentStudent, roll_number: e.target.value})} />
                                                </div>
                                                <div className="input-group">
                                                    <label>Class*</label>
                                                    <select required disabled={modalMode==='view'} className="form-input" value={currentStudent.current_class} onChange={e => setCurrentStudent({...currentStudent, current_class: e.target.value})}>
                                                        {[...Array(12)].map((_, i) => (
                                                            <option key={i + 1} value={i + 1}>Class {i + 1}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="input-group">
                                                    <label>Section*</label>
                                                    <select required disabled={modalMode==='view'} className="form-input" value={currentStudent.section} onChange={e => setCurrentStudent({...currentStudent, section: e.target.value})}>
                                                        {['A', 'B', 'C', 'D'].map(sec => <option key={sec} value={sec}>{sec}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                        </section>

                                        {/* 2. Parent Details */}
                                        <section className="glass-card" style={{ padding: '1.5rem' }}>
                                            <h4 className="section-title">Parental Information</h4>
                                            <div className="input-grid">
                                                <div className="input-group">
                                                    <label>Father's Name*</label>
                                                    <input type="text" required disabled={modalMode==='view'} className="form-input" value={currentStudent.father_name} onChange={e => setCurrentStudent({...currentStudent, father_name: e.target.value})} />
                                                </div>
                                                <div className="input-group">
                                                    <label>Father's Phone*</label>
                                                    <input type="text" required disabled={modalMode==='view'} className="form-input" value={currentStudent.father_phone} onChange={e => setCurrentStudent({...currentStudent, father_phone: e.target.value})} />
                                                </div>
                                                <div className="input-group">
                                                    <label>Mother's Name*</label>
                                                    <input type="text" required disabled={modalMode==='view'} className="form-input" value={currentStudent.mother_name} onChange={e => setCurrentStudent({...currentStudent, mother_name: e.target.value})} />
                                                </div>
                                                <div className="input-group">
                                                    <label>Mother's Phone*</label>
                                                    <input type="text" required disabled={modalMode==='view'} className="form-input" value={currentStudent.mother_phone} onChange={e => setCurrentStudent({...currentStudent, mother_phone: e.target.value})} />
                                                </div>
                                                <div className="input-group" style={{ gridColumn: 'span 2' }}>
                                                    <label>Guardian / Other Details</label>
                                                    <input type="text" disabled={modalMode==='view'} className="form-input" value={currentStudent.guardian_details || ''} onChange={e => setCurrentStudent({...currentStudent, guardian_details: e.target.value})} />
                                                </div>
                                            </div>
                                        </section>

                                        {/* 3. Contact & Address */}
                                        <section className="glass-card" style={{ padding: '1.5rem', background: 'var(--surface)' }}>
                                            <h4 className="section-title">Contact & Medical</h4>
                                            <div className="input-grid">
                                                <div className="input-group">
                                                    <label>Aadhar Number</label>
                                                    <input type="text" disabled={modalMode==='view'} className="form-input" value={currentStudent.aadhar_number || ''} onChange={e => setCurrentStudent({...currentStudent, aadhar_number: e.target.value})} />
                                                </div>
                                                <div className="input-group">
                                                    <label>Email ID*</label>
                                                    <input type="email" required disabled={modalMode==='view'} className="form-input" value={currentStudent.email} onChange={e => setCurrentStudent({...currentStudent, email: e.target.value})} />
                                                </div>
                                                <div className="input-group" style={{ gridColumn: 'span 2' }}>
                                                    <label>Permanent Address*</label>
                                                    <textarea required rows={2} disabled={modalMode==='view'} className="form-input" value={currentStudent.permanent_address} onChange={e => setCurrentStudent({...currentStudent, permanent_address: e.target.value})} />
                                                </div>
                                                <div className="input-group">
                                                    <label>Blood Group*</label>
                                                    <select required disabled={modalMode==='view'} className="form-input" value={currentStudent.blood_group} onChange={e => setCurrentStudent({...currentStudent, blood_group: e.target.value})}>
                                                        <option value="">Select</option>
                                                        {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                                                    </select>
                                                </div>
                                                <div className="input-group">
                                                    <label>Transport Required?</label>
                                                    <select disabled={modalMode==='view'} className="form-input" value={currentStudent.transport_required} onChange={e => setCurrentStudent({...currentStudent, transport_required: e.target.value === 'true'})}>
                                                        <option value="false">No (Day Scholar)</option>
                                                        <option value="true">Yes (School Bus)</option>
                                                    </select>
                                                </div>
                                                <div className="input-group" style={{ gridColumn: 'span 2' }}>
                                                    <label>Medical Conditions / Allergies</label>
                                                    <input type="text" disabled={modalMode==='view'} className="form-input" placeholder="e.g. Asthma, Penicillin allergy" value={currentStudent.medical_conditions || ''} onChange={e => setCurrentStudent({...currentStudent, medical_conditions: e.target.value})} />
                                                </div>
                                            </div>
                                        </section>
                                    </div>

                                    {/* Right Column: Fees & Quick Stats */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                         <section className="glass-card" style={{ padding: '1.5rem', border: '1px solid var(--primary)', background: 'rgba(99, 102, 241, 0.02)' }}>
                                            <h4 className="section-title" style={{ color: 'var(--primary)' }}>Annual Fee Structure</h4>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                                {feeHeads.length === 0 ? (
                                                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                                                        No fee types configured. Go to <span style={{ color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate('/fee-settings')}>Fee Settings</span> to add them.
                                                    </p>
                                                ) : (
                                                    feeHeads.map(head => {
                                                        const allocation = (currentStudent.fee_allocations || []).find(a => a.fee_head_id === head.id);
                                                        const amount = allocation ? allocation.amount : 0;
                                                        
                                                        return (
                                                            <div key={head.id} className="input-group">
                                                                <label style={{ fontSize: '0.75rem' }}>{head.name} (₹)</label>
                                                                <input 
                                                                    type="number" 
                                                                    disabled={modalMode==='view'} 
                                                                    className="form-input" 
                                                                    value={amount} 
                                                                    onChange={e => {
                                                                        const val = parseFloat(e.target.value) || 0;
                                                                        const existing = [...(currentStudent.fee_allocations || [])];
                                                                        const idx = existing.findIndex(a => a.fee_head_id === head.id);
                                                                        if (idx >= 0) {
                                                                            existing[idx].amount = val;
                                                                        } else {
                                                                            existing.push({ fee_head_id: head.id, amount: val });
                                                                        }
                                                                        setCurrentStudent({...currentStudent, fee_allocations: existing});
                                                                    }}
                                                                />
                                                            </div>
                                                        );
                                                    })
                                                )}
                                                
                                                <div style={{ marginTop: '1rem', padding: '1.25rem', background: 'var(--primary)', borderRadius: '12px', color: 'white', textAlign: 'center' }}>
                                                    <p style={{ fontSize: '0.75rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Annual Fee</p>
                                                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
                                                        ₹{(currentStudent.fee_allocations || []).reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
                                                    </h2>
                                                </div>
                                            </div>
                                        </section>

                                        <section className="glass-card" style={{ padding: '1.5rem' }}>
                                            <h4 className="section-title">Record Audits</h4>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Status: <strong>{currentStudent.payment_status}</strong></p>
                                                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Total Paid: ₹{currentStudent.paid?.toLocaleString() || '0'}</p>
                                                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Admission: {currentStudent.admission_date}</p>
                                            </div>
                                        </section>
                                    </div>
                                </div>

                                {modalMode !== 'view' && (
                                    <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem' }}>
                                        <button type="button" className="btn" style={{ flex: 1, border: '1px solid var(--border)', background: 'var(--surface-hover)' }} onClick={() => setIsModalOpen(false)}>Cancel</button>
                                        <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>{modalMode === 'add' ? 'Complete Student Onboarding' : 'Update Record'}</button>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentDirectory;
