import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    ArrowLeft, Inbox, Search, Filter, CheckCircle2,
    XCircle, Clock, ExternalLink, MessageSquare, User,
    ChevronRight, ArrowUpRight
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';

const Applications = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [filter, setFilter] = useState('All');
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchApplications = useCallback(async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5001') + '/api/applications/brand', config);
            setApplications(data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching applications:', err);
            setError('Failed to load applications');
            setLoading(false);
        }
    }, [user.token]);

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    const handleStatusUpdate = async (id, status) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/applications/${id}/status`, { status }, config);
            
            // Update local state instead of refetching everything
            setApplications(prev => prev.map(app => 
                app._id === id ? { ...app, status } : app
            ));
        } catch (err) {
            console.error('Error updating status:', err);
            alert('Failed to update status');
        }
    };

    const filteredApps = filter === 'All' ? applications : applications.filter(app => app.status === filter);

    return (
        <div className="min-h-screen bg-brand-background text-slate-100 brand-mesh-gradient pb-20">
            <Navbar />
            <main className="max-w-6xl mx-auto px-6 pt-24">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <button
                            onClick={() => navigate('/brand/dashboard')}
                            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-black text-[10px] uppercase tracking-widest mb-4"
                        >
                            <ArrowLeft size={14} /> Back to Dashboard
                        </button>
                        <h1 className="text-5xl font-black uppercase tracking-tighter">Inbound <span className="text-brand-primary">Requests</span></h1>
                        <p className="text-slate-400 font-medium mt-2">Manage applications from creators eager to collaborate with your brand.</p>
                    </div>

                    <div className="flex bg-brand-surface/50 p-1.5 rounded-2xl border border-white/5">
                        {['All', 'Pending', 'Approved', 'Declined'].map((s) => (
                            <button
                                key={s}
                                onClick={() => setFilter(s)}
                                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === s ? 'bg-brand-primary text-black shadow-lg shadow-brand-primary/20' : 'text-slate-500 hover:text-white'
                                    }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Applications Grid */}
                <div className="grid gap-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-40 gap-4">
                            <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Applications...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-40 glass-card rounded-[3rem] border border-red-500/20 bg-red-500/5">
                            <h3 className="text-2xl font-black text-white uppercase tracking-widest text-red-500">Error Loading Data</h3>
                            <p className="text-red-400 font-bold mt-2 uppercase text-xs">{error}</p>
                        </div>
                    ) : filteredApps.map((app, index) => (
                        <motion.div
                            key={app._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-card p-8 rounded-[2.5rem] border border-white/5 bg-white/5 overflow-hidden relative group"
                        >
                            <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center relative z-10">
                                {/* Profile Info */}
                                <div className="flex items-center gap-6 min-w-[300px]">
                                    <div className="w-20 h-20 rounded-3xl bg-brand-surface border border-white/10 flex items-center justify-center text-3xl overflow-hidden relative group-hover:scale-105 transition-transform cursor-pointer" onClick={() => navigate(`/brand/influencer/${app.influencer?._id}`)}>
                                        {app.influencer?.profileImage ? (
                                            <img src={app.influencer.profileImage} alt={app.influencer.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 to-transparent flex items-center justify-center">
                                                <User size={32} className="text-brand-primary" />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-white">{app.influencer?.name}</h3>
                                        <p className="text-brand-secondary font-bold text-sm">@{app.influencer?.name?.toLowerCase().replace(/\s+/g, '')}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="bg-white/5 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-400">{app.influencer?.category || 'Lifestyle'}</span>
                                            <span className="bg-white/5 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-400">{(app.influencer?.followers / 1000).toFixed(1)}K Followers</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-px lg:h-16 w-full lg:w-px bg-white/5" />

                                {/* Campaign & Pitch Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-3">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Campaign Application</p>
                                        <span className="w-1 h-1 bg-slate-700 rounded-full" />
                                        <p className="text-sm font-bold text-white">{app.campaign?.title}</p>
                                    </div>
                                    <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 italic font-medium break-words">
                                        "{app.pitch}"
                                    </p>
                                </div>

                                {/* Stats & Match */}
                                <div className="flex items-center gap-10">
                                    <div className="text-center">
                                        <div className="text-2xl font-black text-white flex items-center justify-center gap-2">
                                            {app.influencer?.engagementRate || '4.5'}% <ArrowUpRight size={16} className="text-green-400" />
                                        </div>
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Smart Match</p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {app.status === 'Pending' ? (
                                            <>
                                                <button 
                                                    onClick={() => handleStatusUpdate(app._id, 'Declined')}
                                                    className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-rose-500/20 hover:text-rose-400 transition-all border border-black/0 hover:border-rose-500/20"
                                                >
                                                    <XCircle size={20} />
                                                </button>
                                                <button 
                                                    onClick={() => handleStatusUpdate(app._id, 'Approved')}
                                                    className="px-8 h-12 bg-brand-primary text-black font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-xl shadow-brand-primary/20"
                                                >
                                                    Approve
                                                </button>
                                            </>
                                        ) : (
                                            <span className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                                                app.status === 'Approved' ? 'bg-green-500/20 text-green-400 border-green-500/20' : 'bg-rose-500/20 text-rose-400 border-rose-500/20'
                                            }`}>
                                                {app.status}
                                            </span>
                                        )}
                                        <button className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-white/10 transition-all">
                                            <MessageSquare size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative element */}
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{new Date(app.createdAt).toLocaleDateString()}</span>
                            </div>
                        </motion.div>
                    ))}

                    {!loading && filteredApps.length === 0 && (
                        <div className="py-20 text-center glass-card rounded-[3rem] border border-white/5">
                            <Inbox size={48} className="mx-auto text-slate-700 mb-6" />
                            <h3 className="text-2xl font-black uppercase">No applications found</h3>
                            <p className="text-slate-500 mt-2 font-medium">Try adjusting your filters or wait for more creators to find your mission.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Applications;
