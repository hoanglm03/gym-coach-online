import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Dumbbell, History, Plus, Trash2, MessageCircle, MoreVertical, Pin, Pencil } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({
  onOpenPlan,
  history = [],
  currentId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  onRenameConversation,
  onPinConversation,
}) => {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const menuRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editingId && inputRef.current) inputRef.current.focus();
  }, [editingId]);

  useEffect(() => {
    const close = (e) => {
      if (openMenuId && menuRef.current && !menuRef.current.contains(e.target)) setOpenMenuId(null);
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [openMenuId]);

  const handleRenameStart = (conv, e) => {
    e.stopPropagation();
    setOpenMenuId(null);
    setEditingId(conv.id);
    setEditingTitle(conv.title || '');
  };

  const handleRenameSave = (id) => {
    const t = editingTitle.trim();
    if (t && onRenameConversation) onRenameConversation(id, t);
    setEditingId(null);
    setEditingTitle('');
  };

  const handlePin = (id, e) => {
    e.stopPropagation();
    setOpenMenuId(null);
    onPinConversation && onPinConversation(id);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    setOpenMenuId(null);
    onDeleteConversation && onDeleteConversation(id);
  };

  return (
    <motion.div
      initial={{ x: -250, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 bg-gray-900/90 border-r border-gray-700/50 flex flex-col h-full backdrop-blur-md"
    >
      <div className="p-6 border-b border-gray-700/50 flex items-center gap-2">
        <Dumbbell className="text-blue-500" size={28} />
        <span className="text-xl font-bold text-white tracking-wide">FITNESS.AI</span>
      </div>

      <div className="p-4 flex-1 flex flex-col min-h-0">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onOpenPlan}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl py-3 text-sm font-semibold shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 mb-4"
        >
          <Plus size={18} />
          Tạo Lộ Trình
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNewChat}
          className="w-full bg-gray-700/50 hover:bg-gray-700 text-gray-200 rounded-xl py-2.5 text-sm font-medium flex items-center justify-center gap-2 mb-6 border border-gray-600/50"
        >
          <MessageCircle size={18} />
          Cuộc hội thoại mới
        </motion.button>

        <div className="flex-1 min-h-0 flex flex-col">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2 px-2">
            <History size={14} /> Gần đây
          </h2>
          <ul className="space-y-1 overflow-y-auto flex-1 pr-1">
            {history.length === 0 ? (
              <li className="p-3 rounded-lg text-sm text-gray-500 flex items-center gap-3">
                <MessageSquare size={16} className="text-gray-600 shrink-0" />
                Chưa có lịch sử
              </li>
            ) : (
              history.map((conv) => (
                <li
                  key={conv.id}
                  className={`group flex items-center gap-2 p-3 rounded-lg cursor-pointer transition ${currentId === conv.id ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30' : 'hover:bg-white/5 text-gray-300'}`}
                  onClick={() => editingId !== conv.id && onSelectConversation && onSelectConversation(conv.id)}
                >
                  {conv.pinned ? (
                    <Pin size={16} className="shrink-0 text-amber-400 fill-amber-400" title="Đã ghim lên đầu" />
                  ) : (
                    <MessageSquare size={16} className="text-gray-500 shrink-0 group-hover:text-blue-400" />
                  )}
                  {editingId === conv.id ? (
                    <input
                      ref={inputRef}
                      type="text"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onBlur={() => handleRenameSave(conv.id)}
                      onKeyDown={(e) => {
                        e.stopPropagation();
                        if (e.key === 'Enter') handleRenameSave(conv.id);
                        if (e.key === 'Escape') {
                          setEditingId(null);
                          setEditingTitle('');
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 min-w-0 bg-gray-700 text-white text-sm rounded px-2 py-1 border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  ) : (
                    <span className="truncate flex-1 text-sm">{conv.title}</span>
                  )}
                  <div className="relative shrink-0" ref={openMenuId === conv.id ? menuRef : null}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId((prev) => (prev === conv.id ? null : conv.id));
                      }}
                      className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white transition"
                      title="Thao tác"
                    >
                      <MoreVertical size={16} />
                    </button>
                    {openMenuId === conv.id && (
                      <div
                        className="absolute right-0 top-full mt-1 py-1 w-44 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={(e) => handleRenameStart(conv, e)}
                          className="w-full px-3 py-2 text-left text-sm text-gray-200 hover:bg-gray-700 flex items-center gap-2"
                        >
                          <Pencil size={14} /> Đổi tên
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handlePin(conv.id, e)}
                          className="w-full px-3 py-2 text-left text-sm text-gray-200 hover:bg-gray-700 flex items-center gap-2"
                        >
                          <Pin size={14} className={conv.pinned ? 'fill-amber-400 text-amber-400' : ''} />
                          {conv.pinned ? 'Bỏ ghim' : 'Ghim lên đầu'}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDelete(conv.id, e)}
                          className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-red-500/20 flex items-center gap-2"
                        >
                          <Trash2 size={14} /> Xóa
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      <div className="mt-auto p-4 border-t border-gray-700/50 text-center">
        <p className="text-xs text-gray-600">Bản quyền © by LeMinhHoang</p>
      </div>
    </motion.div>
  );
};

export default Sidebar;
