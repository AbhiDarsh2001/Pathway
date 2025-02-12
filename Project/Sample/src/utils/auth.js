import axios from 'axios';

export const refreshToken = async () => {
    try {
        const currentToken = localStorage.getItem('token');
        const response = await axios.post(`${import.meta.env.VITE_URL}/auth/refresh-token`, {
            token: currentToken
        });

        if (response.data.success) {
            localStorage.setItem('token', response.data.token);
            return response.data.token;
        }
        return null;
    } catch (error) {
        localStorage.removeItem('token');
        return null;
    }
}; 