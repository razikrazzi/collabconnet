import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft, Search, Filter, MoreHorizontal, Eye, Edit,
    Clock, Target, Calendar, ArrowUpRight
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';

const CampaignManagement = () => {
    const navigate = useNavigate();
    const [campaigns, setCampaigns] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5001') + '/api/campaigns', config);
                setCampaigns(data);
                setIsLoading(false);
            } catch (err) {
                console.error('Error fetching campaigns:', err);
                setIsLoading(false);
            }
        };
        fetchCampaigns();
    }, [user.token]);

    const filteredCampaigns = useMemo(() => {
        return campaigns.filter(c => {
            const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = filterStatus === 'All' || c.status === filterStatus;
            return matchesSearch && matchesFilter;
        });
    }, [campaigns, searchTerm, filterStatus]);

    return (
        <div className="min-h-screen bg-brand-background text-slate-100 brand-mesh-gradient pb-20">
            <Navbar />
            <main className="max-w-7xl mx-auto px-6 pt-24 space-y-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <button
                            onClick={() => navigate('/brand/dashboard')}
                            className="flex items-center gap-2 text-brand-primary font-bold text-sm mb-4 hover:underline transition-all"
                        >
                            <ChevronLeft size={16} /> Back to Dashboard
                        </button>
                        <h1 className="text-5xl font-black tracking-tight uppercase">Campaign <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">Management</span></h1>
                        <p className="text-slate-400 mt-2 text-lg font-medium">Detailed tracking and control of all your brand collaborations</p>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="glass-card p-6 rounded-[2.5rem] border border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 bg-white/5 backdrop-blur-2xl">
                    <div className="relative flex-1 w-full group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-primary transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search campaigns by name..."
                            className="w-full bg-white/5 border border-white/5 focus:border-brand-primary/50 rounded-2xl py-4 pl-14 pr-6 outline-none transition-all font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto no-scrollbar pb-2 md:pb-0">
                        {['All', 'Active', 'Pending', 'Completed'].map((s) => (
                            <button
                                key={s}
                                onClick={() => setFilterStatus(s)}
                                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase transition-all whitespace-nowrap ${filterStatus === s ? 'bg-brand-primary text-black' : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Table */}
                <div className="glass-card rounded-[2.5rem] overflow-hidden border border-brand-border/30 bg-brand-surface/20 backdrop-blur-md">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-40 gap-4">
                            <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Campaigns...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-surface-dark/40 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                                        <th className="px-8 py-6">Campaign Profile</th>
                                        <th className="px-8 py-6">Status Indicator</th>
                                        <th className="px-8 py-6">Investment</th>
                                        <th className="px-8 py-6">Deadline</th>
                                        <th className="px-8 py-6">Performance</th>
                                        <th className="px-8 py-6 text-right">Control</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-dark/20">
                                    {filteredCampaigns.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-8 py-20 text-center text-slate-500 font-medium italic">
                                                No campaigns found matching your criteria.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredCampaigns.map((camp) => (
                                            <motion.tr
                                                layout
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                key={camp._id}
                                                className="hover:bg-white/[0.02] transition-colors group"
                                            >
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-brand-surface border border-white/5 flex items-center justify-center text-2xl shadow-inner uppercase font-black text-brand-primary overflow-hidden">
                                                            {camp.image ? (
                                                                <img src={camp.image} alt={camp.title} className="w-full h-full object-cover" />
                                                            ) : (
                                                                camp.title[0]
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="text-base font-bold text-white group-hover:text-brand-primary transition-colors">{camp.title}</p>
                                                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-0.5">{camp.category}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border tracking-widest ${camp.status === 'Active' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]' :
                                                        camp.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                                            'bg-green-500/10 text-green-400 border-green-500/20'
                                                        }`}>
                                                        {camp.status}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex flex-col">
                                                        <p className="text-sm font-bold text-white">${camp.budget.toLocaleString()}</p>
                                                        <p className="text-[10px] text-slate-500 uppercase font-black">USD Balance</p>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-2 text-slate-300 text-xs font-bold">
                                                        <Calendar size={14} className="text-brand-primary" /> {new Date(camp.timeline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="w-32">
                                                        <div className="flex justify-between text-[8px] font-black uppercase text-slate-500 mb-1">
                                                            <span>Progress</span>
                                                            <span>{camp.status === 'Completed' ? '100%' : '65%'}</span>
                                                        </div>
                                                        <div className="h-1.5 bg-brand-surface rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full bg-gradient-to-r ${camp.status === 'Completed' ? 'from-emerald-500 to-teal-400' : 'from-brand-primary to-brand-secondary'}`}
                                                                style={{ width: camp.status === 'Completed' ? '100%' : '65%' }}
                                                            />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                                        <Link
                                                            to={`/brand/campaign/${camp._id}`}
                                                            className="flex items-center gap-2 px-4 py-2 bg-brand-primary/10 text-brand-primary rounded-xl hover:bg-brand-primary hover:text-black transition-all border border-brand-primary/20 font-black text-[10px] uppercase group/btn"
                                                        >
                                                            More Details <ArrowUpRight size={14} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                                        </Link>
                                                        <Link to={`/brand/edit/${camp._id}`} className="p-2.5 bg-white/5 rounded-xl hover:bg-blue-500 hover:text-white transition-all border border-white/5 shadow-lg"><Edit size={18} /></Link>
                                                        <button className="p-2.5 bg-white/5 rounded-xl hover:bg-rose-500 hover:text-white transition-all border border-white/5 shadow-lg"><MoreHorizontal size={18} /></button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Bottom CTA */}
                <div className="flex flex-col md:flex-row gap-6">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="flex-1 bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 p-8 rounded-[2.5rem] border border-brand-primary/20 flex items-center justify-between"
                    >
                        <div>
                            <h4 className="text-xl font-black uppercase tracking-tight">Need more reach?</h4>
                            <p className="text-sm text-slate-400 font-medium">Launch a high-impact campaign today.</p>
                        </div>
                        <Link to="/brand/create-campaign" className="bg-brand-primary text-black px-6 py-3 rounded-2xl font-black text-xs uppercase flex items-center gap-2">
                            New Campaign <ArrowUpRight size={14} />
                        </Link>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="flex-1 bg-white/5 p-8 rounded-[2.5rem] border border-white/5 flex items-center justify-between backdrop-blur-xl"
                    >
                        <div>
                            <h4 className="text-xl font-black uppercase tracking-tight">Find Talent</h4>
                            <p className="text-sm text-slate-400 font-medium">Browse our vetted influencer network.</p>
                        </div>
                        <Link to="/brand/discover" className="bg-white text-black px-6 py-3 rounded-2xl font-black text-xs uppercase flex items-center gap-2">
                            Discover <Target size={14} />
                        </Link>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default CampaignManagement;
