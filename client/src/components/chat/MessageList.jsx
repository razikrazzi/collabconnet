import React, { useEffect, useRef } from 'react';
import { FileText, Image as ImageIcon, Video } from 'lucide-react';

const MessageList = ({ messages, currentUserId }) => {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const renderFile = (url, type) => {
        if (type === 'image') return <img src={url} alt="Shared content" className="max-w-xs rounded-lg mt-2 cursor-pointer hover:opacity-90" />;
        if (type === 'video') return <video src={url} controls className="max-w-xs rounded-lg mt-2" />;
        if (type === 'document') return (
            <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center p-3 bg-white/5 rounded-lg mt-2 border border-white/10 hover:bg-white/10 transition-colors">
                <FileText className="w-6 h-6 text-indigo-400 mr-2" />
                <span className="text-sm text-slate-200">View Document</span>
            </a>
        );
        return null;
    };

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {messages.map((msg, index) => {
                const isMe = msg.senderId === currentUserId;
                return (
                    <div key={msg._id || index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] flex ${isMe ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2`}>
                            <div className={`w-8 h-8 rounded-full bg-slate-700 flex-shrink-0 flex items-center justify-center text-xs font-bold text-white mb-1 ${isMe ? 'ml-2' : 'mr-2'}`}>
                                {msg.senderName ? msg.senderName.charAt(0) : 'U'}
                            </div>

                            <div className="flex flex-col">
                                <div className={`px-4 py-2 rounded-2xl text-sm ${isMe
                                        ? 'bg-indigo-600 text-white rounded-br-none'
                                        : 'bg-white/10 text-slate-100 rounded-bl-none border border-white/5'
                                    }`}>
                                    {msg.messageText && <p>{msg.messageText}</p>}
                                    {msg.fileUrl && renderFile(msg.fileUrl, msg.messageType)}
                                </div>
                                <span className={`text-[10px] text-slate-500 mt-1 ${isMe ? 'text-right' : 'text-left'}`}>
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    {isMe && (
                                        <span className="ml-1 text-indigo-400">
                                            {msg.status === 'Seen' ? '✓✓' : msg.status === 'Delivered' ? '✓✓' : '✓'}
                                        </span>
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default MessageList;
