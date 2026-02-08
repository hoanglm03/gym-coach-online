import React, { useState } from 'react';
import { SendHorizontal } from 'lucide-react';

const InputArea = ({ onSendMessage, disabled }) => {
    const [input, setInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim() && !disabled) {
            onSendMessage(input);
            setInput('');
        }
    };

    return (
        <div className="p-4 bg-gray-900/30 backdrop-blur-md border-t border-gray-700/50">
            <form onSubmit={handleSubmit} className="flex items-center gap-3 max-w-4xl mx-auto">
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={disabled}
                        placeholder={disabled ? "HLV đang trả lời..." : "Hỏi tôi về lịch tập, dinh dưỡng..."}
                        className="w-full bg-gray-800/50 text-white rounded-xl pl-5 pr-12 py-3.5 border border-gray-700/50 focus:outline-none focus:border-blue-500/50 focus:bg-gray-800 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-gray-500"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || disabled}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg transition-all shadow-lg shadow-blue-500/30"
                    >
                        <SendHorizontal size={18} />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default InputArea;
