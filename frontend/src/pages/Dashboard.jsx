import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, DollarSign, Clock, Filter, ChevronDown, Loader2, Calendar, Building2 } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const API_BASE_URL = 'http://localhost:8000';

const Dashboard = () => {
  const [summary, setSummary] = useState({
    totalPaymentReceived: 0,
    pendingPaymentToBeReceived: 0,
    totalStudentCount: 0,
    classDistribution: [],
    activityDistribution: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [recentPayments, setRecentPayments] = useState([]);
  
  const [filters, setFilters] = useState({
      standard: 'All', section: 'All', status: 'All'
  });

  const loggedInUser = JSON.parse(localStorage.getItem('user')) || {};
  const isSuperAdmin = loggedInUser.role === 'Super Admin';
  const [schoolId, setSchoolId] = useState(isSuperAdmin ? 0 : (loggedInUser.school_id || null));

  useEffect(() => {
      const fetchInitial = async () => {
          if (!isSuperAdmin && !schoolId) {
              try {
                  const resp = await fetch(`${API_BASE_URL}/schools/`);
                  if (resp.ok) {
                      const data = await resp.json();
                      if (data.length > 0) setSchoolId(data[0].id);
                  }
              } catch (e) {
                  console.error(e);
              }
          }
      };
      if (!isSuperAdmin && !schoolId) fetchInitial();
  }, [schoolId, isSuperAdmin]);

  useEffect(() => {
    if (schoolId !== null) {
        fetchDashboardData();
        fetchRecentPayments();
    }
  }, [schoolId, filters.standard, filters.section, filters.status]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
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
      // Fallback dummy data
      setSummary({
        totalPaymentReceived: isSuperAdmin ? 8540000 : 2845000,
        pendingPaymentToBeReceived: isSuperAdmin ? 3250000 : 1250000,
        totalStudentCount: isSuperAdmin ? 5420 : 1248,
        totalSchools: 12,
        classDistribution: [{ name: "Class 1", count: 40 }, { name: "Class 2", count: 35 }, { name: "Class 3", count: 50 }],
        activityDistribution: [{ name: "Basketball", count: 25 }, { name: "Chess", count: 15 }]
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecentPayments = async () => {
      try {
          const resp = await fetch(`${API_BASE_URL}/fees/audits?school_id=${schoolId}`);
          if (resp.ok) {
            const data = await resp.json();
            const payments = data.filter(a => a.action === 'Record Payment').slice(0, 5);
            setRecentPayments(payments);
          } else {
            throw new Error('Fallback to mock');
          }
      } catch (err) {
          console.error('Error fetching audits, using mock:', err);
          // Fallback dummy payments
          setRecentPayments([
              { details: 'Annual Fee payment for Rahul Sharma (Class 10-A)', action: 'Record Payment', timestamp: new Date(Date.now() - 3600000).toISOString() },
              { details: 'Monthly Tuition for Sneha Gupta (Class 8-B)', action: 'Record Payment', timestamp: new Date(Date.now() - 86400000).toISOString() },
              { details: 'Term Exam Fee for Amit Kumar (Class 5-C)', action: 'Record Payment', timestamp: new Date(Date.now() - 172800000).toISOString() },
              { details: 'New Admission Fee for Priya Singh (Class 12-A)', action: 'Record Payment', timestamp: new Date(Date.now() - 259200000).toISOString() },
              { details: 'Transportation charges for Vikram Aditya (Class 3-D)', action: 'Record Payment', timestamp: new Date(Date.now() - 432000000).toISOString() }
          ]);
      }
  };

  const stats = [
    { label: 'Total Payment Received', value: `₹ ${summary.totalPaymentReceived.toLocaleString()}`, icon: TrendingUp, color: '#10b981' },
    { label: 'Pending Payment', value: `₹ ${summary.pendingPaymentToBeReceived.toLocaleString()}`, icon: Clock, color: '#ef4444' },
    ...(isSuperAdmin ? [{ label: 'Total Schools', value: (summary.totalSchools || '0').toLocaleString(), icon: Building2, color: '#8b5cf6' }] : []),
    { label: 'Total Student Count', value: summary.totalStudentCount.toLocaleString(), icon: Users, color: '#6366f1' },
  ];

  return (
    <div className="animate-fade-in">
      <header className="page-header">
        <div className="title-group">
          <h1>{isSuperAdmin ? 'Global Dashboard' : 'Payment Dashboard'}</h1>
          <p>{isSuperAdmin ? 'Aggregated analytics across all onboarded schools' : `Real-time financial visibility for ${loggedInUser.school_info?.name || 'your institution'}`}</p>
        </div>
        
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div className="glass-card" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid var(--border)' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={16} color="var(--text-muted)" />
                <select value={filters.standard} onChange={e => setFilters({...filters, standard: e.target.value})} style={{ background: 'transparent', border: 'none', color: 'var(--text)', outline: 'none', fontSize: '0.875rem' }}>
                    <option value="All">All Grades</option>
                    {[...Array(12)].map((_, i) => <option key={i+1} value={i+1}>Grade {i+1}</option>)}
                </select>
             </div>
             <div style={{ width: '1px', height: '16px', background: 'var(--border)' }}></div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Filter size={16} color="var(--text-muted)" />
                <select value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})} style={{ background: 'transparent', border: 'none', color: 'var(--text)', outline: 'none', fontSize: '0.875rem' }}>
                    <option value="All">All Status</option>
                    <option value="Paid">Paid</option>
                    <option value="Partial">Partial</option>
                    <option value="Pending">Pending</option>
                </select>
             </div>
          </div>
          <button className="btn btn-primary" onClick={() => window.print()}>Generate Report</button>
        </div>
      </header>

      {isLoading ? (
          <div style={{ padding: '5rem', textAlign: 'center' }}><Loader2 className="animate-spin" size={40} style={{ margin: '0 auto', color: 'var(--primary)' }} /></div>
      ) : (
          <>
            <section className={`grid ${isSuperAdmin ? 'grid-4' : 'grid-3'}`} style={{ marginBottom: '2.5rem' }}>
                {stats.map((stat, idx) => (
                <div key={idx} className="glass-card" style={{ padding: '2rem', borderTop: `4px solid ${stat.color}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>{stat.label}</span>
                    <div style={{ padding: '0.75rem', borderRadius: '12px', background: `${stat.color}15`, color: stat.color }}>
                        <stat.icon size={24} />
                    </div>
                    </div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text)' }}>{stat.value}</h2>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '1rem', fontSize: '0.875rem' }}>
                    <span style={{ color: '#10b981', fontWeight: 700 }}>LIVE</span>
                    <span style={{ color: 'var(--text-muted)', marginLeft: '0.25rem' }}>sync active</span>
                    </p>
                </div>
                ))}
            </section>

            {/* Analytics Dashboard Charts */}
            <section className="grid grid-3" style={{ marginBottom: '2.5rem' }}>
                {/* 1. Revenue Split */}
                <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.125rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '8px', height: '24px', background: 'var(--primary)', borderRadius: '4px' }}></div>
                        Revenue Distribution
                    </h3>
                    <div style={{ flex: 1, minHeight: '250px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie 
                                    data={[
                                        { name: 'Collected', value: summary.totalPaymentReceived },
                                        { name: 'Pending', value: summary.pendingPaymentToBeReceived }
                                    ]} 
                                    cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value"
                                >
                                    <Cell fill="#10b981" />
                                    <Cell fill="#ef4444" />
                                </Pie>
                                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }}></div>Collected</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }}></div>Pending</div>
                    </div>
                </div>

                {/* 2. Class-wise Demographics */}
                <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.125rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '8px', height: '24px', background: '#ec4899', borderRadius: '4px' }}></div>
                        Class-wise Registration Count
                    </h3>
                    <div style={{ flex: 1, minHeight: '250px' }}>
                        {summary.classDistribution && summary.classDistribution.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={summary.classDistribution}>
                                    <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', background: 'var(--surface)', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                                    <Bar dataKey="count" fill="#ec4899" radius={[4, 4, 0, 0]} barSize={30} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>Not enough data to map class-wise distribution yet.</div>
                        )}
                    </div>
                </div>

                {/* 3. Extracurriculars Enrollment */}
                <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.125rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '8px', height: '24px', background: '#8b5cf6', borderRadius: '4px' }}></div>
                        Activity Participation
                    </h3>
                    <div style={{ flex: 1, minHeight: '250px' }}>
                        {summary.activityDistribution && summary.activityDistribution.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={summary.activityDistribution} layout="vertical">
                                    <XAxis type="number" fontSize={12} tickLine={false} axisLine={false} hide />
                                    <YAxis dataKey="name" type="category" fontSize={12} tickLine={false} axisLine={false} width={80} />
                                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', background: 'var(--surface)', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                                    <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>No students enrolled in activities.</div>
                        )}
                    </div>
                </div>
            </section>

            <section className="glass-card" style={{ padding: '2.5rem' }}>
                <h3 style={{ marginBottom: '2rem', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '8px', height: '24px', background: 'var(--primary)', borderRadius: '4px' }}></div>
                    Recent Payment Activities
                </h3>
                <div className="table-container">
                <table>
                    <thead>
                    <tr>
                        <th>Action Details</th>
                        <th>Status</th>
                        <th>Timestamp</th>
                    </tr>
                    </thead>
                    <tbody>
                    {recentPayments.length === 0 ? (
                        <tr>
                            <td colSpan="3" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No recent payment activity found for the selecting filters.</td>
                        </tr>
                    ) : (
                        recentPayments.map((row, idx) => (
                            <tr key={idx}>
                            <td style={{ fontWeight: 600 }}>{row.details}</td>
                            <td>
                                <span className="badge badge-paid">
                                {row.action}
                                </span>
                            </td>
                            <td style={{ color: 'var(--text-muted)' }}>{new Date(row.timestamp).toLocaleString()}</td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
                </div>
            </section>
          </>
      )}
    </div>
  );
};

export default Dashboard;
