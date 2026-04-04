import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Send, Calendar, DollarSign, Tag, FileText,
    CheckCircle2, Target, Users, MapPin, Globe, Rocket,
    ChevronRight, ChevronLeft, Instagram, Video, Share2, Info, Image as ImageIcon
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';

const CreateCampaign = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        budget: '',
        timeline: '',
        category: 'Technology',
        platform: ['Instagram'],
        goals: ['Brand Awareness'],
        targetAudience: '',
        image: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const { user } = useAuth();
    const navigate = useNavigate();

    const categories = ['Fashion', 'Technology', 'Lifestyle', 'Gaming', 'Fitness', 'Beauty', 'Food', 'Travel'];
    const platforms = ['Instagram', 'TikTok', 'YouTube', 'Twitter', 'Twitch'];
    const goalOptions = ['Brand Awareness', 'Sales Conversion', 'App Installs', 'Engagement', 'Content Creation'];

    const toggleMultiSelect = (field, value) => {
        setFormData(prev => {
            const current = prev[field];
            if (current.includes(value)) {
                return { ...prev, [field]: current.filter(item => item !== value) };
            } else {
                return { ...prev, [field]: [...current, value] };
            }
        });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('File is too large! Please select an image smaller than 5MB.');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        if (!formData.title || !formData.description || !formData.budget || !formData.timeline) {
            alert('Please fill in all required fields: Title, Description, Budget, and Deadline.');
            return;
        }

        // Check if the image string is excessively large (Base64 is ~1.33x the original size)
        // 10MB characters is roughly 7.5MB binary. 50MB characters is roughly 37.5MB binary.
        if (formData.image && formData.image.length > 20 * 1024 * 1024) {
            alert('The image data is too large to send. Please use a smaller imagery file (< 5MB).');
            return;
        }

        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post((import.meta.env.VITE_API_URL || 'http://localhost:5001') + '/api/campaigns', formData, config);
            setSuccess(true);
            setTimeout(() => navigate('/brand/campaigns'), 2000);
        } catch (err) {
            console.error('Full Error Object:', err);
            let message = 'Failed to launch campaign. ';

            if (err.response) {
                // Server responded with a code out of the 2xx range
                console.log('Error Data:', err.response.data);
                message += err.response.data.message || `Server Error (${err.response.status})`;
                if (err.response.data.errors) {
                    message += '\nValidation Details: ' + JSON.stringify(err.response.data.errors);
                }
            } else if (err.request) {
                // Request was made but no response was received
                message += 'No response from server. Please check if the backend is running.';
            } else {
                // Something else happened in setting up the request
                message += err.message;
            }
            alert(message);
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const stepVariants = {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -50 }
    };

    return (
        <div className="min-h-screen bg-brand-background text-slate-100 brand-mesh-gradient pb-20">
            <Navbar />
            <main className="max-w-4xl mx-auto px-6 pt-24">
                {/* Progress Header */}
                <div className="flex items-center justify-between mb-12">
                    <button
                        onClick={() => navigate('/brand/dashboard')}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-bold text-sm"
                    >
                        <ArrowLeft size={16} /> Dashboard
                    </button>

                    <div className="flex items-center gap-4">
                        {[1, 2, 3, 4].map(num => (
                            <div key={num} className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all duration-500 border-2 ${step >= num ? 'bg-brand-primary border-brand-primary text-black' : 'border-white/10 text-slate-500'
                                    } shadow-lg ${step === num ? 'scale-110 ring-4 ring-brand-primary/20' : ''}`}>
                                    {step > num ? <CheckCircle2 size={16} /> : num}
                                </div>
                                {num < 4 && <div className={`w-12 h-1 bg-white/5 mx-2 rounded-full overflow-hidden`}>
                                    <div className={`h-full bg-brand-primary transition-all duration-700 ${step > num ? 'w-full' : 'w-0'}`} />
                                </div>}
                            </div>
                        ))}
                    </div>

                    <div className="text-right hidden md:block">
                        <p className="text-[10px] uppercase font-black tracking-widest text-slate-500">Step {step} of 4</p>
                        <p className="text-sm font-bold text-white">
                            {step === 1 ? 'Concept & Identity' :
                                step === 2 ? 'Strategy & Scope' :
                                    step === 3 ? 'Budget & Timeline' : 'Final Review'}
                        </p>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {!success ? (
                        <motion.div
                            key={step}
                            variants={stepVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="glass-card p-10 rounded-[3rem] border border-white/5 bg-white/5 backdrop-blur-3xl shadow-2xl overflow-hidden relative"
                        >
                            {/* Decorative Background icons */}
                            <div className="absolute top-0 right-0 p-8 text-white/5 pointer-events-none">
                                {step === 1 ? <Rocket size={120} /> :
                                    step === 2 ? <Target size={120} /> :
                                        step === 3 ? <DollarSign size={120} /> : <CheckCircle2 size={120} />}
                            </div>

                            {/* Step 1: Concept & Identity */}
                            {step === 1 && (
                                <div className="space-y-8 relative z-10">
                                    <div className="mb-10">
                                        <h2 className="text-4xl font-black uppercase tracking-tight mb-2">The <span className="text-brand-primary">Vision</span></h2>
                                        <p className="text-slate-400 font-medium">Define the core identity of your upcoming collaboration.</p>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="group">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 block group-focus-within:text-brand-primary transition-colors">Campaign Headline</label>
                                            <div className="relative">
                                                <Tag className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-primary transition-colors" size={20} />
                                                <input
                                                    className="w-full bg-white/5 border border-white/5 focus:border-brand-primary/50 focus:bg-white/10 rounded-2xl py-4 pl-14 pr-6 outline-none transition-all font-bold text-lg text-white placeholder:text-slate-500"
                                                    placeholder="e.g. Neo-Vibe Summer Drop"
                                                    value={formData.title}
                                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="group">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 block group-focus-within:text-brand-primary transition-colors">Campaign Imagery</label>
                                            <div className="space-y-4">
                                                <div className="relative">
                                                    <ImageIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-primary transition-colors" size={20} />
                                                    <input
                                                        className="w-full bg-white/5 border border-white/5 focus:border-brand-primary/50 focus:bg-white/10 rounded-2xl py-4 pl-14 pr-6 outline-none transition-all font-bold text-lg text-white placeholder:text-slate-500"
                                                        placeholder="Paste Image URL or..."
                                                        value={formData.image.startsWith('data:') ? 'Image selected from gallery' : formData.image}
                                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                                    />
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <div className="h-px flex-1 bg-white/5" />
                                                    <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.3em]">OR</span>
                                                    <div className="h-px flex-1 bg-white/5" />
                                                </div>

                                                <label className="flex items-center justify-center gap-3 w-full bg-white/5 border-2 border-dashed border-white/10 hover:border-brand-primary/50 hover:bg-brand-primary/5 py-8 rounded-[2rem] cursor-pointer transition-all group/upload">
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={handleImageUpload}
                                                    />
                                                    <div className="text-center">
                                                        <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-3 mx-auto group-hover/upload:scale-110 transition-transform">
                                                            <Share2 size={24} />
                                                        </div>
                                                        <p className="text-xs font-black uppercase text-white">Select from Gallery</p>
                                                        <p className="text-[8px] text-slate-500 font-bold uppercase mt-1">High-res PNG, JPG (Max 5MB)</p>
                                                    </div>
                                                </label>
                                            </div>
                                            {formData.image && (
                                                <div className="mt-6 rounded-3xl overflow-hidden h-52 border border-white/10 glass-card relative group/preview">
                                                    <img src={formData.image} alt="Campaign Poster" className="w-full h-full object-cover group-hover/preview:scale-105 transition-transform duration-700" />
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/preview:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => setFormData({ ...formData, image: '' })}
                                                            className="bg-rose-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase shadow-xl"
                                                        >
                                                            Remove Asset
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div>
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 block">Primary Category</label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {categories.map(cat => (
                                                        <button
                                                            key={cat}
                                                            onClick={() => setFormData({ ...formData, category: cat })}
                                                            className={`py-3 rounded-xl text-[10px] font-black uppercase border transition-all ${formData.category === cat
                                                                ? 'bg-brand-primary text-black border-brand-primary shadow-lg shadow-brand-primary/20'
                                                                : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                                                                }`}
                                                        >
                                                            {cat}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 block">Target Platforms</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {platforms.map(plat => (
                                                        <button
                                                            key={plat}
                                                            onClick={() => toggleMultiSelect('platform', plat)}
                                                            className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase border transition-all flex items-center gap-2 ${formData.platform.includes(plat)
                                                                ? 'bg-brand-secondary text-white border-brand-secondary shadow-lg shadow-brand-secondary/20'
                                                                : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                                                                }`}
                                                        >
                                                            {plat === 'Instagram' ? <Instagram size={14} /> :
                                                                plat === 'TikTok' ? <Video size={14} /> : <Share2 size={14} />}
                                                            {plat}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Strategy & Scope */}
                            {step === 2 && (
                                <div className="space-y-8 relative z-10">
                                    <div className="mb-10">
                                        <h2 className="text-4xl font-black uppercase tracking-tight mb-2">Global <span className="text-brand-secondary">Impact</span></h2>
                                        <p className="text-slate-400 font-medium">What is the mission and who is the audience?</p>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="group">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 block group-focus-within:text-brand-secondary transition-colors">Campaign Mission / Description</label>
                                            <div className="relative">
                                                <FileText className="absolute left-5 top-5 text-slate-500 group-focus-within:text-brand-secondary transition-colors" size={20} />
                                                <textarea
                                                    className="w-full bg-white/5 border border-white/5 focus:border-brand-secondary/50 focus:bg-white/10 rounded-2xl py-5 pl-14 pr-6 h-40 outline-none transition-all font-medium leading-relaxed text-white placeholder:text-slate-500"
                                                    placeholder="Detail the creative direction, deliverables expected (e.g., 2 Reels, 3 Stories), and the core brand message..."
                                                    value={formData.description}
                                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div className="group">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 block">Campaign Goals</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {goalOptions.map(goal => (
                                                        <button
                                                            key={goal}
                                                            onClick={() => toggleMultiSelect('goals', goal)}
                                                            className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase border transition-all ${formData.goals.includes(goal)
                                                                ? 'bg-white text-black border-white'
                                                                : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                                                                }`}
                                                        >
                                                            {goal}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="group">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 block font-bold">Target Audience Demo</label>
                                                <div className="relative">
                                                    <Users className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                                    <input
                                                        className="w-full bg-white/5 border border-white/5 focus:border-brand-secondary/50 rounded-2xl py-4 pl-14 pr-6 outline-none transition-all font-bold text-white placeholder:text-slate-500"
                                                        placeholder="e.g. Gen-Z, Tech Enthusiasts, US-based"
                                                        value={formData.targetAudience}
                                                        onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Logistics & Power */}
                            {step === 3 && (
                                <div className="space-y-8 relative z-10">
                                    <div className="mb-10">
                                        <h2 className="text-4xl font-black uppercase tracking-tight mb-2">Fuel & <span className="text-sky-400">Time</span></h2>
                                        <p className="text-slate-400 font-medium">Resources assigned and the final countdown.</p>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-10">
                                        <div className="glass-card p-8 rounded-[2rem] border border-white/5 bg-brand-primary/5 backdrop-blur-md">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-brand-primary mb-4 block">Deployment Budget</label>
                                            <div className="relative">
                                                <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-primary" size={24} />
                                                <input
                                                    type="number"
                                                    className="w-full bg-black/20 border border-brand-primary/20 focus:border-brand-primary/60 rounded-2xl py-6 pl-14 pr-6 outline-none transition-all font-black text-3xl text-brand-primary"
                                                    placeholder="5000"
                                                    value={formData.budget}
                                                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                                />
                                            </div>
                                            <p className="text-[10px] text-slate-500 uppercase font-bold mt-4 flex items-center gap-2 italic">
                                                <Info size={12} /> This budget represents the total pool for creator payouts.
                                            </p>
                                        </div>

                                        <div className="glass-card p-8 rounded-[2rem] border border-white/5 bg-brand-secondary/5 backdrop-blur-md">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-brand-secondary mb-4 block">Campaign Deadline</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-secondary" size={24} />
                                                <input
                                                    type="date"
                                                    className="w-full bg-black/20 border border-brand-secondary/20 focus:border-brand-secondary/60 rounded-2xl py-6 pl-14 pr-6 outline-none transition-all font-black text-2xl text-brand-secondary"
                                                    value={formData.timeline}
                                                    onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                                                />
                                            </div>
                                            <p className="text-[10px] text-slate-500 uppercase font-bold mt-4 flex items-center gap-2 italic">
                                                <Info size={12} /> All deliverables must be approved by this date.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Final Review */}
                            {step === 4 && (
                                <div className="space-y-8 relative z-10">
                                    <div className="mb-10">
                                        <h2 className="text-4xl font-black uppercase tracking-tight mb-2">Engine <span className="text-emerald-400">Check</span></h2>
                                        <p className="text-slate-400 font-medium">Verify your configuration before deployment.</p>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-8 text-sm">
                                        <div className="space-y-6 md:col-span-2">
                                            <div className="glass-card p-6 rounded-2xl border border-white/5 bg-white/5">
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Campaign Identity</p>
                                                <h3 className="text-2xl font-black text-brand-primary uppercase">{formData.title || 'Untitled Campaign'}</h3>
                                                <p className="text-slate-400 italic mt-2">"{formData.description.substring(0, 150)}..."</p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="glass-card p-4 rounded-2xl border border-white/5 bg-white/5">
                                                    <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Platforms</p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {formData.platform.map(p => <span key={p} className="bg-brand-secondary/20 text-brand-secondary px-2 py-0.5 rounded-lg font-black text-[8px] uppercase">{p}</span>)}
                                                    </div>
                                                </div>
                                                <div className="glass-card p-4 rounded-2xl border border-white/5 bg-white/5">
                                                    <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Goals</p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {formData.goals.map(g => <span key={g} className="bg-white/10 text-white px-2 py-0.5 rounded-lg font-black text-[8px] uppercase">{g}</span>)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="bg-brand-primary/20 p-6 rounded-[2rem] border border-brand-primary/30 text-center">
                                                <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest mb-1">Liquidity</p>
                                                <p className="text-4xl font-black text-white">${Number(formData.budget).toLocaleString()}</p>
                                            </div>
                                            <div className="bg-white/10 p-6 rounded-[2rem] border border-white/5 text-center">
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Deadline</p>
                                                <p className="text-lg font-black text-white">{formData.timeline || 'Not set'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="mt-16 flex justify-between items-center relative z-10 border-t border-white/5 pt-10">
                                {step > 1 ? (
                                    <button
                                        onClick={prevStep}
                                        className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/5 text-slate-300 font-black uppercase text-xs hover:bg-white/10 transition-all border border-white/5"
                                    >
                                        <ChevronLeft size={18} /> Back
                                    </button>
                                ) : <div />}

                                {step < 4 ? (
                                    <button
                                        onClick={nextStep}
                                        disabled={!formData.title && step === 1}
                                        className="flex items-center gap-3 px-10 py-4 rounded-2xl bg-brand-primary text-black font-black uppercase text-xs hover:scale-105 hover:shadow-2xl hover:shadow-brand-primary/30 transition-all disabled:opacity-30 disabled:hover:scale-100"
                                    >
                                        Proceed <ChevronRight size={18} />
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleSubmit}
                                        disabled={loading}
                                        className="flex items-center gap-3 px-12 py-5 rounded-[2rem] bg-gradient-to-r from-orange-400 to-orange-600 text-white font-black uppercase text-sm hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/40 transition-all shadow-xl shadow-orange-500/20"
                                    >
                                        {loading ? 'Initiating...' : (
                                            <>Launch Campaign <Rocket size={20} className="animate-bounce" /></>
                                        )}
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex flex-col items-center justify-center py-40 glass-card rounded-[4rem] border border-green-500/20 bg-green-500/5 text-center"
                        >
                            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-black mb-8 shadow-2xl shadow-green-500/40">
                                <CheckCircle2 size={48} />
                            </div>
                            <h2 className="text-5xl font-black uppercase tracking-tighter mb-4">Mission Started</h2>
                            <p className="text-slate-400 max-w-md font-medium text-lg leading-relaxed">
                                Your campaign has been deployed successfully. Redirecting you to the management center...
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default CreateCampaign;
