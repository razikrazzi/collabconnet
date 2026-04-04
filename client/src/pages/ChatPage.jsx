import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { MoreVertical, Search, ArrowLeft, MessageSquare } from 'lucide-react';
import Navbar from '../components/Navbar';

const ChatPage = () => {
    const { user } = useAuth();
    const [contacts, setContacts] = useState([]);
    const [activeContact, setActiveContact] = useState(null);
    const socket = useRef();

    useEffect(() => {
        if (!user?._id) return;
        socket.current = io('http://localhost:5001');
        socket.current.emit('join', user._id);

        return () => {
            socket.current.disconnect();
        };
    }, [user._id]);

    useEffect(() => {
        // Fetch contacts (brands/influencers based on role)
        const fetchContacts = async () => {
            if (!user?.token) return;
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                // Using a simplified mock fetch for contacts here
                const { data } = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5001') + '/api/auth/profile', config);
                // In a real app, this would be a list of people involved in collaborations
                setContacts([
                    { _id: '65e123456789012345678901', name: 'Brand Tech Lab', role: 'Brand', avatar: '🏢' },
                    { _id: '65e123456789012345678902', name: 'Sarah Creator', role: 'Influencer', avatar: '🤳' }
                ]);
            } catch (err) {
                console.error(err);
            }
        };
        fetchContacts();
    }, [user.token]);

    useEffect(() => {
        if (activeContact) {
            // Profile view or other info could go here
        }
    }, [activeContact]);





    const isBrand = user?.role === 'Brand';

    return (
        <div className={`h-screen flex flex-col overflow-hidden ${isBrand ? 'bg-brand-background' : 'bg-background-dark'}`}>
            <Navbar />
            <div className={`flex-1 flex overflow-hidden p-6 pt-24 gap-6 ${isBrand ? 'brand-mesh-gradient' : 'mesh-gradient'}`}>
                {/* Contacts List */}
                <div className={`w-80 rounded-[2.5rem] overflow-hidden flex flex-col border backdrop-blur-3xl shadow-2xl transition-all duration-500 ${isBrand
                    ? 'bg-brand-surface/20 border-brand-border/30 hover:border-brand-primary/50'
                    : 'bg-white/5 border-white/5 hover:border-primary/50'
                    }`}>
                    <div className="p-8 border-b border-white/5">
                        <h2 className="text-2xl font-black uppercase tracking-tight mb-6 flex items-center gap-3">
                            <MessageSquare className={isBrand ? 'text-brand-primary' : 'text-primary'} size={24} />
                            Inbox
                        </h2>
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white transition-colors" size={16} />
                            <input
                                className={`w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-12 pr-4 outline-none transition-all text-sm font-medium ${isBrand ? 'focus:border-brand-primary/50' : 'focus:border-primary/50'}`}
                                placeholder="Search..."
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto no-scrollbar py-4 px-3 space-y-2">
                        {contacts.map((contact) => (
                            <button
                                key={contact._id}
                                onClick={() => setActiveContact(contact)}
                                className={`w-full p-4 flex items-center gap-4 rounded-[1.5rem] transition-all relative group ${activeContact?._id === contact._id
                                    ? (isBrand ? 'bg-brand-primary/10' : 'bg-primary/20 shadow-lg shadow-primary/10')
                                    : 'hover:bg-white/5'
                                    }`}
                            >
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner relative overflow-hidden ${activeContact?._id === contact._id
                                    ? (isBrand ? 'bg-brand-primary text-black' : 'bg-primary text-black')
                                    : 'bg-white/5 border border-white/5 grayscale group-hover:grayscale-0'
                                    }`}>
                                    {contact.avatar}
                                </div>
                                <div className="text-left flex-1 min-w-0">
                                    <p className={`font-black uppercase text-sm tracking-tight truncate ${activeContact?._id === contact._id ? 'text-white' : 'text-slate-300'}`}>{contact.name}</p>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-550 mt-0.5">{contact.role}</p>
                                </div>
                                {activeContact?._id === contact._id && (
                                    <motion.div layoutId="activeInd" className={`w-1.5 h-1.5 rounded-full ${isBrand ? 'bg-brand-primary' : 'bg-primary'}`} />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chat Window */}
                <div className={`flex-1 rounded-[3rem] border backdrop-blur-3xl overflow-hidden flex flex-col shadow-2xl transition-all duration-700 ${isBrand ? 'bg-brand-surface/10 border-brand-border/20' : 'bg-white/5 border-white/5'}`}>
                    {activeContact ? (
                        <>
                            <div className="p-6 px-10 border-b border-white/5 flex justify-between items-center bg-white/5 backdrop-blur-xl">
                                <div className="flex items-center gap-6">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-xl ${isBrand ? 'bg-brand-primary/20 text-brand-primary' : 'bg-primary/20 text-primary'}`}>
                                        {activeContact.avatar}
                                    </div>
                                    <div>
                                        <p className="text-xl font-black uppercase tracking-tight text-white">{activeContact.name}</p>
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-sm shadow-emerald-500/50"></span>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Live Connection</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-400 hover:text-white transition-all border border-white/5">
                                        <MoreVertical size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-12 flex flex-col items-center justify-center relative">
                                <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden select-none">
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40rem] font-black">
                                        CHAT
                                    </div>
                                </div>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    className="p-12 text-center glass-card rounded-[4rem] border border-white/10 relative z-10 max-w-md bg-gradient-to-br from-white/5 to-transparent shadow-2xl"
                                >
                                    <div className={`w-24 h-24 rounded-[2rem] mx-auto mb-8 flex items-center justify-center ${isBrand ? 'bg-brand-primary/10 text-brand-primary' : 'bg-primary/10 text-primary'}`}>
                                        <MessageSquare size={48} className="opacity-40" />
                                    </div>
                                    <h3 className="text-3xl font-black uppercase tracking-tighter text-white mb-4 italic underline underline-offset-8">Secure Workspace</h3>
                                    <p className="text-slate-400 font-medium leading-relaxed">
                                        End-to-end encrypted collaboration with <span className="text-white">@{activeContact.name.toLowerCase().replace(/\s/g, '')}</span> is active. Start your mission today.
                                    </p>
                                    <button className={`mt-10 px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all hover:scale-105 ${isBrand ? 'bg-brand-primary text-black shadow-lg shadow-brand-primary/20' : 'bg-primary text-black shadow-lg shadow-primary/20'}`}>
                                        Message Terminal
                                    </button>
                                </motion.div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center relative">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col items-center"
                            >
                                <div className="w-32 h-32 bg-white/5 rounded-[3rem] flex items-center justify-center mb-8 border border-white/5 shadow-inner">
                                    <MessageSquare size={56} className="text-slate-800" />
                                </div>
                                <h2 className="text-4xl font-black uppercase tracking-tighter text-white mb-3">Transmission <span className={isBrand ? 'text-brand-primary' : 'text-primary'}>Ready</span></h2>
                                <p className="text-slate-500 font-medium uppercase tracking-[0.2em] text-xs">Select a frequency to begin collaboration</p>
                            </motion.div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
