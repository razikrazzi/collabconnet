import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle, Clock, Info, Trash2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5001') + '/api/notifications', config);
                setNotifications(data);
            } catch (err) {
                console.error('Error fetching notifications:', err);
            }
        };
        fetchNotifications();
    }, [user.token]);

    const markAsRead = async (id) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/notifications/${id}`, {}, config);
            setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
        } catch (err) {
            console.error('Error marking notification as read:', err);
        }
    };

    const isBrand = user.role === 'Brand';

    return (
        <div className={`min-h-screen text-slate-100 pb-20 ${isBrand ? 'bg-brand-background brand-mesh-gradient' : 'bg-background-dark mesh-gradient'}`}>
            <Navbar />
            <main className="max-w-4xl mx-auto px-6 pt-24 pb-10">
                <header className="flex justify-between items-center mb-10">
                    <h1 className="text-4xl font-black uppercase tracking-tighter flex items-center gap-4">
                        <Bell className={isBrand ? 'text-brand-primary' : 'text-primary'} size={32} />
                        Notifications
                    </h1>
                    <button className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Mark all read</button>
                </header>

                <div className="space-y-4">
                    <AnimatePresence>
                        {notifications.length === 0 ? (
                            <div className="py-20 text-center glass-card rounded-[3rem] border border-white/5 bg-white/5">
                                <Bell size={48} className="mx-auto text-slate-700 mb-6" />
                                <h3 className="text-2xl font-black uppercase">Peace & Quiet</h3>
                                <p className="text-slate-500 mt-2 font-medium">You're all caught up with your transmissions.</p>
                            </div>
                        ) : (
                            notifications.map((n, i) => (
                                <motion.div
                                    key={n._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: i * 0.05 }}
                                    className={`glass-card p-6 rounded-3xl flex items-start gap-4 transition-all relative border border-white/5 ${!n.read ? `border-l-4 ${isBrand ? 'border-brand-primary' : 'border-primary'}` : 'opacity-60'}`}
                                >
                                    <div className={`p-3 rounded-2xl ${n.type === 'payment' ? 'bg-emerald-500/10 text-emerald-400' :
                                        n.type === 'campaign' ? `bg-blue-500/10 text-blue-400` :
                                            `${isBrand ? 'bg-brand-primary/10 text-brand-primary' : 'bg-primary/10 text-primary'}`
                                        }`}>
                                        {n.type === 'payment' ? <CheckCircle size={20} /> : <Info size={20} />}
                                    </div>
                                    <div className="flex-1">
                                        <p className={`text-lg font-black uppercase tracking-tight ${!n.read ? 'text-white' : 'text-slate-400'}`}>{n.title}</p>
                                        <p className="text-slate-400 font-medium mt-1">{n.message}</p>
                                        <p className="text-[10px] text-slate-500 mt-3 uppercase font-black tracking-widest flex items-center gap-2">
                                            <Clock size={12} /> {new Date(n.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        {!n.read && (
                                            <button onClick={() => markAsRead(n._id)} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isBrand ? 'bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-black' : 'bg-primary/10 text-primary hover:bg-primary hover:text-black'}`}>
                                                <CheckCircle size={18} />
                                            </button>
                                        )}
                                        <button className="w-10 h-10 rounded-xl bg-white/5 text-slate-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

export default NotificationsPage;
