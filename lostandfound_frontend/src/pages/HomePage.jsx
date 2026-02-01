import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Check if the user is logged in
    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    // Fetch the most recent items
    useEffect(() => {
        fetch("http://127.0.0.1:8000/lostandfoundboard/items/?ordering=-date_created")
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
                console.error(err);
                setLoading(false);
            });
    }, []);

    // Show the modal to log in or register when user tries to post an item
    const handlePostItemClick = () => {
        if (!isLoggedIn) {
            setShowAuthModal(true); // Show login/register modal if not logged in
        } else {
            navigate("/items/create"); // Navigate to post item page if logged in
        }
    };

    const handleLogin = () => {
        navigate("/login"); // Navigate to login page
        setShowAuthModal(false); // Close modal
    };

    const handleRegister = () => {
        navigate("/register"); // Navigate to register page
        setShowAuthModal(false); // Close modal
    };

    const handleCloseModal = () => {
        setShowAuthModal(false); // Close modal without any action
    };

    const handleBrowse = () => {
        navigate("/lostandfound"); // Navigate to the Lost & Found board
    };

    const handleSignIn = () => {
        navigate("/login"); // Navigate to the login page
    };

    const handleSignOut = () => {
        localStorage.removeItem("authToken"); // Remove auth token to log out
        setIsLoggedIn(false); // Update login status
    };

    if (loading) return <p>Loading items...</p>;

    return (
        <div style={styles.page}>
            {/* Hero Section */}
            <section style={styles.hero}>
                <h1 style={styles.heroTitle}>Lost Something? Found Something?</h1>
                <p style={styles.heroSubtitle}>
                    Reconnect lost items with their owners — fast, simple, and secure.
                </p>

                <div style={styles.buttons}>
                    <button onClick={handleBrowse} style={styles.primaryButton}>
                        Browse Lost & Found
                    </button>
                    <button onClick={handlePostItemClick} style={styles.secondaryButton}>
                        Post an Item
                    </button>
                </div>

                <div style={styles.authLinks}>
                    {!isLoggedIn ? (
                        <button onClick={handleSignIn} style={styles.authButton}>
                            Sign In
                        </button>
                    ) : (
                        <button onClick={handleSignOut} style={styles.authButton}>
                            Sign Out
                        </button>
                    )}
                </div>
            </section>

            {/* Auth Modal */}
            {showAuthModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <h3>Please log in or register to post an item</h3>
                        <button onClick={handleLogin} style={styles.modalButton}>
                            Log In
                        </button>
                        <button onClick={handleRegister} style={styles.modalButton}>
                            Register
                        </button>
                        <button onClick={handleCloseModal} style={styles.modalClose}>
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Recent Items Preview */}
            <section style={styles.recentItemsSection}>
                <h2 style={styles.sectionTitle}>Recent Lost & Found Items</h2>
                <div style={styles.itemsGrid}>
                    {items.length === 0 ? (
                        <p>No items found.</p>
                    ) : (
                        items.slice(0, 4).map((item) => (
                            <div
                                key={item.id}
                                style={styles.card}
                                onClick={() => navigate(`/items/${item.id}`)} // Navigate to item detail
                            >
                                {item.image ? (
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        style={styles.cardImage}
                                    />
                                ) : (
                                    <div style={styles.cardImage}>Image Placeholder</div>
                                )}
                                <div style={styles.cardContent}>
                                    <h3>{item.title}</h3>
                                    <p>Status: {item.status.charAt(0).toUpperCase() + item.status.slice(1)}</p>
                                    {isLoggedIn ? (
                                        <button
                                            style={styles.contactButton}
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent card click navigation
                                                navigate(`/items/${item.id}/contact`);
                                            }}
                                        >
                                            Contact Owner
                                        </button>
                                    ) : (
                                        <p style={styles.contactMessage}>
                                            You need to sign in to contact the owner.
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <button style={styles.viewAllButton} onClick={handleBrowse}>
                    View all items
                </button>
            </section>

            {/* How It Works */}
            <section style={styles.howItWorks}>
                <h2 style={styles.sectionTitle}>How It Works</h2>
                <ol style={styles.stepsList}>
                    <li>Post a lost or found item</li>
                    <li>Message securely through the app</li>
                    <li>Reunite item with owner 🎉</li>
                </ol>
            </section>

            {/* Trust & Safety Section */}
            <section style={styles.trustSection}>
                <h2 style={styles.sectionTitle}>Trust & Safety</h2>
                <ul style={styles.trustList}>
                    <li>Private messaging</li>
                    <li>Verified users</li>
                    <li>Community-based</li>
                </ul>
            </section>

            {/* Call to Action */}
            <section style={styles.callToAction}>
                <h2 style={styles.callToActionTitle}>
                    Found something or missing something?
                </h2>
                <button onClick={handlePostItemClick} style={styles.primaryButton}>
                    Get started in seconds
                </button>
            </section>
        </div>
    );
};

const styles = {
    page: {
        fontFamily: "Arial, sans-serif",
        margin: 0,
        padding: 0,
    },
    hero: {
        backgroundColor: "#10b981",
        color: "#fff",
        textAlign: "center",
        padding: "60px 20px",
    },
    heroTitle: {
        fontSize: "36px",
        marginBottom: "16px",
    },
    heroSubtitle: {
        fontSize: "18px",
        marginBottom: "40px",
        maxWidth: "600px",
        margin: "0 auto",
    },
    buttons: {
        display: "flex",
        justifyContent: "center",
        gap: "20px",
    },
    primaryButton: {
        backgroundColor: "#2563eb",
        color: "#fff",
        padding: "12px 24px",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "16px",
    },
    secondaryButton: {
        backgroundColor: "#ffffff",
        color: "#2563eb",
        padding: "12px 24px",
        border: "2px solid #2563eb",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "16px",
    },
    authLinks: {
        marginTop: "20px",
    },
    authButton: {
        backgroundColor: "#f59e0b",
        color: "#fff",
        padding: "12px 24px",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "16px",
    },
    modalOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
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
        padding: "12px 20px",
        backgroundColor: "#2563eb",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "16px",
        margin: "8px 0",
    },
    modalClose: {
        backgroundColor: "#e5e7eb",
        color: "#111827",
        border: "none",
        padding: "8px 16px",
        borderRadius: "6px",
        cursor: "pointer",
    },
    recentItemsSection: {
        padding: "40px 20px",
        backgroundColor: "#f9fafb",
        textAlign: "center",
    },
    sectionTitle: {
        fontSize: "24px",
        marginBottom: "20px",
    },
    itemsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "20px",
        marginBottom: "20px",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        padding: "16px",
        cursor: "pointer",
    },
    cardImage: {
        height: "160px",
        backgroundColor: "#e5e7eb",
        marginBottom: "12px",
    },
    cardContent: {
        textAlign: "left",
    },
    contactButton: {
        backgroundColor: "#16a34a",
        color: "#fff",
        padding: "8px 16px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "14px",
    },
    contactMessage: {
        color: "#e11d48",
        fontSize: "14px",
    },
    viewAllButton: {
        backgroundColor: "#2563eb",
        color: "#fff",
        padding: "10px 20px",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "16px",
    },
    howItWorks: {
        padding: "40px 20px",
        backgroundColor: "#ffffff",
        textAlign: "center",
    },
    stepsList: {
        listStyleType: "none",
        padding: 0,
    },
    trustSection: {
        padding: "40px 20px",
        backgroundColor: "#f9fafb",
        textAlign: "center",
    },
    trustList: {
        listStyleType: "none",
        padding: 0,
    },
    callToAction: {
        padding: "40px 20px",
        backgroundColor: "#10b981",
        color: "#fff",
        textAlign: "center",
    },
    callToActionTitle: {
        fontSize: "24px",
        marginBottom: "20px",
    },
};

export default Homepage;
