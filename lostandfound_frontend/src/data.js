const API_BASE = "http://127.0.0.1:8000";

export const API = {
    LOGIN: `${API_BASE}/api-token-auth/`,
    ITEMS: `${API_BASE}/lostandfoundboard/items/`,
};

export async function createItem(itemData) {
    const token = localStorage.getItem("authToken");

    const response = await fetch(API.ITEMS, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`,
        },
        body: JSON.stringify(itemData),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(text);
    }

    return response.json();
}



// export async function getItems(token) {
//     const response = await fetch(`${API_BASE}/items/`, {
//         headers: {
//             "Authorization": `Token ${token}`,
//         },
//     });
//     return response.json();
// }

// export async function createItem(token, itemData) {
//     const response = await fetch(`${API_BASE}/items/`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Token ${token}`,
//         },
//         body: JSON.stringify(itemData),
//     });
//     return response.json();
// }
