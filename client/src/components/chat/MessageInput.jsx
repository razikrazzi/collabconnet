import React, { useState, useRef } from 'react';
import { Send, Paperclip, Smile, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import axios from 'axios';

const MessageInput = ({ onSendMessage, campaignId, receiverId }) => {
    const [message, setMessage] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileType, setFileType] = useState('text');
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setSelectedFile(file);
        if (file.type.startsWith('image/')) setFileType('image');
        else if (file.type.startsWith('video/')) setFileType('video');
        else setFileType('document');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim() && !selectedFile) return;

        let fileUrl = '';
        let finalMessageType = fileType;

        if (selectedFile) {
            setIsUploading(true);
            const formData = new FormData();
            formData.append('file', selectedFile);

            try {
                // Assuming an endpoint for file upload exists or using a generic one
                // In this implementation, we'll suggest using a separate upload route if needed
                // but for now, we'll focus on the message sending logic.
                const res = await axios.post((import.meta.env.VITE_API_URL || 'http://localhost:5001') + '/api/chat/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                fileUrl = res.data.url;
            } catch (err) {
                console.error('Upload failed:', err);
                setIsUploading(false);
                return;
            }
            setIsUploading(false);
        }

        onSendMessage({
            messageText: message,
            fileUrl,
            messageType: fileUrl ? finalMessageType : 'text'
        });

        setMessage('');
        setSelectedFile(null);
        setFileType('text');
    };

    return (
        <div className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-md">
            {selectedFile && (
                <div className="mb-2 p-2 bg-indigo-500/20 border border-indigo-500/30 rounded-lg flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <ImageIcon className="w-4 h-4 text-indigo-400" />
                        <span className="text-xs text-slate-200 truncate max-w-[200px]">{selectedFile.name}</span>
                    </div>
                    <button onClick={() => setSelectedFile(null)} className="text-slate-400 hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex items-center space-x-2">
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-slate-400 hover:text-indigo-400 transition-colors"
                >
                    <Paperclip className="w-5 h-5" />
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                />

                <button type="button" className="p-2 text-slate-400 hover:text-indigo-400 transition-colors">
                    <Smile className="w-5 h-5" />
                </button>

                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />

                <button
                    type="submit"
                    disabled={isUploading || (!message.trim() && !selectedFile)}
                    className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full transition-all shadow-lg shadow-indigo-500/20"
                >
                    {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
            </form>
        </div>
    );
};

export default MessageInput;
