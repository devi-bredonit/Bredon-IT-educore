import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Download, UserPlus, Eye, Edit3, Trash2, X, Check, Camera, FileText, CreditCard, Filter, Clock, AlertCircle, Loader2 } from 'lucide-react';

const StudentDirectory = ({ user }) => {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState('directory'); // 'directory' or 'audits'
    const [auditLogs, setAuditLogs] = useState([]);
    const isAdminUser = user?.role === 'Administration User';
    const [searchTerm, setSearchTerm] = useState('');
    const [students, setStudents] = useState([]);
    const [schools, setSchools] = useState([]);
    const [selectedSchoolId, setSelectedSchoolId] = useState(user?.school_id || null);
    const [filterClass, setFilterClass] = useState('All');
    const [filterSection, setFilterSection] = useState('All');
    const [feeHeads, setFeeHeads] = useState([]);
    const [classFeeStructures, setClassFeeStructures] = useState([]);
    const [activitiesList, setActivitiesList] = useState([]);
    const [showToast, setShowToast] = useState(null);
    const [admissionExists, setAdmissionExists] = useState(false);
    const [isCheckingAdmission, setIsCheckingAdmission] = useState(false);

    const hasPermission = (perms) => {
        if (user?.role === 'Super Admin' || user?.role === 'Administrator') return true;
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
            if (viewMode === 'audits') {
                await fetchAudits();
            }
        };
        init();
    }, [viewMode]);

    useEffect(() => {
        if (selectedSchoolId) {
            fetchStudents();
            fetchFeeHeads();
            fetchClassFeeStructures();
            fetchActivities();
            if (viewMode === 'audits') fetchAudits();
        }
    }, [selectedSchoolId, viewMode]);

    const fetchFeeHeads = async () => {
        try {
            const resp = await fetch(`http://localhost:8000/fee-configs/heads?school_id=${selectedSchoolId}`);
            if (resp.ok) {
                const data = await resp.json();
                setFeeHeads(data);
            }
        } catch (error) {
            console.error("Failed to fetch fee heads:", error);
        }
    };

    const fetchClassFeeStructures = async () => {
        try {
            const resp = await fetch(`http://localhost:8000/class-fees/?school_id=${selectedSchoolId}`);
            if (resp.ok) {
                const data = await resp.json();
                setClassFeeStructures(data);
            }
        } catch (error) {
            console.error("Failed to fetch class fee structures:", error);
        }
    };
    
    const fetchActivities = async () => {
        try {
            const resp = await fetch(`http://localhost:8000/activities/?school_id=${selectedSchoolId}`);
            if (resp.ok) {
                setActivitiesList(await resp.json());
            }
        } catch (err) {
            console.error("Failed to fetch activities:", err);
        }
    };

    const fetchAudits = async () => {
        try {
            const url = `http://localhost:8000/fees/audits?school_id=${selectedSchoolId}`;
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                setAuditLogs(data);
            }
        } catch (error) {
            console.error("Failed to fetch audits:", error);
        }
    };

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
            const url = (selectedSchoolId !== null && selectedSchoolId !== undefined)
                ? `http://localhost:8000/students/?school_id=${selectedSchoolId}&role=${user?.role}`
                : `http://localhost:8000/students/?role=${user?.role}`;
            
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
                setStudents(mappedData);
            } else {
                const errData = await response.json();
                console.error("Server error:", errData);
                setShowToast(`Error: ${errData.detail || 'Failed to fetch students'}`);
                setTimeout(() => setShowToast(null), 5000);
            }
        } catch (error) {
            console.error("Failed to fetch students:", error);
            setShowToast("Network error: Could not reach student server.");
            setTimeout(() => setShowToast(null), 5000);
        }
    };

    const [isIdCreated, setIsIdCreated] = useState(false);
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
        fee_allocations: [],
        extracurricular_activities: []
    });

    const filtered = students.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (s.admissionNo && s.admissionNo.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesClass = filterClass === 'All' || (s.class && s.class.toString() === filterClass);
        const matchesSection = filterSection === 'All' || (s.section && s.section === filterSection);
        return matchesSearch && matchesClass && matchesSection;
    });

    const checkAdmissionUnique = async (admNo) => {
        if (!admNo || modalMode !== 'add') return;
        setIsCheckingAdmission(true);
        try {
            const resp = await fetch(`http://localhost:8000/students/check-admission?admission_number=${admNo}&school_id=${selectedSchoolId}`);
            if (resp.ok) {
                const data = await resp.json();
                setAdmissionExists(data.exists);
            }
        } catch (e) {
            console.error("Uniqueness check error:", e);
        } finally {
            setIsCheckingAdmission(false);
        }
    };

    const handleOpenModal = (mode, student = null) => {
        if (isAdminUser && (mode === 'add' || mode === 'edit' || mode === 'delete')) return;
        setModalMode(mode);
        setAdmissionExists(false); // Reset uniqueness check state
        if (student) {
            setCurrentStudent({
                ...student,
                school_id: selectedSchoolId // Ensure school_id is preserved
            });
        } else {
            let initialAllocations = [];
            const classFees = classFeeStructures.filter(c => c.class_name == "1");
            if (classFees.length > 0) {
                initialAllocations = classFees.map(cf => ({
                    fee_head_id: cf.fee_head_id,
                    amount: cf.amount
                }));
            }
            setCurrentStudent({
                school_id: selectedSchoolId,
                name: '', admission_number: '', roll_number: '', dob: '', gender: 'Male', blood_group: '',
                photo_url: '', current_class: '1', section: 'A', admission_date: new Date().toISOString().split('T')[0],
                joining_date: new Date().toISOString().split('T')[0],
                previous_school: '', father_name: '', father_phone: '', mother_name: '', mother_phone: '',
                guardian_details: '', email: '', permanent_address: '', communication_address: '',
                aadhar_number: '', transport_required: false, medical_conditions: '', payment_status: 'Pending',
                documents_url: '',
                fee_allocations: initialAllocations,
                extracurricular_activities: []
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
            payment_status: currentStudent.status || currentStudent.payment_status || 'Pending',
            fee_allocations: currentStudent.fee_allocations || [],
            extracurricular_activities: currentStudent.extracurricular_activities || []
        };

        try {
            if (modalMode === 'add') {
                const response = await fetch('http://localhost:8000/students/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (response.ok) {
                    setShowToast("Student profile created successfully!");
                    fetchStudents();
                    setIsModalOpen(false);
                    setTimeout(() => setShowToast(null), 3000);
                } else {
                    const err = await response.json();
                    setShowToast(`Error: ${err.detail || 'Failed to create'}`);
                    setTimeout(() => setShowToast(null), 5000);
                }
            } else if (modalMode === 'edit') {
                const response = await fetch(`http://localhost:8000/students/${currentStudent.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (response.ok) {
                    setShowToast("Student record updated!");
                    fetchStudents();
                    setIsModalOpen(false);
                    setTimeout(() => setShowToast(null), 3000);
                } else {
                    setShowToast("Failed to update student record.");
                    setTimeout(() => setShowToast(null), 5000);
                }
            }
        } catch (error) {
            console.error("Error saving student:", error);
            setShowToast("Network connection error.");
            setTimeout(() => setShowToast(null), 5000);
        }
    };

    const handleDelete = async (id) => {
        if (isAdminUser) return;
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
        document.body.removeChild(link);
    };

    const handleImportCSV = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`http://localhost:8000/students/import?school_id=${selectedSchoolId}`, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                setShowToast("Bulk import successful!");
                fetchStudents();
            } else {
                const err = await response.json();
                setShowToast(`Import failed: ${err.detail || 'check file format'}`);
            }
        } catch (error) {
            console.error("Import error:", error);
            setShowToast("Network error during import.");
        } finally {
            event.target.value = '';
        }
    };

    return (
        <div className="animate-fade-in">
            <header className="page-header">
                <div className="title-group">
                    <h1>Student Directory</h1>
                    <p>Onboard and manage academic student profiles for {user?.school_info?.name || 'your school'}</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    {!isAdminUser && hasPermission(['edit_students']) && (
                        <>
                            <input
                                type="file"
                                id="csvImport"
                                accept=".csv"
                                style={{ display: 'none' }}
                                onChange={handleImportCSV}
                            />
                            <button className="btn" onClick={() => document.getElementById('csvImport').click()} style={{ background: 'var(--surface-hover)', border: '1px solid var(--border)' }}>
                                <FileText size={20} />
                                <span>Import CSV</span>
                            </button>
                            <button className="btn btn-primary" onClick={() => handleOpenModal('add')}>
                                <UserPlus size={20} />
                                <span>New Admission</span>
                            </button>
                        </>
                    )}
                    {!isAdminUser && (
                        <button className="btn" onClick={handleExportData} style={{ background: 'var(--surface-hover)', border: '1px solid var(--border)' }}>
                            <Download size={20} />
                            <span>Export CSV</span>
                        </button>
                    )}
                </div>
            </header>

            {/* View Tabs */}
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                <button
                    onClick={() => setViewMode('directory')}
                    style={{
                        padding: '0.75rem 1rem',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: viewMode === 'directory' ? '2px solid var(--primary)' : '2px solid transparent',
                        color: viewMode === 'directory' ? 'var(--primary)' : 'var(--text-muted)',
                        fontWeight: 600,
                        cursor: 'pointer'
                    }}
                >
                    Student Directory
                </button>
                <button
                    onClick={() => setViewMode('audits')}
                    style={{
                        padding: '0.75rem 1rem',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: viewMode === 'audits' ? '2px solid var(--primary)' : '2px solid transparent',
                        color: viewMode === 'audits' ? 'var(--primary)' : 'var(--text-muted)',
                        fontWeight: 600,
                        cursor: 'pointer'
                    }}
                >
                    Audit Action history
                </button>
            </div>

            {viewMode === 'directory' ? (
                <>
                    <div className="glass-card" style={{ padding: '0', marginBottom: '2rem', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
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
                        {/* Class-wise Horizontal Tabs */}
                        <div style={{ display: 'flex', overflowX: 'auto', padding: '0 1rem', gap: '0.5rem', scrollbarWidth: 'none', borderBottom: '1px solid var(--border)' }}>
                            <button
                                onClick={() => setFilterClass('All')}
                                style={{
                                    padding: '1rem 1.5rem',
                                    background: 'transparent',
                                    border: 'none',
                                    borderBottom: filterClass === 'All' ? '2px solid var(--primary)' : '2px solid transparent',
                                    color: filterClass === 'All' ? 'var(--primary)' : 'var(--text-muted)',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                All Classes
                            </button>
                            {[...Array(12)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setFilterClass((i + 1).toString())}
                                    style={{
                                        padding: '1rem 1.5rem',
                                        background: 'transparent',
                                        border: 'none',
                                        borderBottom: filterClass === (i + 1).toString() ? '2px solid var(--primary)' : '2px solid transparent',
                                        color: filterClass === (i + 1).toString() ? 'var(--primary)' : 'var(--text-muted)',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    Class {i + 1}
                                </button>
                            ))}
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
                                    {!isAdminUser && <th>Status</th>}
                                    {!isAdminUser && <th style={{ textAlign: 'right' }}>Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={isAdminUser ? "4" : "6"} style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                                            No students found in this school directory.
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((s) => (
                                        <tr
                                            key={s.id}
                                            onClick={() => handleOpenModal('view', s)}
                                            style={{ cursor: 'pointer', transition: 'background 0.2s' }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-hover)'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                        >
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
                                            {!isAdminUser && (
                                                <td><span className={`badge badge-${s.status?.toLowerCase() || 'pending'}`}>{s.status || 'Pending'}</span></td>
                                            )}
                                            {!isAdminUser && (
                                                <td>
                                                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                        <button onClick={(e) => { e.stopPropagation(); handleOpenModal('view', s); }} title="View" className="btn" style={{ padding: '0.5rem', border: '1px solid var(--border)', background: 'transparent' }}>
                                                            <Eye size={18} />
                                                        </button>
                                                        {hasPermission(['edit_students']) && (
                                                            <button onClick={(e) => { e.stopPropagation(); handleOpenModal('edit', s); }} title="Edit" className="btn" style={{ padding: '0.5rem', border: '1px solid var(--border)', background: 'transparent' }}>
                                                                <Edit3 size={18} />
                                                            </button>
                                                        )}
                                                        {hasPermission(['delete_students']) && (
                                                            <button onClick={(e) => { e.stopPropagation(); handleDelete(s.id); }} title="Delete" className="btn" style={{ padding: '0.5rem', border: '1px solid var(--border)', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                                                                <Trash2 size={18} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                <div className="table-container">
                    <div className="glass-card" style={{ padding: '1.5rem', background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.1)', marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ color: 'var(--primary)' }}><Clock size={20} /></div>
                            Complete Activity Audit Trail
                        </h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Timestamp</th>
                                    <th>Action Performed</th>
                                    <th>Detailed Activity Log</th>
                                </tr>
                            </thead>
                            <tbody>
                                {auditLogs.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No audit activities recorded for this school yet.</td>
                                    </tr>
                                ) : (
                                    auditLogs.map(log => (
                                        <tr key={log.id}>
                                            <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{new Date(log.timestamp).toLocaleString()}</td>
                                            <td><span className="badge" style={{ background: 'var(--surface-hover)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>{log.action}</span></td>
                                            <td style={{ fontSize: '0.875rem', fontWeight: 500 }}>{log.details}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {isModalOpen && (
                <div className="overlay">
                    <div className="modal-card" style={{ maxWidth: '1050px', width: '95%' }}>
                        <div className="modal-header">
                            <div>
                                <h2 style={{ textTransform: 'capitalize' }}>{modalMode} Student Profile</h2>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Full Academic & Personal Enrollment Record</p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                {modalMode === 'view' && !isAdminUser && hasPermission(['edit_students']) && (
                                    <button type="button" className="btn btn-primary" onClick={() => setModalMode('edit')} style={{ padding: '0.5rem 1rem' }}>
                                        <Edit3 size={16} style={{ marginRight: '0.4rem' }} /> Edit Profile
                                    </button>
                                )}
                                <button className="close-btn" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
                            </div>
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
                                                            disabled={modalMode === 'view'}
                                                            className="form-input"
                                                            placeholder="Enter student photo URL (e.g. https://...)"
                                                            value={currentStudent.photo || ''}
                                                            onChange={e => setCurrentStudent({ ...currentStudent, photo: e.target.value })}
                                                        />
                                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Paste a link to the student's portrait photo</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                                                <div className="input-group">
                                                    <label>Full Student Name*</label>
                                                    <input type="text" required disabled={modalMode === 'view'} className="form-input" value={currentStudent.name} onChange={e => setCurrentStudent({ ...currentStudent, name: e.target.value })} />
                                                </div>
                                                <div className="input-group">
                                                    <label>DOB*</label>
                                                    <input type="date" required disabled={modalMode === 'view'} className="form-input" value={currentStudent.dob} onChange={e => setCurrentStudent({ ...currentStudent, dob: e.target.value })} />
                                                </div>
                                                <div className="input-group">
                                                    <label>Gender*</label>
                                                    <select required disabled={modalMode === 'view'} className="form-input" value={currentStudent.gender} onChange={e => setCurrentStudent({ ...currentStudent, gender: e.target.value })}>
                                                        <option value="Male">Male</option>
                                                        <option value="Female">Female</option>
                                                        <option value="Other">Other</option>
                                                    </select>
                                                </div>
                                                <div className="input-group">
                                                    <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        Admission No*
                                                        {isCheckingAdmission && <Loader2 size={12} className="animate-spin" />}
                                                        {admissionExists && modalMode === 'add' && <span style={{ color: '#ef4444', fontSize: '0.7rem', fontWeight: 700 }}>Already exists!</span>}
                                                    </label>
                                                    <input 
                                                        type="text" 
                                                        required 
                                                        disabled={modalMode === 'view'} 
                                                        className="form-input" 
                                                        style={{ borderColor: admissionExists && modalMode === 'add' ? '#ef4444' : 'var(--border)' }}
                                                        value={currentStudent.admission_number} 
                                                        onChange={e => {
                                                            const val = e.target.value;
                                                            setCurrentStudent({ ...currentStudent, admission_number: val });
                                                        }}
                                                        onBlur={e => checkAdmissionUnique(e.target.value)}
                                                    />
                                                </div>
                                                <div className="input-group">
                                                    <label>Roll Number</label>
                                                    <input type="text" disabled={modalMode === 'view'} className="form-input" value={currentStudent.roll_number || ''} onChange={e => setCurrentStudent({ ...currentStudent, roll_number: e.target.value })} />
                                                </div>
                                                <div className="input-group">
                                                    <label>Class*</label>
                                                    <select required disabled={modalMode === 'view'} className="form-input" value={currentStudent.current_class} onChange={e => {
                                                        const newClass = e.target.value;
                                                        // Pre-populate fee structures if it's a new student
                                                        let newAllocations = currentStudent.fee_allocations || [];
                                                        if (modalMode === 'add') {
                                                            const classFees = classFeeStructures.filter(c => c.class_name === newClass);
                                                            if (classFees.length > 0) {
                                                                newAllocations = classFees.map(cf => ({
                                                                    fee_head_id: cf.fee_head_id,
                                                                    amount: cf.amount
                                                                }));
                                                            }
                                                        }
                                                        setCurrentStudent({ ...currentStudent, current_class: newClass, fee_allocations: newAllocations });
                                                    }}>
                                                        {[...Array(12)].map((_, i) => (
                                                            <option key={i + 1} value={i + 1}>Class {i + 1}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="input-group">
                                                    <label>Section*</label>
                                                    <select required disabled={modalMode === 'view'} className="form-input" value={currentStudent.section} onChange={e => setCurrentStudent({ ...currentStudent, section: e.target.value })}>
                                                        {['A', 'B', 'C', 'D'].map(sec => <option key={sec} value={sec}>{sec}</option>)}
                                                    </select>
                                                </div>
                                                <div className="input-group">
                                                    <label>Admission Date*</label>
                                                    <input type="date" required disabled={modalMode === 'view'} className="form-input" value={currentStudent.joined} onChange={e => setCurrentStudent({ ...currentStudent, joined: e.target.value })} />
                                                </div>
                                                <div className="input-group">
                                                    <label>Previous School</label>
                                                    <input type="text" disabled={modalMode === 'view'} className="form-input" value={currentStudent.prevSchool || ''} onChange={e => setCurrentStudent({ ...currentStudent, prevSchool: e.target.value })} />
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
                                                        <>
                                                            {currentStudent.fee_allocations?.length === 0 ? (
                                                            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>No fees assigned.</p>
                                                        ) : (
                                                            (currentStudent.fee_allocations || []).map((allocation, index) => {
                                                                const head = feeHeads.find(h => h.id === allocation.fee_head_id) || { name: 'Unknown Fee' };
                                                                return (
                                                                    <div key={index} className="input-group" style={{ position: 'relative' }}>
                                                                        <label style={{ fontSize: '0.75rem' }}>{head.name} (₹)</label>
                                                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                                            <input
                                                                                type="number"
                                                                                disabled={modalMode === 'view'}
                                                                                className="form-input"
                                                                                value={allocation.amount}
                                                                                onChange={e => {
                                                                                    const val = parseFloat(e.target.value) || 0;
                                                                                    const existing = [...currentStudent.fee_allocations];
                                                                                    existing[index].amount = val;
                                                                                    setCurrentStudent({ ...currentStudent, fee_allocations: existing });
                                                                                }}
                                                                            />
                                                                            {modalMode !== 'view' && (
                                                                                <button
                                                                                    type="button"
                                                                                    className="btn"
                                                                                    style={{ padding: '0 0.75rem', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}
                                                                                    onClick={() => {
                                                                                        const existing = [...currentStudent.fee_allocations];
                                                                                        existing.splice(index, 1);
                                                                                        setCurrentStudent({ ...currentStudent, fee_allocations: existing });
                                                                                    }}
                                                                                >
                                                                                    <Trash2 size={16} />
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })
                                                        )}

                                                        {modalMode !== 'view' && feeHeads.length > 0 && (
                                                            <div className="input-group" style={{ marginTop: '0.5rem' }}>
                                                                <select
                                                                    className="form-input"
                                                                    value=""
                                                                    onChange={e => {
                                                                        if (!e.target.value) return;
                                                                        const headId = parseInt(e.target.value);
                                                                        const existing = currentStudent.fee_allocations ? [...currentStudent.fee_allocations] : [];
                                                                        if (!existing.find(a => a.fee_head_id === headId)) {
                                                                            const headDetail = feeHeads.find(h => h.id === headId);
                                                                            existing.push({ fee_head_id: headId, amount: headDetail ? headDetail.amount : 0 });
                                                                            setCurrentStudent({ ...currentStudent, fee_allocations: existing });
                                                                        }
                                                                    }}
                                                                >
                                                                    <option value="">+ Add Fee Type to Student...</option>
                                                                    {feeHeads.filter(h => !(currentStudent.fee_allocations || []).find(a => a.fee_head_id === h.id)).map(h => (
                                                                        <option key={h.id} value={h.id}>{h.name}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        )}
                                                        </>
                                                    )}

                                                    <div style={{ marginTop: '1rem', padding: '1.25rem', background: 'var(--primary)', borderRadius: '12px', color: 'white', textAlign: 'center' }}>
                                                        <p style={{ fontSize: '0.75rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Annual Fee</p>
                                                        <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
                                                            ₹{((currentStudent.fee_allocations || []).reduce((acc, curr) => acc + curr.amount, 0) + (currentStudent.extracurricular_activities || []).reduce((acc, actId) => {
                                                                const act = activitiesList.find(a => a.id === actId);
                                                                return acc + (act && act.cost ? act.cost : 0);
                                                            }, 0)).toLocaleString()}
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
                                                    <input type="text" required disabled={modalMode === 'view'} className="form-input" value={currentStudent.father_name} onChange={e => setCurrentStudent({ ...currentStudent, father_name: e.target.value })} />
                                                </div>
                                                <div className="input-group">
                                                    <label>Father's Phone*</label>
                                                    <input type="text" required disabled={modalMode === 'view'} className="form-input" value={currentStudent.father_phone} onChange={e => setCurrentStudent({ ...currentStudent, father_phone: e.target.value })} />
                                                </div>
                                                <div className="input-group">
                                                    <label>Mother's Name*</label>
                                                    <input type="text" required disabled={modalMode === 'view'} className="form-input" value={currentStudent.mother_name} onChange={e => setCurrentStudent({ ...currentStudent, mother_name: e.target.value })} />
                                                </div>
                                                <div className="input-group">
                                                    <label>Mother's Phone*</label>
                                                    <input type="text" required disabled={modalMode === 'view'} className="form-input" value={currentStudent.mother_phone} onChange={e => setCurrentStudent({ ...currentStudent, mother_phone: e.target.value })} />
                                                </div>
                                                <div className="input-group">
                                                    <label>Guardian / Other Details</label>
                                                    <input type="text" disabled={modalMode === 'view'} className="form-input" value={currentStudent.guardian_details || ''} onChange={e => setCurrentStudent({ ...currentStudent, guardian_details: e.target.value })} />
                                                </div>
                                            </div>
                                        </section>

                                        {/* 3. Contact & Address */}
                                        <section className="glass-card" style={{ padding: '1rem', background: 'var(--surface)' }}>
                                            <h4 className="section-title" style={{ marginBottom: '0.75rem' }}>Contact & Medical</h4>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                                                <div className="input-group">
                                                    <label>Aadhar Number</label>
                                                    <input type="text" disabled={modalMode === 'view'} className="form-input" value={currentStudent.aadhar_number || ''} onChange={e => setCurrentStudent({ ...currentStudent, aadhar_number: e.target.value })} />
                                                </div>
                                                <div className="input-group">
                                                    <label>Email ID*</label>
                                                    <input type="email" required disabled={modalMode === 'view'} className="form-input" value={currentStudent.email} onChange={e => setCurrentStudent({ ...currentStudent, email: e.target.value })} />
                                                </div>
                                                <div className="input-group">
                                                    <label>Permanent Address*</label>
                                                    <textarea required rows={2} disabled={modalMode === 'view'} className="form-input" value={currentStudent.permanent_address} onChange={e => setCurrentStudent({ ...currentStudent, permanent_address: e.target.value })} />
                                                </div>
                                                <div className="input-group">
                                                    <label>Communication Address</label>
                                                    <textarea rows={2} disabled={modalMode === 'view'} className="form-input" value={currentStudent.commAddress || ''} onChange={e => setCurrentStudent({ ...currentStudent, commAddress: e.target.value })} placeholder="Leave blank if same as permanent" />
                                                </div>
                                                <div className="input-group">
                                                    <label>Blood Group*</label>
                                                    <select required disabled={modalMode === 'view'} className="form-input" value={currentStudent.blood_group} onChange={e => setCurrentStudent({ ...currentStudent, blood_group: e.target.value })}>
                                                        <option value="">Select</option>
                                                        {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                                                    </select>
                                                </div>
                                                <div className="input-group">
                                                    <label>Medical Conditions / Allergies</label>
                                                    <input type="text" disabled={modalMode === 'view'} className="form-input" placeholder="e.g. Asthma, Penicillin allergy" value={currentStudent.medical_conditions || ''} onChange={e => setCurrentStudent({ ...currentStudent, medical_conditions: e.target.value })} />
                                                </div>
                                            </div>
                                        </section>
                                    </div>

                                    {/* Bottom Row 2: Secondary Info */}
                                    <section className="glass-card" style={{ padding: '1rem', background: 'var(--surface)' }}>
                                        <h4 className="section-title" style={{ marginBottom: '0.75rem' }}>Programs, Transport & Documents</h4>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                                            <div className="input-group" style={{ gridColumn: 'span 2' }}>
                                                <label>Extracurricular Activities</label>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                                    {(currentStudent.extracurricular_activities || []).map((actId, idx) => {
                                                        const act = activitiesList.find(a => a.id === actId) || { name: 'Unknown' };
                                                        return (
                                                            <span key={idx} className="badge" style={{ background: 'var(--surface-hover)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                                {act.name} {act.cost > 0 ? `(₹${act.cost})` : ''}
                                                                {modalMode !== 'view' && (
                                                                    <X size={14} style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => {
                                                                        const arr = [...currentStudent.extracurricular_activities];
                                                                        arr.splice(idx, 1);
                                                                        setCurrentStudent({...currentStudent, extracurricular_activities: arr});
                                                                    }} />
                                                                )}
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                                {modalMode !== 'view' && activitiesList.length > 0 && (
                                                    <select className="form-input" value="" onChange={e => {
                                                        if(!e.target.value) return;
                                                        const aId = parseInt(e.target.value);
                                                        const arr = currentStudent.extracurricular_activities ? [...currentStudent.extracurricular_activities] : [];
                                                        if (!arr.includes(aId)) {
                                                            arr.push(aId);
                                                            setCurrentStudent({...currentStudent, extracurricular_activities: arr});
                                                        }
                                                    }}>
                                                        <option value="">+ Enroll in Activity...</option>
                                                        {activitiesList.filter(a => !(currentStudent.extracurricular_activities || []).includes(a.id)).map(a => (
                                                            <option key={a.id} value={a.id}>{a.name} {a.cost > 0 ? `(₹${a.cost})` : ''}</option>
                                                        ))}
                                                    </select>
                                                )}
                                                {activitiesList.length === 0 && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No activities configured for this school.</p>}
                                            </div>
                                            <div className="input-group">
                                                <label>Transport Required?</label>
                                                <select disabled={modalMode === 'view'} className="form-input" value={currentStudent.transport_required} onChange={e => setCurrentStudent({ ...currentStudent, transport_required: e.target.value === 'true' })}>
                                                    <option value="false">No (Day Scholar)</option>
                                                    <option value="true">Yes (School Bus)</option>
                                                </select>
                                            </div>
                                            <div className="input-group">
                                                <label>Documents (TC, Birth Certificate) - URL</label>
                                                <input type="text" disabled={modalMode === 'view'} className="form-input" placeholder="e.g. drive link or filename" value={currentStudent.documents_url || ''} onChange={e => setCurrentStudent({ ...currentStudent, documents_url: e.target.value })} />
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

            {showToast && (
                <div style={{ 
                    position: 'fixed', 
                    bottom: '2rem', 
                    right: '2rem', 
                    background: showToast.includes('Error') ? '#ef4444' : 'var(--primary)', 
                    color: 'white', 
                    padding: '1rem 2rem', 
                    borderRadius: '12px', 
                    boxShadow: '0 10px 15px rgba(0,0,0,0.2)', 
                    animation: 'fadeIn 0.3s ease-out', 
                    zIndex: 1000, 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.75rem' 
                }}>
                    <Check size={24} />
                    <span style={{ fontWeight: 600 }}>{showToast}</span>
                </div>
            )}
        </div>
    );
};

export default StudentDirectory;
