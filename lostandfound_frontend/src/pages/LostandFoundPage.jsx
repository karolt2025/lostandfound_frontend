import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ShareModal from "../components/ShareModal";

function LostAndFound() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [shareItem, setShareItem] = useState(null); // ✅ ONE modal state

    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://127.0.0.1:8000/lostandfoundboard/items/")
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch items");
                return res.json();
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
                    {items.map((item) => {
                        const shareUrl = `${window.location.origin}/items/${item.id}`;

                        return (
                            <div
                                key={item.id}
                                style={styles.card}
                                onClick={() => navigate(`/items/${item.id}`)}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "translateY(-4px)";
                                    e.currentTarget.style.boxShadow =
                                        "0 8px 20px rgba(0,0,0,0.15)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "none";
                                    e.currentTarget.style.boxShadow =
                                        "0 4px 12px rgba(0,0,0,0.1)";
                                }}
                            >
                                {item.image ? (
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        style={styles.image}
                                    />
                                ) : (
                                    <div style={styles.imagePlaceholder}>No Image</div>
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

                                    <button
                                        style={styles.shareButton}
                                        onClick={(e) => {
                                            e.stopPropagation(); // 🚫 prevent card navigation
                                            setShareItem(item);
                                        }}
                                    >
                                        Share 🔗
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ✅ ONE SHARE MODAL */}
            {shareItem && (
                <ShareModal
                    shareUrl={`${window.location.origin}/items/${shareItem.id}`}
                    title={shareItem.title}
                    onClose={() => setShareItem(null)}
                />
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
        cursor: "pointer",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
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
    },
    cardBody: {
        padding: "15px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    },
    cardTitle: {
        margin: 0,
    },
    description: {
        fontSize: "14px",
        color: "#374151",
    },
    badge: {
        alignSelf: "flex-start",
        padding: "4px 10px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: "600",
    },
    shareButton: {
        marginTop: "8px",
        padding: "6px 10px",
        fontSize: "13px",
        borderRadius: "6px",
        border: "none",
        backgroundColor: "#10b981",
        color: "#fff",
        cursor: "pointer",
    },
};

export default LostAndFound;
