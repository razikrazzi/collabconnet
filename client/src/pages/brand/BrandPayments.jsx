import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    DollarSign, Clock, CheckCircle2, AlertCircle,
    Search, Wallet, ShieldCheck, ExternalLink,
    Briefcase, User, Eye
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';

const BrandPayments = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [payments, setPayments] = useState([]);
    const [deliverables, setDeliverables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('Verification');

    const fetchData = useCallback(async () => {
        if (!user?.token) return;
        try {
            console.log('[BrandPayments] Fetching data...');
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const [payRes, delivRes] = await Promise.all([
                axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5001') + '/api/payments', config),
                axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5001') + '/api/deliverables/brand', config)
            ]);
            console.log('[BrandPayments] Payments:', payRes.data.length);
            console.log('[BrandPayments] Deliverables:', delivRes.data.length);
            setPayments(payRes.data);
            setDeliverables(delivRes.data);
            setLoading(false);
        } catch (err) {
            console.error('[BrandPayments] Data fetch error:', err);
            setLoading(false);
        }
    }, [user?.token]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleReleasePayment = async (paymentId) => {
        if (!window.confirm('Are you sure you want to release this payment? This action cannot be undone.')) return;
        
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/payments/${paymentId}/release`, {}, config);
            fetchData();
        } catch (err) {
            console.error('Payment release failed:', err);
            alert('Failed to release payment.');
        }
    };

    const pendingDeliverables = deliverables.filter(d => 
        ['Under Review', 'Pending', 'Draft Submitted', 'Revision Requested'].includes(d.status)
    );
    const pendingPayments = payments.filter(p => p.status === 'Pending');
    const escrowBalance = payments.reduce((acc, p) => acc + (p.status === 'Pending' ? p.amount : 0), 0);

    const filteredDeliverables = pendingDeliverables.filter(d => 
        (d.influencer?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (d.campaign?.title || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredPayments = pendingPayments.filter(p => 
        (p.influencer?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.campaign?.title || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-brand-background text-slate-100 brand-mesh-gradient pb-20">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 pt-24 space-y-10">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <div className="flex items-center gap-2 text-brand-accent font-black text-[10px] uppercase tracking-[0.2em] mb-3">
                            <ShieldCheck size={14} /> Settlement Terminal
                        </div>
                        <h1 className="text-5xl font-black uppercase tracking-tighter">
                            Review & <span className="text-brand-accent">Payments</span>
                        </h1>
                        <p className="text-slate-400 mt-2 text-lg font-medium italic">Verify mission objectives and authorize financial releases.</p>
                    </div>

                    <div className="glass-card px-8 py-4 rounded-3xl border border-white/5 flex items-center gap-4 bg-white/5">
                        <div className="w-12 h-12 rounded-2xl bg-brand-accent/10 flex items-center justify-center text-brand-accent border border-brand-accent/20">
                            <Wallet size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Escrow Balance</p>
                            <p className="text-2xl font-black italic text-brand-accent">${escrowBalance.toLocaleString()}</p>
                        </div>
                    </div>
                </header>

                <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                    <div className="flex bg-brand-surface/50 p-1.5 rounded-2xl border border-white/5 w-full md:w-auto">
                        <button
                            onClick={() => setActiveTab('Verification')}
                            className={`flex-1 md:flex-none px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                activeTab === 'Verification' ? 'bg-brand-accent text-black shadow-lg shadow-brand-accent/20' : 'text-slate-500 hover:text-white'
                            }`}
                        >
                            Verification Queue ({pendingDeliverables.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('Settlement')}
                            className={`flex-1 md:flex-none px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                activeTab === 'Settlement' ? 'bg-brand-accent text-black shadow-lg shadow-brand-accent/20' : 'text-slate-500 hover:text-white'
                            }`}
                        >
                            Escrow Terminal ({pendingPayments.length})
                        </button>
                    </div>

                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Filter by creator or mission..."
                            className="w-full bg-brand-surface border border-white/5 rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 transition-all font-bold text-sm italic"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    {loading ? (
                        <div className="py-40 text-center">
                            <div className="w-16 h-16 border-4 border-brand-accent/20 border-t-brand-accent rounded-full animate-spin mx-auto mb-6"></div>
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Syncing Ledgers...</h3>
                        </div>
                    ) : (
                        <AnimatePresence mode="wait">
                            {activeTab === 'Verification' ? (
                                <motion.div
                                    key="verification"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="space-y-4"
                                >
                                    {filteredDeliverables.length > 0 ? filteredDeliverables.map((d, idx) => (
                                        <div key={d._id} className="glass-card group p-6 rounded-[2.5rem] border border-white/5 hover:border-brand-accent/30 transition-all flex flex-col lg:flex-row items-center gap-8 bg-gradient-to-r from-white/[0.02] to-transparent">
                                            <div className="flex items-center gap-5 min-w-[280px]">
                                                <div className="w-16 h-16 rounded-2xl bg-brand-surface border border-white/10 flex items-center justify-center text-3xl overflow-hidden shadow-xl">
                                                    {d.influencer?.profileImage ? <img src={d.influencer.profileImage} alt="" className="w-full h-full object-cover" /> : <User size={24} />}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-black uppercase tracking-tight">{d.influencer?.name}</h3>
                                                    <p className="text-brand-accent text-[9px] font-bold italic">@{d.influencer?.name?.toLowerCase().replace(/\s+/g, '')}</p>
                                                </div>
                                            </div>

                                            <div className="flex-1 space-y-1">
                                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                                                    <Briefcase size={12} /> Mission Objective
                                                </p>
                                                <h4 className="text-base font-bold text-white italic">{d.campaign?.title}</h4>
                                            </div>

                                            <div className="text-center lg:text-right min-w-[120px]">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Budget Protected</p>
                                                <p className="text-2xl font-black italic text-brand-accent">${d.campaign?.budget?.toLocaleString()}</p>
                                            </div>

                                            <button
                                                onClick={() => navigate(`/brand/review/${d._id}`)}
                                                className="w-full lg:w-auto px-10 py-4 rounded-2xl bg-brand-primary text-black font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-xl shadow-brand-primary/20 flex items-center justify-center gap-2"
                                            >
                                                Verify Work <Eye size={16} />
                                            </button>
                                        </div>
                                    )) : (
                                        <div className="py-24 text-center glass-card rounded-[3rem] border border-white/5 opacity-50">
                                            <CheckCircle2 size={48} className="mx-auto text-slate-700 mb-6" />
                                            <h3 className="text-xl font-black uppercase italic">Queue Synchronized</h3>
                                            <p className="text-slate-500 mt-2 font-medium">No missions currently requiring manual verification.</p>
                                        </div>
                                    )}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="settlement"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="space-y-4"
                                >
                                    {filteredPayments.length > 0 ? filteredPayments.map((p, idx) => (
                                        <div key={p._id} className="glass-card group p-6 rounded-[2.5rem] border border-white/5 hover:border-emerald-500/30 transition-all flex flex-col lg:flex-row items-center gap-8 bg-gradient-to-r from-white/[0.02] to-transparent">
                                            <div className="flex items-center gap-5 min-w-[280px]">
                                                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                                                    <DollarSign size={28} />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-black uppercase tracking-tight">{p.influencer?.name}</h3>
                                                    <p className="text-emerald-500 text-[9px] font-bold italic">Verification Complete</p>
                                                </div>
                                            </div>

                                            <div className="flex-1 space-y-1">
                                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                                                    <ShieldCheck size={12} className="text-emerald-500" /> Authorized Mission
                                                </p>
                                                <h4 className="text-base font-bold text-white italic">{p.campaign?.title}</h4>
                                            </div>

                                            <div className="text-center lg:text-right min-w-[120px]">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Release Amount</p>
                                                <p className="text-3xl font-black italic text-emerald-400">${p.amount?.toLocaleString()}</p>
                                            </div>

                                            <button
                                                onClick={() => handleReleasePayment(p._id)}
                                                className="w-full lg:w-auto px-10 py-4 rounded-2xl bg-emerald-500 text-black font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2"
                                            >
                                                Release Funds <ExternalLink size={16} />
                                            </button>
                                        </div>
                                    )) : (
                                        <div className="py-24 text-center glass-card rounded-[3rem] border border-white/5 opacity-50">
                                            <DollarSign size={48} className="mx-auto text-slate-700 mb-6" />
                                            <h3 className="text-xl font-black uppercase italic">Treasury Clear</h3>
                                            <p className="text-slate-500 mt-2 font-medium">All financial settlements are currently finalized.</p>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    )}
                </div>

                <div className="flex items-center gap-4 bg-white/5 p-8 rounded-[2.5rem] border border-white/5 italic">
                    <AlertCircle size={24} className="text-brand-accent shrink-0" />
                    <p className="text-[11px] font-medium text-slate-400 leading-relaxed">
                        Funds released from the Escrow Terminal are transferred directly to the creator's CollabConnect Wallet. 
                        Please ensure work satisfies campaign requirements before authorizing release. Once triggered, the block-sequence cannot be reversed.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default BrandPayments;
