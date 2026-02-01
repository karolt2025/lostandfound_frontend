import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function ItemDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = localStorage.getItem("authToken");
    const userId = Number(localStorage.getItem("userId"));

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
            window.location.href = "/lostandfound";
        } else {
            alert("You are not allowed to delete this item.");
        }
    };

    if (loading) return <p>Loading item...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!item) return null;

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

            {/* ✅ CONTACT OWNER (only if not your item) */}
            {userId && userId !== item.owner && (
                <button
                    onClick={() => navigate(`/items/${id}/contact`)}
                    style={styles.contactButton}
                >
                    Contact Owner
                </button>
            )}

            {/* ✅ OWNER-ONLY EDIT + DELETE */}
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
        </div>
    );
}

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
        marginTop: "24px",
        padding: "14px 22px",
        backgroundColor: "#16a34a",
        color: "#fff",
        border: "none",
        borderRadius: "10px",
        cursor: "pointer",
        fontSize: "16px",
        width: "100%",
        maxWidth: "280px",
    },
};

export default ItemDetail;


// import { useParams, useNavigate } from "react-router-dom"; // 👈 ADD useNavigate
// import { useEffect, useState } from "react";

// function ItemDetail() {
//     const { id } = useParams();
//     const navigate = useNavigate(); // 👈 ADD THIS

//     const [item, setItem] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     const token = localStorage.getItem("authToken");
//     const userId = Number(localStorage.getItem("userId"));

//     useEffect(() => {
//         fetch(`http://127.0.0.1:8000/lostandfoundboard/items/${id}/`, {
//             headers: token
//                 ? { Authorization: `Token ${token}` }
//                 : {},
//         })
//             .then((res) => {
//                 if (!res.ok) {
//                     throw new Error("Unauthorized or item not found");
//                 }
//                 return res.json();
//             })
//             .then((data) => {
//                 setItem(data);
//                 setLoading(false);
//             })
//             .catch((err) => {
//                 setError(err.message);
//                 setLoading(false);
//             });
//     }, [id, token]);

//     const handleDelete = async () => {
//         if (!window.confirm("Are you sure you want to delete this item?")) return;

//         const response = await fetch(
//             `http://127.0.0.1:8000/lostandfoundboard/items/${id}/`,
//             {
//                 method: "DELETE",
//                 headers: {
//                     Authorization: `Token ${token}`,
//                 },
//             }
//         );

//         if (response.ok) {
//             window.location.href = "/lostandfound";
//         } else {
//             alert("You are not allowed to delete this item.");
//         }
//     };

//     if (loading) return <p>Loading item...</p>;
//     if (error) return <p>Error: {error}</p>;
//     if (!item) return null;

//     return (
//         <div style={styles.page}>
//             <h1>{item.title}</h1>

//             {item.image && (
//                 <img
//                     src={item.image}
//                     alt={item.title}
//                     style={styles.image}
//                 />
//             )}

//             <p><strong>Description:</strong> {item.description}</p>
//             <p><strong>Status:</strong> {item.status.toUpperCase()}</p>
//             <p><strong>Location:</strong> {item.location}</p>
//             <p><strong>Contact Email:</strong> {item.contact_email}</p>

//             <p style={styles.date}>
//                 Posted on {new Date(item.date_created).toLocaleDateString()}
//             </p>

//             {/* ✅ OWNER-ONLY EDIT + DELETE */}
//             {userId === item.owner && (
//                 <div style={{ marginTop: "30px", display: "flex", gap: "12px" }}>
//                     <button
//                         onClick={() => navigate(`/items/${id}/edit`)}
//                         style={styles.editButton}
//                     >
//                         Edit Item
//                     </button>

//                     <button
//                         onClick={handleDelete}
//                         style={styles.deleteButton}
//                     >
//                         Delete Item
//                     </button>
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
//     image: {
//         width: "100%",
//         maxHeight: "400px",
//         objectFit: "cover",
//         marginBottom: "20px",
//         borderRadius: "12px",
//     },
//     date: {
//         marginTop: "20px",
//         color: "#6b7280",
//         fontSize: "14px",
//     },
//     editButton: { // 👈 ADD THIS
//         padding: "12px 20px",
//         backgroundColor: "#2563eb",
//         color: "#fff",
//         border: "none",
//         borderRadius: "8px",
//         cursor: "pointer",
//         fontSize: "16px",
//     },
//     deleteButton: {
//         padding: "12px 20px",
//         backgroundColor: "#dc2626",
//         color: "#fff",
//         border: "none",
//         borderRadius: "8px",
//         cursor: "pointer",
//         fontSize: "16px",
//     },
// };

// export default ItemDetail;
