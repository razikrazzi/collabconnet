import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    ArrowLeft, Bell, Search, Filter, CheckCircle2,
    XCircle, Clock, Building2,
    ChevronRight, ArrowUpRight, Target, Award
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';

const BrandRequests = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [filter, setFilter] = useState('All');
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRequests = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('http://localhost:5001/api/invitations/my', config);
            setRequests(data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching requests:', err);
            setError('Failed to load brand invitations');
            setLoading(false);
        }
    }, [user.token]);

    useEffect(() => {
        if (user && user.token) {
            fetchRequests();
        } else {
            setLoading(false);
            setError('Authentication required to view invitations.');
        }
    }, [fetchRequests, user]);

    const handleStatusUpdate = async (id, status) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`http://localhost:5001/api/invitations/${id}/status`, { status }, config);
            
            // Update local state
            setRequests(prev => prev.map(req => 
                req._id === id ? { ...req, status } : req
            ));
        } catch (err) {
            console.error('Error updating invitation:', err);
            alert('Action failed. Please try again.');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'New': return 'bg-rose-500/20 text-rose-400 border-rose-500/20';
            case 'Accepted': return 'bg-green-500/20 text-green-400 border-green-500/20';
            case 'Declined': return 'bg-slate-500/20 text-slate-400 border-slate-500/20';
            case 'Expired': return 'bg-slate-700/20 text-slate-500 border-white/5';
            default: return 'bg-slate-500/20 text-slate-400 border-slate-500/20';
        }
    };

    const filteredRequests = filter === 'All' ? requests : requests.filter(req => req.status === filter);

    return (
        <div className="min-h-screen bg-background-dark text-slate-100 mesh-gradient pb-20">
            <Navbar />
            <main className="max-w-6xl mx-auto px-6 pt-24">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <button
                            onClick={() => navigate('/influencer/dashboard')}
                            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-black text-[10px] uppercase tracking-widest mb-4"
                        >
                            <ArrowLeft size={14} /> Back to Dashboard
                        </button>
                        <h1 className="text-5xl font-black uppercase tracking-tighter">Mission <span className="text-rose-500">Requests</span></h1>
                        <p className="text-slate-400 font-medium mt-2">Exclusive invitations sent directly to you from brands.</p>
                    </div>

                    <div className="flex bg-surface-dark/50 p-1.5 rounded-2xl border border-white/5">
                        {['All', 'New', 'Accepted', 'Expired'].map((s) => (
                            <button
                                key={s}
                                onClick={() => setFilter(s)}
                                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === s ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'text-slate-500 hover:text-white'
                                    }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Requests Grid */}
                <div className="grid gap-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-40 gap-4">
                            <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs tracking-[0.2em]">Intercepting Frequencies...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-40 glass-card rounded-[3rem] border border-rose-500/20 bg-rose-500/5">
                            <h3 className="text-2xl font-black text-white uppercase tracking-widest text-rose-500">System Error</h3>
                            <p className="text-rose-400 font-bold mt-2 uppercase text-xs">{error}</p>
                        </div>
                    ) : filteredRequests.map((req, index) => (
                        <motion.div
                            key={req._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-card p-8 rounded-[2.5rem] border border-white/5 bg-white/5 overflow-hidden relative group"
                        >
                            <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center relative z-10">
                                {/* Brand Info */}
                                <div className="flex items-center gap-6 min-w-[300px]">
                                    <div className="w-20 h-20 rounded-3xl bg-surface-dark border border-white/10 flex items-center justify-center text-3xl overflow-hidden relative group-hover:scale-105 transition-transform cursor-pointer" onClick={() => navigate(`/influencer/brand/${req.brand?._id}`)}>
                                        {req.brand?.profileImage ? (
                                            <img src={req.brand.profileImage} alt={req.brand.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 to-transparent flex items-center justify-center">
                                                <Building2 size={32} className="text-rose-400" />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-white">{req.brand?.companyName || req.brand?.name}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Target size={12} className="text-rose-400" />
                                            <p className="text-rose-400 font-bold text-xs uppercase tracking-wider">{req.brand?.industry || 'Exclusive Brand'}</p>
                                        </div>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="bg-white/5 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-400">98% Match</span>
                                            <span className="bg-white/5 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-400">{req.reward} Offer</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-px lg:h-16 w-full lg:w-px bg-white/5" />

                                {/* Campaign & Message Info */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Invited Mission</p>
                                        <span className="w-1 h-1 bg-slate-700 rounded-full" />
                                        <p className="text-sm font-bold text-white">{req.campaign?.title}</p>
                                    </div>
                                    <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 italic font-medium">
                                        "{req.message}"
                                    </p>
                                </div>

                                {/* Status & Actions */}
                                <div className="flex items-center gap-10">
                                    <div className="text-center">
                                        <span className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getStatusColor(req.status)}`}>
                                            {req.status}
                                        </span>
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-2">Invitation Status</p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {req.status === 'New' && (
                                            <>
                                                <button
                                                    onClick={() => handleStatusUpdate(req._id, 'Accepted')}
                                                    className="px-8 h-12 bg-rose-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-xl shadow-rose-500/20"
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(req._id, 'Declined')}
                                                    className="w-12 h-12 bg-white/5 text-slate-500 flex items-center justify-center rounded-2xl hover:bg-rose-500/10 hover:text-rose-400 transition-all border border-white/5"
                                                >
                                                    <XCircle size={20} />
                                                </button>
                                            </>
                                        )}
                                        <button
                                            onClick={() => navigate(`/influencer/campaign/${req.campaign?._id}`)}
                                            className="px-6 h-12 bg-white/5 text-slate-300 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all border border-white/5"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative element */}
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Received {new Date(req.createdAt).toLocaleDateString()}</span>
                            </div>
                        </motion.div>
                    ))}

                    {!loading && filteredRequests.length === 0 && (
                        <div className="py-20 text-center glass-card rounded-[3rem] border border-white/5">
                            <Bell size={48} className="mx-auto text-slate-700 mb-6" />
                            <h3 className="text-2xl font-black uppercase">No requests found</h3>
                            <p className="text-slate-500 mt-2 font-medium">You haven't received any new invitations for this filter yet.</p>
                            <button
                                onClick={() => navigate('/influencer/discover-campaigns')}
                                className="mt-8 px-8 py-3 bg-rose-500 text-white rounded-xl font-black uppercase text-xs hover:scale-105 transition-all shadow-xl shadow-rose-500/20"
                            >
                                Discover Missions
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default BrandRequests;
