import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Filter, Briefcase, Zap, ChevronLeft,
    TrendingUp, MessageSquare, PlusCircle, Building2,
    Calendar, DollarSign, ArrowRight, Target, Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';

const DiscoverCampaigns = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5001') + '/api/campaigns', config);
                setCampaigns(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching campaigns:', err);
                setError(err.response?.data?.message || err.message || 'Failed to connect to server');
                setLoading(false);
            }
        };
        fetchCampaigns();
    }, [user.token]);

    const filteredCampaigns = campaigns.filter(camp => {
        const matchesSearch = camp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (camp.description && camp.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (camp.brand?.companyName && camp.brand.companyName.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory = selectedCategory === 'All' || camp.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const categories = ['All', 'Fashion', 'Technology', 'Beauty', 'Lifestyle', 'Gaming', 'Fitness', 'Food', 'Travel'];

    return (
        <div className="min-h-screen bg-background-dark text-slate-100 selection:bg-primary selection:text-black mesh-gradient pb-20">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 pt-32">
                <button
                    onClick={() => navigate('/influencer/dashboard')}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-all mb-8 group"
                >
                    <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-black uppercase tracking-widest">Back to Dashboard</span>
                </button>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                    <div className="space-y-4">
                        <h1 className="text-6xl font-black tracking-tighter uppercase leading-none">
                            Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Opportunities</span>
                        </h1>
                        <p className="text-slate-400 text-lg font-medium max-w-xl">
                            Find high-impact campaigns from world-class brands. Your next big collaboration starts here.
                        </p>
                    </div>
                </div>

                {/* Search and Filter Bar */}
                <div className="glass-card p-4 rounded-[32px] border border-white/5 mb-12 flex flex-col lg:flex-row gap-4 items-center bg-white/5 backdrop-blur-2xl shadow-2xl">
                    <div className="relative flex-1 w-full group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search campaigns, brands, or niches..."
                            className="w-full bg-white/5 border border-white/5 focus:border-primary/50 rounded-2xl py-4 pl-14 pr-6 outline-none transition-all font-medium"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-wrap justify-center gap-2 p-1 bg-white/5 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase transition-all whitespace-nowrap ${selectedCategory === cat ? 'bg-primary text-background-dark' : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-4">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Campaigns...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-40 glass-card rounded-[40px] border border-red-500/20 bg-red-500/5">
                        <Target size={64} className="text-red-500 mb-6 opacity-30" />
                        <h3 className="text-2xl font-black text-white uppercase tracking-widest">Network Outage</h3>
                        <p className="text-red-400 font-bold mt-2 uppercase text-xs">{error}</p>
                    </div>
                ) : filteredCampaigns.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence>
                            {filteredCampaigns.map((camp, idx) => (
                                <motion.div
                                    key={camp._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="glass-card rounded-[40px] p-8 border border-white/5 hover:border-primary/30 transition-all group relative flex flex-col h-full overflow-hidden bg-gradient-to-br from-white/[0.02] to-transparent"
                                >
                                    {/* Campaign Image Header */}
                                    <div className="absolute top-0 left-0 w-full h-32 overflow-hidden opacity-40 group-hover:opacity-60 transition-opacity">
                                        {camp.image ? (
                                            <img
                                                src={camp.image}
                                                alt={camp.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20" />
                                        )}
                                    </div>

                                    {/* High Ticket Badge */}
                                    {camp.budget >= 5000 && (
                                        <div className="absolute top-0 right-0 z-20">
                                            <div className="bg-yellow-500 text-black px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-bl-3xl">
                                                High Ticket
                                            </div>
                                        </div>
                                    )}

                                    <div className="relative z-10 flex items-start justify-between mb-8 mt-12">
                                        <div className="w-16 h-16 rounded-2xl bg-surface-dark border border-white/10 flex items-center justify-center text-3xl font-black text-primary group-hover:scale-110 transition-transform shadow-xl overflow-hidden">
                                            {camp.brand?.profileImage ? (
                                                <img src={camp.brand.profileImage} alt={camp.brand.companyName} className="w-full h-full object-cover" />
                                            ) : (
                                                camp.brand?.companyName?.[0] || camp.title[0]
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <span className="px-3 py-1 bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest rounded-full backdrop-blur-md">
                                                {camp.category}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="relative z-10 space-y-3 mb-8">
                                        <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em]">
                                            {camp.brand?.companyName || 'Verified Brand'}
                                        </p>
                                        <h3 className="text-2xl font-black group-hover:text-primary transition-colors leading-tight">
                                            {camp.title}
                                        </h3>
                                        <p className="text-slate-400 text-sm font-medium line-clamp-2 leading-relaxed">
                                            {camp.description}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 py-6 border-y border-white/5 mb-8">
                                        <div>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
                                                <DollarSign size={10} className="text-primary" /> Budget
                                            </p>
                                            <p className="text-xl font-black text-white">${camp.budget.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
                                                <Calendar size={10} className="text-secondary" /> Deadline
                                            </p>
                                            <p className="text-xl font-black text-secondary">
                                                {new Date(camp.timeline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-4 flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live Mission</span>
                                        </div>
                                        <button
                                            onClick={() => navigate(`/influencer/campaign/${camp._id}`)}
                                            className="bg-primary text-background-dark px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all flex items-center gap-2 shadow-lg shadow-primary/10"
                                        >
                                            View Details <ArrowRight size={14} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-40 glass-card rounded-[40px] border border-white/5 border-dashed bg-white/5">
                        <Briefcase size={64} className="text-slate-800 mb-6" />
                        <h3 className="text-2xl font-black text-slate-600 uppercase tracking-widest">No Opportunities Found</h3>
                        <p className="text-slate-500 font-bold mt-2">Companies are still launching their campaigns. Check back soon!</p>
                        <button
                            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                            className="mt-8 px-8 py-3 bg-primary text-background-dark rounded-xl font-black uppercase text-xs hover:scale-105 transition-transform"
                        >
                            Refreshed View
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DiscoverCampaigns;
