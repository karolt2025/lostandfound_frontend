import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Inbox() {
    const navigate = useNavigate();
    const token = localStorage.getItem("authToken");
    const currentUserId = Number(localStorage.getItem("userId"));

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/lostandfoundboard/messages/", {
            headers: {
                Authorization: `Token ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to load messages");
                return res.json();
            })
            .then((data) => {
                setMessages(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [token]);

    if (loading) return <p>Loading inbox…</p>;
    if (error) return <p>Error: {error}</p>;

    /**
     * ONE conversation per item + other user
     * newest message wins
     * unread ONLY if the other user sent it
     */
    const conversations = Object.values(
        messages.reduce((acc, msg) => {
            const isMine = msg.sender === currentUserId;

            const otherUserId = isMine ? msg.receiver : msg.sender;
            const otherUserName = isMine
                ? msg.receiver_username || msg.receiver_email
                : msg.sender_username || msg.sender_email;

            const key = `${msg.item}-${otherUserId}`;

            const hasUnread =
                !isMine &&
                msg.receiver === currentUserId &&
                !msg.is_read;

            if (!acc[key]) {
                acc[key] = {
                    ...msg,
                    otherUserId,
                    otherUserName,
                    hasUnread,
                };
            } else {
                // keep newest message
                if (
                    new Date(msg.created_at) >
                    new Date(acc[key].created_at)
                ) {
                    acc[key] = {
                        ...acc[key],
                        ...msg,
                        otherUserId,
                        otherUserName,
                    };
                }

                // once unread → stay unread
                if (hasUnread) {
                    acc[key].hasUnread = true;
                }
            }

            return acc;
        }, {})
    ).sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    return (
        <div style={styles.page}>
            <h1>Inbox</h1>

            {conversations.length === 0 ? (
                <p style={styles.empty}>No messages yet 📭</p>
            ) : (
                <div style={styles.list}>
                    {conversations.map((msg) => (
                        <div
                            key={`${msg.item}-${msg.otherUserId}`}
                            style={{
                                ...styles.messageCard,
                                backgroundColor: msg.hasUnread
                                    ? "#eef2ff"
                                    : "#f9fafb",
                                fontWeight: msg.hasUnread ? "600" : "400",
                            }}
                        >
                            <div style={styles.topRow}>
                                <span style={styles.sender}>
                                    Chat with: {msg.otherUserName}
                                    {msg.hasUnread && (
                                        <span style={styles.unreadDot}>
                                            • New
                                        </span>
                                    )}
                                </span>

                                <span style={styles.date}>
                                    {new Date(
                                        msg.created_at
                                    ).toLocaleDateString()}
                                </span>
                            </div>

                            {msg.item_title && (
                                <p style={styles.item}>
                                    Item: {msg.item_title}
                                </p>
                            )}

                            <p style={styles.preview}>
                                {msg.content.length > 100
                                    ? msg.content.slice(0, 100) + "…"
                                    : msg.content}
                            </p>

                            <button
                                onClick={() =>
                                    navigate(
                                        `/conversation/${msg.item}/${msg.otherUserId}`
                                    )
                                }
                                style={styles.replyButton}
                            >
                                Open Chat
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const styles = {
    page: {
        maxWidth: "800px",
        margin: "40px auto",
        padding: "20px",
    },
    empty: {
        color: "#6b7280",
        marginTop: "20px",
    },
    list: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        marginTop: "20px",
    },
    messageCard: {
        padding: "16px",
        borderRadius: "12px",
        border: "1px solid #e5e7eb",
    },
    topRow: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "6px",
    },
    sender: {
        fontWeight: "600",
    },
    unreadDot: {
        color: "#2563eb",
        fontWeight: "600",
        marginLeft: "6px",
    },
    date: {
        fontSize: "13px",
        color: "#6b7280",
    },
    item: {
        fontSize: "14px",
        color: "#2563eb",
        marginBottom: "6px",
    },
    preview: {
        fontSize: "15px",
        color: "#374151",
        marginBottom: "10px",
    },
    replyButton: {
        padding: "8px 14px",
        backgroundColor: "#2563eb",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "14px",
    },
};

export default Inbox;


// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// function Inbox() {
//     const navigate = useNavigate();
//     const token = localStorage.getItem("authToken");
//     const currentUserId = Number(localStorage.getItem("userId"));

//     const [messages, setMessages] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         fetch("http://127.0.0.1:8000/lostandfoundboard/messages/", {
//             headers: {
//                 Authorization: `Token ${token}`,
//             },
//         })
//             .then((res) => {
//                 if (!res.ok) throw new Error("Failed to load messages");
//                 return res.json();
//             })
//             .then((data) => {
//                 setMessages(data);
//                 setLoading(false);
//             })
//             .catch((err) => {
//                 setError(err.message);
//                 setLoading(false);
//             });
//     }, [token]);

//     if (loading) return <p>Loading inbox…</p>;
//     if (error) return <p>Error: {error}</p>;

//     // ✅ ONE conversation per item + user
//     // ✅ newest message wins
//     // ✅ unread only if THEY sent it and it's not read
//     const conversations = Object.values(
//         messages.reduce((acc, msg) => {
//             const isMine = msg.sender === currentUserId;

//             const otherUserId = isMine ? msg.receiver : msg.sender;
//             const otherUserName = isMine
//                 ? msg.receiver_username || msg.receiver_email
//                 : msg.sender_username || msg.sender_email;

//             const key = `${msg.item}-${otherUserId}`;

//             const hasUnread =
//                 !isMine &&
//                 msg.receiver === currentUserId &&
//                 !msg.is_read;

//             if (!acc[key]) {
//                 acc[key] = {
//                     ...msg,
//                     otherUserId,
//                     otherUserName,
//                     hasUnread,
//                 };
//             } else {
//                 // keep newest message
//                 if (
//                     new Date(msg.created_at) >
//                     new Date(acc[key].created_at)
//                 ) {
//                     acc[key] = {
//                         ...acc[key],
//                         ...msg,
//                     };
//                 }

//                 // once unread → stay unread until opened
//                 if (hasUnread) {
//                     acc[key].hasUnread = true;
//                 }
//             }

//             return acc;
//         }, {})
//     ).sort(
//         (a, b) => new Date(b.created_at) - new Date(a.created_at)
//     );
//     // // ✅ ONE conversation per item + other user (keep latest message)
//     // const conversations = Object.values(
//     //     messages.reduce((acc, msg) => {
//     //         const isMine = msg.sender === currentUserId;

//     //         const otherUserId = isMine ? msg.receiver : msg.sender;

//     //         const otherUserName =
//     //             (isMine
//     //                 ? msg.receiver_username || msg.receiver_email
//     //                 : msg.sender_username || msg.sender_email) ||
//     //             `User ${otherUserId}`;

//     //         const key = `${msg.item}-${otherUserId}`;

//     //         if (
//     //             !acc[key] ||
//     //             new Date(msg.created_at) > new Date(acc[key].created_at)
//     //         ) {
//     //             acc[key] = {
//     //                 ...msg,
//     //                 otherUserId,
//     //                 otherUserName,
//     //             };
//     //         }

//     //         return acc;
//     //     }, {})
//     // );

//     //     return (
//     //         <div style={styles.page}>
//     //             <h1>Inbox</h1>

//     //             {conversations.length === 0 ? (
//     //                 <p style={styles.empty}>No messages yet 📭</p>
//     //             ) : (
//     //                 <div style={styles.list}>
//     //                     {conversations.map((msg) => (
//     //                         <div
//     //                             key={`${msg.item}-${msg.otherUserId}`}
//     //                             style={{
//     //                                 ...styles.messageCard,
//     //                                 backgroundColor: msg.is_read
//     //                                     ? "#f9fafb"
//     //                                     : "#eef2ff",
//     //                             }}
//     //                         >
//     //                             <div style={styles.topRow}>
//     //                                 <span style={styles.sender}>
//     //                                     Chat with: {msg.otherUserName}
//     //                                 </span>
//     //                                 <span style={styles.date}>
//     //                                     {new Date(msg.created_at).toLocaleDateString()}
//     //                                 </span>
//     //                             </div>

//     //                             {msg.item_title && (
//     //                                 <p style={styles.item}>
//     //                                     Item: {msg.item_title}
//     //                                 </p>
//     //                             )}

//     //                             <p style={styles.preview}>
//     //                                 {msg.content.length > 100
//     //                                     ? msg.content.slice(0, 100) + "…"
//     //                                     : msg.content}
//     //                             </p>

//     //                             <button
//     //                                 onClick={() =>
//     //                                     navigate(
//     //                                         `/conversation/${msg.item}/${msg.otherUserId}`
//     //                                     )
//     //                                 }
//     //                                 style={styles.replyButton}
//     //                             >
//     //                                 Open Chat
//     //                             </button>
//     //                         </div>
//     //                     ))}
//     //                 </div>
//     //             )}
//     //         </div>
//     //     );
//     // }

//     return (
//         <div style={styles.page}>
//             <h1>Inbox</h1>

//             {conversations.length === 0 ? (
//                 <p style={styles.empty}>No messages yet 📭</p>
//             ) : (
//                 <div style={styles.list}>
//                     {conversations.map((msg) => (
//     <div
//         key={`${msg.item}-${msg.otherUserId}`}
//         style={{
//             ...styles.messageCard,
//             backgroundColor: msg.hasUnread ? "#eef2ff" : "#f9fafb",
//             fontWeight: msg.hasUnread ? "600" : "400",
//         }}
//     >
//         <div style={styles.topRow}>
//             <span style={styles.sender}>
//                 Chat with: {msg.otherUserName}
//                 {msg.hasUnread && (
//                     <span
//                         style={{
//                             color: "#2563eb",
//                             fontWeight: 600,
//                             marginLeft: 6,
//                         }}
//                     >
//                         • New
//                     </span>
//                 )}
//             </span>

//             <span style={styles.date}>
//                 {new Date(msg.created_at).toLocaleDateString()}
//             </span>
//         </div>

//         {msg.item_title && (
//             <p style={styles.item}>Item: {msg.item_title}</p>
//         )}

//         <p style={styles.preview}>
//             {msg.content.length > 100
//                 ? msg.content.slice(0, 100) + "…"
//                 : msg.content}
//         </p>

//         <button
//             onClick={() =>
//                 navigate(
//                     `/conversation/${msg.item}/${msg.otherUserId}`
//                 )
//             }
//             style={styles.replyButton}
//         >
//             Open Chat
//         </button>
//     </div>
// ))}

//                     {/* {conversations.map((msg) => (
//                         <div
//                             key={`${msg.item}-${msg.otherUserId}`}
//                             style={{
//                                 ...styles.messageCard,
//                                 backgroundColor: msg.hasUnread
//                                     ? "#eef2ff"
//                                     : "#f9fafb",
//                             }}
//                         >
//                             <div style={styles.topRow}>
//                                 <span style={styles.sender}>
//                                     Chat with: {msg.otherUserName}
//                                     {msg.hasUnread && (
//                                         <span style={{ color: "#2563eb", fontWeight: 600, marginLeft: 6 }}>
//                                             • New
//                                         </span>
//                                     )}
//                                 </span>

//                                 <span style={styles.date}>
//                                     {new Date(msg.created_at).toLocaleDateString()}
//                                 </span>
//                             </div>
//                             {/* <div style={styles.topRow}>
//                                 <span style={styles.sender}>
//                                     Chat with: {msg.otherUserName}
//                                     {msg.hasUnread && (
//                                         <span style={styles.unreadDot}> • New</span>
//                                     )}
//                                 </span>
//                                 <span style={styles.date}>
//                                     {new Date(msg.created_at).toLocaleDateString()}
//                                 </span>
//                             </div> */}

//                             {msg.item_title && (
//                                 <p style={styles.item}>
//                                     Item: {msg.item_title}
//                                 </p>
//                             )}

//                             <p style={styles.preview}>
//                                 {msg.content.length > 100
//                                     ? msg.content.slice(0, 100) + "…"
//                                     : msg.content}
//                             </p>

//                             <button
//                                 onClick={() =>
//                                     navigate(
//                                         `/conversation/${msg.item}/${msg.otherUserId}`
//                                     )
//                                 }
//                                 style={styles.replyButton}
//                             >
//                                 Open Chat
//                             </button>
//                         </div>
//                     ))} */}
//                 </div>
//             )}
//         </div>
//     );
// }

// const styles = {
//     page: {
//         maxWidth: "800px",
//         margin: "40px auto",
//         padding: "20px",
//     },
//     empty: {
//         color: "#6b7280",
//         marginTop: "20px",
//     },
//     list: {
//         display: "flex",
//         flexDirection: "column",
//         gap: "16px",
//         marginTop: "20px",
//     },
//     messageCard: {
//         padding: "16px",
//         borderRadius: "12px",
//         border: "1px solid #e5e7eb",
//     },
//     topRow: {
//         display: "flex",
//         justifyContent: "space-between",
//         marginBottom: "6px",
//     },
//     sender: {
//         fontWeight: "600",
//     },
//     unreadDot: {
//         color: "#2563eb",
//         fontWeight: "600",
//         marginLeft: "4px",
//     },
//     date: {
//         fontSize: "13px",
//         color: "#6b7280",
//     },
//     item: {
//         fontSize: "14px",
//         color: "#2563eb",
//         marginBottom: "6px",
//     },
//     preview: {
//         fontSize: "15px",
//         color: "#374151",
//         marginBottom: "10px",
//     },
//     replyButton: {
//         padding: "8px 14px",
//         backgroundColor: "#2563eb",
//         color: "#fff",
//         border: "none",
//         borderRadius: "6px",
//         cursor: "pointer",
//         fontSize: "14px",
//     },
// };

// export default Inbox;