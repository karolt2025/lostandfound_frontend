// src/data.js
export const BASE_URL = "http://127.0.0.1:8000"; // Django backend

export const API = {
    REGISTER: `${BASE_URL}/users/register/`,
    LOGIN: `${BASE_URL}/api-token-auth/`,
    ITEMS: `${BASE_URL}/items/`, // replace with your items endpoint
};

// Get token from localStorage
export const getToken = () => localStorage.getItem("token");

// Headers with token
export const authHeaders = () => {
    const token = getToken();
    return token ? { Authorization: `Token ${token}` } : {};
};
