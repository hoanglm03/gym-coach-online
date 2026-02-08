import React from 'react';
import { motion } from 'framer-motion';
import { Bot, User, Sparkles, Dumbbell, Flame } from 'lucide-react';

const MessageBubble = ({ message }) => {
  if (!message || typeof message !== 'object') return null;

  const isUser = message.sender === 'user';
  const text = message.text != null ? String(message.text) : '';

  /** Hiển thị text: ẩn dấu ** (in đậm), list/heading có icon. Không dùng react-markdown để tránh lỗi trang trắng. */
  const renderAiContent = (content) => {
    if (!content) return null;
    const renderBold = (str) => {
      const parts = str.split(/\*\*(.+?)\*\*/g);
      return parts.map((p, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-bold text-blue-300 inline-flex items-center gap-1">
            <Sparkles size={12} className="shrink-0 text-amber-400" />
            {p}
          </strong>
        ) : (
          p
        )
      );
    };
    const lines = content.split(/\n/);
    return (
      <div className="[&_p]:mb-2 [&_p:last-child]:mb-0">
        {lines.map((line, i) => {
          const t = line.trim();
          if (/^###?\s/.test(t) || /^#\s/.test(t)) {
            const text = t.replace(/^#+\s*/, '');
            return (
              <h3 key={i} className="flex items-center gap-2 text-base font-semibold text-white mt-3 mb-1">
                <Flame size={16} className="text-orange-400 shrink-0" />
                {renderBold(text)}
              </h3>
            );
          }
          if (/^[-*•]\s/.test(t) || /^\d+\.\s/.test(t)) {
            const text = t.replace(/^[-*•]\s*/, '').replace(/^\d+\.\s*/, '');
            return (
              <li key={i} className="flex items-start gap-2 text-gray-200 my-1 list-none">
                <span className="mt-1.5 shrink-0 w-5 h-5 rounded-full bg-blue-500/30 flex items-center justify-center">
                  <Dumbbell size={10} className="text-blue-400" />
                </span>
                <span className="flex-1">{renderBold(text)}</span>
              </li>
            );
          }
          if (!t) return <br key={i} />;
          return (
            <p key={i} className="mb-2 last:mb-0">
              {renderBold(line)}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} items-end gap-2 mb-2`}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shrink-0 mb-1 shadow-lg shadow-blue-500/30">
          <Bot size={16} className="text-white" />
        </div>
      )}

      <div
        className={`max-w-[80%] md:max-w-[70%] rounded-2xl p-4 shadow-md backdrop-blur-sm ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-none shadow-blue-500/20'
            : 'bg-gray-800/90 text-gray-100 rounded-bl-none border border-gray-700/50'
        }`}
      >
        <div className="text-sm leading-relaxed whitespace-pre-wrap">
          {isUser ? text : renderAiContent(text)}
        </div>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center shrink-0 mb-1 border border-gray-600">
          <User size={16} className="text-gray-300" />
        </div>
      )}
    </motion.div>
  );
};

export default MessageBubble;
