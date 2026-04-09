import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Download, UserPlus, Eye, Edit3, Trash2, X, Check, Camera, FileText, CreditCard, Filter } from 'lucide-react';

const StudentDirectory = ({ user }) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [students, setStudents] = useState([]);
    const [isIdCreated, setIsIdCreated] = useState(false);

    const [schools, setSchools] = useState([]);
    const [selectedSchoolId, setSelectedSchoolId] = useState(null);
    const [filterClass, setFilterClass] = useState('All');
    const [filterSection, setFilterSection] = useState('All');
    const [feeHeads, setFeeHeads] = useState([]);

    const hasPermission = (perms) => {
        if (user?.role === 'Super Admin') return true;
        const storedRoles = localStorage.getItem('customRoles');
        if (storedRoles) {
            const parsedRoles = JSON.parse(storedRoles);
            const matchedRole = parsedRoles.find(r => r.name === user?.role);
            if (matchedRole && matchedRole.permissions) {
                return perms.some(p => matchedRole.permissions.includes(p));
            }
        }
        return false;
    };

    useEffect(() => {
        const init = async () => {
            await fetchSchools();
            await fetchStudents();
        };
        init();
    }, []);

    useEffect(() => {
        if (selectedSchoolId) {
            fetchStudents();
        }
    }, [selectedSchoolId]);

    const fetchSchools = async () => {
        try {
            const response = await fetch('http://localhost:8000/schools/');
            if (response.ok) {
                const data = await response.json();
                setSchools(data);
                if (data.length > 0 && !selectedSchoolId) {
                    setSelectedSchoolId(data[0].id);
                }
            }
        } catch (error) {
            console.error("Failed to fetch schools:", error);
        }
    };

    const fetchStudents = async () => {
        try {
            const url = selectedSchoolId 
                ? `http://localhost:8000/students/?school_id=${selectedSchoolId}`
                : 'http://localhost:8000/students/';
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                const mappedData = data.map(s => ({
                    ...s,
                    admissionNo: s.admission_number,
                    rollNo: s.roll_number,
                    class: s.current_class,
                    joined: s.admission_date,
                    fatherName: s.father_name,
                    fatherPhone: s.father_phone,
                    motherName: s.mother_name,
                    motherPhone: s.mother_phone,
                    status: s.payment_status,
                    bloodGroup: s.blood_group,
                    address: s.permanent_address,
                    commAddress: s.communication_address,
                    aadhar: s.aadhar_number,
                    transport: s.transport_required ? 'Yes' : 'No',
                    medical: s.medical_conditions,
                    prevSchool: s.previous_school,
                    guardianName: s.guardian_details
                }));
                // Filter by school if necessary (handled by backend)
                setStudents(mappedData);
            }
        } catch (error) {
            console.error("Failed to fetch students:", error);
        }
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [currentStudent, setCurrentStudent] = useState({
        school_id: selectedSchoolId,
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

    const filtered = students.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             (s.admissionNo && s.admissionNo.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesClass = filterClass === 'All' || (s.class && s.class.toString() === filterClass);
        return matchesSearch && matchesClass;
    });

    const handleOpenModal = (mode, student = null) => {
        setModalMode(mode);
        if (student) {
            setCurrentStudent({
                ...student,
                school_id: selectedSchoolId // Ensure school_id is preserved
            });
        } else {
            setCurrentStudent({
                school_id: selectedSchoolId,
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
        
        if (!selectedSchoolId) {
            alert("Please ensure at least one school exists before adding students.");
            return;
        }

        const payload = {
            school_id: selectedSchoolId,
            name: currentStudent.name,
            admission_number: currentStudent.admission_number || currentStudent.admissionNo,
            roll_number: currentStudent.roll_number || currentStudent.rollNo,
            dob: currentStudent.dob,
            gender: currentStudent.gender,
            blood_group: currentStudent.blood_group || currentStudent.bloodGroup,
            photo_url: currentStudent.photo_url || currentStudent.photo,
            current_class: currentStudent.current_class || currentStudent.class,
            section: currentStudent.section,
            admission_date: currentStudent.joined || currentStudent.admission_date,
            previous_school: currentStudent.prevSchool || currentStudent.previous_school,
            father_name: currentStudent.father_name || currentStudent.fatherName,
            father_phone: currentStudent.father_phone || currentStudent.fatherPhone,
            mother_name: currentStudent.mother_name || currentStudent.motherName,
            mother_phone: currentStudent.mother_phone || currentStudent.motherPhone,
            guardian_details: currentStudent.guardian_details || currentStudent.guardianName,
            email: currentStudent.email,
            permanent_address: currentStudent.permanent_address || currentStudent.address,
            communication_address: currentStudent.commAddress || currentStudent.communication_address,
            aadhar_number: currentStudent.aadhar_number || currentStudent.aadhar,
            transport_required: currentStudent.transport_required === true || currentStudent.transport === 'Yes',
            medical_conditions: currentStudent.medical_conditions || currentStudent.medical,
            documents_url: currentStudent.documents_url, 
            joining_date: currentStudent.joined || currentStudent.joining_date || currentStudent.admission_date,
            payment_status: currentStudent.status || currentStudent.payment_status || 'Pending'
        };

        try {
            if (modalMode === 'add') {
                const response = await fetch('http://localhost:8000/students/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (response.ok) {
                    fetchStudents();
                    setIsModalOpen(false);
                } else {
                    const err = await response.json();
                    alert(`Failed to create student: ${JSON.stringify(err.detail)}`);
                }
            } else if (modalMode === 'edit') {
                const response = await fetch(`http://localhost:8000/students/${currentStudent.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (response.ok) {
                    fetchStudents();
                    setIsModalOpen(false);
                } else {
                    alert("Failed to update student.");
                }
            }
        } catch (error) {
            console.error("Error saving student:", error);
            alert("Connection error.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this student record?')) {
            try {
                const response = await fetch(`http://localhost:8000/students/${id}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    fetchStudents();
                } else {
                    alert("Failed to delete student.");
                }
            } catch (error) {
                console.error("Error deleting student:", error);
                alert("Connection error.");
            }
        }
    };

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
                    <p>Onboard and manage academic student profiles for {user?.school_info?.name || 'your school'}</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    {hasPermission(['edit_students']) && (
                        <button className="btn btn-primary" onClick={() => handleOpenModal('add')}>
                            <UserPlus size={20} />
                            <span>Add Student</span>
                        </button>
                    )}
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

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Adm No.</th>
                            <th>Student Details</th>
                            <th>Parent Details</th>
                            <th>Class/Section</th>
                            <th>Status</th>
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
                                    <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{s.admissionNo}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>
                                                {s.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p style={{ fontWeight: 600 }}>{s.name}</p>
                                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Roll: {s.rollNo} | {s.gender}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <p style={{ fontSize: '0.875rem' }}>F: {s.fatherName}</p>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>P: {s.fatherPhone}</p>
                                    </td>
                                    <td>{s.class}-{s.section}</td>
                                    <td><span className={`badge badge-${s.status?.toLowerCase() || 'pending'}`}>{s.status || 'Pending'}</span></td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            <button onClick={() => handleOpenModal('view', s)} title="View" className="btn" style={{ padding: '0.5rem', border: '1px solid var(--border)', background: 'transparent' }}>
                                                <Eye size={18} />
                                            </button>
                                            {hasPermission(['edit_students']) && (
                                                <button onClick={() => handleOpenModal('edit', s)} title="Edit" className="btn" style={{ padding: '0.5rem', border: '1px solid var(--border)', background: 'transparent' }}>
                                                <Edit3 size={18} />
                                                </button>
                                            )}
                                            {hasPermission(['delete_students']) && (
                                                <button onClick={() => handleDelete(s.id)} title="Delete" className="btn" style={{ padding: '0.5rem', border: '1px solid var(--border)', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                                                <Trash2 size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="overlay">
                    <div className="modal-card" style={{ maxWidth: '1050px', width: '95%' }}>
                        <div className="modal-header">
                            <div>
                                <h2 style={{ textTransform: 'capitalize' }}>{modalMode} Student Profile</h2>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Full Academic & Personal Enrollment Record</p>
                            </div>
                            <button className="close-btn" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
                        </div>

                        <div className="modal-content">
                            <form onSubmit={handleSave}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    
                                    {/* Top Row: Identity (Left) & Fees (Right) */}
                                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '1.5rem' }}>
                                        
                                        {/* 1. Basic Identity */}
                                        <section className="glass-card" style={{ padding: '1rem', background: 'var(--surface)' }}>
                                            <h4 className="section-title" style={{ marginBottom: '1rem' }}>Identity & Admission</h4>
                                            
                                            <div className="input-group" style={{ marginBottom: '1.25rem' }}>
                                                <label>Student Profile Photo</label>
                                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                    <div style={{ 
                                                        width: '72px', 
                                                        height: '72px', 
                                                        borderRadius: '16px', 
                                                        background: 'var(--background)', 
                                                        border: '2px dashed var(--border)', 
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        justifyContent: 'center',
                                                        overflow: 'hidden',
                                                        flexShrink: 0
                                                    }}>
                                                        {currentStudent.photo ? (
                                                            <img src={currentStudent.photo} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        ) : (
                                                            <Camera size={28} style={{ color: 'var(--text-muted)' }} />
                                                        )}
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <input 
                                                            type="text" 
                                                            disabled={modalMode==='view'} 
                                                            className="form-input" 
                                                            placeholder="Enter student photo URL (e.g. https://...)" 
                                                            value={currentStudent.photo || ''} 
                                                            onChange={e => setCurrentStudent({...currentStudent, photo: e.target.value})} 
                                                        />
                                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Paste a link to the student's portrait photo</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                                                <div className="input-group">
                                                    <label>Full Student Name*</label>
                                                    <input type="text" required disabled={modalMode==='view'} className="form-input" value={currentStudent.name} onChange={e => setCurrentStudent({...currentStudent, name: e.target.value})} />
                                                </div>
                                                <div className="input-group">
                                                    <label>DOB*</label>
                                                    <input type="date" required disabled={modalMode==='view'} className="form-input" value={currentStudent.dob} onChange={e => setCurrentStudent({...currentStudent, dob: e.target.value})} />
                                                </div>
                                                <div className="input-group">
                                                    <label>Gender*</label>
                                                    <select required disabled={modalMode==='view'} className="form-input" value={currentStudent.gender} onChange={e => setCurrentStudent({...currentStudent, gender: e.target.value})}>
                                                        <option value="Male">Male</option>
                                                        <option value="Female">Female</option>
                                                        <option value="Other">Other</option>
                                                    </select>
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
                                                <div className="input-group">
                                                    <label>Admission Date*</label>
                                                    <input type="date" required disabled={modalMode==='view'} className="form-input" value={currentStudent.joined} onChange={e => setCurrentStudent({...currentStudent, joined: e.target.value})} />
                                                </div>
                                                <div className="input-group">
                                                    <label>Previous School</label>
                                                    <input type="text" disabled={modalMode==='view'} className="form-input" value={currentStudent.prevSchool || ''} onChange={e => setCurrentStudent({...currentStudent, prevSchool: e.target.value})} />
                                                </div>
                                            </div>
                                        </section>

                                    {/* Right Column: Fees & Quick Stats */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                         <section className="glass-card" style={{ padding: '1rem', border: '1px solid var(--primary)', background: 'rgba(99, 102, 241, 0.02)' }}>
                                            <h4 className="section-title" style={{ color: 'var(--primary)', marginBottom: '0.75rem' }}>Annual Fee Structure</h4>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
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

                                        <section className="glass-card" style={{ padding: '1rem' }}>
                                            <h4 className="section-title" style={{ marginBottom: '0.75rem' }}>Record Audits</h4>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Status: <strong>{currentStudent.payment_status}</strong></p>
                                                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Total Paid: ₹{currentStudent.paid?.toLocaleString() || '0'}</p>
                                                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Admission: {currentStudent.admission_date}</p>
                                            </div>
                                        </section>
                                    </div>
                                    </div>

                                    {/* Bottom Row: Parental + Contact Layout */}
                                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1.5rem' }}>
                                            {/* 2. Parent Details */}
                                            <section className="glass-card" style={{ padding: '1rem' }}>
                                                <h4 className="section-title" style={{ marginBottom: '0.75rem' }}>Parental Information</h4>
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
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
                                                <div className="input-group">
                                                    <label>Guardian / Other Details</label>
                                                    <input type="text" disabled={modalMode==='view'} className="form-input" value={currentStudent.guardian_details || ''} onChange={e => setCurrentStudent({...currentStudent, guardian_details: e.target.value})} />
                                                </div>
                                            </div>
                                        </section>

                                            {/* 3. Contact & Address */}
                                            <section className="glass-card" style={{ padding: '1rem', background: 'var(--surface)' }}>
                                                <h4 className="section-title" style={{ marginBottom: '0.75rem' }}>Contact & Medical</h4>
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                                                <div className="input-group">
                                                    <label>Aadhar Number</label>
                                                    <input type="text" disabled={modalMode==='view'} className="form-input" value={currentStudent.aadhar_number || ''} onChange={e => setCurrentStudent({...currentStudent, aadhar_number: e.target.value})} />
                                                </div>
                                                <div className="input-group">
                                                    <label>Email ID*</label>
                                                    <input type="email" required disabled={modalMode==='view'} className="form-input" value={currentStudent.email} onChange={e => setCurrentStudent({...currentStudent, email: e.target.value})} />
                                                </div>
                                                <div className="input-group">
                                                    <label>Permanent Address*</label>
                                                    <textarea required rows={2} disabled={modalMode==='view'} className="form-input" value={currentStudent.permanent_address} onChange={e => setCurrentStudent({...currentStudent, permanent_address: e.target.value})} />
                                                </div>
                                                <div className="input-group">
                                                    <label>Communication Address</label>
                                                    <textarea rows={2} disabled={modalMode==='view'} className="form-input" value={currentStudent.commAddress || ''} onChange={e => setCurrentStudent({...currentStudent, commAddress: e.target.value})} placeholder="Leave blank if same as permanent" />
                                                </div>
                                                <div className="input-group">
                                                    <label>Blood Group*</label>
                                                    <select required disabled={modalMode==='view'} className="form-input" value={currentStudent.blood_group} onChange={e => setCurrentStudent({...currentStudent, blood_group: e.target.value})}>
                                                        <option value="">Select</option>
                                                        {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                                                    </select>
                                                </div>
                                                <div className="input-group">
                                                    <label>Medical Conditions / Allergies</label>
                                                    <input type="text" disabled={modalMode==='view'} className="form-input" placeholder="e.g. Asthma, Penicillin allergy" value={currentStudent.medical_conditions || ''} onChange={e => setCurrentStudent({...currentStudent, medical_conditions: e.target.value})} />
                                                </div>
                                                </div>
                                            </section>
                                        </div>

                                        {/* Bottom Row 2: Secondary Info */}
                                        <section className="glass-card" style={{ padding: '1rem', background: 'var(--surface)' }}>
                                            <h4 className="section-title" style={{ marginBottom: '0.75rem' }}>Transport & Documents</h4>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                                                <div className="input-group">
                                                    <label>Transport Required?</label>
                                                    <select disabled={modalMode==='view'} className="form-input" value={currentStudent.transport_required} onChange={e => setCurrentStudent({...currentStudent, transport_required: e.target.value === 'true'})}>
                                                        <option value="false">No (Day Scholar)</option>
                                                        <option value="true">Yes (School Bus)</option>
                                                    </select>
                                                </div>
                                                <div className="input-group">
                                                    <label>Documents (TC, Birth Certificate) - URL</label>
                                                    <input type="text" disabled={modalMode==='view'} className="form-input" placeholder="e.g. drive link or filename" value={currentStudent.documents_url || ''} onChange={e => setCurrentStudent({...currentStudent, documents_url: e.target.value})} />
                                                </div>
                                            </div>
                                        </section>
                                </div>

                                {modalMode !== 'view' && (
                                    <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
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
