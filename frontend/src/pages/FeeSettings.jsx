import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, CheckCircle2, Loader2, Settings, AlertCircle, DollarSign, Layers } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000';

const FeeSettings = () => {
    // Shared State
    const [activeTab, setActiveTab] = useState('types'); // 'types' or 'classes'
    const [isLoading, setIsLoading] = useState(true);
    const [showToast, setShowToast] = useState(null);

    const loggedInUser = JSON.parse(localStorage.getItem('user')) || {};
    const schoolId = loggedInUser.school_id || null;

    // Fee Types State
    const [feeHeads, setFeeHeads] = useState([]);
    const [isHeadModalOpen, setIsHeadModalOpen] = useState(false);
    const [headModalMode, setHeadModalMode] = useState('add');
    const [currentHead, setCurrentHead] = useState({ name: '', description: '', is_active: true });

    // Class Structures State
    const [classStructures, setClassStructures] = useState([]);
    const [isStructModalOpen, setIsStructModalOpen] = useState(false);
    const [currentStruct, setCurrentStruct] = useState({ class_name: '1', fee_head_id: '', amount: '' });

    useEffect(() => {
        if (schoolId) fetchData();
    }, [schoolId]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [headsResp, structResp] = await Promise.all([
                fetch(`${API_BASE_URL}/fee-configs/heads?school_id=${schoolId}`),
                fetch(`${API_BASE_URL}/class-fees/?school_id=${schoolId}`)
            ]);
            
            if (headsResp.ok) setFeeHeads(await headsResp.json());
            if (structResp.ok) setClassStructures(await structResp.json());
        } catch (error) {
            console.error('Error fetching fee data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // --- FEE TYPES LOGIC ---
    const handleOpenHeadModal = (mode, head = null) => {
        setHeadModalMode(mode);
        setCurrentHead(head || { school_id: schoolId, name: '', description: '', is_active: true });
        setIsHeadModalOpen(true);
    };

    const handleSaveHead = async (e) => {
        e.preventDefault();
        try {
            const method = headModalMode === 'add' ? 'POST' : 'PUT';
            const url = headModalMode === 'add' ? `${API_BASE_URL}/fee-configs/heads` : `${API_BASE_URL}/fee-configs/heads/${currentHead.id}`;
            const resp = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(currentHead) });
            if (resp.ok) {
                fetchData();
                setIsHeadModalOpen(false);
                displayToast(`Fee type ${headModalMode === 'add' ? 'created' : 'updated'}`);
            }
        } catch (error) { console.error('Error saving fee head:', error); }
    };

    const handleDeleteHead = async (id) => {
        if (window.confirm('Delete this fee head? This may affect student allocations.')) {
            try {
                const resp = await fetch(`${API_BASE_URL}/fee-configs/heads/${id}`, { method: 'DELETE' });
                if (resp.ok) { fetchData(); displayToast('Fee type deleted'); }
            } catch (error) { console.error('Error deleting fee head:', error); }
        }
    };

    // --- CLASS STRUCTURE LOGIC ---
    const handleOpenStructModal = (struct = null) => {
        setCurrentStruct(struct || { class_name: '1', fee_head_id: feeHeads[0]?.id || '', amount: '' });
        setIsStructModalOpen(true);
    };

    const handleSaveStruct = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                school_id: schoolId, class_name: currentStruct.class_name,
                fee_head_id: parseInt(currentStruct.fee_head_id), amount: parseFloat(currentStruct.amount)
            };
            const resp = await fetch(`${API_BASE_URL}/class-fees/`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
            });
            if (resp.ok) {
                fetchData();
                setIsStructModalOpen(false);
                displayToast('Class fee structure updated');
            }
        } catch (error) { console.error('Error saving structure:', error); }
    };

    const handleDeleteStruct = async (id) => {
        if (window.confirm('Remove this default fee structure?')) {
            try {
                const resp = await fetch(`${API_BASE_URL}/class-fees/${id}`, { method: 'DELETE' });
                if (resp.ok) { fetchData(); displayToast('Structure deleted'); }
            } catch (error) { console.error('Error deleting structure:', error); }
        }
    };

    const displayToast = (msg) => {
        setShowToast(msg);
        setTimeout(() => setShowToast(null), 3000);
    };

    return (
        <div className="animate-fade-in">
            <header className="page-header" style={{ marginBottom: '1.5rem' }}>
                <div className="title-group">
                    <h1>Fee Configurations</h1>
                    <p>Manage custom fee types and define automatic class-wise fee structures.</p>
                </div>
                <button className="btn btn-primary" onClick={() => activeTab === 'types' ? handleOpenHeadModal('add') : handleOpenStructModal()}>
                    <Plus size={20} />
                    <span>{activeTab === 'types' ? 'Add Fee Type' : 'Set Class Fee'}</span>
                </button>
            </header>

            {/* Navigation Tabs */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                <button 
                    onClick={() => setActiveTab('types')}
                    style={{ 
                        padding: '1rem 1.5rem', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem',
                        borderBottom: activeTab === 'types' ? '2px solid var(--primary)' : '2px solid transparent',
                        color: activeTab === 'types' ? 'var(--primary)' : 'var(--text-muted)'
                    }}>
                    <Layers size={18} /> Global Fee Types
                </button>
                <button 
                    onClick={() => setActiveTab('classes')}
                    style={{ 
                        padding: '1rem 1.5rem', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem',
                        borderBottom: activeTab === 'classes' ? '2px solid var(--primary)' : '2px solid transparent',
                        color: activeTab === 'classes' ? 'var(--primary)' : 'var(--text-muted)'
                    }}>
                    <DollarSign size={18} /> Class-wise Structures
                </button>
            </div>

            <div className="glass-card" style={{ padding: '2rem' }}>
                {isLoading ? (
                    <div style={{ padding: '4rem', textAlign: 'center' }}><Loader2 className="animate-spin" size={32} style={{ margin: '0 auto', color: 'var(--primary)' }} /></div>
                ) : (
                    <>
                        {/* TAB 1: FEE TYPES */}
                        {activeTab === 'types' && (
                            <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', padding: '1rem', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
                                <AlertCircle size={20} style={{ color: 'var(--primary)' }} />
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Changes made here will be reflected globally across Student Onboarding and Fee Collection panels.</p>
                            </div>
                            <div className="table-container">
                                <table>
                                    <thead><tr><th>Fee Type Name</th><th>Description</th><th>Status</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
                                    <tbody>
                                        {feeHeads.length === 0 ? (
                                            <tr><td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No custom fee types defined yet.</td></tr>
                                        ) : (
                                            feeHeads.map((head) => (
                                                <tr key={head.id}>
                                                    <td><span style={{ fontWeight: 600 }}>{head.name}</span></td>
                                                    <td>{head.description || <span style={{ opacity: 0.5 }}>—</span>}</td>
                                                    <td><span className={`badge badge-${head.is_active ? 'paid' : 'pending'}`}>{head.is_active ? 'Active' : 'Inactive'}</span></td>
                                                    <td>
                                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                                            <button onClick={() => handleOpenHeadModal('edit', head)} className="btn" style={{ padding: '0.5rem', background: 'transparent', border: '1px solid var(--border)' }}><Edit2 size={16} /></button>
                                                            <button onClick={() => handleDeleteHead(head.id)} className="btn" style={{ padding: '0.5rem', background: 'rgba(239, 68, 68, 0.05)', color: '#ef4444' }}><Trash2 size={16} /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            </>
                        )}

                        {/* TAB 2: CLASS STRUCTURES */}
                        {activeTab === 'classes' && (
                            <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', padding: '1rem', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
                                <AlertCircle size={20} style={{ color: 'var(--primary)' }} />
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Setting a default amount for a class automatically applies it when adding new students in the directory.</p>
                            </div>
                            <div className="table-container">
                                <table>
                                    <thead><tr><th>Class Name</th><th>Fee Head</th><th>Default Amount</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
                                    <tbody>
                                        {classStructures.length === 0 ? (
                                            <tr><td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No standard class structures defined.</td></tr>
                                        ) : (
                                            classStructures.map(struct => {
                                                const head = feeHeads.find(h => h.id === struct.fee_head_id);
                                                return (
                                                    <tr key={struct.id}>
                                                        <td style={{ fontWeight: 600 }}>Class {struct.class_name}</td>
                                                        <td>{head ? head.name : 'Unknown Fee Head'}</td>
                                                        <td style={{ color: 'var(--primary)', fontWeight: 600 }}>₹{struct.amount.toLocaleString()}</td>
                                                        <td>
                                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                                                <button onClick={() => handleDeleteStruct(struct.id)} className="btn" style={{ padding: '0.5rem', background: 'rgba(239, 68, 68, 0.05)', color: '#ef4444' }}><Trash2 size={16} /></button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            </>
                        )}
                    </>
                )}
            </div>

            {/* Modal: Fee Types */}
            {isHeadModalOpen && (
                <div className="overlay">
                    <div className="modal-card" style={{ maxWidth: '500px' }}>
                        <div className="modal-header">
                            <div><h2 style={{ textTransform: 'capitalize' }}>{headModalMode} Fee Type</h2><p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Configure head details</p></div>
                            <button className="close-btn" onClick={() => setIsHeadModalOpen(false)}><X size={20} /></button>
                        </div>
                        <div className="modal-content">
                            <form onSubmit={handleSaveHead}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div className="input-group">
                                        <label>Fee Type Name*</label>
                                        <input type="text" required className="form-input" placeholder="e.g. Annual Sports Fee" value={currentHead.name} onChange={e => setCurrentHead({...currentHead, name: e.target.value})} />
                                    </div>
                                    <div className="input-group">
                                        <label>Description</label>
                                        <textarea className="form-input" rows={3} placeholder="What is this fee for?" value={currentHead.description || ''} onChange={e => setCurrentHead({...currentHead, description: e.target.value})} />
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <input type="checkbox" id="is_active" checked={currentHead.is_active} onChange={e => setCurrentHead({...currentHead, is_active: e.target.checked})} />
                                        <label htmlFor="is_active" style={{ fontSize: '0.875rem' }}>This fee type is currently active</label>
                                    </div>
                                </div>
                                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{headModalMode === 'add' ? 'Create Type' : 'Update Type'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: Class Structure */}
            {isStructModalOpen && (
                <div className="overlay">
                    <div className="modal-card" style={{ maxWidth: '400px' }}>
                        <div className="modal-header">
                            <h2>Define Fee Structure</h2>
                            <button className="close-btn" onClick={() => setIsStructModalOpen(false)}><X size={20} /></button>
                        </div>
                        <div className="modal-content">
                            <form onSubmit={handleSaveStruct}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div className="input-group">
                                        <label>Target Class*</label>
                                        <select required className="form-input" value={currentStruct.class_name} onChange={e => setCurrentStruct({...currentStruct, class_name: e.target.value})}>
                                            {[...Array(12)].map((_, i) => <option key={i+1} value={(i+1).toString()}>Class {i+1}</option>)}
                                        </select>
                                    </div>
                                    <div className="input-group">
                                        <label>Fee Head Type*</label>
                                        <select required className="form-input" value={currentStruct.fee_head_id} onChange={e => setCurrentStruct({...currentStruct, fee_head_id: e.target.value})}>
                                            <option value="">Select a fee type...</option>
                                            {feeHeads.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="input-group">
                                        <label>Amount (₹)*</label>
                                        <div style={{ position: 'relative' }}>
                                            <DollarSign size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                            <input type="number" required min="0" step="0.01" className="form-input" style={{ paddingLeft: '2.5rem' }} value={currentStruct.amount} onChange={e => setCurrentStruct({...currentStruct, amount: e.target.value})} />
                                        </div>
                                    </div>
                                </div>
                                <div style={{ marginTop: '2rem' }}>
                                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Set Structure</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {showToast && (
                <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', background: 'var(--primary)', color: 'white', padding: '1rem 2rem', borderRadius: '12px', zIndex: 1000, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <CheckCircle2 size={24} />
                    <span style={{ fontWeight: 600 }}>{showToast}</span>
                </div>
            )}
        </div>
    );
};

export default FeeSettings;
