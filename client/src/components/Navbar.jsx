import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Bell, MessageSquare, ArrowLeft, Circle } from 'lucide-react';
import { io } from 'socket.io-client';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [hasNewMessage, setHasNewMessage] = useState(false);

    useEffect(() => {
        if (!user) return;

        const socket = io('http://localhost:5001');
        socket.emit('join', user._id);

        socket.on('new_notification', (data) => {
            if (data.type === 'message') {
                setHasNewMessage(true);
            }
        });

        return () => socket.disconnect();
    }, [user]);

    const isBrand = user?.role === 'Brand';

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b px-6 md:px-20 py-4 flex justify-between items-center transition-all ${isBrand
            ? 'bg-brand-background/80 border-brand-border shadow-lg shadow-black/20'
            : 'bg-background-dark/80 border-border-dark'
            }`}>
            <div className="flex items-center gap-4">
                {location.pathname !== '/' && (
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-all flex items-center gap-2"
                        title="Go Back"
                    >
                        <ArrowLeft size={20} />
                        <span className="text-sm font-medium hidden sm:block">Back</span>
                    </button>
                )}
                <Link to="/" className={`text-2xl font-black uppercase tracking-tighter flex items-center gap-2 transition-colors ${isBrand ? 'text-brand-primary' : 'text-primary'
                    }`}>
                    <span>CollabConnect</span>
                </Link>
            </div>

            <div className="flex items-center gap-6">
                {user ? (
                    <>
                        {user.role === 'Admin' && (
                            <Link to="/admin/dashboard" className="text-sky-400 hover:text-white transition-all text-[8px] font-black uppercase tracking-widest bg-sky-400/10 px-4 py-2 rounded-xl border border-sky-400/20">
                                Admin Panel
                            </Link>
                        )}
                        {user.role !== 'Admin' && (
                            <Link
                                to="/chat"
                                className="text-slate-300 hover:text-white transition-colors relative"
                                onClick={() => setHasNewMessage(false)}
                            >
                                <MessageSquare size={20} />
                                {hasNewMessage && (
                                    <span className={`absolute -top-1 -right-1 w-3 h-3 border-2 rounded-full animate-pulse shadow-lg ${isBrand
                                        ? 'bg-brand-accent border-brand-background shadow-brand-accent/50'
                                        : 'bg-red-500 border-background-dark shadow-red-500/50'
                                        }`}></span>
                                )}
                            </Link>
                        )}
                        <Link to="/notifications" className="text-slate-300 hover:text-white transition-colors">
                            <Bell size={20} />
                        </Link>
                        <Link to={user?.role === 'Brand' ? "/brand/profile" : "/profile"} className="text-slate-300 hover:text-white transition-colors">
                            <User size={20} />
                        </Link>
                        <button
                            onClick={logout}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all font-black uppercase text-[10px] tracking-widest border border-red-500/10"
                        >
                            <LogOut size={16} />
                            <span>Logout</span>
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="text-slate-300 hover:text-white transition-colors font-black uppercase text-[10px] tracking-widest">Login</Link>
                        <Link
                            to="/register"
                            className={`px-6 py-2 rounded-xl text-black font-black uppercase text-[10px] tracking-widest transition-all shadow-lg ${isBrand
                                ? 'bg-brand-primary shadow-brand-primary/20'
                                : 'bg-gradient-to-r from-primary to-secondary shadow-primary/20'
                                }`}
                        >
                            Get Started
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
