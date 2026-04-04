import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
    ArrowLeft, Send, Sparkles, AlertCircle,
    CheckCircle2, Info, User, Target,
    Zap, Rocket, MessageSquare
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';

const CampaignApply = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);
    const [pitch, setPitch] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/campaigns/${id}`, config);
                setCampaign(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching campaign:', err);
                setError('Could not load campaign data.');
                setLoading(false);
            }
        };
        fetchCampaign();
    }, [id, user.token]);

    const handleApply = async (e) => {
        e.preventDefault();
        if (pitch.length < 50) {
            setError('Please provide a more detailed pitch (at least 50 characters).');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            // Note: This endpoint is assumed based on standard patterns, 
            // the user might need to adjust based on their actual backend.
            await axios.post((import.meta.env.VITE_API_URL || 'http://localhost:5001') + '/api/applications', {
                campaignId: id,
                pitch
            }, config);

            navigate('/influencer/myapplications');
        } catch (err) {
            console.error('Error submitting application:', err);
            // Even if the API call fails, we'll simulate success for UX if it's a mock setup
            // or show a specific message if it's a real backend issue.
            setError(err.response?.data?.message || 'Failed to submit application. Please try again.');
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-dark text-slate-100 mesh-gradient pb-20">
            <Navbar />

            <main className="max-w-4xl mx-auto px-6 pt-24">
                {/* Header Section */}
                <div className="mb-12">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest mb-8 group"
                    >
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Details
                    </button>

                    <div className="flex flex-col md:flex-row gap-8 items-end justify-between">
                        <div>
                            <p className="text-[10px] text-primary font-black uppercase tracking-[0.3em] mb-3">Application Portal</p>
                            <h1 className="text-5xl font-black uppercase tracking-tighter leading-tight">Pitch Your <span className="text-primary">Vision</span></h1>
                            <p className="text-slate-400 font-medium mt-2 max-w-xl">You're applying for <span className="text-white font-bold">{campaign?.title}</span> by <span className="text-white font-bold">{campaign?.brand?.companyName || 'Brand Partner'}</span>.</p>
                        </div>
                        <div className="bg-white/5 border border-white/5 px-6 py-4 rounded-3xl text-center">
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Contract Total</p>
                            <p className="text-2xl font-black text-white">${campaign?.budget?.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Form Column */}
                    <div className="md:col-span-2 space-y-8">
                        <form onSubmit={handleApply} className="glass-card p-10 rounded-[3rem] border border-white/5 bg-white/5">
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Professional Pitch / Proposal</label>
                                        <span className={`text-[9px] font-black uppercase tracking-widest ${pitch.length < 50 ? 'text-orange-500' : 'text-primary'}`}>
                                            {pitch.length} / 50 min characters
                                        </span>
                                    </div>
                                    <div className="relative group">
                                        <MessageSquare className="absolute left-6 top-6 text-slate-500 group-focus-within:text-primary transition-all" size={20} />
                                        <textarea
                                            required
                                            value={pitch}
                                            onChange={(e) => setPitch(e.target.value)}
                                            placeholder="Explain why you're a perfect fit for this campaign. Mention your creative ideas, past results, and why you love the brand..."
                                            className="w-full bg-white/5 border border-white/5 focus:border-primary/50 rounded-[2rem] py-6 pl-16 pr-6 h-64 outline-none transition-all font-medium text-white resize-none leading-relaxed"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 text-red-400 text-xs font-bold"
                                    >
                                        <AlertCircle size={16} />
                                        {error}
                                    </motion.div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full h-18 bg-primary text-black font-black uppercase text-sm rounded-2xl flex items-center justify-center gap-3 hover:shadow-2xl hover:shadow-primary/30 transition-all group disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        <>Submitting Proposal...</>
                                    ) : (
                                        <>
                                            Send Application <Rocket size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Meta Column */}
                    <div className="space-y-6">
                        <section className="glass-card p-8 rounded-[3rem] border border-white/5 bg-white/5">
                            <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                                <User size={16} className="text-primary" /> Profile Sent
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center font-black text-black uppercase">
                                        {user?.name?.[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-white uppercase">{user?.name}</p>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">Creator Account</p>
                                    </div>
                                </div>
                                <div className="pt-4 space-y-3">
                                    <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl">
                                        <span className="text-[9px] font-black uppercase text-slate-500">Reach Efficiency</span>
                                        <span className="text-xs font-black text-primary">High</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl">
                                        <span className="text-[9px] font-black uppercase text-slate-500">Match Rating</span>
                                        <span className="text-xs font-black text-primary">98% Fit</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="p-8 rounded-[3rem] border border-white/5 bg-primary/5">
                            <h3 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2 text-primary">
                                <Sparkles size={16} /> Pro Tips
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex gap-3 items-start">
                                    <CheckCircle2 size={12} className="text-primary mt-1 shrink-0" />
                                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed">Mention specific metrics like average engagement rate.</p>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <CheckCircle2 size={12} className="text-primary mt-1 shrink-0" />
                                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed">Keep it professional but show your unique personality.</p>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <CheckCircle2 size={12} className="text-primary mt-1 shrink-0" />
                                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed">Quality over quantity - explain your vision for the content.</p>
                                </li>
                            </ul>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CampaignApply;
