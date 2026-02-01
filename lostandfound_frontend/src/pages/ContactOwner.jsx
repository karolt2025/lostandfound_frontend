import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function ContactOwner() {
    const { id } = useParams(); // item ID
    const navigate = useNavigate();

    const token = localStorage.getItem("authToken");

    const [message, setMessage] = useState("");
    const [ownerId, setOwnerId] = useState(null);
    const [sending, setSending] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 🔹 Load item to get owner ID
    useEffect(() => {
        fetch(`http://127.0.0.1:8000/lostandfoundboard/items/${id}/`)
            .then((res) => {
                if (!res.ok) throw new Error("Failed to load item");
                return res.json();
            })
            .then((data) => {
                setOwnerId(data.owner);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        setError(null);

        if (!ownerId) {
            setError("Owner not found.");
            setSending(false);
            return;
        }

        const response = await fetch(
            "http://127.0.0.1:8000/lostandfoundboard/messages/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`,
                },
                body: JSON.stringify({
                    receiver: ownerId,
                    item: id,
                    content: message,
                }),
            }
        );

        if (response.ok) {
            alert("Message sent!");
            navigate("/inbox");
            // navigate(-1);
        } else {
            const errorData = await response.json();
            console.error("Message error:", errorData);
            setError("Failed to send message.");
        }

        setSending(false);
    };

    if (loading) return <p style={{ textAlign: "center" }}>Loading contact form…</p>;
    if (error && !ownerId) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div style={styles.page}>
            <h1>Contact Owner</h1>
            <p style={styles.subtitle}>
                Send a message to the owner of this item.
            </p>

            <form onSubmit={handleSubmit} style={styles.form}>
                <label style={styles.label}>
                    Your Message
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows="5"
                        placeholder="Hi! I think this item might be mine…"
                        style={styles.textarea}
                        required
                    />
                </label>

                {error && <p style={styles.error}>{error}</p>}

                <div style={styles.buttons}>
                    <button
                        type="submit"
                        disabled={sending}
                        style={styles.sendButton}
                    >
                        {sending ? "Sending..." : "Send Message"}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        style={styles.cancelButton}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

const styles = {
    page: {
        maxWidth: "600px",
        margin: "50px auto",
        padding: "24px",
        borderRadius: "12px",
    },
    subtitle: {
        color: "#6b7280",
        marginBottom: "20px",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
    },
    label: {
        display: "flex",
        flexDirection: "column",
        fontWeight: "500",
    },
    textarea: {
        marginTop: "6px",
        padding: "12px",
        fontSize: "15px",
        borderRadius: "8px",
        border: "1px solid #d1d5db",
        resize: "vertical",
    },
    buttons: {
        display: "flex",
        gap: "12px",
        marginTop: "20px",
    },
    sendButton: {
        padding: "12px 20px",
        backgroundColor: "#16a34a",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "16px",
    },
    cancelButton: {
        padding: "12px 20px",
        backgroundColor: "#6b7280",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "16px",
    },
    error: {
        color: "#dc2626",
        fontSize: "14px",
    },
};

export default ContactOwner;


// import { useParams, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";

// function ContactOwner() {
//     const { id } = useParams(); // item id
//     const navigate = useNavigate();

//     const token = localStorage.getItem("authToken");

//     const [message, setMessage] = useState("");
//     const [ownerId, setOwnerId] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     // 🔹 Load item to get owner ID
//     useEffect(() => {
//         fetch(`http://127.0.0.1:8000/lostandfoundboard/items/${id}/`)
//             .then((res) => {
//                 if (!res.ok) throw new Error("Failed to load item");
//                 return res.json();
//             })
//             .then((data) => {
//                 setOwnerId(data.owner); // ✅ THIS was missing before
//                 setLoading(false);
//             })
//             .catch((err) => {
//                 setError(err.message);
//                 setLoading(false);
//             });
//     }, [id]);

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!ownerId) {
//             alert("Owner not found.");
//             return;
//         }

//         const response = await fetch(
//             "http://127.0.0.1:8000/lostandfoundboard/messages/",
//             {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Token ${token}`,
//                 },
//                 body: JSON.stringify({
//                     receiver: ownerId,
//                     item: id,
//                     content: message,
//                 }),
//             }
//         );

//         if (response.ok) {
//             alert("Message sent!");
//             navigate(-1);
//         } else {
//             const data = await response.json();
//             console.error("Message error:", data);
//             alert("Failed to send message.");
//         }
//     };

//     if (loading) return <p>Loading contact form...</p>;
//     if (error) return <p>Error: {error}</p>;

//     return (
//         <div style={styles.page}>
//             <h1>Contact Owner</h1>

//             <form onSubmit={handleSubmit} style={styles.form}>
//                 <label>
//                     Message
//                     <textarea
//                         value={message}
//                         onChange={(e) => setMessage(e.target.value)}
//                         rows="5"
//                         required
//                     />
//                 </label>

//                 <button type="submit" style={styles.sendButton}>
//                     Send Message
//                 </button>
//             </form>
//         </div>
//     );
// }

// const styles = {
//     page: {
//         maxWidth: "600px",
//         margin: "40px auto",
//         padding: "20px",
//     },
//     form: {
//         display: "flex",
//         flexDirection: "column",
//         gap: "16px",
//     },
//     sendButton: {
//         padding: "12px 20px",
//         backgroundColor: "#2563eb",
//         color: "#fff",
//         border: "none",
//         borderRadius: "8px",
//         cursor: "pointer",
//         fontSize: "16px",
//     },
// };

// export default ContactOwner;


// // import { useParams, useNavigate } from "react-router-dom";
// // import { useState } from "react";

// // function ContactOwner() {
// //     const { id } = useParams(); // item ID
// //     const navigate = useNavigate();

// //     const token = localStorage.getItem("authToken");

// //     const [message, setMessage] = useState("");
// //     const [sending, setSending] = useState(false);
// //     const [error, setError] = useState(null);

// //     const handleSubmit = async (e) => {
// //         e.preventDefault();

// //         const response = await fetch(
// //             "http://127.0.0.1:8000/lostandfoundboard/messages/",
// //             {
// //                 method: "POST",
// //                 headers: {
// //                     "Content-Type": "application/json",
// //                     Authorization: `Token ${token}`,
// //                 },
// //                 body: JSON.stringify({
// //                     receiver: ownerId,   // 👈 item.owner
// //                     item: itemId,        // 👈 from URL or props
// //                     content: message,    // 👈 textarea value
// //                 }),
// //             }
// //         );

// //         if (response.ok) {
// //             alert("Message sent!");
// //             navigate(-1);
// //         } else {
// //             const errorData = await response.json();
// //             console.error("Message error:", errorData);
// //             alert("Failed to send message");
// //         }
// //     };

// //     return (
// //         <div style={styles.page}>
// //             <h1>Contact Owner</h1>
// //             <p style={styles.subtitle}>
// //                 Send a message to the owner of this item.
// //             </p>

// //             <form onSubmit={handleSubmit} style={styles.form}>
// //                 <label style={styles.label}>
// //                     Your Message
// //                     <textarea
// //                         value={message}
// //                         onChange={(e) => setMessage(e.target.value)}
// //                         rows="5"
// //                         placeholder="Hi! I think this item might be mine..."
// //                         style={styles.textarea}
// //                         required
// //                     />
// //                 </label>

// //                 {error && <p style={styles.error}>{error}</p>}

// //                 <div style={styles.buttons}>
// //                     <button
// //                         type="submit"
// //                         disabled={sending}
// //                         style={styles.sendButton}
// //                     >
// //                         {sending ? "Sending..." : "Send Message"}
// //                     </button>

// //                     <button
// //                         type="button"
// //                         onClick={() => navigate(-1)}
// //                         style={styles.cancelButton}
// //                     >
// //                         Cancel
// //                     </button>
// //                 </div>
// //             </form>
// //         </div>
// //     );
// // }

// // const styles = {
// //     page: {
// //         maxWidth: "600px",
// //         margin: "50px auto",
// //         padding: "24px",
// //     },
// //     subtitle: {
// //         color: "#6b7280",
// //         marginBottom: "20px",
// //     },
// //     form: {
// //         display: "flex",
// //         flexDirection: "column",
// //         gap: "16px",
// //     },
// //     label: {
// //         display: "flex",
// //         flexDirection: "column",
// //         fontWeight: "500",
// //     },
// //     textarea: {
// //         marginTop: "6px",
// //         padding: "12px",
// //         fontSize: "15px",
// //         borderRadius: "8px",
// //         border: "1px solid #d1d5db",
// //         resize: "vertical",
// //     },
// //     buttons: {
// //         display: "flex",
// //         gap: "12px",
// //         marginTop: "20px",
// //     },
// //     sendButton: {
// //         padding: "12px 20px",
// //         backgroundColor: "#16a34a",
// //         color: "#fff",
// //         border: "none",
// //         borderRadius: "8px",
// //         cursor: "pointer",
// //         fontSize: "16px",
// //     },
// //     cancelButton: {
// //         padding: "12px 20px",
// //         backgroundColor: "#6b7280",
// //         color: "#fff",
// //         border: "none",
// //         borderRadius: "8px",
// //         cursor: "pointer",
// //         fontSize: "16px",
// //     },
// //     error: {
// //         color: "#dc2626",
// //         fontSize: "14px",
// //     },
// // };

// // export default ContactOwner;
