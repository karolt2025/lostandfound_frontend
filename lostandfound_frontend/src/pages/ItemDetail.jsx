import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ShareModal from "../components/ShareModal";

function ItemDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = localStorage.getItem("authToken");
    const userId = Number(localStorage.getItem("userId"));

    const [showShareModal, setShowShareModal] = useState(false);
    const [showQR, setShowQR] = useState(false);

    const [showAuthModal, setShowAuthModal] = useState(false);
    const [redirectAfterAuth, setRedirectAfterAuth] = useState(null);


    useEffect(() => {
        fetch(`http://127.0.0.1:8000/lostandfoundboard/items/${id}/`, {
            headers: token ? { Authorization: `Token ${token}` } : {},
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Unauthorized or item not found");
                }
                return res.json();
            })
            .then((data) => {
                setItem(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [id, token]);

    const handleContactOwner = () => {
        if (!token) {
            setRedirectAfterAuth(`/items/${id}/contact`);
            setShowAuthModal(true);
        } else {
            navigate(`/items/${id}/contact`);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;

        const response = await fetch(
            `http://127.0.0.1:8000/lostandfoundboard/items/${id}/`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Token ${token}`,
                },
            }
        );

        if (response.ok) {
            navigate("/lostandfound");
        } else {
            alert("You are not allowed to delete this item.");
        }
    };

    // ✅ EARLY RETURNS (CRITICAL)
    if (loading) return <p>Loading item...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!item) return <p>Item not found.</p>;

    // ✅ SAFE: item exists now
    const shareUrl = `${window.location.origin}/items/${item.id}`;

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: item.title,
                text: "Check out this item",
                url: shareUrl,
            });
        } else {
            navigator.clipboard.writeText(shareUrl);
            alert("Link copied to clipboard!");
        }
    };

    return (
        <div style={styles.page}>
            <h1>{item.title}</h1>

            {item.image && (
                <img
                    src={item.image}
                    alt={item.title}
                    style={styles.image}
                />
            )}

            <p><strong>Description:</strong> {item.description}</p>
            <p><strong>Status:</strong> {item.status.toUpperCase()}</p>
            <p><strong>Location:</strong> {item.location}</p>

            <p style={styles.date}>
                Posted on {new Date(item.date_created).toLocaleDateString()}
            </p>

            <div style={styles.actionButtons}>
                <button
                    onClick={() => setShowShareModal(true)}
                    style={styles.shareButton}
                >
                    Share 🔗
                </button>

                {userId !== item.owner && (
                    <button
                        onClick={handleContactOwner}
                        style={styles.contactButton}
                    >
                        Contact Owner
                    </button>
                )}
            </div>


            {/* QR CODE */}
            {/* <div style={styles.qrSection}>
                <p style={styles.qrLabel}>Scan to open this item</p>
                <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                        shareUrl
                    )}`}
                    alt="Item QR Code"
                    style={styles.qrImage}
                />
            </div> */}

            {/* SHARE */}
            {/* <button
                onClick={() => setShowShareModal(true)}
                style={styles.shareButton}
            >
                Share 🔗
            </button> */}

            {/* CONTACT OWNER */}
            {/* {userId && userId !== item.owner && (
                <button
                    onClick={() => navigate(`/items/${id}/contact`)}
                    style={styles.contactButton}
                >
                    Contact Owner
                </button>
            )} */}

            {/* OWNER CONTROLS */}
            {userId === item.owner && (
                <div style={styles.ownerButtons}>
                    <button
                        onClick={() => navigate(`/items/${id}/edit`)}
                        style={styles.editButton}
                    >
                        Edit Item
                    </button>
                    <button
                        onClick={handleDelete}
                        style={styles.deleteButton}
                    >
                        Delete Item
                    </button>
                </div>
            )}

            {/* 🆕 AUTH MODAL */}
            {showAuthModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <h3>Please log in or register to contact the owner</h3>

                        <button
                            style={styles.modalButton}
                            onClick={() =>
                                navigate("/login", {
                                    state: { redirectTo: redirectAfterAuth },
                                })
                            }
                        >
                            Log In
                        </button>

                        <button
                            style={styles.modalButton}
                            onClick={() =>
                                navigate("/register", {
                                    state: { redirectTo: redirectAfterAuth },
                                })
                            }
                        >
                            Register
                        </button>

                        <button
                            style={styles.modalClose}
                            onClick={() => setShowAuthModal(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
            {/* SHARE MODAL */}
            {showShareModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <h3>Share this item</h3>

                        <button
                            style={styles.modalButton}
                            onClick={() => {
                                navigator.clipboard.writeText(shareUrl);
                                alert("Link copied to clipboard!");
                            }}
                        >
                            🔗 Copy Link
                        </button>

                        <button
                            style={styles.modalButton}
                            onClick={() => setShowQR((prev) => !prev)}
                        >
                            📱 {showQR ? "Hide QR Code" : "Generate QR Code"}
                        </button>

                        {showQR && (
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                                    shareUrl
                                )}`}
                                alt="QR Code"
                                style={{ marginTop: "16px" }}
                            />
                        )}

                        <button
                            style={styles.modalClose}
                            onClick={() => {
                                setShowShareModal(false);
                                setShowQR(false);
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

const styles = {
    page: {
        maxWidth: "800px",
        margin: "40px auto",
        padding: "20px",
    },
    image: {
        width: "100%",
        maxHeight: "400px",
        objectFit: "cover",
        marginBottom: "20px",
        borderRadius: "12px",
    },
    date: {
        marginTop: "20px",
        color: "#6b7280",
        fontSize: "14px",
    },
    ownerButtons: {
        marginTop: "30px",
        display: "flex",
        gap: "12px",
    },
    editButton: {
        padding: "12px 20px",
        backgroundColor: "#2563eb",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "16px",
    },
    deleteButton: {
        padding: "12px 20px",
        backgroundColor: "#dc2626",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "16px",
    },
    contactButton: {
        marginTop: "16px",
        padding: "10px 18px",
        backgroundColor: "#16a34a",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "16px",
    },
    shareButton: {
        marginTop: "16px",
        padding: "10px 18px",
        backgroundColor: "#10b981",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "16px",
    },
    qrSection: {
        marginTop: "24px",
        textAlign: "center",
    },
    qrLabel: {
        marginBottom: "8px",
        fontSize: "14px",
        color: "#374151",
    },
    qrImage: {
        width: "100px",
        height: "100px",
    },
    modalOverlay: {
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
    },
    modal: {
        backgroundColor: "#fff",
        padding: "24px",
        borderRadius: "12px",
        width: "90%",
        maxWidth: "320px",
        textAlign: "center",
    },
    modalButton: {
        width: "100%",
        padding: "12px",
        marginTop: "12px",
        fontSize: "15px",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
        backgroundColor: "#2563eb",
        color: "#fff",
    },
    modalClose: {
        marginTop: "16px",
        background: "none",
        border: "none",
        color: "#374151",
        cursor: "pointer",
    },
    actionButtons: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        maxWidth: "280px",
        flexDirection: "row",

    },


};

export default ItemDetail;
