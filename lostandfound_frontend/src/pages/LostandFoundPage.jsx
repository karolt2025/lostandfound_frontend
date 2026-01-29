// src/pages/LostAndFound.jsx
import { useState, useEffect } from "react";

function LostAndFound() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/lostandfoundboard/items/")
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
        <div style={styles.page}>
            <h1 style={styles.title}>Lost & Found Board</h1>

            {items.length === 0 ? (
                <p>No items found.</p>
            ) : (
                <div style={styles.grid}>
                    {items.map((item) => (
                        <div key={item.id} style={styles.card}>
                            {item.image ? (
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    style={styles.image}
                                />
                            ) : (
                                <div style={styles.imagePlaceholder}>
                                    No Image
                                </div>
                            )}

                            <div style={styles.cardBody}>
                                <h3 style={styles.cardTitle}>{item.title}</h3>

                                <p style={styles.description}>
                                    {item.description}
                                </p>

                                <span
                                    style={{
                                        ...styles.badge,
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
                    ))}
                </div>
            )}
        </div>
    );
}

const styles = {
    page: {
        padding: "30px",
        maxWidth: "1200px",
        margin: "0 auto",
    },
    title: {
        textAlign: "center",
        marginBottom: "30px",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "20px",
    },
    card: {
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
    },
    image: {
        width: "100%",
        height: "200px",
        objectFit: "cover",
    },
    imagePlaceholder: {
        width: "100%",
        height: "200px",
        backgroundColor: "#e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#6b7280",
        fontSize: "14px",
    },
    cardBody: {
        padding: "15px",
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
    },
    cardTitle: {
        margin: "0 0 10px 0",
    },
    description: {
        fontSize: "14px",
        color: "#374151",
        marginBottom: "15px",
    },
    badge: {
        alignSelf: "flex-start",
        padding: "4px 10px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: "600",
        color: "#111827",
    },
};

export default LostAndFound;
