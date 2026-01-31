import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./LostAndFound.css";

function LostAndFound() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("http://localhost:8000/lostandfoundboard/items/")
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
        <div className="page">
            <h1 className="title">Lost & Found Items</h1>

            {items.length === 0 ? (
                <p>No items found.</p>
            ) : (
                <div className="grid">
                    {items.map((item) => (
                        <Link
                            key={item.id}
                            to={`/items/${item.id}`}
                            className="card-link"
                        >
                            <div className="card">
                                {item.image ? (
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="card-image"
                                    />
                                ) : (
                                    <div className="image-placeholder">
                                        No Image
                                    </div>
                                )}

                                <div className="card-body">
                                    <h3 className="card-title">
                                        {item.title}
                                    </h3>

                                    <p className="description">
                                        {item.description}
                                    </p>

                                    <span
                                        className="badge"
                                        style={{
                                            backgroundColor:
                                                item.status === "lost"
                                                    ? "#fde68a"
                                                    : "#bbf7d0",
                                        }}
                                    >
                                        {item.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

export default LostAndFound;
