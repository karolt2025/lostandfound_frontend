// src/pages/LostAndFound.jsx
import { useState, useEffect } from "react";

function LostAndFound() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch items from backend
    useEffect(() => {
        fetch("http://127.0.0.1:8000/lostandfoundboard/items/") // Adjust URL if needed
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch items");
                }
                return response.json();
            })
            .then((data) => {
                setItems(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading items...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>Lost & Found Board</h1>
            {items.length === 0 ? (
                <p>No items found.</p>
            ) : (
                <ul>
                    {items.map((item) => (
                        <li key={item.id}>
                            <strong>{item.name}</strong> - {item.description}{" "}
                            <em>({item.status})</em>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default LostAndFound;
