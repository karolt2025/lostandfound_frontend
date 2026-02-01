import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ShareModal from "../components/ShareModal";
import styles from "./LostAndFoundPage.module.css";

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
        <div className={styles.page}>
            <section className={styles.section}>
                <div className={styles.container}>
                    <h1 className={styles.sectionTitle}>Lost & Found Board</h1>

                    {items.length === 0 ? (
                        <p className={styles.empty}>No items found.</p>
                    ) : (
                        <div className={styles.itemsGrid}>
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className={styles.card}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => navigate(`/items/${item.id}`)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            navigate(`/items/${item.id}`);
                                        }
                                    }}
                                >
                                    {item.image ? (
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className={styles.cardImage}
                                        />
                                    ) : (
                                        <div className={styles.cardImage} />
                                    )}

                                    <div className={styles.cardBody}>
                                        <h3>{item.title}</h3>
                                        <p className={styles.description}>
                                            {item.description}
                                        </p>

                                        <div className={styles.cardFooter}>
                                            <span
                                                className={`${styles.badge} ${item.status === "lost"
                                                        ? styles.lost
                                                        : styles.found
                                                    }`}
                                            >
                                                {item.status.toUpperCase()}
                                            </span>

                                            {/* <button
                                                className={styles.shareButton}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setShareItem(item);
                                                }}
                                            >
                                                Share
                                            </button> */}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

export default LostAndFound;