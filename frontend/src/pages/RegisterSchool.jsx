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
            logo: '',
            branch: '',
            code: '',
            address: '',
            city: '',
            state: '',
            pin: '',
            contact: '',
            email: '',
            website: '',
            affiliation: 'CBSE',
            type: 'Co-ed',
            academic_year: '2024–2025',
            timezone: 'IST'
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
                <div className="glass-card" style={{ maxWidth: '500px', padding: '4rem', textAlign: 'center', color: 'var(--text)' }}>
                    <div style={{ width: '80px', height: '80px', background: 'var(--success)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                        <CheckCircle2 size={48} />
                    </div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Registration Successful!</h1>
                    <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2.5rem' }}>
                        Your school <strong style={{ color: 'var(--text)' }}>{formData.school.name}</strong> has been registered.
                        You can now log in using your administrator credentials.
                    </p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Redirecting to login in 5 seconds...</p>
                    <Link to="/login" style={{ display: 'block', marginTop: '2rem', color: 'var(--primary)', fontWeight: 700, textDecoration: 'underline' }}>Go to Login Now</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="login-screen" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh',
            background: 'linear-gradient(135deg, #f5f3ff 0%, #e0e7ff 100%)', padding: '2rem'
        }}>
            <div className="glass-card" style={{ width: '100%', maxWidth: '1100px', padding: '3.5rem', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.8)', overflowY: 'auto', maxHeight: '90vh', background: 'rgba(255, 255, 255, 0.7)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)' }}>
                <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem', background: 'linear-gradient(to right, #4f46e5, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Join EduCore<sup>+</sup>
                        </h1>
                    </Link>
                    <p style={{ color: 'var(--text-muted)' }}>Register your institution and start managing with precision</p>
                </div>

                {error && (
                    <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '12px', marginBottom: '2rem', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: '4rem' }}>
                        {/* School Details */}
                        <div>
                            <h3 style={{ color: 'var(--text)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <School size={20} color="var(--primary)" /> Corporate Onboarding Form
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div className="register-input-group">
                                    <label>School Logo</label>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <div style={{
                                            width: '64px',
                                            height: '64px',
                                            borderRadius: '12px',
                                            background: 'var(--background)',
                                            border: '2px dashed var(--border)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            overflow: 'hidden',
                                            flexShrink: 0
                                        }}>
                                            {formData.school.logo ? (
                                                <img src={formData.school.logo} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <Building2 size={24} style={{ color: 'var(--text-muted)' }} />
                                            )}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <input
                                                type="text"
                                                name="logo"
                                                placeholder="Enter image URL (e.g. https://...)"
                                                value={formData.school.logo}
                                                onChange={e => handleChange(e, 'school')}
                                            />
                                            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>Paste a link to your school logo image</p>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="register-input-group">
                                        <label>School Name*</label>
                                        <input type="text" name="name" required value={formData.school.name} onChange={e => handleChange(e, 'school')} placeholder="e.g. St. Xavier's Academy" />
                                    </div>
                                    <div className="register-input-group">
                                        <label>Branch Name*</label>
                                        <input type="text" name="branch" required value={formData.school.branch} onChange={e => handleChange(e, 'school')} placeholder="Main Branch" />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="register-input-group">
                                        <label>School Code / ID*</label>
                                        <input type="text" name="code" required value={formData.school.code} onChange={e => handleChange(e, 'school')} placeholder="SXA001" />
                                    </div>
                                    <div className="register-input-group">
                                        <label>Affiliation*</label>
                                        <select name="affiliation" className="register-select" required value={formData.school.affiliation} onChange={e => handleChange(e, 'school')}>
                                            <option value="CBSE">CBSE</option>
                                            <option value="ICSE">ICSE</option>
                                            <option value="State Board">State Board</option>
                                            <option value="IB">IB</option>
                                        </select>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="register-input-group">
                                        <label>School Type*</label>
                                        <select name="type" className="register-select" required value={formData.school.type} onChange={e => handleChange(e, 'school')}>
                                            <option value="Co-ed">Co-ed</option>
                                            <option value="Boys Only">Boys Only</option>
                                            <option value="Girls Only">Girls Only</option>
                                            <option value="Boarding">Boarding</option>
                                        </select>
                                    </div>
                                    <div className="register-input-group">
                                        <label>Academic Year Structure*</label>
                                        <input type="text" name="academic_year" required value={formData.school.academic_year} onChange={e => handleChange(e, 'school')} placeholder="e.g. 2024–2025" />
                                    </div>
                                </div>

                                <div style={{ padding: '1.5rem', background: 'var(--background)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                                    <h4 style={{ marginBottom: '1.25rem', fontSize: '0.75rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Contact & Location</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                            <div className="register-input-group">
                                                <label>Official Email ID*</label>
                                                <input type="email" name="email" required value={formData.school.email} onChange={e => handleChange(e, 'school')} placeholder="contact@school.com" />
                                            </div>
                                            <div className="register-input-group">
                                                <label>Contact Number(s)*</label>
                                                <input type="text" name="contact" required value={formData.school.contact} onChange={e => handleChange(e, 'school')} placeholder="+91..." />
                                            </div>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                            <div className="register-input-group">
                                                <label>City*</label>
                                                <input type="text" name="city" required value={formData.school.city} onChange={e => handleChange(e, 'school')} />
                                            </div>
                                            <div className="register-input-group">
                                                <label>State & PIN*</label>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <input type="text" name="state" required placeholder="State" value={formData.school.state} onChange={e => handleChange(e, 'school')} />
                                                    <input type="text" name="pin" required placeholder="PIN" style={{ width: '100px' }} value={formData.school.pin} onChange={e => handleChange(e, 'school')} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="register-input-group">
                                            <label>Full Address*</label>
                                            <textarea name="address" required rows={2} style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', background: 'white', border: '1px solid var(--border)', color: 'var(--text)', outline: 'none', resize: 'none' }} value={formData.school.address} onChange={e => handleChange(e, 'school')} />
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="register-input-group">
                                        <label>Website</label>
                                        <input type="text" name="website" value={formData.school.website} onChange={e => handleChange(e, 'school')} placeholder="www.school.com" />
                                    </div>
                                    <div className="register-input-group">
                                        <label>Time Zone</label>
                                        <input type="text" name="timezone" value={formData.school.timezone} onChange={e => handleChange(e, 'school')} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Admin Details */}
                        <div>
                            <div style={{ position: 'sticky', top: 0 }}>
                                <h3 style={{ color: 'var(--text)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <User size={20} color="var(--primary)" /> Admin Account Settings
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

                                    <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(79, 70, 229, 0.1)', borderRadius: '16px', border: '1px solid rgba(79, 70, 229, 0.2)' }}>
                                        <p style={{ fontSize: '0.875rem', color: 'var(--text)', lineHeight: 1.5 }}>
                                            <strong>Note:</strong> These credentials will grant full administrative access to your school dashboard. Please keep them secure.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
                        <Link to="/login" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = 'var(--primary)'} onMouseOut={e => e.target.style.color = 'var(--text-muted)'}>
                            Already registered? Back to Login
                        </Link>
                        <button type="submit" disabled={isLoading} className="btn btn-primary" style={{ minWidth: '280px', padding: '1rem 2rem' }}>
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
                    color: var(--text-muted);
                    margin-bottom: 0.5rem;
                }
                .register-input-group input, .register-select {
                    width: 100%;
                    padding: 0.75rem 1rem;
                    border-radius: 10px;
                    background: white;
                    border: 1px solid var(--border);
                    color: var(--text);
                    outline: none;
                    transition: all 0.2s;
                }
                .register-input-group input:focus, .register-select:focus {
                    background: white;
                    border-color: var(--primary);
                    box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
                }
                .register-select {
                    appearance: none;
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
                    background-repeat: no-repeat;
                    background-position: right 1rem center;
                    background-size: 1.25rem;
                    padding-right: 2.5rem;
                }
            `}</style>
        </div>
    );
};

export default RegisterSchool;
