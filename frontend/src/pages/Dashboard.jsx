import React from 'react';
import { TrendingUp, Users, DollarSign, Clock, Filter, ChevronDown } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { label: 'Total Payment Received', value: '₹ 1,24,500', icon: TrendingUp, color: '#10b981' },
    { label: 'Pending Payment', value: '₹ 45,000', icon: Clock, color: '#f59e0b' },
    { label: 'Total Student Count', value: '1,240', icon: Users, color: '#6366f1' },
  ];

  return (
    <div className="animate-fade-in">
      <header className="page-header">
        <div className="title-group">
          <h1>Payment Dashboard</h1>
          <p>Real-time insights for your school operations</p>
        </div>
        
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div className="glass-card" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <Filter size={18} />
            <span>Filters</span>
            <ChevronDown size={16} />
          </div>
          <button className="btn btn-primary">Download Report</button>
        </div>
      </header>

      <section className="grid grid-3" style={{ marginBottom: '2.5rem' }}>
        {stats.map((stat, idx) => (
          <div key={idx} className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{stat.label}</span>
              <div style={{ padding: '0.75rem', borderRadius: '12px', background: `rgba(255,255,255,0.05)`, color: stat.color }}>
                <stat.icon size={24} />
              </div>
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>{stat.value}</h2>
            <p style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem', fontSize: '0.875rem', color: '#10b981' }}>
              <span>+12.5%</span>
              <TrendingUp size={14} />
              <span style={{ color: 'var(--text-muted)', marginLeft: '0.25rem' }}>from last month</span>
            </p>
          </div>
        ))}
      </section>

      <section className="glass-card" style={{ padding: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Recent Payment Activity</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Fee Type</th>
                <th>Standard</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Arjun Sharma', type: 'Tuition', class: '10-A', amount: '₹ 12,000', status: 'Paid', date: '2026-04-05' },
                { name: 'Sarah Joseph', type: 'Transport', class: '8-B', amount: '₹ 3,500', status: 'Partial', date: '2026-04-05' },
                { name: 'Rahul Reddy', type: 'Exam', class: '12-C', amount: '₹ 2,000', status: 'Pending', date: '2026-04-04' },
                { name: 'Anita Patel', type: 'Tuition', class: '5-A', amount: '₹ 8,500', status: 'Paid', date: '2026-04-04' },
              ].map((row, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 600 }}>{row.name}</td>
                  <td>{row.type}</td>
                  <td>{row.class}</td>
                  <td style={{ fontWeight: 600 }}>{row.amount}</td>
                  <td>
                    <span className={`badge badge-${row.status.toLowerCase()}`}>
                      {row.status}
                    </span>
                  </td>
                  <td>{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
