import { useEffect, useState } from "react";

function LostAndFound() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch items from backend
    useEffect(() => {
        fetch("http://localhost:8000/lostandfoundboard/items/") // update URL if different
            .then((response) => response.json())
            .then((data) => {
                setItems(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching items:", error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <p>Loading items...</p>;
    }

    return (
        <div>
            <h1>Lost & Found Items</h1>
            {items.length === 0 ? (
                <p>No items found.</p>
            ) : (
                <ul>
                    {items.map((item) => (
                        <li key={item.id}>
                            <strong>{item.name}</strong> - {item.description}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default LostAndFound;
