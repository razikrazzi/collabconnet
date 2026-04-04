import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Filter, Users, Star, TrendingUp,
    MessageCircle, ShieldCheck, Zap, ChevronLeft,
    Instagram, Twitter, Globe, ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const DiscoverInfluencers = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [influencers, setInfluencers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        const fetchInfluencers = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5001') + '/api/influencers', config);
                setInfluencers(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching influencers:', err);
                setError(err.response?.data?.message || err.message || 'Failed to connect to server');
                setLoading(false);
            }
        };
        fetchInfluencers();
    }, [user.token]);

    const filteredInfluencers = influencers.filter(inf => {
        const matchesSearch = inf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (inf.category && inf.category.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory = selectedCategory === 'All' || inf.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const categories = ['All', 'Fashion', 'Technology', 'Beauty', 'Lifestyle', 'Gaming', 'Fitness'];

    return (
        <div className="min-h-screen bg-brand-background text-slate-100 selection:bg-brand-primary selection:text-black brand-mesh-gradient pb-20">
            {/* Header Section */}
            <div className="max-w-7xl mx-auto px-6 pt-12">
                <button
                    onClick={() => navigate('/brand/dashboard')}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-all mb-8 group"
                >
                    <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-black uppercase tracking-widest">Back to Dashboard</span>
                </button>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                    <div className="space-y-4">
                        <h1 className="text-6xl font-black tracking-tighter uppercase leading-none">
                            Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">Creators</span>
                        </h1>
                        <p className="text-slate-400 text-lg font-medium max-w-xl">
                            Find the perfect voice for your brand. Connect with vetted influencers across every niche.
                        </p>
                    </div>
                </div>

                {/* Search and Filter Bar */}
                <div className="glass-card p-4 rounded-[32px] border border-white/5 mb-12 flex flex-col lg:flex-row gap-4 items-center bg-white/5 backdrop-blur-2xl">
                    <div className="relative flex-1 w-full group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-primary transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name, category, or niche..."
                            className="w-full bg-white/5 border border-white/5 focus:border-brand-primary/50 rounded-2xl py-4 pl-14 pr-6 outline-none transition-all font-medium"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-wrap justify-center gap-2 p-1 bg-white/5 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase transition-all whitespace-nowrap ${selectedCategory === cat ? 'bg-brand-primary text-black' : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-40">
                        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-40 glass-card rounded-[40px] border border-red-500/20 bg-red-500/5">
                        <ShieldCheck size={64} className="text-red-500 mb-6 opacity-50" />
                        <h3 className="text-2xl font-black text-white uppercase tracking-widest">Network Error</h3>
                        <p className="text-red-400 font-bold mt-2 uppercase text-xs">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-8 px-8 py-3 bg-red-500 text-white rounded-xl font-black uppercase text-xs hover:scale-105 transition-transform"
                        >
                            Retry Connection
                        </button>
                    </div>
                ) : filteredInfluencers.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        <AnimatePresence>
                            {filteredInfluencers.map((inf, idx) => (
                                <motion.div
                                    key={inf._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="glass-card rounded-[40px] p-6 border border-white/5 hover:border-primary/30 transition-all group relative flex flex-col"
                                >
                                    <div className="relative mb-6">
                                        <div className="w-full aspect-[4/5] rounded-[32px] overflow-hidden bg-brand-surface border border-white/10 group-hover:border-brand-primary/30 transition-all flex items-center justify-center">
                                            {/* Mock avatar if no image */}
                                            <div className="w-full h-full bg-gradient-to-br from-white/10 to-transparent flex flex-col items-center justify-center gap-4">
                                                <div className="w-20 h-20 rounded-full bg-brand-background/80 border border-white/10 flex items-center justify-center text-4xl font-black text-brand-primary">
                                                    {inf.name[0]}
                                                </div>
                                                <div className="flex gap-4 opacity-50">
                                                    <Instagram size={18} />
                                                    <Twitter size={18} />
                                                    <Globe size={18} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="absolute top-4 right-4 bg-brand-background/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2 shadow-xl">
                                            <Star size={12} className="text-yellow-500 fill-yellow-500" />
                                            <span className="text-[10px] font-black tracking-widest text-white">4.9</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-6">
                                        <div className="flex items-center gap-2">
                                            <span className="px-3 py-1 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-black uppercase tracking-wider rounded-lg">
                                                {inf.category || 'Lifestyle'}
                                            </span>
                                            {inf.followers > 50000 && (
                                                <span className="px-3 py-1 bg-brand-secondary/10 border border-brand-secondary/20 text-brand-secondary text-[10px] font-black uppercase tracking-wider rounded-lg flex items-center gap-1">
                                                    <Zap size={10} className="fill-brand-secondary" /> Hot
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-2xl font-black group-hover:text-brand-primary transition-colors truncate">@{inf.name.toLowerCase().replace(' ', '')}</h3>
                                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Digital Storyteller</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 py-6 border-y border-white/5 mb-6">
                                        <div>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Reach</p>
                                            <p className="text-xl font-black text-white">{(inf.followers / 1000).toFixed(1)}K</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Engagement</p>
                                            <p className="text-xl font-black text-brand-secondary">{(inf.engagementRate || '4.2')}%</p>
                                        </div>
                                    </div>

                                    <div className="mt-auto space-y-3">
                                        <button
                                            onClick={() => navigate(`/brand/influencer/${inf._id}`)}
                                            className="w-full bg-white text-black py-3.5 rounded-2xl font-black uppercase text-xs hover:bg-brand-primary transition-all flex items-center justify-center gap-2"
                                        >
                                            View Profile <ArrowRight size={14} />
                                        </button>
                                        <button className="w-full bg-white/5 text-white py-3.5 rounded-2xl font-black uppercase text-xs border border-white/5 hover:bg-white/10 transition-all">
                                            Save to List
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-40 glass-card rounded-[40px] border border-white/5 border-dashed">
                        <Users size={64} className="text-slate-800 mb-6" />
                        <h3 className="text-2xl font-black text-slate-600 uppercase tracking-widest">No Creators Found</h3>
                        <p className="text-slate-500 font-bold mt-2">Try adjusting your filters or search keywords.</p>
                        <button
                            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                            className="mt-8 px-8 py-3 bg-primary text-background-dark rounded-xl font-black uppercase text-xs hover:scale-105 transition-transform"
                        >
                            Reset Explore
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DiscoverInfluencers;
