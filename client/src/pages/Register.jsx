import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Briefcase, TrendingUp, Users, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';

const Register = () => {
    const [role, setRole] = useState('Influencer');
    const [formData, setFormData] = useState({
        name: '', email: '', password: '',
        companyName: '', industry: '', description: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await register({ ...formData, role });
            navigate(role === 'Brand' ? '/brand/dashboard' : '/influencer/dashboard');
        } catch (err) {
            alert(err.response?.data?.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background-dark text-slate-100 mesh-gradient">
            <Navbar />
            <div className="flex-1 flex items-center justify-center p-6 pt-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass w-full max-w-2xl p-8 rounded-3xl border border-border-dark"
                >
                    <h2 className="text-3xl font-bold mb-2">Create Account</h2>
                    <p className="text-slate-400 mb-8">Join the CollabConnect network today</p>

                    <div className="flex gap-4 mb-8 bg-surface/50 p-1 rounded-xl">
                        {['Influencer', 'Brand'].map((r) => (
                            <button
                                key={r}
                                onClick={() => setRole(r)}
                                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${role === r ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                {r}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className={`grid ${role === 'Brand' ? 'md:grid-cols-2' : ''} gap-6`}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input name="name" onChange={handleChange} className="w-full bg-surface-dark/50 border border-border-dark/50 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-primary/50 text-white placeholder:text-slate-500" required placeholder="John Doe" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input name="email" type="email" onChange={handleChange} className="w-full bg-surface-dark/50 border border-border-dark/50 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-primary/50 text-white placeholder:text-slate-500" required placeholder="john@example.com" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input name="password" type="password" onChange={handleChange} className="w-full bg-surface-dark/50 border border-border-dark/50 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-primary/50 text-white placeholder:text-slate-500" required placeholder="••••••••" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {role === 'Brand' && (
                                <>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Company Name</label>
                                        <div className="relative">
                                            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                            <input name="companyName" onChange={handleChange} className="w-full bg-surface-dark/50 border border-border-dark/50 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-primary/50 text-white placeholder:text-slate-500" placeholder="Acme Inc" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Industry</label>
                                        <input name="industry" onChange={handleChange} className="w-full bg-surface-dark/50 border border-border-dark/50 rounded-xl py-2.5 px-4 focus:outline-none focus:ring-1 focus:ring-primary/50 text-white placeholder:text-slate-500" placeholder="E-commerce" />
                                    </div>
                                </>
                            )}
                        </div>

                        <button
                            disabled={isLoading}
                            className="md:col-span-2 w-full bg-red-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-red-600/20 hover:bg-red-700 active:scale-95 transition-all disabled:opacity-50 flex justify-center items-center gap-2"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Complete Registration'}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;
