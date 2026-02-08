import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const PlanForm = ({ onSubmit, onClose }) => {
    const [formData, setFormData] = useState({
        age: '',
        gender: 'Nam',
        height: '',
        weight: '',
        goal: 'Giảm cân',
        daysPerWeek: '3'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-gray-900 border border-gray-700/50 rounded-2xl p-8 w-full max-w-lg shadow-2xl relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />

                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition">
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6 text-center">
                    Cá nhân hóa Lộ trình
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Tuổi</label>
                            <input
                                required type="number" name="age" value={formData.age} onChange={handleChange} min="10" max="100"
                                className="w-full bg-gray-800/50 text-white rounded-xl px-4 py-3 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                                placeholder="VD: 25"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Giới tính</label>
                            <select
                                name="gender" value={formData.gender} onChange={handleChange}
                                className="w-full bg-gray-800/50 text-white rounded-xl px-4 py-3 border border-gray-700 focus:border-blue-500 outline-none appearance-none"
                            >
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Chiều cao (cm)</label>
                            <input
                                required type="number" name="height" value={formData.height} onChange={handleChange} min="100" max="250"
                                className="w-full bg-gray-800/50 text-white rounded-xl px-4 py-3 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                                placeholder="VD: 175"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Cân nặng (kg)</label>
                            <input
                                required type="number" name="weight" value={formData.weight} onChange={handleChange} min="30" max="200"
                                className="w-full bg-gray-800/50 text-white rounded-xl px-4 py-3 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                                placeholder="VD: 70"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Mục tiêu chính</label>
                        <select
                            name="goal" value={formData.goal} onChange={handleChange}
                            className="w-full bg-gray-800/50 text-white rounded-xl px-4 py-3 border border-gray-700 focus:border-blue-500 outline-none appearance-none"
                        >
                            <option value="Giảm cân">🔥 Giảm cân</option>
                            <option value="Tăng cơ">💪 Tăng cơ</option>
                            <option value="Duy trì sức khỏe">❤️ Duy trì sức khỏe</option>
                            <option value="Tăng thể lực">⚡ Tăng thể lực</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Số buổi tập/tuần</label>
                        <select
                            name="daysPerWeek" value={formData.daysPerWeek} onChange={handleChange}
                            className="w-full bg-gray-800/50 text-white rounded-xl px-4 py-3 border border-gray-700 focus:border-blue-500 outline-none appearance-none"
                        >
                            <option value="2">2 buổi (Nhẹ nhàng)</option>
                            <option value="3">3 buổi (Vừa phải)</option>
                            <option value="4">4 buổi (Tích cực)</option>
                            <option value="5">5 buổi (Cường độ cao)</option>
                            <option value="6">6 buổi (Vận động viên)</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transform transition active:scale-95 mt-4"
                    >
                        🚀 Bắt đầu Tạo Lộ Trình
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default PlanForm;
