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
                                onClick={() => navigate(`/items/${item.id}`)}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "translateY(-4px)";
                                    e.currentTarget.style.boxShadow =
                                        "0 8px 20px rgba(0,0,0,0.15)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow =
                                        "0 4px 12px rgba(0,0,0,0.1)";
                                }}
                            >
                                {item.image ? (
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        style={styles.cardImage}
                                    />
                                ) : (
                                    <div style={styles.cardImage} />
                                )}

                                <div style={styles.cardBody}>
                                    <h3 style={{ margin: 0 }}>{item.title}</h3>

                                    <span
                                        style={{
                                            ...styles.badge,
                                            backgroundColor:
                                                item.status === "lost"
                                                    ? "#fee2e2"
                                                    : "#dcfce7",
                                        }}
                                    >
                                        {item.status.charAt(0).toUpperCase() +
                                            item.status.slice(1)}
                                    </span>
                                    {/* <button
                                        style={styles.contactButton}
                                        onClick={(e) => {
                                            e.stopPropagation(); // prevent card navigation

                                            if (isLoggedIn) {
                                                navigate(`/items/${item.id}/contact`);
                                            } else {
                                                navigate("/login", {
                                                    state: {
                                                        redirectTo: `/items/${item.id}`,
                                                    },
                                                });
                                            }
                                        }}
                                    >
                                        Contact Owner
                                    </button> */}
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
        fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Inter, Arial, sans-serif",
        margin: 0,
        padding: 0,
        color: "#111827",
        lineHeight: 1.6,
    },

    /* HERO */
    hero: {
        background:
            "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 55%, #3b82f6 100%)",
        color: "#ffffff",
        textAlign: "center",
        padding: "80px 20px",
    },
    heroTitle: {
        fontSize: "clamp(32px, 5vw, 44px)",
        fontWeight: 700,
        marginBottom: "16px",
    },
    heroSubtitle: {
        fontSize: "18px",
        maxWidth: "640px",
        margin: "0 auto 40px",
        opacity: 0.95,
    },

    buttons: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "16px",
    },

    primaryButton: {
        backgroundColor: "#1d4ed8",
        color: "#ffffff",
        padding: "14px 28px",
        border: "none",
        borderRadius: "12px",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: 600,
        minWidth: "180px",
        outlineOffset: "3px",
    },

    secondaryButton: {
        backgroundColor: "#ffffff",
        color: "#1d4ed8",
        padding: "14px 28px",
        border: "2px solid #1d4ed8",
        borderRadius: "12px",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: 600,
        minWidth: "180px",
        outlineOffset: "3px",
    },

    authLinks: {
        marginTop: "24px",
    },

    authButton: {
        backgroundColor: "#f59e0b",
        color: "#111827",
        padding: "10px 22px",
        border: "none",
        borderRadius: "10px",
        cursor: "pointer",
        fontSize: "15px",
        fontWeight: 600,
        outlineOffset: "3px",
    },

    /* MODAL */
    modalOverlay: {
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
    },

    modal: {
        backgroundColor: "#ffffff",
        padding: "28px",
        borderRadius: "16px",
        width: "90%",
        maxWidth: "360px",
        textAlign: "center",
        boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
    },

    modalButton: {
        width: "100%",
        padding: "14px",
        backgroundColor: "#1d4ed8",
        color: "#ffffff",
        border: "none",
        borderRadius: "10px",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: 600,
        margin: "10px 0",
        outlineOffset: "3px",
    },

    modalClose: {
        backgroundColor: "#e5e7eb",
        color: "#111827",
        border: "none",
        padding: "10px 18px",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "14px",
    },

    /* SECTIONS */
    recentItemsSection: {
        padding: "60px 20px",
        backgroundColor: "#f9fafb",
        textAlign: "center",
    },

    sectionTitle: {
        fontSize: "28px",
        fontWeight: 700,
        marginBottom: "28px",
    },

    itemsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "24px",
        marginBottom: "32px",
    },

    card: {
        borderRadius: "16px",
        overflow: "hidden",
        backgroundColor: "#ffffff",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        outlineOffset: "4px",
    },

    cardImage: {
        width: "100%",
        height: "200px",
        objectFit: "cover",
        backgroundColor: "#e5e7eb",
    },

    cardBody: {
        padding: "18px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        textAlign: "left",
    },

    badge: {
        alignSelf: "flex-start",
        padding: "6px 12px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: 700,
        color: "#111827",
    },

    viewAllButton: {
        backgroundColor: "#1d4ed8",
        color: "#ffffff",
        padding: "14px 26px",
        border: "none",
        borderRadius: "12px",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: 600,
        outlineOffset: "3px",
    },

    howItWorks: {
        padding: "60px 20px",
        backgroundColor: "#ffffff",
        textAlign: "center",
    },

    stepsList: {
        listStyle: "none",
        padding: 0,
        maxWidth: "480px",
        margin: "0 auto",
        fontSize: "18px",
    },

    trustSection: {
        padding: "60px 20px",
        backgroundColor: "#f9fafb",
        textAlign: "center",
    },

    trustList: {
        listStyle: "none",
        padding: 0,
        fontSize: "18px",
    },

    callToAction: {
        padding: "70px 20px",
        background: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)",
        color: "#ffffff",
        textAlign: "center",
    },

    callToActionTitle: {
        fontSize: "28px",
        fontWeight: 700,
        marginBottom: "24px",
    },
};


