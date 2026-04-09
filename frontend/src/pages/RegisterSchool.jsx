import React, { useState } from 'react';
import { School, User, Mail, Phone, Lock, ArrowRight, CheckCircle2, Loader2, Globe, MapPin, Building2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8000';

const RegisterSchool = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        school: {
            name: '',
            code: '',
            branch: '',
            email: '',
            contact: '',
            city: '',
            state: '',
            academic_year: '2024-2025'
        },
        admin_name: '',
        admin_username: '',
        admin_password: '',
        admin_email: '',
        admin_phone: ''
    });

    const handleChange = (e, section = null) => {
        const { name, value } = e.target;
        if (section) {
            setFormData(prev => ({
                ...prev,
                [section]: { ...prev[section], [name]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const resp = await fetch(`${API_BASE_URL}/schools/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (resp.ok) {
                setIsSuccess(true);
                setTimeout(() => navigate('/login'), 5000);
            } else {
                const errData = await resp.json();
                setError(errData.detail || 'Registration failed. Please try again.');
            }
        } catch (err) {
            console.error('Registration error:', err);
            setError('Connection failed. Please ensure the backend is running.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="login-screen" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh',
                background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)'
            }}>
                <div className="glass-card" style={{ maxWidth: '500px', padding: '4rem', textAlign: 'center', color: 'white' }}>
                    <div style={{ width: '80px', height: '80px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                        <CheckCircle2 size={48} />
                    </div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Registration Successful!</h1>
                    <p style={{ opacity: 0.9, lineHeight: 1.6, marginBottom: '2.5rem' }}>
                        Your school <strong>{formData.school.name}</strong> has been registered. 
                        You can now log in using your administrator credentials.
                    </p>
                    <p style={{ fontSize: '0.875rem' }}>Redirecting to login in 5 seconds...</p>
                    <Link to="/login" style={{ display: 'block', marginTop: '2rem', color: 'white', fontWeight: 700, textDecoration: 'underline' }}>Go to Login Now</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="login-screen" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh',
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', padding: '2rem'
        }}>
            <div className="glass-card" style={{ width: '100%', maxWidth: '900px', padding: '3.5rem', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem', color: 'white' }}>
                        Join EduCore<sup>+</sup>
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.7)' }}>Register your institution and start managing with precision</p>
                </div>

                {error && (
                    <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#fca5a5', borderRadius: '12px', marginBottom: '2rem', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                        {/* School Details */}
                        <div>
                            <h3 style={{ color: 'white', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <School size={20} /> School Information
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div className="register-input-group">
                                    <label>School Name*</label>
                                    <input type="text" name="name" required value={formData.school.name} onChange={e => handleChange(e, 'school')} placeholder="e.g. St. Xavier's Academy" />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="register-input-group">
                                        <label>Unique School Code*</label>
                                        <input type="text" name="code" required value={formData.school.code} onChange={e => handleChange(e, 'school')} placeholder="SXA001" />
                                    </div>
                                    <div className="register-input-group">
                                        <label>Branch Name</label>
                                        <input type="text" name="branch" value={formData.school.branch} onChange={e => handleChange(e, 'school')} placeholder="Main Branch" />
                                    </div>
                                </div>
                                <div className="register-input-group">
                                    <label>Official Email*</label>
                                    <input type="email" name="email" required value={formData.school.email} onChange={e => handleChange(e, 'school')} placeholder="contact@school.com" />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="register-input-group">
                                        <label>City*</label>
                                        <input type="text" name="city" required value={formData.school.city} onChange={e => handleChange(e, 'school')} />
                                    </div>
                                    <div className="register-input-group">
                                        <label>State*</label>
                                        <input type="text" name="state" required value={formData.school.state} onChange={e => handleChange(e, 'school')} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Admin Details */}
                        <div>
                            <h3 style={{ color: 'white', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <User size={20} /> Admin Account Settings
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div className="register-input-group">
                                    <label>Full Admin Name*</label>
                                    <input type="text" name="admin_name" required value={formData.admin_name} onChange={handleChange} placeholder="The Principal/Owner Name" />
                                </div>
                                <div className="register-input-group">
                                    <label>Admin Username*</label>
                                    <input type="text" name="admin_username" required value={formData.admin_username} onChange={handleChange} placeholder="For login purpose" />
                                </div>
                                <div className="register-input-group">
                                    <label>Password*</label>
                                    <input type="password" name="admin_password" required value={formData.admin_password} onChange={handleChange} placeholder="Secure password" />
                                </div>
                                <div className="register-input-group">
                                    <label>Personal Email*</label>
                                    <input type="email" name="admin_email" required value={formData.admin_email} onChange={handleChange} />
                                </div>
                                <div className="register-input-group">
                                    <label>Contact Phone*</label>
                                    <input type="text" name="admin_phone" required value={formData.admin_phone} onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '3.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Link to="/login" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = 'white'} onMouseOut={e => e.target.style.color = 'rgba(255,255,255,0.6)'}>
                            Already registered? Back to Login
                        </Link>
                        <button type="submit" disabled={isLoading} className="btn" style={{ background: 'white', color: '#4f46e5', minWidth: '240px', padding: '1rem 2rem' }}>
                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
                                <>
                                    <span style={{ fontWeight: 700 }}>Initialize School Dashboard</span>
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
                .register-input-group label {
                    display: block;
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: rgba(255,255,255,0.5);
                    margin-bottom: 0.5rem;
                }
                .register-input-group input {
                    width: 100%;
                    padding: 0.75rem 1rem;
                    border-radius: 10px;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    color: white;
                    outline: none;
                    transition: all 0.2s;
                }
                .register-input-group input:focus {
                    background: rgba(255,255,255,0.1);
                    border-color: rgba(255,255,255,0.3);
                }
            `}</style>
        </div>
    );
};

export default RegisterSchool;
