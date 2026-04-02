import React from 'react';
import { Info, Calendar, Target } from 'lucide-react';

const ChatHeader = ({ campaign, brandName, influencerName }) => {
    return (
        <div className="p-4 border-b border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                    <Target className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-white">{campaign?.title || 'Campaign Chat'}</h3>
                    <p className="text-xs text-slate-400">
                        {brandName} & {influencerName}
                    </p>
                </div>
            </div>

            <div className="flex items-center space-x-4 text-slate-400">
                <div className="flex items-center text-xs">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{campaign?.timeline ? new Date(campaign.timeline).toLocaleDateString() : 'No deadline'}</span>
                </div>
                <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <Info className="w-5 h-5 text-slate-300" />
                </button>
            </div>
        </div>
    );
};

export default ChatHeader;
