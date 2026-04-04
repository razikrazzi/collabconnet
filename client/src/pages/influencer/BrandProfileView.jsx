import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Building2, Star, Globe, Twitter,
    Instagram, MapPin, Briefcase, Users,
    ShieldCheck, Zap, ArrowUpRight, Filter, Search
} from 'lucide-react';
import Navbar from '../../components/Navbar';

import { useAuth } from '../../context/AuthContext';

const BrandProfileView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [brand, setBrand] = useState(null);
    const [campaigns, setCampaigns] = useState([]);
    const [error, setError] = useState(null);



    useEffect(() => {
        const fetchBrandData = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                
                // Fetch Brand Profile
                const brandRes = await axios.get(${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/auth/brands/${id}`, config);
                setBrand(brandRes.data);

                // Fetch All Campaigns and filter for this brand
                const campaignsRes = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5001') + '/api/campaigns', config);
                const brandCampaigns = campaignsRes.data.filter(c => c.brand?._id === id || c.brand === id);
                setCampaigns(brandCampaigns);
                
                setLoading(false);
            } catch (err) {
                console.error('Error fetching brand data:', err);
                setError('Could not load brand profile.');
                setLoading(false);
            }
        };
        fetchBrandData();
    }, [id, user.token]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !brand) {
        return (
            <div className="min-h-screen bg-background-dark flex flex-col items-center justify-center gap-6">
                <h2 className="text-2xl font-black uppercase text-red-500">{error || 'Brand Not Found'}</h2>
                <button
                    onClick={() => navigate('/influencer/dashboard')}
                    className="px-8 py-3 bg-primary text-black rounded-xl font-black uppercase text-xs"
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-dark text-slate-100 mesh-gradient pb-20">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 pt-24">
                {/* Header Section */}
                <div className="mb-12">
                    <button
                        onClick={() => navigate('/influencer/dashboard')}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest mb-8 group"
                    >
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Discover
                    </button>

                    <div className="flex flex-col lg:flex-row gap-10 items-start">
                        {/* Brand Badge */}
                        <div className="relative shrink-0">
                            <div className="w-40 h-40 rounded-[3rem] bg-gradient-to-br from-primary/20 to-secondary/20 border border-white/10 flex items-center justify-center text-6xl font-black text-white shadow-2xl relative z-10 overflow-hidden">
                                {brand.profileImage ? (
                                    <img src={brand.profileImage} alt="Brand" className="w-full h-full object-cover" />
                                ) : (
                                    (brand.companyName || brand.name)[0]
                                )}
                            </div>
                            <div className="absolute -inset-4 bg-primary/20 rounded-[3.5rem] blur-2xl opacity-30 animate-pulse" />
                            <div className="absolute -bottom-2 -right-2 bg-green-500 text-black p-2 rounded-2xl border-4 border-background-dark z-20">
                                <ShieldCheck size={20} />
                            </div>
                        </div>

                        {/* Brand Info */}
                        <div className="flex-1 space-y-6">
                            <div className="flex flex-wrap items-center gap-4">
                                <h1 className="text-6xl font-black uppercase tracking-tighter leading-none">{brand.companyName || brand.name}</h1>
                                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                                    <span className="text-sm font-black">5.0 Rating</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-6 text-slate-400 font-bold uppercase tracking-widest text-xs">
                                <div className="flex items-center gap-2">
                                    <MapPin size={16} className="text-primary" /> Global Office
                                </div>
                                <div className="flex items-center gap-2">
                                    <Globe size={16} className="text-primary" /> {brand.website || 'collabconnect.co'}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Briefcase size={16} className="text-primary" /> {brand.industry || 'Exclusive Partner'}
                                </div>
                            </div>

                            <p className="text-slate-400 text-lg font-medium max-w-3xl leading-relaxed italic">
                                "{brand.description || 'Verified partner brand committed to high-impact creator collaborations.'}"
                            </p>

                            <div className="flex gap-4">
                                <div className="flex items-center gap-2 bg-white/5 hover:bg-white/10 transition-all px-4 py-2 rounded-xl border border-white/10 cursor-pointer">
                                    <Instagram size={16} />
                                    <span className="text-xs font-black">@{brand.name?.replace(/\s+/g, '').toLowerCase()}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white/5 hover:bg-white/10 transition-all px-4 py-2 rounded-xl border border-white/10 cursor-pointer">
                                    <Twitter size={16} />
                                    <span className="text-xs font-black">@{brand.name?.replace(/\s+/g, '').toLowerCase()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 gap-4 w-full lg:w-72">
                            <div className="bg-white/5 p-6 rounded-3xl border border-white/5 text-center">
                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Creators</p>
                                <p className="text-2xl font-black text-white">120+</p>
                            </div>
                            <div className="bg-white/5 p-6 rounded-3xl border border-white/5 text-center">
                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Missions</p>
                                <p className="text-2xl font-black text-white">{campaigns.length}</p>
                            </div>
                            <div className="col-span-2 bg-primary/10 p-6 rounded-3xl border border-primary/20 text-center">
                                <p className="text-[10px] text-primary font-black uppercase tracking-widest mb-1">Response Rate</p>
                                <p className="text-2xl font-black text-white">99% FAST</p>
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="border-white/5 mb-16" />

                {/* Campaigns Feed */}
                <div className="space-y-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="space-y-2">
                            <h2 className="text-4xl font-black uppercase tracking-tighter">Active <span className="text-primary">Missions</span></h2>
                            <p className="text-slate-400 font-medium font-bold uppercase text-[10px] tracking-[0.3em]">Currently hiring for {campaigns.length} campaigns</p>
                        </div>

                        <div className="flex items-center gap-3 bg-white/5 p-2 rounded-[2rem] border border-white/10">
                            <button className="px-6 py-2 bg-primary text-black rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20">All Open</button>
                            <button className="px-6 py-2 text-slate-400 hover:text-white rounded-full font-black text-[10px] uppercase tracking-widest transition-all">Archived</button>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
                        {campaigns.map((camp, idx) => (
                            <motion.div
                                key={camp._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="glass-card p-8 rounded-[3rem] border border-white/5 bg-white/5 hover:border-primary/30 transition-all group relative flex flex-col justify-between overflow-hidden"
                            >
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/20 transition-all" />

                                <div>
                                    <div className="h-32 w-full mb-6 rounded-2xl overflow-hidden relative">
                                        {camp.image ? (
                                            <img src={camp.image} alt={camp.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary">
                                                <Zap size={24} />
                                            </div>
                                        )}
                                        <div className="absolute top-2 right-2 bg-background-dark/80 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 text-[8px] font-black tracking-widest text-primary uppercase">
                                            98% Match
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-black text-white mb-4 group-hover:text-primary transition-colors leading-tight line-clamp-2">{camp.title}</h3>

                                    <div className="space-y-4 mb-6 relative z-10">
                                        <div className="flex justify-between items-center bg-white/5 p-3 rounded-2xl border border-white/5">
                                            <p className="text-[9px] font-black text-slate-500 uppercase">Budget</p>
                                            <p className="text-sm font-black text-green-400">${camp.budget?.toLocaleString()}</p>
                                        </div>
                                        <div className="flex justify-between items-center px-3">
                                            <p className="text-[9px] font-black text-slate-500 uppercase">Deadline</p>
                                            <p className="text-xs font-bold text-white uppercase">{new Date(camp.timeline).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => navigate(`/influencer/campaign/${camp._id}`)}
                                    className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-2 hover:bg-primary transition-all group-hover:shadow-[0_0_20px_rgba(19,200,236,0.3)] shadow-xl mt-4"
                                >
                                    Secure Mission <ArrowUpRight size={14} />
                                </button>
                            </motion.div>
                        ))}
                        {campaigns.length === 0 && (
                            <div className="col-span-full py-20 text-center glass-card rounded-[3rem] border border-white/5">
                                <p className="text-slate-500 font-black uppercase tracking-widest text-xs">No active missions found for this brand</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default BrandProfileView;
