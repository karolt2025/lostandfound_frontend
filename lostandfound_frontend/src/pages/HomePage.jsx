import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./HomePage.module.css";

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
        <div className={styles.page}>
            {/* HERO */}
            <section className={styles.hero}>
                <h1 className={styles.heroTitle}>Lost Something? Found Something?</h1>
                <p className={styles.heroSubtitle}>
                    Reconnect lost items with their owners — fast, simple, and secure.
                </p>

                <div className={styles.buttonGroup}>
                    <button
                        className={styles.primaryButton}
                        onClick={() => navigate("/lostandfound")}
                    >
                        Browse Lost & Found
                    </button>
                    <button
                        className={styles.secondaryButton}
                        onClick={handlePostItemClick}
                    >
                        Post an Item
                    </button>
                </div>

                <div className={styles.authLinks}>
                    {!isLoggedIn ? (
                        <button
                            className={styles.authButton}
                            onClick={() => navigate("/login")}
                        >
                            Sign In
                        </button>
                    ) : (
                        <button
                            className={styles.authButton}
                            onClick={() => {
                                localStorage.removeItem("authToken");
                                setIsLoggedIn(false);
                            }}
                        >
                            Sign Out
                        </button>
                    )}
                </div>
            </section>

            {/* RECENT ITEMS */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Recent Lost & Found Items</h2>

                <div className={styles.itemsGrid}>
                    {items.slice(0, 4).map((item) => (
                        <div
                            key={item.id}
                            className={styles.card}
                            role="button"
                            tabIndex={0}
                            onClick={() => navigate(`/items/${item.id}`)}
                            onKeyDown={(e) =>
                                e.key === "Enter" &&
                                navigate(`/items/${item.id}`)
                            }
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
                                <span
                                    className={`${styles.badge} ${item.status === "lost"
                                        ? styles.lost
                                        : styles.found
                                        }`}
                                >
                                    {item.status.toUpperCase()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    className={styles.viewAllButton}
                    onClick={() => navigate("/lostandfound")}
                >
                    View all items
                </button>
            </section>

            {/* HOW IT WORKS */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>How It Works</h2>

                <ol className={styles.stepsList}>
                    <li className={styles.step}>
                        <h3>Post an item</h3>
                        <p>Create a lost or found listing in seconds.</p>
                    </li>
                    <li className={styles.step}>
                        <h3>Message securely</h3>
                        <p>Chat safely with verified users.</p>
                    </li>
                    <li className={styles.step}>
                        <h3>Reunite 🎉</h3>
                        <p>Get items back where they belong.</p>
                    </li>
                </ol>
            </section>

            {/* CALL TO ACTION */}
            <section className={styles.callToAction}>
                <h2 className={styles.callToActionTitle}>
                    Found something or missing something?
                </h2>
                <button
                    className={styles.primaryButton}
                    onClick={handlePostItemClick}
                >
                    Get started in seconds
                </button>
            </section>
        </div>
    );
};

export default Homepage;

//     return (
//         <div className={styles.page}>
//             {/* ================= HERO ================= */}
//             <section className={styles.hero}>
//                 <h1 className={styles.heroTitle}>Lost Something? Found Something?</h1>
//                 <p className={styles.heroSubtitle}>
//                     Reconnect lost items with their owners — fast, simple, and secure.
//                 </p>

//                 <div className={styles.buttons}>
//                     <button
//                         className={styles.primaryButton}
//                         onClick={() => navigate("/lostandfound")}
//                     >
//                         Browse Lost & Found
//                     </button>

//                     <button
//                         className={styles.secondaryButton}
//                         onClick={handlePostItemClick}
//                     >
//                         Post an Item
//                     </button>
//                 </div>

//                 <div className={styles.authLinks}>
//                     {!isLoggedIn ? (
//                         <button
//                             className={styles.authButton}
//                             onClick={() => navigate("/login")}
//                         >
//                             Sign In
//                         </button>
//                     ) : (
//                         <button
//                             className={styles.authButton}
//                             onClick={() => {
//                                 localStorage.removeItem("authToken");
//                                 setIsLoggedIn(false);
//                             }}
//                         >
//                             Sign Out
//                         </button>
//                     )}
//                 </div>
//             </section>

//             {/* ================= AUTH MODAL ================= */}
//             {showAuthModal && (
//                 <div className={styles.modalOverlay} role="dialog" aria-modal="true">
//                     <div className={styles.modal}>
//                         <h3>Please log in or register to post an item</h3>

//                         <button
//                             className={styles.modalButton}
//                             onClick={() => navigate("/login")}
//                         >
//                             Log In
//                         </button>

//                         <button
//                             className={styles.modalButton}
//                             onClick={() => navigate("/register")}
//                         >
//                             Register
//                         </button>

//                         <button
//                             className={styles.modalClose}
//                             onClick={() => setShowAuthModal(false)}
//                         >
//                             Close
//                         </button>
//                     </div>
//                 </div>
//             )}

//             {/* ================= RECENT ITEMS ================= */}
//             <section className={styles.section}>
//                 <h2 className={styles.sectionTitle}>Recent Lost & Found Items</h2>

//                 <div className={styles.itemsGrid}>
//                     {items.length === 0 ? (
//                         <p>No items found.</p>
//                     ) : (
//                         items.slice(0, 4).map((item) => (
//                             <div
//                                 key={item.id}
//                                 className={styles.card}
//                                 role="button"
//                                 tabIndex={0}
//                                 aria-label={`View details for ${item.title}`}
//                                 onClick={() => navigate(`/items/${item.id}`)}
//                                 onKeyDown={(e) => {
//                                     if (e.key === "Enter") {
//                                         navigate(`/items/${item.id}`);
//                                     }
//                                 }}
//                             >
//                                 {item.image ? (
//                                     <img
//                                         src={item.image}
//                                         alt={item.title}
//                                         className={styles.cardImage}
//                                     />
//                                 ) : (
//                                     <div className={styles.cardImage} />
//                                 )}

//                                 <div className={styles.cardBody}>
//                                     <h3>{item.title}</h3>
//                                     <span className={styles.badge}>
//                                         {item.status.charAt(0).toUpperCase() +
//                                             item.status.slice(1)}
//                                     </span>
//                                 </div>
//                             </div>
//                         ))
//                     )}
//                 </div>

//                 <button
//                     className={styles.viewAllButton}
//                     onClick={() => navigate("/lostandfound")}
//                 >
//                     View all items
//                 </button>
//             </section>

//             {/* ================= HOW IT WORKS ================= */}
//             <section className={styles.section}>
//                 <h2 className={styles.sectionTitle}>How It Works</h2>
//                 <ol className={styles.howItWorks}>
//                     <li>Post a lost or found item</li>
//                     <li>Message securely through the app</li>
//                     <li>Reunite item with owner 🎉</li>
//                 </ol>
//             </section>

//             {/* ================= CALL TO ACTION ================= */}
//             <section className={styles.callToAction}>
//                 <h2 className={styles.callToActionTitle}>
//                     Found something or missing something?
//                 </h2>
//                 <button
//                     className={styles.primaryButton}
//                     onClick={handlePostItemClick}
//                 >
//                     Get started in seconds
//                 </button>
//             </section>
//         </div>
//     );
// };

// export default Homepage;