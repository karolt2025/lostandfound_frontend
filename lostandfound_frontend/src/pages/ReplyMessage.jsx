import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

function ReplyMessage() {
    const { messageId } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("authToken");

    const [content, setContent] = useState("");
    const [error, setError] = useState(null);
    const [sending, setSending] = useState(false);

    const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    try {
        // 1️⃣ Get original message
        const msgRes = await fetch(
            `http://127.0.0.1:8000/lostandfoundboard/messages/${messageId}/`,
            {
                headers: {
                    Authorization: `Token ${token}`,
                },
            }
        );

        if (!msgRes.ok) {
            throw new Error("Failed to load original message");
        }

        const original = await msgRes.json();

        // 2️⃣ Send reply as a NEW message
        const res = await fetch(
            "http://127.0.0.1:8000/lostandfoundboard/messages/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`,
                },
                body: JSON.stringify({
                    content,
                    item: original.item,
                    receiver: original.sender,
                }),
            }
        );

        if (!res.ok) {
            throw new Error("Failed to send reply");
        }

        navigate("/inbox");
    } catch (err) {
        setError(err.message);
    } finally {
        setSending(false);
    }
};

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setSending(true);

    //     try {
    //         const res = await fetch(
    //             `http://127.0.0.1:8000/lostandfoundboard/messages/${messageId}/reply/`,
    //             {
    //                 method: "POST",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                     Authorization: `Token ${token}`,
    //                 },
    //                 body: JSON.stringify({ content }),
    //             }
    //         );

    //         if (!res.ok) {
    //             throw new Error("Failed to send reply");
    //         }

    //         navigate("/inbox");
    //     } catch (err) {
    //         setError(err.message);
    //     } finally {
    //         setSending(false);
    //     }
    // };

    return (
        <div style={styles.page}>
            <h1>Reply</h1>

            <form onSubmit={handleSubmit} style={styles.form}>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    placeholder="Write your reply…"
                    style={styles.textarea}
                />

                {error && <p style={styles.error}>{error}</p>}

                <button disabled={sending} style={styles.button}>
                    {sending ? "Sending…" : "Send Reply"}
                </button>
            </form>
        </div>
    );
}

const styles = {
    page: {
        maxWidth: "600px",
        margin: "40px auto",
        padding: "20px",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
    },
    textarea: {
        minHeight: "120px",
        padding: "10px",
        fontSize: "15px",
        borderRadius: "8px",
        border: "1px solid #d1d5db",
    },
    button: {
        alignSelf: "flex-start",
        padding: "10px 16px",
        backgroundColor: "#2563eb",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
    },
    error: {
        color: "red",
    },
};

export default ReplyMessage;


// import { useParams, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";

// function ReplyMessage() {
//     const { messageId } = useParams();
//     const navigate = useNavigate();
//     const token = localStorage.getItem("authToken");

//     const [message, setMessage] = useState("");
//     const [receiverId, setReceiverId] = useState(null);
//     const [itemId, setItemId] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         fetch(`http://127.0.0.1:8000/lostandfoundboard/messages/${messageId}/`, {
//             headers: {
//                 Authorization: `Token ${token}`,
//             },
//         })
//             .then((res) => res.json())
//             .then((data) => {
//                 setReceiverId(data.sender);
//                 setItemId(data.item);
//                 setLoading(false);
//             });
//     }, [messageId, token]);

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         const response = await fetch(
//             "http://127.0.0.1:8000/lostandfoundboard/messages/",
//             {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Token ${token}`,
//                 },
//                 body: JSON.stringify({
//                     receiver: receiverId,
//                     item: itemId,
//                     content: message,
//                 }),
//             }
//         );

//         if (response.ok) {
//             alert("Reply sent!");
//             navigate("/inbox");
//         } else {
//             alert("Failed to send reply");
//         }
//     };

//     if (loading) return <p>Loading reply…</p>;

//     return (
//         <div style={styles.page}>
//             <h1>Reply</h1>

//             <form onSubmit={handleSubmit} style={styles.form}>
//                 <textarea
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                     rows="5"
//                     placeholder="Write your reply…"
//                     required
//                     style={styles.textarea}
//                 />

//                 <div style={styles.buttons}>
//                     <button type="submit" style={styles.send}>
//                         Send Reply
//                     </button>
//                     <button
//                         type="button"
//                         onClick={() => navigate(-1)}
//                         style={styles.cancel}
//                     >
//                         Cancel
//                     </button>
//                 </div>
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
//     textarea: {
//         padding: "12px",
//         borderRadius: "8px",
//         border: "1px solid #d1d5db",
//         fontSize: "15px",
//     },
//     buttons: {
//         display: "flex",
//         gap: "12px",
//     },
//     send: {
//         backgroundColor: "#16a34a",
//         color: "#fff",
//         border: "none",
//         borderRadius: "8px",
//         padding: "10px 18px",
//         cursor: "pointer",
//     },
//     cancel: {
//         backgroundColor: "#6b7280",
//         color: "#fff",
//         border: "none",
//         borderRadius: "8px",
//         padding: "10px 18px",
//         cursor: "pointer",
//     },
// };

// export default ReplyMessage;
