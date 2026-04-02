import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import {
    ArrowLeft, Inbox, Search, Filter, CheckCircle2,
    XCircle, Clock, Building2, Bell,
    ChevronRight, ArrowUpRight, Target
} from 'lucide-react';
import Navbar from '../../components/Navbar';

const MyApplications = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [filter, setFilter] = useState('All');
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('http://localhost:5001/api/applications/my', config);
                setApplications(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching applications:', err);
                setError('Failed to load applications');
                setLoading(false);
            }
        };
        fetchApplications();
    }, [user.token]);

    const filteredApps = filter === 'All' 
        ? applications 
        : applications.filter(app => app.status === filter);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved': return 'bg-green-500/20 text-green-400 border-green-500/20';
            case 'Pending': return 'bg-orange-500/20 text-orange-400 border-orange-500/20';
            case 'Declined': return 'bg-red-500/20 text-red-400 border-red-500/20';
            default: return 'bg-slate-500/20 text-slate-400 border-slate-500/20';
        }
    };

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
                        <h1 className="text-5xl font-black uppercase tracking-tighter">My <span className="text-primary">Applications</span></h1>
                        <p className="text-slate-400 font-medium mt-2">Track the status of your campaign proposals and collaborations.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <button
                            onClick={() => navigate('/influencer/requests')}
                            className="bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/20 px-6 py-3 rounded-2xl flex items-center gap-3 transition-all group"
                        >
                            <Bell size={18} className="group-hover:animate-bounce" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Brand Invitations</span>
                            <div className="bg-rose-500 text-white text-[8px] px-1.5 py-0.5 rounded-full">3</div>
                        </button>

                        <div className="flex bg-surface-dark/50 p-1.5 rounded-2xl border border-white/5">
                            {['All', 'Pending', 'Approved', 'Declined'].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setFilter(s)}
                                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === s ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-slate-500 hover:text-white'
                                        }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-4">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Applications...</p>
                    </div>
                ) : error ? (
                    <div className="py-20 text-center glass-card rounded-[3rem] border border-red-500/20 bg-red-500/5">
                        <h3 className="text-2xl font-black uppercase text-red-500">Error</h3>
                        <p className="text-red-400 mt-2 font-medium">{error}</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {filteredApps.map((app, index) => (
                            <motion.div
                                key={app._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="glass-card p-8 rounded-[2.5rem] border border-white/5 bg-white/5 overflow-hidden relative group"
                            >
                                <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center relative z-10">
                                    {/* Brand Info */}
                                    <div className="flex items-center gap-6 min-w-[300px]">
                                        <div className="w-20 h-20 rounded-3xl bg-surface-dark border border-white/10 flex items-center justify-center text-3xl overflow-hidden relative group-hover:scale-105 transition-transform">
                                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
                                            {app.campaign?.brand?.profileImage ? (
                                                <img src={app.campaign.brand.profileImage} alt="Brand" className="w-full h-full object-cover" />
                                            ) : (
                                                <Building2 size={32} className="text-primary" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-white">{app.campaign?.brand?.companyName || app.campaign?.brand?.name || 'Partner'}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Target size={12} className="text-primary" />
                                                <p className="text-primary font-bold text-xs uppercase tracking-wider">{app.campaign?.category}</p>
                                            </div>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="bg-white/5 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-400">98% Fit</span>
                                                <span className="bg-white/5 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-400">${app.campaign?.budget?.toLocaleString()} Reward</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="h-px lg:h-16 w-full lg:w-px bg-white/5" />

                                    {/* Campaign & Pitch Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Applied Campaign</p>
                                            <span className="w-1 h-1 bg-slate-700 rounded-full" />
                                            <p className="text-sm font-bold text-white">{app.campaign?.title}</p>
                                        </div>
                                        <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 italic font-medium">
                                            "{app.pitch}"
                                        </p>
                                    </div>

                                    {/* Status & Actions */}
                                    <div className="flex items-center gap-10">
                                        <div className="text-center">
                                            <span className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getStatusColor(app.status)}`}>
                                                {app.status}
                                            </span>
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-2">Current Status</p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {app.status === 'Approved' && (
                                                <button
                                                    onClick={() => navigate(`/influencer/workspace/${app.campaign?._id}`)}
                                                    className="px-8 h-12 bg-primary text-black font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-xl shadow-primary/20"
                                                >
                                                    Go to Workspace
                                                </button>
                                            )}

                                        </div>
                                    </div>
                                </div>

                                {/* Decorative element */}
                                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Submitted {new Date(app.createdAt).toLocaleDateString()}</span>
                                </div>
                            </motion.div>
                        ))}

                        {filteredApps.length === 0 && (
                            <div className="py-20 text-center glass-card rounded-[3rem] border border-white/5">
                                <Inbox size={48} className="mx-auto text-slate-700 mb-6" />
                                <h3 className="text-2xl font-black uppercase">No applications found</h3>
                                <p className="text-slate-500 mt-2 font-medium">You haven't submitted any applications for this filter yet.</p>
                                <button
                                    onClick={() => navigate('/influencer/discover-campaigns')}
                                    className="mt-8 px-8 py-3 bg-primary text-black rounded-xl font-black uppercase text-xs hover:scale-105 transition-all shadow-xl shadow-primary/20"
                                >
                                    Discover Campaigns
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default MyApplications;
