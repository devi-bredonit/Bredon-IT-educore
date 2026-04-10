import React, { useState, useEffect, useMemo } from 'react';
import {
    Plus, Edit2, Trash2, X, CheckCircle2, Loader2, AlertCircle,
    DollarSign, Layers, Building2, IndianRupee, TrendingUp,
    Calendar, RefreshCw, Filter, BookOpen, ChevronDown
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000';

const FREQUENCY_OPTIONS = ['Annual', 'Quarterly', 'Monthly', 'Bi-Annual', 'One-time'];
const FREQUENCY_COLORS = {
    'Annual':    { bg: 'rgba(99,102,241,0.1)',  color: '#6366f1' },
    'Quarterly': { bg: 'rgba(16,185,129,0.1)',  color: '#10b981' },
    'Monthly':   { bg: 'rgba(245,158,11,0.1)',  color: '#d97706' },
    'Bi-Annual': { bg: 'rgba(59,130,246,0.1)',  color: '#3b82f6' },
    'One-time':  { bg: 'rgba(239,68,68,0.1)',   color: '#ef4444' },
};

const CLASS_OPTIONS = ['LKG', 'UKG', ...[...Array(12)].map((_, i) => String(i + 1))];

const fmt = (n) => Number(n || 0).toLocaleString('en-IN');

// ─── Summary Card ────────────────────────────────────────────────────────────
const SummaryCard = ({ icon, label, value, sub, color }) => (
    <div className="glass-card" style={{
        padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem',
        borderLeft: `4px solid ${color}`
    }}>
        <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: `${color}18`, display: 'flex',
            alignItems: 'center', justifyContent: 'center', flexShrink: 0
        }}>
            {React.cloneElement(icon, { size: 22, color })}
        </div>
        <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{label}</p>
            <p style={{ fontSize: '1.4rem', fontWeight: 800, lineHeight: 1 }}>{value}</p>
            {sub && <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>{sub}</p>}
        </div>
    </div>
);

// ─── Frequency Badge ─────────────────────────────────────────────────────────
const FreqBadge = ({ freq }) => {
    const style = FREQUENCY_COLORS[freq] || { bg: 'var(--surface-hover)', color: 'var(--text-muted)' };
    return (
        <span style={{
            padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem',
            fontWeight: 700, background: style.bg, color: style.color
        }}>{freq}</span>
    );
};

