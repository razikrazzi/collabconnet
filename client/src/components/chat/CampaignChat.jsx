import React, { useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { MessageSquare, Users, Info } from 'lucide-react';

const socket = io('http://localhost:5001');

const CampaignChat = ({ campaignId, currentUser, campaign }) => {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchMessages = useCallback(async () => {
        try {
            const res = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5001') + '/api/messages/campaign/' + campaignId);
            if (Array.isArray(res.data)) {
                setMessages(res.data);
            } else {
                console.error('Messages response is not an array:', res.data);
                setMessages([]);
            }
            setIsLoading(false);
        } catch (err) {
            console.error('Error fetching messages:', err);
            setIsLoading(false);
        }
    }, [campaignId]);

    useEffect(() => {
        fetchMessages();

        // Join the campaign room
        socket.emit('join_campaign_room', campaignId);

        // Listen for new messages
        socket.on('receive_message', (newMessage) => {
            if (newMessage.campaignId === campaignId) {
                setMessages((prev) => [...prev, newMessage]);
            }
        });

        return () => {
            socket.off('receive_message');
        };
    }, [campaignId, fetchMessages]);

    const handleSendMessage = (messageData) => {
        if (!currentUser) return;
        const payload = {
            ...messageData,
            campaignId,
            senderId: currentUser._id,
            receiverId: currentUser.role === 'Brand'
                ? (campaign.influencersParticipating?.[0]?._id || campaign.influencersParticipating?.[0] || '')
                : (campaign.brand?._id || campaign.brand),
        };

        socket.emit('send_message', payload);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[500px] bg-white/5 rounded-2xl border border-white/10 animate-pulse">
                <p className="text-slate-400">Loading conversation...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[600px] bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <ChatHeader
                campaign={campaign}
                brandName={campaign?.brand?.name || 'Brand'}
                influencerName={currentUser?.role === 'Influencer' ? currentUser?.name : 'Influencer'}
            />

            <div className="flex-1 flex overflow-hidden">
                {/* Conversations Sidebar (Optional Desktop View) */}
                <div className="hidden md:flex w-64 border-r border-white/10 flex-col bg-white/5">
                    <div className="p-4 border-b border-white/10 font-medium text-slate-300 flex items-center">
                        <Users className="w-4 h-4 mr-2" /> Participants
                    </div>
                    <div className="p-4 space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-[10px] font-bold text-indigo-400">B</div>
                            <span className="text-sm text-slate-300">Brand Representative</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-[10px] font-bold text-emerald-400">I</div>
                            <span className="text-sm text-slate-300">Influencer</span>
                        </div>
                    </div>
                    <div className="mt-auto p-4 border-t border-white/10">
                        <div className="p-3 bg-indigo-600/10 rounded-lg border border-indigo-500/20">
                            <div className="flex items-center text-xs font-semibold text-indigo-400 mb-1">
                                <Info className="w-3 h-3 mr-1" /> Campaign Tips
                            </div>
                            <p className="text-[10px] text-slate-400 leading-tight">Keep communication professional and share drafts early for feedback.</p>
                        </div>
                    </div>
                </div>

                {/* Active Chat Window */}
                <div className="flex-1 flex flex-col min-w-0">
                    <MessageList messages={messages} currentUserId={currentUser?._id} />
                    <MessageInput onSendMessage={handleSendMessage} campaignId={campaignId} />
                </div>
            </div>
        </div>
    );
};

export default CampaignChat;
