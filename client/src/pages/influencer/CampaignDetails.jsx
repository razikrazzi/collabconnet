import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
    ChevronLeft, Calendar, DollarSign, Tag, Briefcase,
    MessageSquare, CheckCircle2, AlertCircle, Building2,
    Clock, ExternalLink, Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';



const CampaignDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const res = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5001') + '/api/campaigns/' + id, config);
                setCampaign(res.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching campaign:', err);
                setError('Failed to load campaign details. It might have been removed or is no longer available.');
                setLoading(false);
            }
        };
        fetchCampaign();
    }, [id, user.token]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !campaign) {
        return (
            <div className="min-h-screen bg-background-dark text-slate-100 p-8 flex flex-col items-center justify-center gap-6">
                <AlertCircle size={64} className="text-red-500 opacity-50" />
                <h2 className="text-2xl font-bold">{error || 'Campaign Not Found'}</h2>
                <button
                    onClick={() => navigate(-1)}
                    className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/10"
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-dark text-slate-100 selection:bg-primary selection:text-black mesh-gradient">
            <div className="max-w-5xl mx-auto px-6 py-12">
                {/* Back Link */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-12 group"
                >
                    <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold uppercase tracking-widest text-xs">Back to Dashboard</span>
                </button>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Left Column: Core Info */}
                    <div className="lg:col-span-2 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <div className="flex flex-wrap items-center gap-4">
                                <span className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-wider">
                                    {campaign.category}
                                </span>
                                <span className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-wider">
                                    <Clock size={12} /> Posted {new Date(campaign.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            {/* Campaign Imagery / Poster */}
                            <div className="relative rounded-[3rem] overflow-hidden border border-white/5 group shadow-2xl glass-card">
                                <div className="aspect-[21/9] w-full relative">
                                    {campaign.image ? (
                                        <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                                            <Briefcase size={64} className="text-primary opacity-20" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent opacity-80" />
                                    <div className="absolute bottom-10 left-10">
                                        <h2 className="text-3xl font-black text-white uppercase tracking-tight">{campaign.title}</h2>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-6 glass-card rounded-3xl border border-white/5">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-0.5 text-black">
                                    <div className="w-full h-full bg-background-dark/80 backdrop-blur-sm rounded-[14px] flex items-center justify-center font-black text-2xl text-white">
                                        {campaign.brand?.companyName?.[0] || campaign.brand?.name?.[0]}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Brand</p>
                                    <h3 className="text-xl font-bold flex items-center gap-2">
                                        {campaign.brand?.companyName || campaign.brand?.name}
                                        <CheckCircle2 size={16} className="text-primary fill-primary/10" />
                                    </h3>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl font-bold flex items-center gap-2 italic">
                                    <Briefcase className="text-primary" size={20} /> Project Brief
                                </h3>
                                <p className="text-slate-400 text-lg leading-relaxed font-medium">
                                    {campaign.description}
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 pt-8">
                                <div className="p-6 glass-card rounded-3xl border border-white/5 group hover:border-primary/30 transition-all">
                                    <DollarSign className="text-primary mb-4" size={24} />
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Budget Allocation</p>
                                    <p className="text-2xl font-black">${campaign.budget?.toLocaleString()}</p>
                                </div>
                                <div className="p-6 glass-card rounded-3xl border border-white/5 group hover:border-secondary/30 transition-all">
                                    <Calendar className="text-secondary mb-4" size={24} />
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Timeline / Deadline</p>
                                    <p className="text-2xl font-black">{new Date(campaign.timeline).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Actions */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="sticky top-32 space-y-6"
                        >
                            <div className="glass-card p-8 rounded-[40px] border border-white/5 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors"></div>

                                <div className="relative z-10 space-y-8">
                                    <div className="space-y-4 pt-4">
                                        <button
                                            onClick={() => navigate(`/influencer/apply/${id}`)}
                                            className="w-full bg-primary text-background-dark py-5 rounded-2xl font-black uppercase text-xs hover:shadow-[0_0_20px_rgba(19,200,236,0.3)] transition-all flex items-center justify-center gap-2 group"
                                        >
                                            <Zap size={18} className="fill-background-dark group-hover:scale-125 transition-transform" />
                                            Apply for Mission
                                        </button>
                                        <p className="text-[10px] text-slate-500 text-center font-bold uppercase tracking-[0.2em] leading-relaxed px-4">
                                            Your profile and metrics will be shared with the brand for review.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 glass-card rounded-3xl border border-white/5 text-center">
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-4">Contract Safety</p>
                                <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                                    Payments are held in escrow and released only after content approval.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>


            </div>


            {/* Subtle Gradient UI Elements */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 opacity-30">
                <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-[120px]"></div>
            </div>
        </div>
    );
};

export default CampaignDetails;
