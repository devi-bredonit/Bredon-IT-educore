import React from 'react';
import { Link } from 'react-router-dom';
import { School, ArrowRight, ShieldCheck, Zap, Layers, Users, Building2, LayoutDashboard, Globe } from 'lucide-react';

const Landing = () => {
    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f5f3ff 0%, #e0e7ff 100%)',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: "'Outfit', sans-serif"
        }}>
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .chart-bar-grow:hover {
                    filter: brightness(1.1);
                    transform: scaleX(1.1);
                }
                .hero-dashboard:hover {
                    transform: rotateY(0deg) rotateX(0deg) scale(1.05) !important;
                }
                @keyframes ticker {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>
            {/* Navigation */}
            <nav style={{
                padding: '2rem 4rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                maxWidth: '1400px',
                width: '100%',
                margin: '0 auto'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                        <School size={24} />
                    </div>
                    <span style={{ fontSize: '1.5rem', fontWeight: 800, background: 'linear-gradient(to right, #4f46e5, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        EduCore<sup>+</sup>
                    </span>
                </div>
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <Link to="/login" style={{ textDecoration: 'none', color: '#4f46e5', fontWeight: 600 }}>Login</Link>
                    <Link to="/register" className="btn btn-primary" style={{ padding: '0.75rem 1.75rem', textDecoration: 'none' }}>
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* Innovative Live Ticker */}
            <div style={{ background: '#0f172a', color: 'white', padding: '0.75rem 0', overflow: 'hidden', whiteSpace: 'nowrap', fontSize: '0.8rem', fontWeight: 600, borderY: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'inline-block', animation: 'ticker 30s linear infinite', paddingLeft: '100%' }}>
                    <span style={{ margin: '0 3rem' }}>🟢 SYSTEM STATUS: OPTIMAL</span>
                    <span style={{ margin: '0 3rem' }}>👥 ACTIVE STUDENTS: 52,482</span>
                    <span style={{ margin: '0 3rem' }}>🏢 SCHOOLS SECURED: 154</span>
                    <span style={{ margin: '0 3rem' }}>⚡ AVG RESPONSE: 42ms</span>
                    <span style={{ margin: '0 3rem' }}>🔒 AES-256 ACTIVE</span>
                    <span style={{ margin: '0 3rem' }}>🟢 SYSTEM STATUS: OPTIMAL</span>
                    <span style={{ margin: '0 3rem' }}>👥 ACTIVE STUDENTS: 52,482</span>
                    <span style={{ margin: '0 3rem' }}>🏢 SCHOOLS SECURED: 154</span>
                    <span style={{ margin: '0 3rem' }}>⚡ AVG RESPONSE: 42ms</span>
                    <span style={{ margin: '0 3rem' }}>🔒 AES-256 ACTIVE</span>
                </div>
            </div>

            {/* Hero Section */}
            <main style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6rem 4rem',
                maxWidth: '1400px',
                width: '100%',
                margin: '0 auto',
                minHeight: '80vh'
            }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '6rem', alignItems: 'center' }}>
                    <div className="animate-fade-in">
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'white', borderRadius: '99px', border: '1px solid #e2e8f0', marginBottom: '2rem', fontSize: '0.875rem', fontWeight: 600, color: '#4f46e5' }}>
                            <Zap size={16} fill="#4f46e5" />
                            The Future of School Management
                        </div>
                        <h1 style={{ fontSize: '4.5rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '2rem', color: '#1e1b4b' }}>
                            Precision Software for <br />
                            <span style={{ background: 'linear-gradient(to right, #4f46e5, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Modern Institutions</span>
                        </h1>
                        <p style={{ fontSize: '1.25rem', color: '#64748b', lineHeight: 1.6, marginBottom: '3rem', maxWidth: '600px' }}>
                            A comprehensive, high-performance platform designed to unify administration, academics, and finances into a single intuitive dashboard.
                        </p>

                        <div style={{ display: 'flex', gap: '1.5rem' }}>
                            <Link to="/register" className="btn btn-primary" style={{ padding: '1.25rem 2.5rem', fontSize: '1.1rem', textDecoration: 'none' }}>
                                Register Your School
                                <ArrowRight size={22} />
                            </Link>
                            <Link to="/login" style={{ padding: '1.25rem 2.5rem', fontSize: '1.1rem', color: '#1e1b4b', fontWeight: 700, textDecoration: 'none', background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                Access Dashboard
                            </Link>
                        </div>

                        <div style={{ marginTop: '4rem', display: 'flex', gap: '3rem' }}>
                            <div>
                                <h4 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e1b4b' }}>150+</h4>
                                <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Partner Schools</p>
                            </div>
                            <div style={{ width: '1px', background: '#e2e8f0' }}></div>
                            <div>
                                <h4 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e1b4b' }}>50k+</h4>
                                <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Active Students</p>
                            </div>
                            <div style={{ width: '1px', background: '#e2e8f0' }}></div>
                            <div>
                                <h4 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e1b4b' }}>99.9%</h4>
                                <p style={{ color: '#64748b', fontSize: '0.875rem' }}>System Uptime</p>
                            </div>
                        </div>
                    </div>

                    <div className="animate-fade-in">
                        {/* High-End Singular Browser Frame */}
                        <div style={{
                            position: 'relative',
                            background: 'white',
                            borderRadius: '24px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 40px 100px rgba(0,0,0,0.08)',
                            overflow: 'hidden',
                            maxWidth: '700px',
                            margin: '0 auto'
                        }}>
                            {/* Professional Header Bar */}
                            <div style={{
                                height: '40px',
                                background: '#f8fafc',
                                borderBottom: '1px solid #e2e8f0',
                                display: 'flex',
                                alignItems: 'center',
                                padding: '0 1.25rem',
                                gap: '8px'
                            }}>
                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f56' }}></div>
                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e' }}></div>
                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27c93f' }}></div>
                                <div style={{
                                    flex: 1,
                                    height: '24px',
                                    background: 'white',
                                    borderRadius: '6px',
                                    margin: '0 3rem',
                                    border: '1px solid #e2e8f0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    paddingLeft: '1rem'
                                }}>
                                    <div style={{ width: '120px', height: '6px', background: '#f1f5f9', borderRadius: '3px' }}></div>
                                </div>
                            </div>

                            {/* Main Dashboard Image - High Clarity */}
                            <img
                                src="/dashboard_preview.png"
                                alt="EduCore Enterprise Dashboard"
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    display: 'block'
                                }}
                            />

                            {/* Subtle Trust Overlay */}
                            <div style={{
                                position: 'absolute',
                                bottom: '24px',
                                right: '24px',
                                background: 'rgba(255,255,255,0.9)',
                                backdropFilter: 'blur(10px)',
                                padding: '1rem 1.5rem',
                                borderRadius: '16px',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                border: '1px solid rgba(0,0,0,0.05)'
                            }}>
                                <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                    <ShieldCheck size={20} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 800 }}>LIVE STATUS</div>
                                    <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#1e1b4b' }}>Secure & Active</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            {/* Creative Workflow Section - Inspired by user reference */}
            <section style={{ padding: '4rem 4rem', background: 'white', overflow: 'hidden' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1e1b4b', marginBottom: '3rem' }}>The Institutional Lifecycle</h2>

                    <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', padding: '3rem 0' }}>
                        {/* Connecting Wavy SVG Line */}
                        <svg style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '100px', transform: 'translateY(-50%)', zIndex: 1 }} viewBox="0 0 1200 100" preserveAspectRatio="none">
                            <path d="M0,50 Q150,0 300,50 T600,50 T900,50 T1200,50" fill="none" stroke="#e0e7ff" strokeWidth="4" strokeDasharray="12,12" />
                        </svg>

                        <WorkflowNode icon={<Users size={24} />} title="Admission" desc="Lead to enrollment" delay="0s" />
                        <WorkflowNode icon={<Layers size={24} />} title="Batching" desc="Class allocation" delay="0.2s" offset />
                        <WorkflowNode icon={<LayoutDashboard size={24} />} title="Curriculum" desc="Academic planning" delay="0.4s" />
                        <WorkflowNode icon={<Building2 size={24} />} title="Financials" desc="Fee automation" delay="0.6s" offset />
                        <WorkflowNode icon={<ArrowRight size={24} />} title="Reporting" desc="Performance data" delay="0.8s" />
                        <WorkflowNode icon={<ShieldCheck size={24} />} title="Graduation" desc="Final certification" delay="1s" offset />
                    </div>
                </div>
            </section>


            {/* Innovative Animated Ecosystem Section */}
            <section style={{ padding: '3rem 4rem', background: 'white', position: 'relative' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
                    <div style={{ marginBottom: '2.5rem' }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1e1b4b', marginBottom: '0.75rem' }}>The EduCore Ecosystem</h2>
                        <div style={{ width: '60px', height: '4px', background: 'linear-gradient(to right, #4f46e5, #7c3aed)', margin: '0 auto', borderRadius: '2px' }}></div>
                    </div>

                    <div style={{ position: 'relative', height: '380px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {/* Animated Pulses - Enhancing Visibility */}
                        <div className="pulse-ring" style={{ position: 'absolute', width: '200px', height: '200px', border: '2px solid rgba(79, 70, 229, 0.2)', borderRadius: '50%', zIndex: 0 }}></div>
                        <div className="pulse-ring" style={{ position: 'absolute', width: '350px', height: '350px', border: '1px solid rgba(79, 70, 229, 0.1)', borderRadius: '50%', zIndex: 0, animationDelay: '1.5s' }}></div>

                        {/* Central Hub */}
                        <div style={{
                            width: '120px',
                            height: '120px',
                            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                            borderRadius: '50%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            position: 'relative',
                            zIndex: 10,
                            boxShadow: '0 0 40px rgba(79, 70, 229, 0.3)',
                            animation: 'float 4s ease-in-out infinite'
                        }}>
                            <LayoutDashboard size={40} />
                            <span style={{ fontSize: '0.75rem', fontWeight: 800, marginTop: '0.4rem' }}>CENTRAL CORE</span>
                        </div>

                        {/* Tighter Floating Interaction Nodes */}
                        <div style={{ position: 'absolute', top: '5%', left: '20%' }}><FloatingIconNode icon={<Users size={20} />} title="Students" color="#4f46e5" /></div>
                        <div style={{ position: 'absolute', top: '5%', right: '20%' }}><FloatingIconNode icon={<Building2 size={20} />} title="Finance" color="#10b981" /></div>
                        <div style={{ position: 'absolute', bottom: '5%', left: '20%' }}><FloatingIconNode icon={<ShieldCheck size={20} />} title="Security" color="#f59e0b" /></div>
                        <div style={{ position: 'absolute', bottom: '5%', right: '20%' }}><FloatingIconNode icon={<Layers size={20} />} title="Academic" color="#ec4899" /></div>

                        <div style={{ position: 'absolute', top: '50%', right: '8%', transform: 'translateY(-50%)' }}><FloatingIconNode icon={<Globe size={20} />} title="Branches" color="#6366f1" /></div>
                        <div style={{ position: 'absolute', top: '50%', left: '8%', transform: 'translateY(-50%)' }}><FloatingIconNode icon={<Zap size={20} />} title="Exams" color="#8b5cf6" /></div>

                        {/* Tighter Connection Lines with Blinking Particles */}
                        <div className="data-line horizontal" style={{ position: 'absolute', width: '70%', height: '1px', background: 'linear-gradient(to right, transparent, #e2e8f0, transparent)', zIndex: 1 }}>
                            <div className="data-particle" style={{ left: '0', animation: 'moveH 3s linear infinite' }}></div>
                            <div className="data-particle" style={{ left: '50%', animation: 'moveH 3s linear infinite 1.5s' }}></div>
                        </div>
                        <div className="data-line vertical" style={{ position: 'absolute', height: '60%', width: '1px', background: 'linear-gradient(to bottom, transparent, #e2e8f0, transparent)', zIndex: 1 }}>
                            <div className="data-particle" style={{ top: '0', animation: 'moveV 4s linear infinite' }}></div>
                            <div className="data-particle" style={{ top: '60%', animation: 'moveV 4s linear infinite 2s' }}></div>
                        </div>

                        <style>{`
                            @keyframes ripple {
                                0% { opacity: 0; transform: scale(0.8); }
                                50% { opacity: 1; }
                                100% { opacity: 0; transform: scale(1.3); }
                            }
                            @keyframes float {
                                0%, 100% { transform: translateY(0); }
                                50% { transform: translateY(-10px); }
                            }
                            @keyframes moveH {
                                0% { left: 0; opacity: 0; }
                                20%, 80% { opacity: 1; }
                                100% { left: 100%; opacity: 0; }
                            }
                            @keyframes moveV {
                                0% { top: 0; opacity: 0; }
                                20%, 80% { opacity: 1; }
                                100% { top: 100%; opacity: 0; }
                            }
                            .pulse-ring {
                                animation: ripple 4s ease-out infinite;
                            }
                            .data-particle {
                                position: absolute;
                                width: 6px;
                                height: 6px;
                                background: #4f46e5;
                                border-radius: 50%;
                                box-shadow: 0 0 12px #4f46e5, 0 0 20px rgba(79, 70, 229, 0.4);
                                zIndex: 2;
                            }
                        `}</style>
                    </div>
                </div>
            </section>

            {/* Intelligence & Analytics Section - Innovative Diagram */}
            <section style={{ padding: '5rem 4rem', background: 'linear-gradient(to bottom, white, #f8fafc)' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '6rem', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1e1b4b', marginBottom: '1.5rem' }}>Data-Driven Intelligence</h2>
                        <p style={{ fontSize: '1.1rem', color: '#64748b', lineHeight: 1.6, marginBottom: '2rem' }}>
                            EduCore+ doesn't just store data; it analyzes it. Observe a significant increase in administrative efficiency and financial clarity within the first quarter of deployment.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <MetricRow label="Administrative Automation" value="94%" color="#4f46e5" />
                            <MetricRow label="Fee Collection Efficiency" value="88%" color="#10b981" />
                            <MetricRow label="Resource Optimization" value="72%" color="#f59e0b" />
                        </div>
                    </div>

                    <div style={{ background: 'white', padding: '3rem', borderRadius: '32px', boxShadow: '0 20px 50px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '260px', gap: '1rem' }}>
                            <ChartBar height="40%" label="Jan" color="#cbd5e1" />
                            <ChartBar height="55%" label="Feb" color="#94a3b8" />
                            <ChartBar height="48%" label="Mar" color="#64748b" />
                            <ChartBar height="75%" label="Apr" color="#4f46e5" />
                            <ChartBar height="68%" label="May" color="#7c3aed" />
                            <ChartBar height="92%" label="Jun" color="#4338ca" />
                        </div>
                        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.875rem', color: '#64748b', fontWeight: 600 }}>
                            Projected institutional growth and efficiency index
                        </div>
                    </div>
                </div>
            </section>

            {/* Cloud Infrastructure Innovation Section */}
            <section style={{ padding: '5rem 4rem', background: '#0f172a', color: 'white', overflow: 'hidden', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, right: 0, opacity: 0.1, pointerEvents: 'none' }}>
                    <Globe size={400} />
                </div>
                <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '4rem' }}>Next-Gen Cloud Infrastructure</h2>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '4rem', flexWrap: 'wrap' }}>
                        <CloudFeature icon={<ShieldCheck size={32} />} title="Military Grade" desc="AES-256 Bit Encryption" />
                        <CloudFeature icon={<Layers size={32} />} title="Instant Sync" desc="Real-time Multi-Branch Link" />
                        <CloudFeature icon={<Zap size={32} />} title="Edge Compute" desc="Global CDN Acceleration" />
                        <CloudFeature icon={<Building2 size={32} />} title="High Availability" desc="99.9% Uptime SLA" />
                    </div>
                </div>
            </section>
            {/* Feature Deep-Dive Section */}
            <section style={{ padding: '5rem 4rem', background: '#f8fafc' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ width: '64px', height: '64px', background: 'white', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                                <Users size={32} color="#4f46e5" />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e1b4b' }}>Student Information</h3>
                            <p style={{ color: '#64748b', lineHeight: 1.6 }}>
                                Full student lifecycle tracking from enrollment to graduation. Digital admission, attendance, and behavioral analytics.
                            </p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ width: '64px', height: '64px', background: 'white', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                                <Building2 size={32} color="#10b981" />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e1b4b' }}>Financial Master</h3>
                            <p style={{ color: '#64748b', lineHeight: 1.6 }}>
                                Automated fee structure management, instant receipts, revenue forecasting, and debt collection automation in one place.
                            </p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ width: '64px', height: '64px', background: 'white', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                                <ShieldCheck size={32} color="#f59e0b" />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e1b4b' }}>Role-Based Privacy</h3>
                            <p style={{ color: '#64748b', lineHeight: 1.6 }}>
                                Enterprise-grade security with granular permissions for Teachers, Staff, Admins, and Super Admins.
                            </p>
                        </div>
                    </div>
                </div>
            </section>


            {/* Bottom CTA Section */}
            <section style={{ padding: '5rem 4rem', textAlign: 'center' }}>
                <div style={{
                    maxWidth: '900px',
                    margin: '0 auto',
                    background: 'radial-gradient(at 0% 0%, #4f46e5 0px, transparent 50%), radial-gradient(at 50% 0%, #7c3aed 0px, transparent 50%), radial-gradient(at 100% 0%, #4338ca 0px, transparent 50%)',
                    backgroundColor: '#4f46e5',
                    borderRadius: '40px',
                    padding: '6rem 4rem',
                    color: 'white',
                    boxShadow: '0 40px 80px rgba(79, 70, 229, 0.4)',
                    position: 'relative',
                    overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'url("https://www.transparenttextures.com/patterns/cubes.png")', opacity: 0.1 }}></div>
                    <h2 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '1.5rem', position: 'relative', zIndex: 1 }}>Ready to transform your school?</h2>
                    <p style={{ fontSize: '1.3rem', opacity: 0.9, marginBottom: '3.5rem', position: 'relative', zIndex: 1, maxWidth: '600px', margin: '0 auto 3.5rem' }}>
                        Join 150+ institutions that have revolutionized their administration with EduCore+ precision software.
                    </p>
                    <Link to="/register" style={{
                        padding: '1.25rem 3.5rem',
                        background: 'white',
                        color: '#4f46e5',
                        borderRadius: '16px',
                        textDecoration: 'none',
                        fontWeight: 900,
                        fontSize: '1.2rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '1rem',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                        position: 'relative',
                        zIndex: 1
                    }}>
                        Get Started Today
                        <ArrowRight size={26} />
                    </Link>
                </div>
            </section>

            {/* Robust Footer */}
            <footer style={{ padding: '6rem 4rem 4rem', background: '#0f172a', color: '#94a3b8' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '6rem', marginBottom: '6rem' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                                <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                    <School size={18} />
                                </div>
                                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white' }}>
                                    EduCore<sup>+</sup>
                                </span>
                            </div>
                            <p style={{ lineHeight: 1.8, marginBottom: '2rem' }}>
                                The world's most intuitive school management platform. Building precision software for the future of education.
                            </p>
                        </div>
                        <div>
                            <h4 style={{ color: 'white', fontWeight: 700, marginBottom: '2rem' }}>Platform</h4>
                            <p style={{ marginBottom: '1rem' }}>Dashboard</p>
                            <p style={{ marginBottom: '1rem' }}>Student Directory</p>
                            <p style={{ marginBottom: '1rem' }}>Fee Management</p>
                            <p style={{ marginBottom: '1rem' }}>Security</p>
                        </div>
                        <div>
                            <h4 style={{ color: 'white', fontWeight: 700, marginBottom: '2rem' }}>Company</h4>
                            <p style={{ marginBottom: '1rem' }}>About Us</p>
                            <p style={{ marginBottom: '1rem' }}>Contact</p>
                            <p style={{ marginBottom: '1rem' }}>Partners</p>
                            <p style={{ marginBottom: '1rem' }}>Careers</p>
                        </div>
                        <div>
                            <h4 style={{ color: 'white', fontWeight: 700, marginBottom: '2rem' }}>Support</h4>
                            <p style={{ marginBottom: '1rem' }}>Help Center</p>
                            <p style={{ marginBottom: '1rem' }}>Documentation</p>
                            <p style={{ marginBottom: '1rem' }}>API Status</p>
                        </div>
                    </div>
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                        <p>© 2026 EduCore+ Enterprise. All rights reserved.</p>
                        <div style={{ display: 'flex', gap: '3rem' }}>
                            <span>Privacy Policy</span>
                            <span>Terms of Service</span>
                            <span>Cookie Policy</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const WorkflowNode = ({ icon, title, desc, delay, offset }) => (
    <div style={{
        position: 'relative',
        zIndex: 2,
        marginTop: offset ? '60px' : '-60px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.75rem',
        animation: `fadeInUp 0.6s ease-out ${delay} both`,
        width: '120px'
    }}>
        <div style={{
            width: '60px',
            height: '60px',
            background: 'white',
            border: '3px solid #e0e7ff',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#4f46e5',
            boxShadow: '0 10px 25px rgba(79, 70, 229, 0.12)',
            transition: 'all 0.3s ease'
        }}>
            {icon}
        </div>
        <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 800, color: '#1e1b4b', fontSize: '0.95rem' }}>{title}</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem', lineHeight: 1.3 }}>{desc}</div>
        </div>
    </div>
);

const MetricRow = ({ label, value, color }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 700, color: '#1e1b4b' }}>
            <span>{label}</span>
            <span>{value}</span>
        </div>
        <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: value, height: '100%', background: color, borderRadius: '4px' }}></div>
        </div>
    </div>
);

const ChartBar = ({ height, label, color = '#e0e7ff' }) => (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        flex: 1,
        height: '100%',
        justifyContent: 'flex-end'
    }}>
        <div
            className="chart-bar-grow"
            style={{
                width: '100%',
                height: height,
                background: color,
                borderRadius: '8px 8px 0 0',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
            }}
        ></div>
        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b' }}>{label}</span>
    </div>
);

const CloudFeature = ({ icon, title, desc }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', flex: '1 1 200px' }}>
        <div style={{ width: '72px', height: '72px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
            {icon}
        </div>
        <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{title}</h4>
        <p style={{ fontSize: '0.875rem', opacity: 0.6, maxWidth: '180px' }}>{desc}</p>
    </div>
);

const FloatingIconNode = ({ icon, title, color }) => (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.75rem',
        animation: 'float 5s ease-in-out infinite',
        animationDelay: `${Math.random() * 2}s`,
        zIndex: 5
    }}>
        <div style={{
            width: '56px',
            height: '56px',
            background: 'white',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: color,
            boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
            border: `1px solid ${color}20`
        }}>
            {icon}
        </div>
        <span style={{ fontWeight: 800, color: '#1e1b4b', fontSize: '0.8rem' }}>{title}</span>
    </div>
);

const IconNode = ({ icon, label, color }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', background: 'white', padding: '1.5rem', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: `1px solid ${color}20`, zIndex: 5 }}>
        <div style={{ width: '48px', height: '48px', background: `${color}10`, color: color, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {icon}
        </div>
        <span style={{ fontWeight: 700, color: '#1e1b4b', fontSize: '0.875rem' }}>{label}</span>
    </div>
);

const FeatureCard = ({ icon, title, desc }) => (
    <div className="glass-card" style={{ padding: '2rem', background: 'white', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
        <div style={{ width: '48px', height: '48px', background: '#f5f3ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5', marginBottom: '1.5rem' }}>
            {icon}
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: '#1e1b4b' }}>{title}</h3>
        <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.5 }}>{desc}</p>
    </div>
);

export default Landing;
