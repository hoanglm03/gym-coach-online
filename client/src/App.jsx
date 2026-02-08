import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import InputArea from './components/InputArea';
import PlanForm from './components/PlanForm';
import { sendMessageToAI, generatePlanAPI, checkBackendHealth } from './services/api';
import { Menu } from 'lucide-react';
import {
  getHistory,
  saveConversation,
  getConversation,
  deleteConversation as deleteConvStorage,
  updateConversation,
  generateId,
  makeTitle,
} from './utils/historyStorage';

const WELCOME_MSG = {
  text: 'Chào bạn! Tôi là HLV Gym AI của bạn. Tôi có thể giúp gì cho việc tập luyện hôm nay?',
  sender: 'ai',
};

function App() {
  const [messages, setMessages] = useState([WELCOME_MSG]);
  const [loading, setLoading] = useState(false);
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [backendOk, setBackendOk] = useState(null);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [history, setHistory] = useState([]);

  const loadHistory = useCallback(() => setHistory(getHistory()), []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    checkBackendHealth().then((ok) => {
      setBackendOk(ok);
      console.log(ok ? '[FITNESS.AI] Backend đã kết nối (http://localhost:3000)' : '[FITNESS.AI] Backend không kết nối được.');
    });
  }, []);

  const persistCurrent = useCallback(
    (msgs) => {
      if (!msgs || msgs.length <= 1) return;
      const id = currentConversationId || generateId();
      const title = makeTitle(msgs);
      saveConversation({ id, title, messages: msgs, updatedAt: new Date().toISOString() });
      if (!currentConversationId) setCurrentConversationId(id);
      loadHistory();
    },
    [currentConversationId, loadHistory]
  );

  const handleSendMessage = async (text) => {
    const newMessages = [...messages, { text, sender: 'user' }];
    setMessages(newMessages);
    setLoading(true);

    const aiResponse = await sendMessageToAI(text, messages);
    const full = [...newMessages, { text: aiResponse, sender: 'ai' }];
    setMessages(full);
    setLoading(false);
    persistCurrent(full);
  };

  const handleCreatePlan = async (userData) => {
    setShowPlanForm(false);
    const statusMsg = `Đang phân tích dữ liệu (${userData.gender}, ${userData.weight}kg)... và tạo lộ trình tối ưu cho bạn.`;
    const withStatus = [...messages, { text: statusMsg, sender: 'ai' }];
    setMessages(withStatus);
    setLoading(true);

    const plan = await generatePlanAPI(userData);
    const full = [...withStatus, { text: plan, sender: 'ai' }];
    setMessages(full);
    setLoading(false);
    persistCurrent(full);
  };

  const handleSelectConversation = (id) => {
    const conv = getConversation(id);
    if (conv && Array.isArray(conv.messages) && conv.messages.length) {
      setMessages(conv.messages);
      setCurrentConversationId(id);
    }
  };

  const handleNewChat = () => {
    persistCurrent(messages);
    setMessages([WELCOME_MSG]);
    setCurrentConversationId(null);
  };

  const handleDeleteConversation = (id) => {
    deleteConvStorage(id);
    loadHistory();
    if (currentConversationId === id) {
      setMessages([WELCOME_MSG]);
      setCurrentConversationId(null);
    }
  };

  const handleRenameConversation = (id, newTitle) => {
    updateConversation(id, { title: newTitle });
    loadHistory();
  };

  const handlePinConversation = (id) => {
    const conv = getConversation(id);
    if (conv) updateConversation(id, { pinned: !conv.pinned });
    loadHistory();
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white font-sans overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]" />
      </div>

      {isSidebarOpen && (
        <div className="z-20 h-full">
          <Sidebar
            onOpenPlan={() => setShowPlanForm(true)}
            history={history}
            currentId={currentConversationId}
            onSelectConversation={handleSelectConversation}
            onNewChat={handleNewChat}
            onDeleteConversation={handleDeleteConversation}
            onRenameConversation={handleRenameConversation}
            onPinConversation={handlePinConversation}
          />
        </div>
      )}

      <div className="flex-1 flex flex-col relative z-10 backdrop-blur-sm bg-gray-900/80">
        <header className="p-4 border-b border-gray-700/50 flex justify-between items-center backdrop-blur-md bg-gray-800/40">
          <div className="flex items-center gap-3">
            <span
              className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                backendOk === true ? 'bg-green-500' : 'bg-gray-500'
              }`}
              title={backendOk === true ? 'Backend đang hoạt động' : backendOk === false ? 'Backend không hoạt động' : 'Đang kiểm tra...'}
            />
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-gray-700 rounded transition">
              <Menu size={24} className="text-gray-300" />
            </button>
            <h2 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Gym AI Coach
            </h2>
          </div>
          <button
            onClick={() => setShowPlanForm(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded-full font-medium transition shadow-lg shadow-blue-500/20"
          >
            + Lộ Trình Mới
          </button>
        </header>

        <ChatWindow messages={messages} loading={loading} />
        <InputArea onSendMessage={handleSendMessage} disabled={loading} />

        {showPlanForm && (
          <PlanForm onSubmit={handleCreatePlan} onClose={() => setShowPlanForm(false)} />
        )}
      </div>
    </div>
  );
}

export default App;
