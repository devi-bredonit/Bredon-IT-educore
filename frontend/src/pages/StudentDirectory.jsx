import React, { useState } from 'react';
import { Search, Download, UserPlus, Eye, Edit3, Trash2, X, Check, Camera, FileText, CreditCard } from 'lucide-react';

const StudentDirectory = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [students, setStudents] = useState([
        { 
            id: 1, 
            name: 'Aryan Verma', 
            admissionNo: 'ADM-1001', 
            rollNo: '10',
            class: '10', 
            section: 'A', 
            status: 'Paid', 
            joined: '2023-06-15', 
            fatherName: 'Rajesh Verma', 
            fatherPhone: '9876543210', 
            motherName: 'Sunita Verma',
            motherPhone: '9876543211',
            gender: 'Male', 
            dob: '2010-05-12',
            bloodGroup: 'O+',
            email: 'aryan@example.com',
            address: '123 Street, Delhi',
            transport: 'Yes',
            aadhar: '1234-5678-9012',
            feeStructure: { tuition: 15000, transport: 5000, exam: 2000, misc: 1000 }
        },
        { 
            id: 2, 
            name: 'Isika Reddy', 
            admissionNo: 'ADM-1002', 
            rollNo: '15',
            class: '9', 
            section: 'B', 
            status: 'Partial', 
            joined: '2023-08-01', 
            fatherName: 'Suresh Reddy', 
            fatherPhone: '9876543211', 
            motherName: 'Lata Reddy',
            motherPhone: '9876543212',
            gender: 'Female', 
            dob: '2011-03-22',
            bloodGroup: 'A+',
            email: 'isika@example.com',
            address: '45 Road, Mumbai',
            transport: 'No',
            aadhar: '9876-5432-1098',
            feeStructure: { tuition: 15000, transport: 0, exam: 2000, misc: 1000 }
        },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [currentStudent, setCurrentStudent] = useState({
        name: '', admissionNo: '', rollNo: '', dob: '', gender: 'Male', bloodGroup: '',
        photo: '', class: '', section: '', joined: new Date().toISOString().split('T')[0],
        prevSchool: '', fatherName: '', fatherPhone: '', motherName: '', motherPhone: '',
        guardianName: '', guardianPhone: '', email: '', address: '', commAddress: '', 
        aadhar: '', transport: 'No', medical: '', status: 'Pending',
        documents: { tc: false, birthCert: false },
        feeStructure: { tuition: 20000, transport: 0, exam: 2000, misc: 1000 }
    });
    const [filterClass, setFilterClass] = useState('');

    const filtered = students.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             s.admissionNo.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesClass = filterClass === '' || s.class.toString() === filterClass;
        return matchesSearch && matchesClass;
    });

    const handleOpenModal = (mode, student = null) => {
        setModalMode(mode);
        if (student) {
            setCurrentStudent({
                ...student,
                feeStructure: student.feeStructure || { tuition: 20000, transport: 0, exam: 2000, misc: 1000 },
                documents: student.documents || { tc: false, birthCert: false }
            });
        } else {
            setCurrentStudent({
                name: '', admissionNo: '', rollNo: '', dob: '', gender: 'Male', bloodGroup: '',
                photo: '', class: '', section: '', joined: new Date().toISOString().split('T')[0],
                prevSchool: '', fatherName: '', fatherPhone: '', motherName: '', motherPhone: '',
                guardianName: '', guardianPhone: '', email: '', address: '', commAddress: '', 
                aadhar: '', transport: 'No', medical: '', status: 'Pending',
                documents: { tc: false, birthCert: false },
                feeStructure: { tuition: 20000, transport: 0, exam: 2000, misc: 1000 }
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (modalMode === 'add') {
            setStudents([...students, { ...currentStudent, id: Date.now() }]);
        } else if (modalMode === 'edit') {
            setStudents(students.map(s => s.id === currentStudent.id ? currentStudent : s));
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this student record?')) {
            setStudents(students.filter(s => s.id !== id));
        }
    };

    const handleExportData = () => {
        const headers = ['Adm No', 'Name', 'Class', 'Father Name', 'Phone', 'Email', 'Transport'];
        const csvContent = [
            headers.join(','),
            ...students.map(s => `${s.admissionNo},${s.name},${s.class},${s.fatherName},${s.fatherPhone},${s.email},${s.transport}`)
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `edu_students_full_${new Date().toISOString().split('T')[0]}.csv`);
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
                    <p>Onboard and manage detailed academic student profiles</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-primary" onClick={() => handleOpenModal('add')}>
                        <UserPlus size={20} />
                        <span>Add Student</span>
                    </button>
                    <button className="btn" onClick={handleExportData} style={{ background: 'var(--surface-hover)', border: '1px solid var(--border)' }}>
                        <Download size={20} />
                        <span>Export Full Data</span>
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
                    <select 
                        className="form-input" 
                        style={{ width: 'auto' }}
                        value={filterClass}
                        onChange={(e) => setFilterClass(e.target.value)}
                    >
                        <option value="">All Classes</option>
                        {[...Array(12)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>Class {i + 1}</option>
                        ))}
                    </select>
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
                        {filtered.map((s) => (
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
                                        <button onClick={() => handleOpenModal('edit', s)} title="Edit" className="btn" style={{ padding: '0.5rem', border: '1px solid var(--border)', background: 'transparent' }}>
                                            <Edit3 size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(s.id)} title="Delete" className="btn" style={{ padding: '0.5rem', border: '1px solid var(--border)', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="overlay">
                    <div className="modal-card" style={{ maxWidth: '900px' }}>
                        <div className="modal-header">
                            <div>
                                <h2 style={{ textTransform: 'capitalize' }}>{modalMode} Student</h2>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Complete Academic Enrollment Record</p>
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                <button className="btn" style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid var(--border)' }} onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button className="close-btn" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
                            </div>
                        </div>

                        <div className="modal-content animate-fade-in">
                            <form onSubmit={handleSave}>
                                {/* Top Banner / Photo */}
                                <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '2.5rem', marginBottom: '2.5rem', background: 'var(--background)', padding: '2rem', borderRadius: '16px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                                        <div style={{ width: '150px', height: '150px', borderRadius: '20px', border: '2px dashed var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', cursor: 'pointer', background: 'white' }}>
                                            <Camera size={40} strokeWidth={1} />
                                            <span style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>Upload Photo</span>
                                        </div>
                                    </div>
                                    <div className="input-grid">
                                        <div className="input-group">
                                            <label>Full Name*</label>
                                            <input type="text" required disabled={modalMode==='view'} className="form-input" value={currentStudent.name} onChange={e => setCurrentStudent({...currentStudent, name: e.target.value})} />
                                        </div>
                                        <div className="input-group">
                                            <label>Admission No*</label>
                                            <input type="text" required disabled={modalMode==='view'} className="form-input" value={currentStudent.admissionNo} onChange={e => setCurrentStudent({...currentStudent, admissionNo: e.target.value})} />
                                        </div>
                                        <div className="input-group">
                                            <label>Roll Number</label>
                                            <input type="text" disabled={modalMode==='view'} className="form-input" value={currentStudent.rollNo} onChange={e => setCurrentStudent({...currentStudent, rollNo: e.target.value})} />
                                        </div>
                                        <div className="input-group">
                                            <label>Admission Date</label>
                                            <input type="date" disabled={modalMode==='view'} className="form-input" value={currentStudent.joined} onChange={e => setCurrentStudent({...currentStudent, joined: e.target.value})} />
                                        </div>
                                    </div>
                                </div>

                                {/* Form Sections Grid */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                        {/* Basic Details */}
                                        <section className="glass-card" style={{ padding: '1.5rem', background: 'var(--surface)' }}>
                                            <h4 style={{ color: 'var(--primary)', marginBottom: '1.25rem', fontSize: '0.875rem', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Basic Details</h4>
                                            <div className="input-grid">
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
                                                    <label>Blood Group*</label>
                                                    <input type="text" required disabled={modalMode==='view'} className="form-input" placeholder="e.g. O+" value={currentStudent.bloodGroup} onChange={e => setCurrentStudent({...currentStudent, bloodGroup: e.target.value})} />
                                                </div>
                                                <div className="input-group">
                                                    <label>Aadhar No</label>
                                                    <input type="text" disabled={modalMode==='view'} className="form-input" placeholder="1234-5678-..." value={currentStudent.aadhar} onChange={e => setCurrentStudent({...currentStudent, aadhar: e.target.value})} />
                                                </div>
                                            </div>
                                        </section>

                                        {/* Academic Details */}
                                        <section className="glass-card" style={{ padding: '1.5rem', background: 'var(--surface)' }}>
                                            <h4 style={{ color: 'var(--primary)', marginBottom: '1.25rem', fontSize: '0.875rem', textTransform: 'uppercase' }}>Academic History</h4>
                                            <div className="input-grid">
                                                <div className="input-group">
                                                    <label>Class*</label>
                                                    <input type="text" required disabled={modalMode==='view'} className="form-input" value={currentStudent.class} onChange={e => setCurrentStudent({...currentStudent, class: e.target.value})} />
                                                </div>
                                                <div className="input-group">
                                                    <label>Section*</label>
                                                    <input type="text" required disabled={modalMode==='view'} className="form-input" value={currentStudent.section} onChange={e => setCurrentStudent({...currentStudent, section: e.target.value})} />
                                                </div>
                                                <div className="input-group" style={{ gridColumn: 'span 2' }}>
                                                    <label>Previous School</label>
                                                    <input type="text" disabled={modalMode==='view'} className="form-input" value={currentStudent.prevSchool} onChange={e => setCurrentStudent({...currentStudent, prevSchool: e.target.value})} />
                                                </div>
                                            </div>
                                        </section>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                        {/* Parents & Guardians */}
                                        <section className="glass-card" style={{ padding: '1.5rem', background: 'var(--surface)' }}>
                                            <h4 style={{ color: 'var(--primary)', marginBottom: '1.25rem', fontSize: '0.875rem', textTransform: 'uppercase' }}>Parents & Guardians</h4>
                                            <div className="input-grid">
                                                <div className="input-group">
                                                    <label>Father's Name*</label>
                                                    <input type="text" required disabled={modalMode==='view'} className="form-input" value={currentStudent.fatherName} onChange={e => setCurrentStudent({...currentStudent, fatherName: e.target.value})} />
                                                </div>
                                                <div className="input-group">
                                                    <label>Father's Phone*</label>
                                                    <input type="text" required disabled={modalMode==='view'} className="form-input" value={currentStudent.fatherPhone} onChange={e => setCurrentStudent({...currentStudent, fatherPhone: e.target.value})} />
                                                </div>
                                                <div className="input-group">
                                                    <label>Mother's Name*</label>
                                                    <input type="text" required disabled={modalMode==='view'} className="form-input" value={currentStudent.motherName} onChange={e => setCurrentStudent({...currentStudent, motherName: e.target.value})} />
                                                </div>
                                                <div className="input-group">
                                                    <label>Mother's Phone*</label>
                                                    <input type="text" required disabled={modalMode==='view'} className="form-input" value={currentStudent.motherPhone} onChange={e => setCurrentStudent({...currentStudent, motherPhone: e.target.value})} />
                                                </div>
                                                <div className="input-group">
                                                    <label>Guardian Name</label>
                                                    <input type="text" disabled={modalMode==='view'} className="form-input" value={currentStudent.guardianName} onChange={e => setCurrentStudent({...currentStudent, guardianName: e.target.value})} />
                                                </div>
                                                <div className="input-group">
                                                    <label>Guardian Phone</label>
                                                    <input type="text" disabled={modalMode==='view'} className="form-input" value={currentStudent.guardianPhone} onChange={e => setCurrentStudent({...currentStudent, guardianPhone: e.target.value})} />
                                                </div>
                                            </div>
                                        </section>
                                    </div>
                                </div>

                                {/* Address Section */}
                                <section className="glass-card" style={{ padding: '1.5rem', background: 'var(--background)', marginTop: '2rem' }}>
                                    <h4 style={{ color: 'var(--primary)', marginBottom: '1.25rem', fontSize: '0.875rem', textTransform: 'uppercase' }}>Contact & Address Details</h4>
                                    <div className="input-grid">
                                        <div className="input-group" style={{ gridColumn: 'span 2' }}>
                                            <label>Permanent Address*</label>
                                            <textarea required rows={2} disabled={modalMode==='view'} className="form-input" value={currentStudent.address} onChange={e => setCurrentStudent({...currentStudent, address: e.target.value})} />
                                        </div>
                                        <div className="input-group" style={{ gridColumn: 'span 2' }}>
                                            <label>Communication Address (Leave blank if same)</label>
                                            <textarea rows={2} disabled={modalMode==='view'} className="form-input" value={currentStudent.commAddress} onChange={e => setCurrentStudent({...currentStudent, commAddress: e.target.value})} />
                                        </div>
                                        <div className="input-group">
                                            <label>Email ID*</label>
                                            <input type="email" required disabled={modalMode==='view'} className="form-input" value={currentStudent.email} onChange={e => setCurrentStudent({...currentStudent, email: e.target.value})} />
                                        </div>
                                        <div className="input-group">
                                            <label>Transport Required?</label>
                                            <select disabled={modalMode==='view'} className="form-input" value={currentStudent.transport} onChange={e => setCurrentStudent({...currentStudent, transport: e.target.value})}>
                                                <option value="Yes">Yes</option>
                                                <option value="No">No</option>
                                            </select>
                                        </div>
                                        <div className="input-group" style={{ gridColumn: 'span 2' }}>
                                            <label>Medical Conditions</label>
                                            <input type="text" disabled={modalMode==='view'} className="form-input" placeholder="e.g. Asthma, Allergies" value={currentStudent.medical} onChange={e => setCurrentStudent({...currentStudent, medical: e.target.value})} />
                                        </div>
                                    </div>
                                </section>

                                {/* Documents & Fees Panel */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
                                    <section className="glass-card" style={{ padding: '1.5rem' }}>
                                        <h4 style={{ color: 'var(--primary)', marginBottom: '1.25rem', fontSize: '0.875rem', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <FileText size={18} />
                                            Documents Collected
                                        </h4>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
                                                <input type="checkbox" disabled={modalMode==='view'} checked={currentStudent.documents.tc} onChange={e => setCurrentStudent({...currentStudent, documents: {...currentStudent.documents, tc: e.target.checked}})} />
                                                <span>Transfer Certificate (TC)</span>
                                            </label>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
                                                <input type="checkbox" disabled={modalMode==='view'} checked={currentStudent.documents.birthCert} onChange={e => setCurrentStudent({...currentStudent, documents: {...currentStudent.documents, birthCert: e.target.checked}})} />
                                                <span>Birth Certificate</span>
                                            </label>
                                        </div>
                                    </section>

                                    <section className="glass-card" style={{ padding: '1.5rem', background: 'var(--surface-hover)' }}>
                                        <h4 style={{ color: 'var(--primary)', marginBottom: '1.25rem', fontSize: '0.875rem', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <CreditCard size={18} />
                                            Student Fee Structure (Annual)
                                        </h4>
                                        <div className="input-grid">
                                            <div className="input-group">
                                                <label>Tuition Fee (₹)</label>
                                                <input type="number" disabled={modalMode==='view'} className="form-input" value={currentStudent.feeStructure.tuition} onChange={e => setCurrentStudent({...currentStudent, feeStructure: {...currentStudent.feeStructure, tuition: e.target.value}})} />
                                            </div>
                                            <div className="input-group">
                                                <label>Transport (₹)</label>
                                                <input type="number" disabled={modalMode==='view'} className="form-input" value={currentStudent.feeStructure.transport} onChange={e => setCurrentStudent({...currentStudent, feeStructure: {...currentStudent.feeStructure, transport: e.target.value}})} />
                                            </div>
                                            <div className="input-group">
                                                <label>Exam Fee (₹)</label>
                                                <input type="number" disabled={modalMode==='view'} className="form-input" value={currentStudent.feeStructure.exam} onChange={e => setCurrentStudent({...currentStudent, feeStructure: {...currentStudent.feeStructure, exam: e.target.value}})} />
                                            </div>
                                            <div className="input-group">
                                                <label>Misc Fee (₹)</label>
                                                <input type="number" disabled={modalMode==='view'} className="form-input" value={currentStudent.feeStructure.misc} onChange={e => setCurrentStudent({...currentStudent, feeStructure: {...currentStudent.feeStructure, misc: e.target.value}})} />
                                            </div>
                                        </div>
                                        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                                            <span>Total Annual Fee</span>
                                            <span style={{ color: 'var(--primary)' }}>₹{(Object.values(currentStudent.feeStructure).reduce((a, b) => parseFloat(a) + parseFloat(b || 0), 0)).toLocaleString()}</span>
                                        </div>
                                    </section>
                                </div>

                                {modalMode !== 'view' && (
                                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1.25rem', fontSize: '1rem', marginTop: '3rem', borderRadius: '14px', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)' }}>
                                        {modalMode === 'add' ? 'Complete Student Enrollment' : 'Update Student Record'}
                                    </button>
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
