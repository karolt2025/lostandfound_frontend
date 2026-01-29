// src/components/ItemsList.js
import React, { useEffect, useState } from "react";
import { API, authHeaders } from "../data";

export default function ItemsList() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch(API.ITEMS, {
                    headers: { ...authHeaders() },
                });
                const data = await response.json();
                setItems(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchItems();
    }, []);

    return (
        <div>
            <h2>Items</h2>
            <ul>
                {items.map(item => (
                    <li key={item.id}>{item.name} - {item.description}</li>
                ))}
            </ul>
        </div>
    );
}
