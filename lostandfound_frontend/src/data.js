// src/data.js

const API_BASE = "http://localhost:8000"; // adjust if deployed

// ---- Authentication ----
export async function registerUser(username, email, password) {
    const response = await fetch(`${API_BASE}/users/register/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
    });
    return response.json();
}

export async function loginUser(username, password) {
    const response = await fetch(`${API_BASE}/api-token-auth/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    });
    return response.json(); // returns token and user info
}

// ---- Items (Lost and Found) ----
export async function getItems(token) {
    const response = await fetch(`${API_BASE}/items/`, {
        headers: {
            "Authorization": `Token ${token}`,
        },
    });
    return response.json();
}

export async function createItem(token, itemData) {
    const response = await fetch(`${API_BASE}/items/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`,
        },
        body: JSON.stringify(itemData),
    });
    return response.json();
}
