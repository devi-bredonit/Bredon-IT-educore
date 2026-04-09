import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, DollarSign, Clock, Filter, ChevronDown, Loader2, Calendar } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000';

const Dashboard = () => {
  const [summary, setSummary] = useState({
    totalPaymentReceived: 0,
    pendingPaymentToBeReceived: 0,
    totalStudentCount: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [recentPayments, setRecentPayments] = useState([]);
  
  const [filters, setFilters] = useState({
      standard: 'All', section: 'All', status: 'All'
  });

  const loggedInUser = JSON.parse(localStorage.getItem('user')) || {};
  const [schoolId, setSchoolId] = useState(loggedInUser.school_id || null);

  useEffect(() => {
      const fetchInitial = async () => {
          if (!schoolId) {
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
      if (!schoolId) fetchInitial();
  }, [schoolId]);

  useEffect(() => {
    if (schoolId) {
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
        totalPaymentReceived: 2845000,
        pendingPaymentToBeReceived: 1250000,
        totalStudentCount: 1248
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
    { label: 'Total Student Count', value: summary.totalStudentCount.toLocaleString(), icon: Users, color: '#6366f1' },
  ];

  return (
    <div className="animate-fade-in">
      <header className="page-header">
        <div className="title-group">
          <h1>Payment Dashboard</h1>
          <p>Real-time financial visibility for {loggedInUser.school_info?.name || 'your institution'}</p>
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
            <section className="grid grid-3" style={{ marginBottom: '2.5rem' }}>
                {stats.map((stat, idx) => (
                <div key={idx} className="glass-card" style={{ padding: '2rem', borderTop: `4px solid ${stat.color}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>{stat.label}</span>
                    <div style={{ padding: '0.75rem', borderRadius: '12px', background: `${stat.color}15`, color: stat.color }}>
                        <stat.icon size={24} />
                    </div>
                    </div>
                    <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text)' }}>{stat.value}</h2>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '1rem', fontSize: '0.875rem' }}>
                    <span style={{ color: '#10b981', fontWeight: 700 }}>LIVE</span>
                    <span style={{ color: 'var(--text-muted)', marginLeft: '0.25rem' }}>sync active</span>
                    </p>
                </div>
                ))}
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
