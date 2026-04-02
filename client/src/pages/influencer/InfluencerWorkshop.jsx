import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    ArrowLeft, Rocket, CheckCircle2, Clock,
    ChevronRight, Zap, Target, ShieldCheck,
    Briefcase, LayoutGrid, Timer
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';

const InfluencerWorkshop = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [ongoingMissions, setOngoingMissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMissions = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('http://localhost:5001/api/campaigns', config);

                // Filter for missions the user is part of and are not completed
                const active = data.filter(c =>
                    c.influencersParticipating?.includes(user?._id) &&
                    c.status !== 'Completed'
                );
                setOngoingMissions(active);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching workshop data:', err);
                setLoading(false);
            }
        };
        fetchMissions();
    }, [user]);

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

            <main className="max-w-7xl mx-auto px-6 pt-24">
                <header className="mb-12">
                    <button
                        onClick={() => navigate('/influencer/dashboard')}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-black text-[10px] uppercase tracking-widest mb-6"
                    >
                        <ArrowLeft size={14} /> Back to Dashboard
                    </button>
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                        <div>
                            <p className="text-[10px] text-primary font-black uppercase tracking-[0.3em] mb-3">Operational Command</p>
                            <h1 className="text-5xl font-black uppercase tracking-tighter">Mission <span className="text-primary italic">Workshop</span></h1>
                            <p className="text-slate-400 font-medium mt-2">Finalize your active collaborations and submit deliverables for review.</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 px-8 py-5 rounded-[2rem] flex items-center gap-6">
                            <div className="text-center px-4 border-r border-white/10">
                                <p className="text-2xl font-black text-white">{ongoingMissions.length}</p>
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Ongoing</p>
                            </div>
                            <div className="text-center px-4">
                                <p className="text-2xl font-black text-primary">$ {(ongoingMissions.reduce((acc, curr) => acc + (curr.budget || 0), 0)).toLocaleString()}</p>
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">In Pipeline</p>
                            </div>
                        </div>
                    </div>
                </header>

                {ongoingMissions.length > 0 ? (
                    <div className="grid gap-8">
                        {ongoingMissions.map((mission, index) => (
                            <motion.div
                                key={mission._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="glass-card rounded-[3rem] border border-white/5 bg-white/5 overflow-hidden group hover:border-primary/20 transition-all"
                            >
                                <div className="flex flex-col lg:flex-row items-stretch">
                                    {/* Image Section */}
                                    <div className="lg:w-80 h-64 lg:h-auto relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-r from-background-dark/80 to-transparent z-10 lg:hidden" />
                                        {mission.image ? (
                                            <img src={mission.image} alt={mission.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                                                <Zap size={48} className="text-primary/30" />
                                            </div>
                                        )}
                                        <div className="absolute top-6 left-6 z-20">
                                            <span className="bg-primary text-black text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-xl shadow-primary/20">
                                                Active
                                            </span>
                                        </div>
                                    </div>

                                    {/* Detail Section */}
                                    <div className="flex-1 p-10 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-3xl font-black uppercase tracking-tight text-white group-hover:text-primary transition-colors">{mission.title}</h3>
                                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Brand: {mission.brand?.companyName || 'Verified Partner'}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-2xl font-black text-white">${mission.budget?.toLocaleString()}</p>
                                                    <p className="text-[9px] font-black text-primary uppercase tracking-widest">Total Reward</p>
                                                </div>
                                            </div>
                                            <p className="text-slate-400 font-medium leading-relaxed max-w-2xl mb-8">
                                                {mission.description || 'Deliver high-quality content based on the brand brief. Ensure all mandatory tags and mentions are included in the final post.'}
                                            </p>
                                        </div>

                                        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-white/5 gap-6">
                                            <div className="flex items-center gap-8 w-full sm:w-auto">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-3 rounded-2xl bg-white/5 text-slate-400">
                                                        <Timer size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Due Date</p>
                                                        <p className="text-sm font-black text-white uppercase">{new Date(mission.timeline).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <div className="flex-1 sm:w-64">
                                                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2">
                                                        <span>Progress</span>
                                                        <span className="text-primary">75%</span>
                                                    </div>
                                                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                        <div className="h-full bg-primary w-[75%] shadow-[0_0_10px_rgba(19,200,236,0.3)]" />
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => navigate(`/influencer/workspace/${mission._id}`)}
                                                className="w-full sm:w-auto px-8 h-16 bg-white text-black font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-primary transition-all flex items-center justify-center gap-3 shadow-xl group/btn"
                                            >
                                                Finish Work <ChevronRight className="group-hover/btn:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="py-24 text-center glass-card rounded-[4rem] border border-white/5 bg-white/5">
                        <Briefcase size={64} className="mx-auto text-slate-800 mb-8" />
                        <h2 className="text-3xl font-black uppercase tracking-tight text-slate-400">No Active Missions</h2>
                        <p className="text-slate-500 font-medium mt-3 max-w-md mx-auto">
                            You don't have any ongoing work at the moment. Explore new campaigns to start your next mission.
                        </p>
                        <button
                            onClick={() => navigate('/influencer/discover-campaigns')}
                            className="mt-10 px-10 py-4 bg-primary text-black rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-all shadow-2xl shadow-primary/20"
                        >
                            Find Campaigns
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default InfluencerWorkshop;
