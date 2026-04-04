import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
    ChevronLeft, Calendar, DollarSign, Target,
    Users, Layout, Globe, ArrowUpRight, CheckCircle2
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';

const BrandCampaignDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get(${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/campaigns/${id}`, config);
                setCampaign(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching campaign details:', err);
                setLoading(false);
            }
        };
        fetchCampaign();
    }, [id, user.token]);

    if (loading) {
        return (
            <div className="min-h-screen bg-brand-background flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!campaign) {
        return (
            <div className="min-h-screen bg-brand-background text-white flex flex-col items-center justify-center">
                <h2 className="text-2xl font-black mb-4 uppercase">Campaign Not Found</h2>
                <button onClick={() => navigate('/brand/campaigns')} className="px-6 py-2 bg-brand-primary text-black rounded-xl font-black uppercase text-xs">
                    Back to Management
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-background text-slate-100 brand-mesh-gradient pb-20">
            <Navbar />
            <main className="max-w-7xl mx-auto px-6 pt-24 space-y-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <button
                            onClick={() => navigate('/brand/campaigns')}
                            className="flex items-center gap-2 text-brand-primary font-black text-[10px] uppercase tracking-widest mb-4 hover:underline"
                        >
                            <ChevronLeft size={16} /> Campaign Management
                        </button>
                        <h1 className="text-6xl font-black tracking-tighter uppercase leading-none">
                            Campaign <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">Overview</span>
                        </h1>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={() => navigate(`/brand/edit/${campaign._id}`)} className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl font-black uppercase text-[10px] hover:bg-white/10 transition-all">
                            Edit Config
                        </button>
                        <button className="px-8 py-3 bg-brand-primary text-black rounded-2xl font-black uppercase text-[10px] hover:scale-105 transition-all shadow-xl shadow-brand-primary/20">
                            Pause Campaign
                        </button>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-12 gap-10">
                    {/* Left Column: Visuals & Core Info */}
                    <div className="lg:col-span-8 space-y-10">
                        {/* Poster Section */}
                        <div className="relative rounded-[3rem] overflow-hidden border border-white/5 group shadow-2xl glass-card">
                            <div className="aspect-[21/9] w-full relative">
                                {campaign.image ? (
                                    <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 flex items-center justify-center">
                                        <Layout size={64} className="text-brand-primary opacity-20" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent opacity-80" />
                                <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end">
                                    <div>
                                        <div className="flex bg-brand-primary/20 backdrop-blur-md border border-brand-primary/30 px-4 py-1 rounded-full w-fit mb-4">
                                            <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest">{campaign.category}</span>
                                        </div>
                                        <h2 className="text-4xl font-black text-white uppercase tracking-tight">{campaign.title}</h2>
                                    </div>
                                    <div className="flex bg-black/40 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-2xl items-center gap-4">
                                        <div className="text-right">
                                            <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Active Creators</p>
                                            <p className="text-xl font-black text-white">{campaign.influencersParticipating?.length || 0}</p>
                                        </div>
                                        <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                                            <Users size={20} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description Section */}
                        <div className="glass-card p-12 rounded-[3.5rem] border border-white/5 bg-white/[0.02] space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="w-1.5 h-8 bg-brand-primary rounded-full shadow-[0_0_15px_rgba(255,184,0,0.4)]" />
                                <h3 className="text-2xl font-black uppercase tracking-tight">Mission Brief</h3>
                            </div>
                            <p className="text-xl text-slate-300 leading-relaxed font-medium">
                                {campaign.description}
                            </p>

                            <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-white/5">
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Operation Objectives</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {campaign.goals?.map(goal => (
                                            <div key={goal} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 rounded-xl">
                                                <CheckCircle2 size={12} className="text-brand-primary" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">{goal}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Target Ecosystems</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {campaign.platform?.map(plat => (
                                            <span key={plat} className="px-4 py-2 bg-brand-secondary/10 border border-brand-secondary/20 text-brand-secondary rounded-xl text-[10px] font-black uppercase tracking-widest">
                                                {plat}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Statistics & Finance */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Financial Hub */}
                        <div className="glass-card p-8 rounded-[3rem] border border-white/10 bg-gradient-to-br from-brand-primary/10 to-transparent relative overflow-hidden">
                            <div className="relative z-10 space-y-6">
                                <div className="flex items-center justify-between">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary">Financial Pool</p>
                                    <DollarSign className="text-brand-primary opacity-50" size={20} />
                                </div>
                                <div>
                                    <p className="text-5xl font-black text-white tracking-tighter">${campaign.budget?.toLocaleString()}</p>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
                                        <Globe size={12} /> Currency: USD (Global Settlements)
                                    </p>
                                </div>
                                <div className="h-px bg-white/5" />
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                                    <span>Pool Allocated</span>
                                    <span>65% Reach</span>
                                </div>
                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-brand-primary w-[65%]" />
                                </div>
                            </div>
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-primary/10 rounded-full blur-[60px]" />
                        </div>

                        {/* Timeline Hub */}
                        <div className="glass-card p-8 rounded-[3rem] border border-white/5 bg-white/[0.02]">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Deployment Schedule</p>
                                    <Calendar className="text-slate-500" size={20} />
                                </div>
                                <div>
                                    <p className="text-3xl font-black text-white tracking-tight">{new Date(campaign.timeline).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                    <p className="text-[10px] text-brand-secondary font-black uppercase tracking-widest mt-2">Mission Deadline</p>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-white">Application Window Open</p>
                                            <p className="text-[8px] text-slate-500 uppercase font-bold">Influencers can still join</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Audience Hub */}
                        <div className="glass-card p-8 rounded-[3rem] border border-white/5 bg-white/[0.02]">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Target Segment</p>
                                    <Target className="text-slate-500" size={20} />
                                </div>
                                <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
                                    <p className="text-sm font-bold text-white mb-2 leading-relaxed">
                                        {campaign.targetAudience || 'General creator demographic with high engagement.'}
                                    </p>
                                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Optimized Reach</p>
                                </div>
                                <button
                                    onClick={() => navigate(`/brand/match/${campaign._id}`)}
                                    className="w-full py-4 rounded-2xl border border-brand-primary text-brand-primary font-black text-[10px] uppercase hover:bg-brand-primary hover:text-black transition-all flex items-center justify-center gap-2 group"
                                >
                                    AI-Match Influencers <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default BrandCampaignDetails;
