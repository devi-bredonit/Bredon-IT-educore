import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    School as SchoolIcon, 
    Users, 
    UserCheck, 
    Wallet, 
    Activity, 
    ArrowLeft, 
    MapPin, 
    Phone, 
    Mail, 
    Search,
    ChevronRight,
    Award,
    Settings
} from 'lucide-react';

const SchoolDeepDive = ({ user }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('students');
    const [activeSection, setActiveSection] = useState('A');
    const [activeActivity, setActiveActivity] = useState('Sports');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [school, setSchool] = useState(null);

    const [realStudents, setRealStudents] = useState([]);
    const [dbActivities, setDbActivities] = useState([]);
    const [activityStudents, setActivityStudents] = useState([]);

    // Data Fetching
    useEffect(() => {
        const fetchSchoolData = async () => {
            try {
                // Fetch school details
                const schoolResp = await fetch(`http://localhost:8000/schools/${id}`);
                let schoolData = {};
                if (schoolResp.ok) {
                    schoolData = await schoolResp.json();
                } else {
                    schoolData = {
                        id: id,
                        name: "EduCore+ High School (Fallback)",
                        branch: "Main Campus",
                        code: "ED001",
                        city: "Mumbai",
                        state: "Maharashtra",
                        contact: "+91 98765 43210",
                        email: "admin.mumbai@educore.edu"
                    };
                }

                // Fetch students for this school
                const studentResp = await fetch(`http://localhost:8000/students/?school_id=${id}`);
                let studentsData = [];
                if (studentResp.ok) {
                    const data = await studentResp.json();
                    studentsData = data.map(s => ({
                        id: s.id,
                        name: s.name,
                        roll: s.roll_number || s.id.toString(),
                        sex: s.gender === 'Male' ? 'M' : s.gender === 'Female' ? 'F' : 'O',
                        section: s.section || 'A',
                        blood: s.blood_group || 'O+',
                        phone: s.father_phone || 'N/A',
                        parent: s.father_name || 'N/A',
                        joining: s.admission_date || 'N/A',
                        medical: s.medical_conditions || 'None',
                        address: s.permanent_address || 'N/A',
                        status: s.payment_status || 'Pending'
                    }));
                }

                // Fetch activities
                const activitiesResp = await fetch(`http://localhost:8000/activities/?school_id=${id}`);
                if (activitiesResp.ok) {
                    const acts = await activitiesResp.json();
                    setDbActivities(acts);
                    if (acts.length > 0 && activeActivity === 'Sports') {
                        setActiveActivity(acts[0].id);
                    }
                }

                setRealStudents(studentsData);
                setSchool({
                    ...schoolData,
                    totalStudents: studentsData.length,
                    revenue: 404077 // Dummy revenue
                });

            } catch (error) {
                console.error("Failed to fetch school deep dive data:", error);
            }
        };

        if (id) {
            fetchSchoolData();
        }
    }, [id]);

    useEffect(() => {
        const fetchEnrolledStudents = async () => {
            if (!activeActivity || activeActivity === 'Sports') return;
            try {
                const resp = await fetch(`http://localhost:8000/activities/${activeActivity}/students`);
                if (resp.ok) {
                    setActivityStudents(await resp.json());
                }
            } catch (err) {
                console.error("Failed to fetch activity students", err);
            }
        };
        fetchEnrolledStudents();
    }, [activeActivity]);

    const staff = [
        { id: 501, name: "Dr. Ramesh Rao", role: "Principal", dept: "Administration", status: "Active", phone: "9988776655", salary: 150000 },
        { id: 502, name: "Mrs. Leela Nair", role: "Sr. Teacher", dept: "Mathematics", status: "Active", phone: "9988776644", salary: 85000 },
        { id: 503, name: "Mr. David Wilson", role: "Coach", dept: "Physical Education", status: "Active", phone: "9988776633", salary: 65000 },
        { id: 504, name: "Ms. Sarah Chen", role: "Librarian", dept: "Media Center", status: "Leave", phone: "9988776622", salary: 55000 },
    ];

    const activities = [
        { name: "Sports", icon: <Activity size={20} />, list: ["Cricket", "Football", "Basketball", "Shuttle"] },
        { name: "Skills", icon: <Award size={20} />, list: ["Coding", "Robotics", "Public Speaking"] },
        { name: "Swimming", icon: <Activity size={20} />, list: ["Basic Training", "Advanced Competitive"] },
        { name: "Dance", icon: <Activity size={20} />, list: ["Classical", "Hip Hop", "Contemporary"] },
    ];

    const feeTypes = [
        { name: "Tuition Fee", frequency: "Quarterly", amount: 15000 },
        { name: "Transport Fee", frequency: "Monthly", amount: 2500 },
        { name: "Laboratory Fee", frequency: "Annual", amount: 5000 },
        { name: "Examination Fee", frequency: "Bi-Annual", amount: 1500 },
    ];

    if (!school) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading school details...</div>;

    const navTabs = [
        { id: 'students', label: 'Students', icon: <Users size={20} /> },
        { id: 'staff', label: 'Staff Directory', icon: <UserCheck size={20} /> },
        { id: 'management', label: 'Management', icon: <Settings size={20} /> },
        { id: 'fees', label: 'Fee Management', icon: <Wallet size={20} /> },
        { id: 'activities', label: 'Circular Activities', icon: <Activity size={20} /> },
    ];

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
            <header className="page-header" style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <button 
                        onClick={() => navigate('/schools')} 
                        className="btn" 
                        style={{ padding: '0.75rem', borderRadius: '12px', background: 'var(--surface-hover)', border: '1px solid var(--border)' }}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{school.name} Details</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Management, Directory & Revenue Oversight</p>
                    </div>
                </div>
            </header>

            {/* School Profile Summary Card */}
            <div className="glass-card" style={{ padding: '2rem', marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <div style={{ width: '100px', height: '100px', borderRadius: '24px', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                        <SchoolIcon size={48} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{school.name} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>({school.branch})</span></h2>
                        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}><MapPin size={16} /> {school.city}, {school.state}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}><Phone size={16} /> {school.contact}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}><Mail size={16} /> {school.email}</div>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div className="glass-card" style={{ padding: '1rem 1.5rem', background: 'var(--background)', textAlign: 'center', minWidth: '150px' }}>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Revenue</p>
                        <p style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>₹{school.revenue.toLocaleString()}</p>
                    </div>
                    <div className="glass-card" style={{ padding: '1rem 1.5rem', background: 'var(--background)', textAlign: 'center', minWidth: '150px' }}>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Students</p>
                        <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>{school.totalStudents}</p>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', overflowX: 'auto' }}>
                {navTabs.map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`btn ${activeTab === tab.id ? 'btn-primary' : ''}`}
                        style={{ 
                            background: activeTab === tab.id ? 'var(--primary)' : 'transparent',
                            color: activeTab === tab.id ? 'white' : 'var(--text-muted)',
                            border: 'none',
                            padding: '0.75rem 1.25rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            fontWeight: 600,
                            borderRadius: '12px'
                        }}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="animate-fade-in">
                {activeTab === 'students' && (
                    <>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                            {['A', 'B', 'C', 'D'].map(sec => (
                                <button 
                                    key={sec}
                                    onClick={() => { setActiveSection(sec); setSelectedStudent(null); }}
                                    className="btn"
                                    style={{ 
                                        padding: '0.5rem 1.5rem', 
                                        borderRadius: '10px',
                                        background: activeSection === sec ? 'var(--primary)' : 'var(--surface-hover)',
                                        color: activeSection === sec ? 'white' : 'var(--text-muted)',
                                        border: '1px solid var(--border)',
                                        fontWeight: 700
                                    }}
                                >
                                    Section {sec}
                                </button>
                            ))}
                        </div>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Roll No.</th>
                                        <th>Student Name</th>
                                        <th>Guardian</th>
                                        <th>Contact</th>
                                        <th>Status</th>
                                        <th style={{ textAlign: 'right' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {realStudents.filter(s => s.section === activeSection).length > 0 ? (
                                        realStudents.filter(s => s.section === activeSection).map(s => (
                                            <tr key={s.id}>
                                                <td style={{ fontWeight: 800, color: 'var(--primary)' }}>{s.roll}</td>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{s.name[0]}</div>
                                                        {s.name}
                                                    </div>
                                                </td>
                                                <td>{s.parent}</td>
                                                <td>{s.phone}</td>
                                                <td><span className="badge badge-paid">Active</span></td>
                                                <td style={{ textAlign: 'right' }}>
                                                    <button onClick={() => setSelectedStudent(s)} className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', background: 'var(--surface-hover)', border: '1px solid var(--border)' }}>View Profile</button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No students enrolled in this section for the current academic year.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {activeTab === 'staff' && (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Staff Name</th>
                                    <th>Designation</th>
                                    <th>Department</th>
                                    <th>Phone</th>
                                    <th>Salary (₹)</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {staff.map(s => (
                                    <tr key={s.id}>
                                        <td style={{ fontWeight: 600 }}>{s.name}</td>
                                        <td>{s.role}</td>
                                        <td>{s.dept}</td>
                                        <td>{s.phone}</td>
                                        <td style={{ fontWeight: 600, color: '#10b981' }}>{s.salary ? `₹${s.salary.toLocaleString()}` : '—'}</td>
                                        <td><span className={`badge ${s.status === 'Active' ? 'badge-paid' : 'badge-pending'}`}>{s.status}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'management' && (
                    <div className="grid grid-3">
                        {staff.filter(s => s.dept === 'Administration').concat([
                            { id: 901, name: "Dr. Vikram Seth", role: "Chairman", dept: "Management", status: "Active", phone: "9820098200" },
                            { id: 902, name: "Mrs. Anjali Roy", role: "Trustee", dept: "Management", status: "Active", phone: "9820098201" }
                        ]).map(m => (
                            <div key={m.id} className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                                <div style={{ width: '64px', height: '64px', margin: '0 auto 1rem', borderRadius: '50%', background: 'var(--surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <UserCheck size={32} color="var(--primary)" />
                                </div>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{m.name}</h3>
                                <p style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '1rem' }}>{m.role}</p>
                                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.875rem' }}><Phone size={14} /> {m.phone}</div>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.875rem' }}><Mail size={14} /> {m.name.split(' ')[1].toLowerCase()}@school.edu</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'fees' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '2.5rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>School Fee Configuration</h3>
                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Fee Type</th>
                                            <th>Frequency</th>
                                            <th>Amount (₹)</th>
                                            <th>Last Updated</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {feeTypes.map((f, i) => (
                                            <tr key={i}>
                                                <td style={{ fontWeight: 600 }}>{f.name}</td>
                                                <td>{f.frequency}</td>
                                                <td style={{ fontWeight: 800, color: 'var(--primary)' }}>₹{f.amount.toLocaleString()}</td>
                                                <td style={{ color: 'var(--text-muted)' }}>01-Jan-2024</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="glass-card" style={{ padding: '2rem', background: 'linear-gradient(135deg, var(--surface), rgba(99, 102, 241, 0.05))' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Wallet size={20} color="var(--primary)" /> Collection Overview</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Target Annual Collection</p>
                                    <p style={{ fontSize: '1.5rem', fontWeight: 800 }}>₹1.2 Cr</p>
                                </div>
                                <div style={{ height: '8px', background: 'var(--surface-hover)', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ width: '65%', height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--accent))' }}></div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                                    <span>Collected: <strong style={{ color: '#10b981' }}>₹78L</strong></span>
                                    <span>Pending: <strong style={{ color: '#ef4444' }}>₹42L</strong></span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'activities' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '300px minmax(0, 1fr)', gap: '2.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', color: 'var(--text-muted)' }}>Available Modules</h3>
                            {dbActivities.length === 0 ? (
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>No extracurricular activities configured.</p>
                            ) : (
                                dbActivities.map(act => (
                                    <button 
                                        key={act.id}
                                        onClick={() => setActiveActivity(act.id)}
                                        className="btn"
                                        style={{ 
                                            justifyContent: 'flex-start',
                                            padding: '1rem 1.25rem',
                                            background: activeActivity === act.id ? 'var(--primary)' : 'var(--surface)',
                                            color: activeActivity === act.id ? 'white' : 'var(--text)',
                                            border: '1px solid var(--border)',
                                            gap: '1rem',
                                            borderRadius: '16px'
                                        }}
                                    >
                                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: activeActivity === act.id ? 'rgba(255,255,255,0.2)' : 'var(--surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Award size={18} />
                                        </div>
                                        <div style={{ textAlign: 'left' }}>
                                            <span style={{ fontWeight: 600, display: 'block' }}>{act.name}</span>
                                            <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>{act.enrolled_count} Enrolled</span>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                        <div className="animate-fade-in">
                            {activeActivity !== 'Sports' && dbActivities.find(a => a.id === activeActivity) && (
                                <div className="glass-card" style={{ padding: '2rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                        <div>
                                            <h2 style={{ fontSize: '1.5rem' }}>{dbActivities.find(a => a.id === activeActivity).name} Students</h2>
                                            <p style={{ color: 'var(--text-muted)' }}>Currently enrolled in extracurricular program</p>
                                        </div>
                                        <div style={{ padding: '0.75rem 1.5rem', background: 'var(--surface-hover)', borderRadius: '12px', border: '1px solid var(--border)', fontWeight: 700 }}>
                                            {activityStudents.length} Enrolled
                                        </div>
                                    </div>
                                    <div className="table-container">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Student</th>
                                                    <th>Class</th>
                                                    <th>Enrollment Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {activityStudents.length === 0 ? (
                                                    <tr><td colSpan={3} style={{textAlign: 'center', color: 'var(--text-muted)', padding: '2rem'}}>No students enrolled yet.</td></tr>
                                                ) : (
                                                    activityStudents.map((s, i) => (
                                                        <tr key={s.id}>
                                                            <td style={{ fontWeight: 600 }}>{s.name}</td>
                                                            <td>Class {s.current_class}</td>
                                                            <td>{s.enrollment_date}</td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Student Profile Modal */}
            {selectedStudent && (
                <div className="overlay" style={{ zIndex: 2000 }}>
                    <div className="modal-card" style={{ maxWidth: '800px', width: '90%', padding: '0', overflow: 'hidden' }}>
                        <div style={{ height: '120px', background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}></div>
                        <div style={{ padding: '0 2.5rem 2.5rem', marginTop: '-40px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                                <div style={{ width: '100px', height: '100px', borderRadius: '24px', background: 'white', padding: '4px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                                    <div style={{ width: '100%', height: '100%', borderRadius: '20px', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)' }}>{selectedStudent.name[0]}</div>
                                </div>
                                <button onClick={() => setSelectedStudent(null)} className="btn" style={{ background: 'var(--background)', padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.875rem' }}>Close Profile</button>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '3rem' }}>
                                <div>
                                    <h2 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{selectedStudent.name}</h2>
                                    <p style={{ color: 'var(--primary)', fontWeight: 700, marginBottom: '2rem' }}>Roll No: {selectedStudent.roll} | Section {selectedStudent.section}</p>
                                    
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                        <div>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Parent Name</p>
                                            <p style={{ fontWeight: 600 }}>{selectedStudent.parent}</p>
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Contact Number</p>
                                            <p style={{ fontWeight: 600 }}>{selectedStudent.phone}</p>
                                        </div>
                                        <div style={{ gridColumn: 'span 2' }}>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Permanent Address</p>
                                            <p style={{ fontWeight: 600 }}>{selectedStudent.address}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="glass-card" style={{ padding: '1.5rem', background: 'var(--surface-hover)' }}>
                                    <h3 style={{ fontSize: '0.875rem', marginBottom: '1.5rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Academic & Health</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>Blood Group</span>
                                            <span style={{ fontWeight: 700, color: '#ef4444' }}>{selectedStudent.blood}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>Enrollment Date</span>
                                            <span style={{ fontWeight: 600 }}>{selectedStudent.joining}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>Medical Condition</span>
                                            <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{selectedStudent.medical}</span>
                                        </div>
                                        <div style={{ marginTop: '1rem', padding: '1.5rem', background: 'var(--background)', borderRadius: '12px', textAlign: 'center' }}>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Attendance Score</p>
                                            <p style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981' }}>94.2%</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SchoolDeepDive;
