import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, CheckCircle2, Loader2, Settings, AlertCircle } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000';

const FeeSettings = () => {
    const [feeHeads, setFeeHeads] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [currentHead, setCurrentHead] = useState({ name: '', description: '', is_active: true });
    const [showToast, setShowToast] = useState(null);

    const loggedInUser = JSON.parse(localStorage.getItem('user')) || {};
    const schoolId = loggedInUser.school_id;

    useEffect(() => {
        if (schoolId) {
            fetchFeeHeads();
        }
    }, [schoolId]);

    const fetchFeeHeads = async () => {
        setIsLoading(true);
        try {
            const resp = await fetch(`${API_BASE_URL}/fee-configs/heads?school_id=${schoolId}`);
            if (resp.ok) {
                const data = await resp.json();
                setFeeHeads(data);
            }
        } catch (error) {
            console.error('Error fetching fee heads:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (mode, head = null) => {
        setModalMode(mode);
        if (head) {
            setCurrentHead(head);
        } else {
            setCurrentHead({ school_id: schoolId, name: '', description: '', is_active: true });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const method = modalMode === 'add' ? 'POST' : 'PUT';
            const url = modalMode === 'add' 
                ? `${API_BASE_URL}/fee-configs/heads` 
                : `${API_BASE_URL}/fee-configs/heads/${currentHead.id}`;
            
            const resp = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(currentHead)
            });

            if (resp.ok) {
                fetchFeeHeads();
                setIsModalOpen(false);
                setShowToast(`Fee type ${modalMode === 'add' ? 'created' : 'updated'} successfully`);
                setTimeout(() => setShowToast(null), 3000);
            } else {
                alert('Failed to save fee head');
            }
        } catch (error) {
            console.error('Error saving fee head:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this fee head? This may affect student allocations.')) {
            try {
                const resp = await fetch(`${API_BASE_URL}/fee-configs/heads/${id}`, { method: 'DELETE' });
                if (resp.ok) {
                    fetchFeeHeads();
                    setShowToast('Fee type deleted');
                    setTimeout(() => setShowToast(null), 3000);
                }
            } catch (error) {
                console.error('Error deleting fee head:', error);
            }
        }
    };

    return (
        <div className="animate-fade-in">
            <header className="page-header">
                <div className="title-group">
                    <h1>Fee Type Configurations</h1>
                    <p>Define and manage custom fee categories for your school</p>
                </div>
                <button className="btn btn-primary" onClick={() => handleOpenModal('add')}>
                    <Plus size={20} />
                    <span>Add New Fee Type</span>
                </button>
            </header>

            <div className="glass-card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', padding: '1rem', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
                    <AlertCircle size={20} style={{ color: 'var(--primary)' }} />
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        Changes made here will be reflected globally across Student Onboarding and Fee Collection panels.
                    </p>
                </div>

                {isLoading ? (
                    <div style={{ padding: '4rem', textAlign: 'center' }}><Loader2 className="animate-spin" size={32} style={{ margin: '0 auto', color: 'var(--primary)' }} /></div>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Fee Type Name</th>
                                    <th>Description</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {feeHeads.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                                            No custom fee types defined yet.
                                        </td>
                                    </tr>
                                ) : (
                                    feeHeads.map((head) => (
                                        <tr key={head.id}>
                                            <td><span style={{ fontWeight: 600 }}>{head.name}</span></td>
                                            <td>{head.description || <span style={{ opacity: 0.5 }}>—</span>}</td>
                                            <td>
                                                <span className={`badge badge-${head.is_active ? 'paid' : 'pending'}`}>
                                                    {head.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                                    <button onClick={() => handleOpenModal('edit', head)} className="btn" style={{ padding: '0.5rem', background: 'transparent', border: '1px solid var(--border)' }}>
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button onClick={() => handleDelete(head.id)} className="btn" style={{ padding: '0.5rem', background: 'rgba(239, 68, 68, 0.05)', color: '#ef4444' }}>
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="overlay">
                    <div className="modal-card" style={{ maxWidth: '500px' }}>
                        <div className="modal-header">
                            <div>
                                <h2 style={{ textTransform: 'capitalize' }}>{modalMode} Fee Type</h2>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Configure head details</p>
                            </div>
                            <button className="close-btn" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
                        </div>
                        <div className="modal-content">
                            <form onSubmit={handleSave}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div className="input-group">
                                        <label>Fee Type Name*</label>
                                        <input 
                                            type="text" 
                                            required 
                                            className="form-input" 
                                            placeholder="e.g. Annual Sports Fee"
                                            value={currentHead.name}
                                            onChange={e => setCurrentHead({...currentHead, name: e.target.value})}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Description</label>
                                        <textarea 
                                            className="form-input" 
                                            rows={3} 
                                            placeholder="What is this fee for?"
                                            value={currentHead.description || ''}
                                            onChange={e => setCurrentHead({...currentHead, description: e.target.value})}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <input 
                                            type="checkbox" 
                                            id="is_active"
                                            checked={currentHead.is_active}
                                            onChange={e => setCurrentHead({...currentHead, is_active: e.target.checked})}
                                        />
                                        <label htmlFor="is_active" style={{ fontSize: '0.875rem' }}>This fee type is currently active</label>
                                    </div>
                                </div>
                                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                                    <button type="button" className="btn" style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--border)' }} onClick={() => setIsModalOpen(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{modalMode === 'add' ? 'Create Type' : 'Update Type'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {showToast && (
                <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', background: 'var(--primary)', color: 'white', padding: '1rem 2rem', borderRadius: '12px', boxShadow: '0 10px 15px rgba(0,0,0,0.2)', animation: 'fadeIn 0.3s ease-out', zIndex: 1000, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <CheckCircle2 size={24} />
                    <span style={{ fontWeight: 600 }}>{showToast}</span>
                </div>
            )}
        </div>
    );
};

export default FeeSettings;
