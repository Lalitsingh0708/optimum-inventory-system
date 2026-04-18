const API_URL = '/api';

const fetchWithAuth = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        window.location.href = '/index.html';
        return;
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers
    });

    if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/index.html';
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }
        return data;
    } else {
        if (!response.ok) throw new Error('Something went wrong');
        return await response.text();
    }
};
