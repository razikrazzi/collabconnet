import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    ArrowLeft, Rocket, CheckCircle2, Clock,
    Link as LinkIcon, FileText, DollarSign,
    ShieldCheck, Sparkles, Send, AlertCircle,
    Building2, ExternalLink, Trash2
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';

const CampaignWorkspace = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const ensureAbsoluteUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }
        return `https://${url}`;
    };
    const [submissionStatus, setSubmissionStatus] = useState('Draft'); // Draft, Pending, Approved, Revision Requested
    const [links, setLinks] = useState(['']);
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deliverable, setDeliverable] = useState(null);

    const fetchData = useCallback(async () => {
        if (!user || !user.token) return;
        
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            
            // Fetch Campaign
            const campaignRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/campaigns/${id}`, config);
            setCampaign(campaignRes.data);
 
            // Fetch Deliverable for this campaign
            const delivRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/deliverables/campaign/${id}`, config);
            const myDeliv = Array.isArray(delivRes.data) 
                ? delivRes.data.find(d => (d.influencer?._id || d.influencer) === user._id)
                : null;
            
            if (myDeliv) {
                setDeliverable(myDeliv);
                setSubmissionStatus(myDeliv.status);
                setLinks(myDeliv.links?.length > 0 ? myDeliv.links : ['']);
                setNotes(myDeliv.notes || '');
            }
 
            setLoading(false);
        } catch (err) {
            console.error('Error fetching workspace data:', err);
            setLoading(false);
        }
    }, [id, user, user?.token, user?._id]);
 
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const payload = {
                campaignId: id,
                title: `${campaign.title} - Submission`,
                links: links.filter(l => l.trim() !== ''),
                notes: notes
            };
            
            await axios.post((import.meta.env.VITE_API_URL || 'http://localhost:5001') + '/api/deliverables', payload, config);
            setSubmissionStatus('Pending');
            setIsSubmitting(false);
            // Refresh data
            fetchData();
        } catch (err) {
            console.error('Submission failed:', err);
            alert('Failed to submit deliverable. Please try again.');
            setIsSubmitting(false);
        }
    };
    
    const handleAddLink = () => setLinks([...links, '']);
    const handleLinkChange = (index, value) => {
        const newLinks = [...links];
        newLinks[index] = value;
        setLinks(newLinks);
    };
    const handleRemoveLink = (index) => {
        if (links.length > 1) {
            setLinks(links.filter((_, i) => i !== index));
        }
    };

    const steps = [
        { name: 'Collaboration Secured', status: 'complete', icon: ShieldCheck },
        { name: 'Content Submission', status: submissionStatus === 'Draft' ? 'active' : 'complete', icon: Send },
        { name: 'Brand Review', status: submissionStatus === 'Pending' ? 'active' : (submissionStatus === 'Approved' ? 'complete' : 'pending'), icon: Clock },
        { name: 'Payment Release', status: submissionStatus === 'Approved' ? 'active' : 'pending', icon: DollarSign }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-background-dark text-slate-100 mesh-gradient pb-20 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs tracking-[0.2em]">Syncing Mission Data...</p>
                </div>
            </div>
        );
    }

    if (!campaign) {
        return (
            <div className="min-h-screen bg-background-dark text-slate-100 mesh-gradient pb-20 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle size={48} className="text-rose-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-black uppercase">Mission Not Found</h2>
                    <button onClick={() => navigate('/influencer/myapplications')} className="mt-6 text-primary font-black uppercase text-xs hover:underline">Return to Applications</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-dark text-slate-100 mesh-gradient pb-20">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 pt-24">
                {/* Top Navigation */}
                <div className="mb-10 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/influencer/myapplications')}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest"
                    >
                        <ArrowLeft size={14} /> Back to Applications
                    </button>
                    <div className="flex items-center gap-3">
                        <span className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400">
                            Workspace ID: {id?.slice(-8).toUpperCase() || 'CMP-EX101'}
                        </span>
                        <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${submissionStatus === 'Approved' ? 'bg-green-500/20 text-green-400 border-green-500/20' :
                                submissionStatus === 'Pending' ? 'bg-orange-500/20 text-orange-400 border-orange-500/20' :
                                    'bg-primary/20 text-primary border-primary/20'
                            }`}>
                            {submissionStatus}
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column: Project Overview */}
                    <div className="lg:col-span-2 space-y-8">
                        <section className="glass-card p-10 rounded-[3rem] border border-white/5 bg-white/5 relative overflow-hidden">
                            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />

                            <div className="flex gap-6 items-start mb-8">
                                <div className="w-16 h-16 rounded-2xl bg-surface-dark border border-white/10 flex items-center justify-center text-primary shadow-xl shadow-primary/10 overflow-hidden">
                                    {campaign.brand?.profileImage ? (
                                        <img src={campaign.brand.profileImage} alt={campaign.brand.companyName} className="w-full h-full object-cover" />
                                    ) : (
                                        <Building2 size={32} />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Campaign Partner: {campaign.brand?.companyName || campaign.brand?.name}</p>
                                    <h1 className="text-4xl font-black uppercase tracking-tighter leading-none">{campaign.title}</h1>
                                </div>
                            </div>

                            <p className="text-slate-400 text-lg font-medium leading-relaxed mb-8">
                                {campaign.description}
                            </p>

                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Contract Value</p>
                                    <p className="text-2xl font-black text-white">${campaign.budget?.toLocaleString()}</p>
                                </div>
                                <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Final Deadline</p>
                                    <p className="text-2xl font-black text-white">{campaign.timeline ? new Date(campaign.timeline).toLocaleDateString([], { month: 'long', day: 'numeric' }) : 'N/A'}</p>
                                </div>
                                <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Deliverables</p>
                                    <p className="text-2xl font-black text-white">Project Milestones</p>
                                </div>
                            </div>
                        </section>

                        <section className="glass-card p-10 rounded-[3rem] border border-white/5 bg-white/5">
                            <h2 className="text-2xl font-black uppercase mb-8 flex items-center gap-3">
                                <FileText className="text-primary" /> Submission Center
                            </h2>

                            {submissionStatus === 'Pending' ? (
                                <div className="bg-orange-500/5 border border-orange-500/10 p-10 rounded-[2rem] text-center">
                                    <Clock className="text-orange-400 mx-auto mb-4" size={48} />
                                    <h3 className="text-xl font-black text-white mb-2 uppercase">Under Brand Review</h3>
                                    <p className="text-slate-400 max-w-md mx-auto">
                                        Your content link has been sent to <span className="text-white font-bold">{campaign.brand?.companyName || campaign.brand?.name}</span>. They will review it against the guidelines and release payment upon approval.
                                    </p>
                                    {deliverable?.links && deliverable.links.length > 0 && (
                                        <div className="mt-8 space-y-3">
                                            {deliverable.links.map((link, idx) => (
                                                <div key={idx} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between group">
                                                    <div className="flex items-center gap-3">
                                                        <LinkIcon size={16} className="text-slate-500" />
                                                        <span className="text-xs font-bold text-slate-300 truncate max-w-[200px]">{link}</span>
                                                    </div>
                                                    <a href={ensureAbsoluteUrl(link)} target="_blank" rel="noreferrer" className="text-[10px] font-black uppercase text-primary opacity-0 group-hover:opacity-100 transition-opacity">View Link</a>
                                                </div>
                                            ))}
                                            <button onClick={() => setSubmissionStatus('Draft')} className="w-full mt-4 text-[10px] font-black uppercase text-primary hover:underline">Update Submission</button>
                                        </div>
                                    )}
                                </div>
                            ) : submissionStatus === 'Approved' ? (
                                <div className="bg-green-500/5 border border-green-500/10 p-10 rounded-[2rem] text-center">
                                    <CheckCircle2 className="text-green-400 mx-auto mb-4" size={48} />
                                    <h3 className="text-xl font-black text-white mb-2 uppercase">Collaboration Completed</h3>
                                    <p className="text-slate-400 max-w-md mx-auto">
                                        Great work! The brand has approved your submission. Your reward of <span className="text-white font-bold">${campaign.budget?.toLocaleString()}</span> is being processed for release.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live Content URLs</label>
                                            <button 
                                                type="button"
                                                onClick={handleAddLink}
                                                className="text-[10px] font-black uppercase text-primary hover:underline flex items-center gap-2"
                                            >
                                                + Add Another Link
                                            </button>
                                        </div>
                                        
                                        <div className="space-y-3">
                                            {links.map((link, idx) => (
                                                <div key={idx} className="relative group">
                                                    <LinkIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-all" size={20} />
                                                    <input
                                                        required
                                                        type="url"
                                                        placeholder="https://..."
                                                        className="w-full bg-white/5 border border-white/5 focus:border-primary/50 rounded-2xl py-5 pl-16 pr-16 outline-none transition-all font-bold text-white"
                                                        value={link}
                                                        onChange={(e) => handleLinkChange(idx, e.target.value)}
                                                    />
                                                    {links.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveLink(idx)}
                                                            className="absolute right-6 top-1/2 -translate-y-1/2 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-rose-500/10 rounded-lg"
                                                            title="Remove link"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Additional Notes / Metrics</label>
                                        <textarea
                                            placeholder="Mention any specific metrics or notes for the brand's review team..."
                                            className="w-full bg-white/5 border border-white/5 focus:border-primary/50 rounded-3xl py-5 px-6 h-32 outline-none transition-all font-bold text-white resize-none"
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting || links.every(l => !l.trim())}
                                        className="w-full h-16 bg-primary text-black font-black uppercase text-sm rounded-2xl flex items-center justify-center gap-3 hover:shadow-2xl hover:shadow-primary/20 transition-all disabled:opacity-50"
                                    >
                                        {isSubmitting ? 'Encrypting & Sending...' : 'Submit Deliverable'} <Rocket size={20} />
                                    </button>
                                </form>
                            )}
                        </section>
                    </div>

                    {/* Right Column: Status & Payment */}
                    <div className="space-y-8">
                        <section className="glass-card p-8 rounded-[3rem] border border-white/5 bg-white/5">
                            <h3 className="text-xl font-black uppercase mb-8">Progress Matrix</h3>
                            <div className="space-y-0 text-left relative">
                                <div className="absolute left-[31px] top-6 bottom-6 w-0.5 bg-white/5" />
                                {steps.map((step, idx) => (
                                    <div key={idx} className="flex gap-6 items-start pb-10 last:pb-0 relative">
                                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all relative z-10 ${step.status === 'complete' ? 'bg-green-500 border-green-500 text-black shadow-lg shadow-green-500/20' :
                                                step.status === 'active' ? 'bg-primary border-primary text-black shadow-lg shadow-primary/20 animate-pulse' :
                                                    'bg-surface-dark border-white/5 text-slate-700'
                                            }`}>
                                            <step.icon size={24} />
                                        </div>
                                        <div className="pt-2">
                                            <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${step.status === 'pending' ? 'text-slate-700' : 'text-slate-500'}`}>
                                                Stage 0{idx + 1}
                                            </p>
                                            <p className={`text-md font-black uppercase leading-tight ${step.status === 'pending' ? 'text-slate-600' : 'text-white'
                                                }`}>
                                                {step.name}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="glass-card p-8 rounded-[3rem] border border-white/5 bg-gradient-to-br from-primary/10 to-transparent">
                            <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-2">
                                <DollarSign size={20} className="text-primary" /> Finance Info
                            </h3>
                            <div className="space-y-4">
                                <div className="p-4 bg-background-dark/80 rounded-2xl border border-white/5">
                                    <div className="flex justify-between items-center mb-1">
                                        <p className="text-[10px] font-black text-slate-500 uppercase">Payout Amount</p>
                                        <span className="text-xs font-black text-green-400">${campaign.budget?.toLocaleString()}</span>
                                    </div>
                                    <p className="text-sm font-black text-white uppercase">Secured in Escrow</p>
                                </div>
                                <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                                    <ShieldCheck className="text-primary shrink-0" size={16} />
                                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic">
                                        CollabConnect holds all funds during the review period to ensure creator protection.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="glass-card p-10 rounded-[3rem] border border-white/5 bg-surface-dark/50">
                            <h3 className="text-xl font-black uppercase mb-6">Mission Goals</h3>
                            <ul className="space-y-4">
                                {campaign.goals && campaign.goals.length > 0 ? campaign.goals.map((g, idx) => (
                                    <li key={idx} className="flex gap-3 items-start group">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0 group-hover:scale-150 transition-all" />
                                        <p className="text-sm text-slate-400 font-medium">{g}</p>
                                    </li>
                                )) : (
                                    <li className="text-sm text-slate-500 italic">No specific goals listed for this mission.</li>
                                )}
                            </ul>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CampaignWorkspace;