// const styles = {
//     page: {
//         fontFamily: "Arial, sans-serif",
//         margin: 0,
//         padding: 0,
//     },
//     hero: {
//         backgroundColor: "#10b981",
//         color: "#fff",
//         textAlign: "center",
//         padding: "60px 20px",
//     },
//     heroTitle: {
//         fontSize: "36px",
//         marginBottom: "16px",
//     },
//     heroSubtitle: {
//         fontSize: "18px",
//         marginBottom: "40px",
//         maxWidth: "600px",
//         margin: "0 auto",
//     },
//     buttons: {
//         display: "flex",
//         justifyContent: "center",
//         gap: "20px",
//     },
//     primaryButton: {
//         backgroundColor: "#2563eb",
//         color: "#fff",
//         padding: "12px 24px",
//         border: "none",
//         borderRadius: "8px",
//         cursor: "pointer",
//         fontSize: "16px",
//     },
//     secondaryButton: {
//         backgroundColor: "#ffffff",
//         color: "#2563eb",
//         padding: "12px 24px",
//         border: "2px solid #2563eb",
//         borderRadius: "8px",
//         cursor: "pointer",
//         fontSize: "16px",
//     },
//     authLinks: {
//         marginTop: "20px",
//     },
//     authButton: {
//         backgroundColor: "#f59e0b",
//         color: "#fff",
//         padding: "12px 24px",
//         border: "none",
//         borderRadius: "8px",
//         cursor: "pointer",
//         fontSize: "16px",
//     },
//     modalOverlay: {
//         position: "fixed",
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         backgroundColor: "rgba(0,0,0,0.5)",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         zIndex: 1000,
//     },
//     modal: {
//         backgroundColor: "#fff",
//         padding: "24px",
//         borderRadius: "12px",
//         width: "90%",
//         maxWidth: "320px",
//         textAlign: "center",
//     },
//     modalButton: {
//         padding: "12px 20px",
//         backgroundColor: "#2563eb",
//         color: "#fff",
//         border: "none",
//         borderRadius: "8px",
//         cursor: "pointer",
//         fontSize: "16px",
//         margin: "8px 0",
//     },
//     modalClose: {
//         backgroundColor: "#e5e7eb",
//         color: "#111827",
//         border: "none",
//         padding: "8px 16px",
//         borderRadius: "6px",
//         cursor: "pointer",
//     },
//     recentItemsSection: {
//         padding: "40px 20px",
//         backgroundColor: "#f9fafb",
//         textAlign: "center",
//     },
//     sectionTitle: {
//         fontSize: "24px",
//         marginBottom: "20px",
//     },
//     itemsGrid: {
//         display: "grid",
//         gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
//         gap: "20px",
//         marginBottom: "20px",
//     },
//     card: {
//         borderRadius: "12px",
//         overflow: "hidden",
//         boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//         backgroundColor: "#fff",
//         display: "flex",
//         flexDirection: "column",
//         cursor: "pointer",
//         transition: "transform 0.2s ease, box-shadow 0.2s ease",
//     },
//     cardHover: {
//         transform: "translateY(-4px)",
//         boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
//     },
//     cardImage: {
//         width: "100%",
//         height: "200px",
//         objectFit: "cover",
//         backgroundColor: "#e5e7eb",
//     },
//     cardBody: {
//         padding: "15px",
//         display: "flex",
//         flexDirection: "column",
//         gap: "10px",
//         textAlign: "left",
//     },
//     badge: {
//         alignSelf: "flex-start",
//         padding: "4px 10px",
//         borderRadius: "999px",
//         fontSize: "12px",
//         fontWeight: "600",
//     },
//     contactButton: {
//         backgroundColor: "#16a34a",
//         color: "#fff",
//         padding: "8px 16px",
//         border: "none",
//         borderRadius: "6px",
//         cursor: "pointer",
//         fontSize: "14px",
//     },
//     contactMessage: {
//         color: "#e11d48",
//         fontSize: "14px",
//     },
//     viewAllButton: {
//         backgroundColor: "#2563eb",
//         color: "#fff",
//         padding: "10px 20px",
//         border: "none",
//         borderRadius: "8px",
//         cursor: "pointer",
//         fontSize: "16px",
//     },
//     howItWorks: {
//         padding: "40px 20px",
//         backgroundColor: "#ffffff",
//         textAlign: "center",
//     },
//     stepsList: {
//         listStyleType: "none",
//         padding: 0,
//     },
//     trustSection: {
//         padding: "40px 20px",
//         backgroundColor: "#f9fafb",
//         textAlign: "center",
//     },
//     trustList: {
//         listStyleType: "none",
//         padding: 0,
//     },
//     callToAction: {
//         padding: "40px 20px",
//         backgroundColor: "#10b981",
//         color: "#fff",
//         textAlign: "center",
//     },
//     callToActionTitle: {
//         fontSize: "24px",
//         marginBottom: "20px",
//     },
// };

export default Homepage;