// ═════════════════════════════════════════════════════════════════════════════
const FeeSettings = ({ user }) => {
    const isSuperAdmin = user?.role === 'Super Admin';
    const directSchoolId = user?.school_id || null;

    // School picker (Super Admin only)
    const [schools, setSchools]           = useState([]);
    const [selectedSchoolId, setSelectedSchoolId] = useState(directSchoolId);
    const schoolId = isSuperAdmin ? selectedSchoolId : directSchoolId;

    // UI state
    const [activeTab, setActiveTab]       = useState('types');
    const [isLoading, setIsLoading]       = useState(false);
    const [toast, setToast]               = useState(null);   // { msg, type }
    const [classFilter, setClassFilter] = useState('');   // '' = all classes

    // Fee heads data
    const [feeHeads, setFeeHeads]         = useState([]);

    // Class structures
    const [classStructures, setClassStructures] = useState([]);

    // Modal: fee head
    const [headModal, setHeadModal]       = useState(false);
    const [headMode, setHeadMode]         = useState('add'); // 'add' | 'edit'
    const [headSaving, setHeadSaving]     = useState(false);
    const emptyHead = () => ({
        school_id: schoolId,
        name: '', description: '',
        amount: '', frequency: 'Annual',
        class_name: '',
        is_active: true
    });
    const [currentHead, setCurrentHead]   = useState(emptyHead());

    // Modal: class structure
    const [structModal, setStructModal]   = useState(false);
    const [structSaving, setStructSaving] = useState(false);
    const [currentStruct, setCurrentStruct] = useState({ class_name: '1', fee_head_id: '', amount: '' });

    // ── fetch schools (Super Admin) ───────────────────────────────────────────
    useEffect(() => {
        if (!isSuperAdmin) return;
        fetch(`${API_BASE_URL}/schools/`)
            .then(r => r.ok ? r.json() : [])
            .then(setSchools)
            .catch(() => {});
    }, [isSuperAdmin]);

    // ── fetch data on school/session change ──────────────────────────────────
    useEffect(() => {
        if (schoolId) fetchData();
        else { setFeeHeads([]); setClassStructures([]); }
    }, [schoolId]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [hr, cr] = await Promise.all([
                fetch(`${API_BASE_URL}/fee-configs/heads?school_id=${schoolId}`),
                fetch(`${API_BASE_URL}/class-fees/?school_id=${schoolId}`)
            ]);
            if (hr.ok) setFeeHeads(await hr.json());
            if (cr.ok) setClassStructures(await cr.json());
        } catch {
            showToast('Failed to load data — is the backend running?', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // ── derived / filtered data ───────────────────────────────────────────────
    const filteredHeads = useMemo(() =>
        classFilter
            ? feeHeads.filter(h => h.class_name === classFilter)
            : feeHeads,
        [feeHeads, classFilter]
    );

    const activeHeads  = filteredHeads.filter(h => h.is_active);
    const totalAmount  = activeHeads.reduce((s, h) => s + (Number(h.amount) || 0), 0);
    const classesList = [...new Set(feeHeads.map(h => h.class_name).filter(Boolean))].sort();

    // ── helpers ───────────────────────────────────────────────────────────────
    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    // ── Fee Head CRUD ─────────────────────────────────────────────────────────
    const openAddHead = () => {
        setHeadMode('add');
        setCurrentHead({ ...emptyHead(), school_id: schoolId });
        setHeadModal(true);
    };

    const openEditHead = (head) => {
        setHeadMode('edit');
        setCurrentHead({ ...head });
        setHeadModal(true);
    };

    const saveHead = async (e) => {
        e.preventDefault();
        if (!schoolId) { showToast('Select a school first', 'error'); return; }
        setHeadSaving(true);
        try {
            const method = headMode === 'add' ? 'POST' : 'PUT';
            const url    = headMode === 'add'
                ? `${API_BASE_URL}/fee-configs/heads`
                : `${API_BASE_URL}/fee-configs/heads/${currentHead.id}`;

            const body = {
                school_id:        Number(schoolId),
                name:             currentHead.name.trim(),
                description:      currentHead.description || null,
                amount:           parseFloat(currentHead.amount) || 0,
                frequency:        currentHead.frequency,
                class_name:       currentHead.class_name || null,
                is_active:        currentHead.is_active,
            };

            const resp = await fetch(url, {
                method, headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (resp.ok) {
                fetchData();
                setHeadModal(false);
                showToast(`Fee type ${headMode === 'add' ? 'created' : 'updated'} successfully!`);
            } else {
                const err = await resp.json().catch(() => ({}));
                showToast(err.detail || 'Failed to save fee type', 'error');
            }
        } catch {
            showToast('Network error — check backend connection', 'error');
        } finally {
            setHeadSaving(false);
        }
    };

    const deleteHead = async (id, name) => {
        if (!window.confirm(`Delete "${name}"? This may affect student fee records.`)) return;
        const resp = await fetch(`${API_BASE_URL}/fee-configs/heads/${id}`, { method: 'DELETE' });
        if (resp.ok) { fetchData(); showToast('Fee type deleted'); }
        else showToast('Failed to delete', 'error');
    };

    // ── Class Structure CRUD ──────────────────────────────────────────────────
    const openStructModal = (s = null) => {
        setCurrentStruct(s || { class_name: '1', fee_head_id: feeHeads[0]?.id || '', amount: '' });
        setStructModal(true);
    };

    const saveStruct = async (e) => {
        e.preventDefault();
        setStructSaving(true);
        try {
            const body = {
                school_id:    Number(schoolId),
                class_name:   currentStruct.class_name,
                fee_head_id:  parseInt(currentStruct.fee_head_id),
                amount:       parseFloat(currentStruct.amount)
            };
            const resp = await fetch(`${API_BASE_URL}/class-fees/`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            if (resp.ok) { fetchData(); setStructModal(false); showToast('Class structure saved!'); }
            else {
                const err = await resp.json().catch(() => ({}));
                showToast(err.detail || 'Failed to save', 'error');
            }
        } catch { showToast('Network error', 'error'); }
        finally { setStructSaving(false); }
    };

    const deleteStruct = async (id) => {
        if (!window.confirm('Remove this class fee structure?')) return;
        const resp = await fetch(`${API_BASE_URL}/class-fees/${id}`, { method: 'DELETE' });
        if (resp.ok) { fetchData(); showToast('Structure removed'); }
    };

    const selectedSchoolName = isSuperAdmin
        ? schools.find(s => s.id === Number(selectedSchoolId))?.name || ''
        : '';

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div className="animate-fade-in">

            {/* ── Page Header ── */}
            <header className="page-header" style={{ marginBottom: '1.5rem' }}>
                <div className="title-group">
                    <h1>Fee Configuration</h1>
                    <p>Define school-specific fee types, amounts, and class-wise structures.</p>
                </div>
                {schoolId && (
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button className="btn" onClick={fetchData}
                            style={{ padding: '0.75rem', border: '1px solid var(--border)', borderRadius: 12 }}>
                            <RefreshCw size={18} />
                        </button>
                        <button className="btn btn-primary" onClick={() => activeTab === 'types' ? openAddHead() : openStructModal()}>
                            <Plus size={20} />
                            <span>{activeTab === 'types' ? 'Add Fee Type' : 'Set Class Fee'}</span>
                        </button>
                    </div>
                )}
            </header>

            {/* ── Super Admin: School Picker ── */}
            {isSuperAdmin && (
                <div className="glass-card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--primary)' }}>
                        <Building2 size={20} />
                        <span style={{ fontWeight: 700, fontSize: '0.9rem', whiteSpace: 'nowrap' }}>Select School</span>
                    </div>
                    <select
                        className="form-input"
                        style={{ minWidth: 260, flex: 1, maxWidth: 380 }}
                        value={selectedSchoolId || ''}
                        onChange={e => setSelectedSchoolId(e.target.value ? Number(e.target.value) : null)}
                    >
                        <option value="">— Choose a school —</option>
                        {schools.map(s => (
                            <option key={s.id} value={s.id}>{s.name}{s.branch ? ` (${s.branch})` : ''}</option>
                        ))}
                    </select>
                    {selectedSchoolName && (
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            Managing: <strong style={{ color: 'var(--text)' }}>{selectedSchoolName}</strong>
                        </span>
                    )}
                </div>
            )}

            {/* ── No School Placeholder ── */}
            {!schoolId && (
                <div className="glass-card" style={{ padding: '5rem', textAlign: 'center' }}>
                    <Building2 size={52} style={{ margin: '0 auto 1rem', color: 'var(--text-muted)', opacity: 0.3 }} />
                    <h3 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>No School Selected</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                        {isSuperAdmin
                            ? 'Select a school above to manage its fee configuration.'
                            : 'Your account is not linked to a school. Contact your administrator.'}
                    </p>
                </div>
            )}

            {schoolId && !isLoading && (
                /* ── Summary Cards ── */
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
                    <SummaryCard icon={<Layers />}      label="Total Fee Types"   value={feeHeads.length} sub={`${activeHeads.length} active`} color="#6366f1" />
                    <SummaryCard icon={<IndianRupee />}  label="Total Annual Load" value={`₹${fmt(totalAmount)}`} sub="Sum of active, filtered fees" color="#10b981" />
                    <SummaryCard icon={<Calendar />}     label="Classes Assigned" value={classesList.length || '—'} sub={classesList[0] || 'None defined'} color="#f59e0b" />
                    <SummaryCard icon={<BookOpen />}     label="Class Structures"  value={classStructures.length} sub="Default fee mappings" color="#3b82f6" />
                </div>
            )}

            {schoolId && (
                <>
                    {/* ── Tabs ── */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                        {[
                            { id: 'types', label: 'Fee Types & Amounts', icon: <Layers size={17} /> },
                            { id: 'classes', label: 'Class-wise Defaults', icon: <DollarSign size={17} /> },
                        ].map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                                padding: '0.9rem 1.5rem', background: 'transparent', border: 'none',
                                cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center',
                                gap: '0.5rem',
                                borderBottom: activeTab === tab.id ? '2px solid var(--primary)' : '2px solid transparent',
                                color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-muted)'
                            }}>
                                {tab.icon} {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="glass-card" style={{ padding: '2rem' }}>
                        {isLoading ? (
                            <div style={{ padding: '5rem', textAlign: 'center' }}>
                                <Loader2 className="animate-spin" size={34} style={{ margin: '0 auto', color: 'var(--primary)' }} />
                                <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Loading fee data…</p>
                            </div>
                        ) : (
                            <>
                            {/* ══════════ TAB 1: FEE TYPES ══════════ */}
                            {activeTab === 'types' && (
                                <>
                                    {/* Info banner */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', padding: '0.9rem 1.25rem', background: 'rgba(99,102,241,0.05)', borderRadius: 12, border: '1px solid rgba(99,102,241,0.12)' }}>
                                        <AlertCircle size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                                            Each fee type belongs exclusively to this school. Amounts and frequencies can be set per class and drive student billing.
                                        </p>
                                    </div>

                                    {/* Class filter */}
                                    {classesList.length > 0 && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                                            <Filter size={16} style={{ color: 'var(--text-muted)' }} />
                                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Filter by class:</span>
                                            <button onClick={() => setClassFilter('')}
                                                style={{ padding: '4px 14px', borderRadius: 20, border: '1px solid var(--border)', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', background: !classFilter ? 'var(--primary)' : 'transparent', color: !classFilter ? 'white' : 'var(--text-muted)' }}>
                                                All
                                            </button>
                                            {classesList.map(c => (
                                                <button key={c} onClick={() => setClassFilter(c)}
                                                    style={{ padding: '4px 14px', borderRadius: 20, border: '1px solid var(--border)', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', background: classFilter === c ? 'var(--primary)' : 'transparent', color: classFilter === c ? 'white' : 'var(--text-muted)' }}>
                                                    {c}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {/* Table */}
                                    <div className="table-container">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Fee Type / Service</th>
                                                    <th>Description</th>
                                                    <th>Class</th>
                                                    <th>Frequency</th>
                                                    <th style={{ textAlign: 'right' }}>Fee Amount</th>
                                                    <th>Status</th>
                                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredHeads.length === 0 ? (
                                                    <tr><td colSpan="7" style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--text-muted)' }}>
                                                        No fee types defined{classFilter ? ` for class ${classFilter}` : ''}. Click <strong>Add Fee Type</strong> to get started.
                                                    </td></tr>
                                                ) : filteredHeads.map(head => (
                                                    <tr key={head.id}>
                                                        <td>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(99,102,241,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                                    <IndianRupee size={16} color="var(--primary)" />
                                                                </div>
                                                                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{head.name}</span>
                                                            </div>
                                                        </td>
                                                        <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                                            {head.description || <span style={{ opacity: 0.4 }}>—</span>}
                                                        </td>
                                                        <td>
                                                            {head.class_name
                                                                ? <span style={{ fontWeight: 600, fontSize: '0.85rem', background: 'rgba(245,158,11,0.08)', color: '#d97706', padding: '3px 10px', borderRadius: 20 }}>{head.class_name}</span>
                                                                : <span style={{ opacity: 0.4 }}>—</span>}
                                                        </td>
                                                        <td><FreqBadge freq={head.frequency} /></td>
                                                        <td style={{ textAlign: 'right' }}>
                                                            <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#10b981' }}>
                                                                ₹{fmt(head.amount)}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span className={`badge badge-${head.is_active ? 'paid' : 'pending'}`}>
                                                                {head.is_active ? 'Active' : 'Inactive'}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                                                                <button onClick={() => openEditHead(head)} className="btn"
                                                                    style={{ padding: '0.45rem', background: 'transparent', border: '1px solid var(--border)', borderRadius: 8 }}
                                                                    title="Edit">
                                                                    <Edit2 size={15} />
                                                                </button>
                                                                <button onClick={() => deleteHead(head.id, head.name)} className="btn"
                                                                    style={{ padding: '0.45rem', background: 'rgba(239,68,68,0.06)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.18)', borderRadius: 8 }}
                                                                    title="Delete">
                                                                    <Trash2 size={15} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            {filteredHeads.length > 0 && (
                                                <tfoot>
                                                    <tr style={{ borderTop: '2px solid var(--border)' }}>
                                                        <td colSpan="4" style={{ padding: '0.9rem 1rem', fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                                            {filteredHeads.filter(h => h.is_active).length} active fee types
                                                        </td>
                                                        <td style={{ textAlign: 'right', padding: '0.9rem 1rem', fontWeight: 800, fontSize: '1.1rem', color: '#10b981' }}>
                                                            ₹{fmt(totalAmount)}
                                                        </td>
                                                        <td colSpan="2" style={{ padding: '0.9rem 1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                            Total {classFilter ? `(${classFilter})` : '(all classes)'}
                                                        </td>
                                                    </tr>
                                                </tfoot>
                                            )}
                                        </table>
                                    </div>
                                </>
                            )}

                            {/* ══════════ TAB 2: CLASS STRUCTURES ══════════ */}
                            {activeTab === 'classes' && (
                                <>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', padding: '0.9rem 1.25rem', background: 'rgba(99,102,241,0.05)', borderRadius: 12, border: '1px solid rgba(99,102,241,0.12)' }}>
                                        <AlertCircle size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                                            Class-wise defaults auto-populate when enrolling a new student into a specific class.
                                        </p>
                                    </div>

                                    {feeHeads.filter(h => h.is_active).length === 0 && (
                                        <div style={{ marginBottom: '1rem', padding: '0.9rem 1.25rem', background: 'rgba(245,158,11,0.08)', borderRadius: 10, border: '1px solid rgba(245,158,11,0.2)', fontSize: '0.875rem', color: '#b45309' }}>
                                            ⚠️ Create at least one active Fee Type first, then set class-wise amounts here.
                                        </div>
                                    )}

                                    <div className="table-container">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Class</th>
                                                    <th>Fee Type</th>
                                                    <th>Session / Class</th>
                                                    <th style={{ textAlign: 'right' }}>Default Amount</th>
                                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {classStructures.length === 0 ? (
                                                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--text-muted)' }}>
                                                        No class-wise structures defined yet.
                                                    </td></tr>
                                                ) : classStructures.map(s => {
                                                    const head = feeHeads.find(h => h.id === s.fee_head_id);
                                                    return (
                                                        <tr key={s.id}>
                                                            <td><strong>Class {s.class_name}</strong></td>
                                                            <td>{head ? head.name : <span style={{ opacity: 0.4 }}>Unknown</span>}</td>
                                                            <td>
                                                                {head?.class_name
                                                                    ? <span style={{ fontWeight: 600, fontSize: '0.82rem', background: 'rgba(245,158,11,0.08)', color: '#d97706', padding: '2px 9px', borderRadius: 20 }}>{head.class_name}</span>
                                                                    : '—'}
                                                            </td>
                                                            <td style={{ textAlign: 'right', fontWeight: 800, color: '#10b981' }}>₹{fmt(s.amount)}</td>
                                                            <td>
                                                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                                                                    <button onClick={() => openStructModal(s)} className="btn"
                                                                        style={{ padding: '0.45rem', background: 'transparent', border: '1px solid var(--border)', borderRadius: 8 }}
                                                                        title="Edit">
                                                                        <Edit2 size={15} />
                                                                    </button>
                                                                    <button onClick={() => deleteStruct(s.id)} className="btn"
                                                                        style={{ padding: '0.45rem', background: 'rgba(239,68,68,0.06)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.18)', borderRadius: 8 }}>
                                                                        <Trash2 size={15} />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            )}
                            </>
                        )}
                    </div>
                </>
            )}

            {/* ══════════ MODAL: FEE HEAD ══════════ */}
            {headModal && (
                <div className="overlay">
                    <div className="modal-card" style={{ maxWidth: 560, width: '95%' }}>
                        <div className="modal-header">
                            <div>
                                <h2>{headMode === 'add' ? 'Add New Fee Type' : 'Edit Fee Type'}</h2>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                    {headMode === 'add' ? 'Define a new school-specific fee service and its amount.' : 'Update the fee type details and pricing.'}
                                </p>
                            </div>
                            <button className="close-btn" onClick={() => setHeadModal(false)}><X size={20} /></button>
                        </div>

                        <div className="modal-content">
                            <form onSubmit={saveHead}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                                    {/* Name */}
                                    <div className="input-group">
                                        <label>Fee Type / Service Name *</label>
                                        <input type="text" required className="form-input"
                                            placeholder="e.g. Annual Sports Fee, Dance Practice, Drawing Class"
                                            value={currentHead.name}
                                            onChange={e => setCurrentHead({ ...currentHead, name: e.target.value })} />
                                    </div>

                                    {/* Description */}
                                    <div className="input-group">
                                        <label>Description</label>
                                        <textarea className="form-input" rows={2}
                                            placeholder="Briefly describe what this fee covers…"
                                            value={currentHead.description || ''}
                                            onChange={e => setCurrentHead({ ...currentHead, description: e.target.value })} />
                                    </div>

                                    {/* Amount + Frequency side by side */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div className="input-group">
                                            <label>Fee Amount (₹) *</label>
                                            <div style={{ position: 'relative' }}>
                                                <IndianRupee size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                                <input type="number" required min="0" step="0.01" className="form-input"
                                                    style={{ paddingLeft: '2.4rem' }}
                                                    placeholder="0.00"
                                                    value={currentHead.amount}
                                                    onChange={e => setCurrentHead({ ...currentHead, amount: e.target.value })} />
                                            </div>
                                        </div>

                                        <div className="input-group">
                                            <label>Billing Frequency *</label>
                                            <div style={{ position: 'relative' }}>
                                                <select required className="form-input"
                                                    style={{ paddingRight: '2rem', appearance: 'none' }}
                                                    value={currentHead.frequency}
                                                    onChange={e => setCurrentHead({ ...currentHead, frequency: e.target.value })}>
                                                    {FREQUENCY_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                                                </select>
                                                <ChevronDown size={14} style={{ position: 'absolute', right: '0.9rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Class */}
                                    <div className="input-group">
                                        <label>Class</label>
                                        <div style={{ position: 'relative' }}>
                                            <select className="form-input"
                                                style={{ paddingRight: '2rem', appearance: 'none' }}
                                                value={currentHead.class_name || ''}
                                                onChange={e => setCurrentHead({ ...currentHead, class_name: e.target.value || null })}>
                                                <option value="">— Applicable to all classes —</option>
                                                {CLASS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                            <ChevronDown size={14} style={{ position: 'absolute', right: '0.9rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }} />
                                        </div>
                                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>
                                            Linking to a class assigns the fee rate specifically to that class.
                                        </span>
                                    </div>

                                    {/* Preview chip */}
                                    {currentHead.name && (Number(currentHead.amount) > 0) && (
                                        <div style={{ padding: '0.85rem 1.1rem', borderRadius: 12, background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontWeight: 700, color: 'var(--text)' }}>{currentHead.name}</span>
                                            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                                                <FreqBadge freq={currentHead.frequency} />
                                                <span style={{ fontWeight: 800, color: '#10b981', fontSize: '1rem' }}>₹{fmt(currentHead.amount)}</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Active toggle */}
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                                        <input type="checkbox" checked={currentHead.is_active}
                                            onChange={e => setCurrentHead({ ...currentHead, is_active: e.target.checked })} />
                                        <div>
                                            <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Mark as Active</span>
                                            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>Inactive types won't appear during student billing.</p>
                                        </div>
                                    </label>
                                </div>

                                <div style={{ marginTop: '2rem', display: 'flex', gap: '0.75rem' }}>
                                    <button type="button" className="btn" style={{ flex: 1, border: '1px solid var(--border)' }}
                                        onClick={() => setHeadModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={headSaving}>
                                        {headSaving
                                            ? <><Loader2 size={18} className="animate-spin" /> Saving…</>
                                            : headMode === 'add' ? '✓ Create Fee Type' : '✓ Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════ MODAL: CLASS STRUCTURE ══════════ */}
            {structModal && (
                <div className="overlay">
                    <div className="modal-card" style={{ maxWidth: 420 }}>
                        <div className="modal-header">
                            <div>
                                <h2>{currentStruct?.id ? 'Edit Class Fee Default' : 'Set Class Fee Default'}</h2>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{currentStruct?.id ? 'Update the default amount for this class.' : 'Automatically pre-fill amounts during student enrolment.'}</p>
                            </div>
                            <button className="close-btn" onClick={() => setStructModal(false)}><X size={20} /></button>
                        </div>
                        <div className="modal-content">
                            <form onSubmit={saveStruct}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    <div className="input-group">
                                        <label>Class *</label>
                                        <div style={{ position: 'relative' }}>
                                            <select required className="form-input" value={currentStruct.class_name}
                                                disabled={!!currentStruct.id}
                                                style={{ paddingRight: '2rem', appearance: 'none', background: currentStruct.id ? 'var(--surface-hover)' : '' }}
                                                onChange={e => setCurrentStruct({ ...currentStruct, class_name: e.target.value })}>
                                                <option value="LKG">LKG</option>
                                                <option value="UKG">UKG</option>
                                                {[...Array(12)].map((_, i) => <option key={i + 1} value={String(i + 1)}>Class {i + 1}</option>)}
                                            </select>
                                            <ChevronDown size={14} style={{ position: 'absolute', right: '0.9rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }} />
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <label>Fee Type *</label>
                                        <div style={{ position: 'relative' }}>
                                            <select required className="form-input" value={currentStruct.fee_head_id}
                                                disabled={!!currentStruct.id}
                                                style={{ paddingRight: '2rem', appearance: 'none', background: currentStruct.id ? 'var(--surface-hover)' : '' }}
                                                onChange={e => setCurrentStruct({ ...currentStruct, fee_head_id: e.target.value })}>
                                                <option value="">Select a fee type…</option>
                                                {feeHeads.filter(h => h.is_active || (currentStruct.id && currentStruct.fee_head_id === h.id)).map(h => (
                                                    <option key={h.id} value={h.id}>{h.name}{h.class_name ? ` (${h.class_name})` : ''} — ₹{fmt(h.amount)}</option>
                                                ))}
                                            </select>
                                            <ChevronDown size={14} style={{ position: 'absolute', right: '0.9rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }} />
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <label>Override Amount (₹) *</label>
                                        <div style={{ position: 'relative' }}>
                                            <IndianRupee size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                            <input type="number" required min="0" step="0.01" className="form-input"
                                                style={{ paddingLeft: '2.4rem' }}
                                                placeholder="Leave as-is or override the base amount"
                                                value={currentStruct.amount}
                                                onChange={e => setCurrentStruct({ ...currentStruct, amount: e.target.value })} />
                                        </div>
                                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>
                                            You can override the base fee for a specific class.
                                        </span>
                                    </div>
                                </div>
                                <div style={{ marginTop: '2rem', display: 'flex', gap: '0.75rem' }}>
                                    <button type="button" className="btn" style={{ flex: 1, border: '1px solid var(--border)' }}
                                        onClick={() => setStructModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={structSaving}>
                                        {structSaving ? <><Loader2 size={18} className="animate-spin" /> Saving…</> : '✓ Set Structure'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════ TOAST ══════════ */}
            {toast && (
                <div style={{
                    position: 'fixed', bottom: '2rem', right: '2rem',
                    background: toast.type === 'error' ? '#ef4444' : '#10b981',
                    color: 'white', padding: '1rem 1.75rem', borderRadius: 14,
                    zIndex: 9999, display: 'flex', alignItems: 'center', gap: '0.75rem',
                    boxShadow: '0 12px 35px rgba(0,0,0,0.25)', maxWidth: 380
                }}>
                    <CheckCircle2 size={22} />
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{toast.msg}</span>
                </div>
            )}
        </div>
    );
};

export default FeeSettings;
