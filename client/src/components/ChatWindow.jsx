import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import { motion, AnimatePresence } from 'framer-motion';

const ChatWindow = ({ messages = [], loading }) => {
    const bottomRef = useRef(null);
    const safeMessages = Array.isArray(messages) ? messages : [];

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    return (
        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            <AnimatePresence initial={false}>
                {safeMessages.map((msg, index) => (
                    <MessageBubble key={index} message={msg} />
                ))}
            </AnimatePresence>

            {loading && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                >
                    <div className="bg-gray-800/80 rounded-2xl p-4 rounded-bl-none flex gap-1 items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    </div>
                </motion.div>
            )}
            <div ref={bottomRef} className="h-4" />
        </div>
    );
};

export default ChatWindow;
