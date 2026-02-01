import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Conversation() {
    const { itemId, userId } = useParams();
    const token = localStorage.getItem("authToken");

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newMessage, setNewMessage] = useState("");

    const currentUserId = Number(localStorage.getItem("userId"));

    const otherUserName = messages.length
        ? messages[0].sender === currentUserId
            ? messages[0].receiver_username
            : messages[0].sender_username
        : "User";

    const getInitials = (name = "") =>
        name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();

    useEffect(() => {
        fetch(
            `http://127.0.0.1:8000/lostandfoundboard/messages/?item=${itemId}&user=${userId}`,
            {
                headers: {
                    Authorization: `Token ${token}`,
                },
            }
        )
            .then((res) => res.json())
            .then((data) => {
                setMessages(data);
                setLoading(false);
            });
    }, [itemId, userId, token]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const res = await fetch(
            "http://127.0.0.1:8000/lostandfoundboard/messages/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`,
                },
                body: JSON.stringify({
                    content: newMessage,
                    item: itemId,
                    receiver: userId,
                }),
            }
        );

        if (res.ok) {
            const msg = await res.json();
            setMessages((prev) => [...prev, msg]);
            setNewMessage("");
        }
    };

    if (loading) return <p>Loading conversation…</p>;

    return (
        <div style={styles.wrapper}>
            {/* Header */}
            <h2 style={styles.header}>
                Chat with {otherUserName}
            </h2>

            {/* Messages */}
            <div style={styles.chat}>
                {messages.map((msg) => {
                    const isMine = msg.sender === currentUserId;
                    const name = msg.sender_username;
                    const initials = getInitials(name);

                    return (
                        <div
                            key={msg.id}
                            style={{
                                display: "flex",
                                alignItems: "flex-end",
                                gap: "8px",
                                alignSelf: isMine ? "flex-end" : "flex-start",
                            }}
                        >
                            {!isMine && (
                                <div style={styles.avatar}>
                                    {initials}
                                </div>
                            )}

                            <div
                                style={{
                                    ...styles.bubble,
                                    backgroundColor: isMine ? "#2563eb" : "#e5e7eb",
                                    color: isMine ? "white" : "black",
                                }}
                            >
                                <p>{msg.content}</p>
                                <span style={styles.time}>
                                    {new Date(msg.created_at).toLocaleTimeString()}
                                </span>
                            </div>

                            {isMine && (
                                <div style={{ ...styles.avatar, ...styles.myAvatar }}>
                                    {initials}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} style={styles.form}>
                <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message…"
                    style={styles.input}
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
}

const styles = {
    wrapper: {
        maxWidth: "700px",
        margin: "40px auto",
        display: "flex",
        flexDirection: "column",
        height: "80vh",
    },
    header: {
        marginBottom: "12px",
        fontSize: "20px",
        fontWeight: "600",
    },
    chat: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        overflowY: "auto",
        padding: "12px",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        marginBottom: "10px",
    },
    bubble: {
        maxWidth: "70%",
        padding: "10px 14px",
        borderRadius: "16px",
        fontSize: "15px",
    },
    time: {
        display: "block",
        fontSize: "11px",
        opacity: 0.7,
        marginTop: "4px",
        textAlign: "right",
    },
    form: {
        display: "flex",
        gap: "8px",
    },
    input: {
        flex: 1,
        padding: "10px",
        borderRadius: "8px",
        border: "1px solid #d1d5db",
    },
    avatar: {
        width: "32px",
        height: "32px",
        borderRadius: "50%",
        backgroundColor: "#9ca3af",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "13px",
        fontWeight: "600",
        flexShrink: 0,
    },
    myAvatar: {
        backgroundColor: "#2563eb",
    },
};

export default Conversation;



// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";

// function Conversation() {
//     const { itemId, userId } = useParams();
//     const token = localStorage.getItem("authToken");

//     const [messages, setMessages] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [newMessage, setNewMessage] = useState("");

//     const currentUserId = Number(localStorage.getItem("userId"));

//     const getInitials = (name = "") => {
//         return name
//             .split(" ")
//             .map((n) => n[0])
//             .join("")
//             .toUpperCase();
//     };

//     useEffect(() => {
//         fetch(
//             `http://127.0.0.1:8000/lostandfoundboard/messages/?item=${itemId}&user=${userId}`,
//             {
//                 headers: {
//                     Authorization: `Token ${token}`,
//                 },
//             }
//         )
//             .then((res) => res.json())
//             .then((data) => {
//                 setMessages(data);
//                 setLoading(false);
//             });
//     }, [itemId, userId, token]);

//     const sendMessage = async (e) => {
//         e.preventDefault();

//         const res = await fetch(
//             "http://127.0.0.1:8000/lostandfoundboard/messages/",
//             {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Token ${token}`,
//                 },
//                 body: JSON.stringify({
//                     content: newMessage,
//                     item: itemId,
//                     receiver: userId,
//                 }),
//             }
//         );

//         if (res.ok) {
//             const msg = await res.json();
//             setMessages((prev) => [...prev, msg]);
//             setNewMessage("");
//         }
//     };

//     if (loading) return <p>Loading conversation…</p>;

//     return (
//         <div style={styles.wrapper}>
//             <div style={styles.chat}>
//                 {messages.map((msg) => {
//                     const isMine = msg.sender === currentUserId;
//                     const name = isMine
//                         ? msg.sender_username
//                         : msg.sender_username;

//                     const initials = getInitials(name);

//                     return (
//                         <div
//                             key={msg.id}
//                             style={{
//                                 display: "flex",
//                                 alignItems: "flex-end",
//                                 gap: "8px",
//                                 alignSelf: isMine ? "flex-end" : "flex-start",
//                             }}
//                         >
//                             {!isMine && (
//                                 <div style={styles.avatar}>
//                                     {initials}
//                                 </div>
//                             )}

//                             <div
//                                 style={{
//                                     ...styles.bubble,
//                                     backgroundColor: isMine ? "#2563eb" : "#e5e7eb",
//                                     color: isMine ? "white" : "black",
//                                 }}
//                             >
//                                 <p>{msg.content}</p>
//                                 <span style={styles.time}>
//                                     {new Date(msg.created_at).toLocaleTimeString()}
//                                 </span>
//                             </div>

//                             {isMine && (
//                                 <div style={{ ...styles.avatar, ...styles.myAvatar }}>
//                                     {initials}
//                                 </div>
//                             )}
//                         </div>
//                     );
//                 })}
//             </div>

//             <form onSubmit={sendMessage} style={styles.form}>
//                 <input
//                     value={newMessage}
//                     onChange={(e) => setNewMessage(e.target.value)}
//                     placeholder="Type a message…"
//                     style={styles.input}
//                 />
//                 <button type="submit">Send</button>
//             </form>
//         </div>
//     );
// }

// const styles = {
//     wrapper: {
//         maxWidth: "700px",
//         margin: "40px auto",
//         display: "flex",
//         flexDirection: "column",
//         height: "80vh",
//     },
//     chat: {
//         flex: 1,
//         display: "flex",
//         flexDirection: "column",
//         gap: "10px",
//         overflowY: "auto",
//         padding: "12px",
//         border: "1px solid #e5e7eb",
//         borderRadius: "12px",
//         marginBottom: "10px",
//     },
//     bubble: {
//         maxWidth: "70%",
//         padding: "10px 14px",
//         borderRadius: "16px",
//         fontSize: "15px",
//     },
//     time: {
//         display: "block",
//         fontSize: "11px",
//         opacity: 0.7,
//         marginTop: "4px",
//         textAlign: "right",
//     },
//     form: {
//         display: "flex",
//         gap: "8px",
//     },
//     input: {
//         flex: 1,
//         padding: "10px",
//         borderRadius: "8px",
//         border: "1px solid #d1d5db",
//     },
//     avatar: {
//         width: "32px",
//         height: "32px",
//         borderRadius: "50%",
//         backgroundColor: "#9ca3af",
//         color: "white",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         fontSize: "13px",
//         fontWeight: "600",
//         flexShrink: 0,
//     },
//     myAvatar: {
//         backgroundColor: "#2563eb",
//     },
// };

// export default Conversation;


// // import { useEffect, useState } from "react";
// // import { useParams } from "react-router-dom";

// // function Conversation() {
// //     const { itemId, userId } = useParams();
// //     const token = localStorage.getItem("authToken");

// //     const [messages, setMessages] = useState([]);
// //     const [loading, setLoading] = useState(true);
// //     const [newMessage, setNewMessage] = useState("");

// //     const currentUserId = Number(localStorage.getItem("userId"));

// //     const otherUserName = messages.length
// //         ? messages[0].sender === currentUserId
// //             ? messages[0].receiver_username
// //             : messages[0].sender_username
// //         : "";


// //     useEffect(() => {
// //         fetch(
// //             `http://127.0.0.1:8000/lostandfoundboard/messages/?item=${itemId}&user=${userId}`,
// //             {
// //                 headers: {
// //                     Authorization: `Token ${token}`,
// //                 },
// //             }
// //         )
// //             .then((res) => res.json())
// //             .then((data) => {
// //                 setMessages(data);
// //                 setLoading(false);
// //             });
// //     }, [itemId, userId, token]);

// //     const sendMessage = async (e) => {
// //         e.preventDefault();

// //         const res = await fetch(
// //             "http://127.0.0.1:8000/lostandfoundboard/messages/",
// //             {
// //                 method: "POST",
// //                 headers: {
// //                     "Content-Type": "application/json",
// //                     Authorization: `Token ${token}`,
// //                 },
// //                 body: JSON.stringify({
// //                     content: newMessage,
// //                     item: itemId,
// //                     receiver: userId,
// //                 }),
// //             }
// //         );

// //         if (res.ok) {
// //             const msg = await res.json();
// //             setMessages([...messages, msg]);
// //             setNewMessage("");
// //         }
// //     };

// //     if (loading) return <p>Loading conversation…</p>;

// //     return (
// //         <div style={styles.wrapper}>
// //             <div style={styles.chat}>
// //                 {messages.map((msg) => {
// //                     const isMine = msg.sender === currentUserId;

// //                     return (
// //                         <div
// //                             key={msg.id}
// //                             style={{
// //                                 ...styles.bubble,
// //                                 alignSelf: isMine ? "flex-end" : "flex-start",
// //                                 backgroundColor: isMine ? "#2563eb" : "#e5e7eb",
// //                                 color: isMine ? "white" : "black",
// //                             }}
// //                         >
// //                             <p>{msg.content}</p>
// //                             <span style={styles.time}>
// //                                 {new Date(msg.created_at).toLocaleTimeString()}
// //                             </span>
// //                         </div>
// //                     );
// //                 })}
// //             </div>

// //             <form onSubmit={sendMessage} style={styles.form}>
// //                 <input
// //                     value={newMessage}
// //                     onChange={(e) => setNewMessage(e.target.value)}
// //                     placeholder="Type a message…"
// //                     style={styles.input}
// //                 />
// //                 <button type="submit">Send</button>
// //             </form>
// //         </div>
// //     );
// // }

// // const styles = {
// //     wrapper: {
// //         maxWidth: "700px",
// //         margin: "40px auto",
// //         display: "flex",
// //         flexDirection: "column",
// //         height: "80vh",
// //     },
// //     chat: {
// //         flex: 1,
// //         display: "flex",
// //         flexDirection: "column",
// //         gap: "10px",
// //         overflowY: "auto",
// //         padding: "12px",
// //         border: "1px solid #e5e7eb",
// //         borderRadius: "12px",
// //         marginBottom: "10px",
// //     },
// //     bubble: {
// //         maxWidth: "70%",
// //         padding: "10px 14px",
// //         borderRadius: "16px",
// //         fontSize: "15px",
// //     },
// //     time: {
// //         display: "block",
// //         fontSize: "11px",
// //         opacity: 0.7,
// //         marginTop: "4px",
// //         textAlign: "right",
// //     },
// //     form: {
// //         display: "flex",
// //         gap: "8px",
// //     },
// //     input: {
// //         flex: 1,
// //         padding: "10px",
// //         borderRadius: "8px",
// //         border: "1px solid #d1d5db",
// //     },
// // };

// // export default Conversation;
