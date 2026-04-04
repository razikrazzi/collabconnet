import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
    CheckCircle2, ArrowLeft, ExternalLink,
    ShieldCheck, Briefcase, User, Sparkles,
    FileText, AlertCircle
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';

const WorkReview = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const ensureAbsoluteUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }
        return `https://${url}`;
    };
    const [deliverable, setDeliverable] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchDeliverable = useCallback(async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get(${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/deliverables/${id}`, config);
            setDeliverable(data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching deliverable:', err);
            setLoading(false);
        }
    }, [id, user.token]);

    useEffect(() => {
        fetchDeliverable();
    }, [fetchDeliverable]);

    const handleReview = async (status) => {
        if (!window.confirm(`Are you sure you want to set status to ${status}?`)) return;
        setIsProcessing(true);

        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/deliverables/${id}`, { status }, config);
            
            if (status === 'Approved') {
                setIsSuccess(true);
                setTimeout(() => {
                    navigate('/brand/payments');
                }, 3000);
            } else {
                fetchDeliverable(); // Refresh for Revisions
                setIsProcessing(false);
            }
        } catch (err) {
            console.error('Review update failed:', err);
            alert('Failed to update review status.');
            setIsProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-brand-background text-slate-100 brand-mesh-gradient flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!deliverable) {
        return (
            <div className="min-h-screen bg-brand-background text-slate-100 brand-mesh-gradient flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle size={48} className="text-rose-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-black uppercase tracking-widest text-white">Record Not Found</h2>
                    <button onClick={() => navigate('/brand/payments')} className="mt-8 text-brand-primary font-black uppercase text-xs hover:underline">Return to Terminal</button>
                </div>
            </div>
        );
    }

    const { campaign, influencer, links = [], link: legacyLink, title, notes, status, submittedAt, createdAt } = deliverable;
    const activeLinks = (links && links.length > 0) ? links.filter(l => l && l.trim() !== '') : [];

    return (
        <div className="min-h-screen bg-brand-background text-slate-100 brand-mesh-gradient pb-20">
            <Navbar />

            {/* Success Animation Overlay */}
            <AnimatePresence>
                {isSuccess && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center bg-brand-background/95 backdrop-blur-2xl"
                    >
                        <div className="text-center relative">
                            {[...Array(20)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ y: 0, x: 0, opacity: 1 }}
                                    animate={{
                                        y: [0, -200, 200],
                                        x: [0, (i - 10) * 40],
                                        opacity: [1, 1, 0]
                                    }}
                                    transition={{ duration: 2, ease: "easeOut" }}
                                    className="absolute top-1/2 left-1/2 w-3 h-3 bg-brand-accent rounded-full"
                                />
                            ))}

                            <motion.div
                                initial={{ scale: 0, rotate: -20 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", damping: 10 }}
                                className="w-40 h-40 bg-brand-accent rounded-[3rem] flex items-center justify-center mx-auto mb-10 shadow-[0_0_80px_rgba(245,158,11,0.4)]"
                            >
                                <CheckCircle2 size={80} className="text-black" />
                            </motion.div>

                            <motion.h2
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-6xl font-black uppercase tracking-tighter"
                            >
                                Mission <span className="text-brand-accent">Verified</span>
                            </motion.h2>
                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-slate-400 mt-4 text-xl font-medium italic"
                            >
                                Approval logged for {influencer?.name}. Payment record generated in Escrow Terminal.
                            </motion.p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <main className="max-w-7xl mx-auto px-6 pt-24">
                <div className="mb-12">
                    <button
                        onClick={() => navigate('/brand/payments')}
                        className="flex items-center gap-2 text-slate-500 hover:text-brand-accent transition-colors font-black uppercase text-[10px] tracking-widest mb-6"
                    >
                        <ArrowLeft size={16} /> Back to Terminal
                    </button>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div>
                            <div className="flex items-center gap-2 text-brand-primary font-black text-[10px] uppercase tracking-[0.2em] mb-3">
                                <ShieldCheck size={14} /> Verification Protocol
                            </div>
                            <h1 className="text-6xl font-black uppercase tracking-tighter leading-none">
                                Review <span className="text-brand-accent">Submission</span>
                            </h1>
                            <p className="text-slate-400 mt-4 text-xl font-medium flex items-center gap-3">
                                <Briefcase className="text-brand-primary" size={20} /> {campaign?.title}
                            </p>
                        </div>

                        <div className="glass-card px-10 py-6 rounded-[2.5rem] border border-white/5 bg-white/5 flex flex-col items-center">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Escrow Protected</p>
                            <p className="text-5xl font-black italic text-brand-accent">${campaign?.budget?.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass-card p-10 rounded-[3rem] border border-white/5 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-5 text-8xl font-black">@PV</div>
                            <div className="flex items-center gap-6 mb-8 relative z-10">
                                <div className="w-24 h-24 rounded-[2rem] bg-brand-surface border border-brand-accent/20 flex items-center justify-center text-3xl overflow-hidden relative shadow-2xl">
                                    {influencer?.profileImage ? (
                                        <img src={influencer.profileImage} alt={influencer.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={40} className="text-brand-primary" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black uppercase tracking-tight">{influencer?.name}</h3>
                                    <p className="text-brand-accent font-bold italic">@{influencer?.name?.toLowerCase().replace(/\s+/g, '')}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl">
                                    <span className="text-xs font-bold text-slate-500 uppercase">Submission Date</span>
                                    <span className="text-sm font-black italic">{new Date(deliverable.submittedAt || deliverable.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl">
                                    <span className="text-xs font-bold text-slate-500 uppercase">Current status</span>
                                    <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full border ${
                                        status === 'Approved' ? 'bg-green-500/20 text-green-400 border-green-500/20' :
                                        (status === 'Revision Requested' || status === 'Rejected') ? 'bg-rose-500/20 text-rose-400 border-rose-500/20' :
                                        ['Pending', 'Under Review', 'Draft Submitted'].includes(status) ? 'bg-amber-500/20 text-amber-500 border-amber-500/20' :
                                        'bg-brand-primary/20 text-brand-primary border-brand-primary/20'
                                    }`}>
                                        {status}
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="glass-card p-10 rounded-[3rem] border border-white/5"
                        >
                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-8 flex items-center gap-2">
                                <Sparkles size={16} className="text-brand-accent" /> Creator Performance
                            </h4>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="text-center">
                                    <p className="text-3xl font-black text-white italic">{(influencer?.followers / 1000).toFixed(1)}K</p>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">Followers</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-3xl font-black text-white italic">{influencer?.engagementRate || '4.2'}%</p>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">Engagement</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <div className="lg:col-span-2 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card p-10 rounded-[3rem] border border-white/5 h-full flex flex-col"
                        >
                            <div className="flex justify-between items-center mb-10">
                                <h3 className="text-2xl font-black uppercase tracking-tight">Main <span className="text-brand-primary">Deliverables</span></h3>
                                <div className="flex flex-wrap gap-3">
                                    {activeLinks.length > 0 ? activeLinks.map((l, idx) => (
                                        <a
                                            key={idx}
                                            href={ensureAbsoluteUrl(l)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="bg-brand-primary text-black px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-brand-primary/20"
                                        >
                                            Link {idx + 1} <ExternalLink size={14} />
                                        </a>
                                    )) : (legacyLink ? (
                                        <a
                                            href={ensureAbsoluteUrl(legacyLink)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="bg-brand-primary text-black px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-brand-primary/20"
                                        >
                                            Content Link <ExternalLink size={14} />
                                        </a>
                                    ) : (
                                        <div className="bg-white/5 px-6 py-3 rounded-2xl text-[10px] font-black uppercase text-slate-500 border border-white/5 italic">No links submitted</div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6 flex-1">
                                <div className="p-8 bg-brand-surface/30 rounded-[2rem] border border-white/5">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                                        <FileText size={14} className="text-brand-primary" /> Submission Metadata
                                    </p>
                                    <h4 className="text-xl font-bold text-white italic mb-2">{deliverable.title}</h4>
                                    <p className="text-slate-400 font-medium leading-relaxed italic mb-8">
                                        {deliverable.notes || "No additional notes provided by the creator."}
                                    </p>

                                    {/* Detailed Link List */}
                                    <div className="space-y-3">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Submitted Content Assets</p>
                                        {activeLinks.length > 0 ? activeLinks.map((l, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-brand-primary/30 transition-all">
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    <span className="text-[10px] font-black text-brand-primary">#{idx + 1}</span>
                                                    <span className="text-sm font-bold text-slate-300 truncate">{l}</span>
                                                </div>
                                                <a href={ensureAbsoluteUrl(l)} target="_blank" rel="noreferrer" className="shrink-0 text-brand-primary hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                                    Verify Asset <ExternalLink size={12} />
                                                </a>
                                            </div>
                                        )) : (legacyLink ? (
                                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group">
                                                <span className="text-sm font-bold text-slate-300 truncate">{legacyLink}</span>
                                                <a href={ensureAbsoluteUrl(legacyLink)} target="_blank" rel="noreferrer" className="text-brand-primary text-[10px] font-black uppercase tracking-widest">Verify Asset</a>
                                            </div>
                                        ) : (
                                            <div className="p-8 bg-white/5 rounded-2xl border border-dashed border-white/10 text-center text-slate-500 text-sm italic">
                                                No live content links found in this submission.
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Mission Objectives Found</p>
                                    {(campaign?.goals && campaign?.goals.length > 0) ? campaign.goals.map((goal, idx) => (
                                        <div key={idx} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                                            <div className="w-2 h-2 rounded-full bg-brand-primary" />
                                            <span className="text-sm font-bold text-slate-300 italic">{goal}</span>
                                        </div>
                                    )) : (
                                        <p className="text-sm text-slate-500 italic">No specific goals to verify.</p>
                                    )}
                                </div>
                            </div>

                            {['Pending', 'Under Review', 'Draft Submitted'].includes(status) && (
                                <div className="mt-12 pt-10 border-t border-white/5">
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={() => handleReview('Revision Requested')}
                                            disabled={isProcessing}
                                            className="py-6 rounded-3xl font-black uppercase tracking-widest text-xs border border-white/10 hover:bg-white/5 transition-all disabled:opacity-50"
                                        >
                                            Request Revision
                                        </button>
                                        <button
                                            onClick={() => handleReview('Approved')}
                                            disabled={isProcessing}
                                            className="py-6 rounded-3xl font-black uppercase tracking-widest text-xs bg-brand-accent text-black hover:scale-105 transition-all shadow-xl shadow-brand-accent/20 disabled:opacity-50"
                                        >
                                            {isProcessing ? 'Synchronizing...' : 'Verify & Approve Work'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default WorkReview;
