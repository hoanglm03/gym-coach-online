const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/$/, '');
const API_URL = API_BASE;

/** Kiểm tra backend có sống không. URL: http://localhost:3000/api/health */
export const checkBackendHealth = async () => {
    try {
        const base = API_BASE.replace(/\/api\/?$/, '');
        const r = await fetch(`${base}/api/health`);
        const data = await r.json();
        return data?.ok === true;
    } catch (e) {
        console.warn('Backend health check failed:', e);
        return false;
    }
};

export const sendMessageToAI = async (message, history = []) => {
    const url = `${API_URL}/chat`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message, history }),
        });

        if (!response.ok) {
            let errMsg = response.statusText;
            try {
                const errData = await response.json();
                if (errData && errData.response) errMsg = errData.response;
                else errMsg = JSON.stringify(errData) || errMsg;
            } catch (_) {
                errMsg = await response.text() || errMsg;
            }
            console.error('API error', response.status, url, errMsg);
            throw new Error(`Server trả về ${response.status}: ${errMsg}`);
        }

        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error('Error calling AI:', error.message, '| URL:', url);
        if (error.message.startsWith('Server trả về')) {
            return "Lỗi từ backend: " + error.message + " (kiểm tra API Key hoặc tên model trong server).";
        }
        return "Hiện tại tôi không thể kết nối với server. Vui lòng kiểm tra lại backend (hoặc API Key).";
    }
};

export const generatePlanAPI = async (userData) => {
    try {
        const response = await fetch(`${API_URL}/plan`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data.plan;
    } catch (error) {
        console.error('Error generating plan:', error);
        return "Xin lỗi, không thể tạo kế hoạch lúc này. Vui lòng thử lại sau.";
    }
};
