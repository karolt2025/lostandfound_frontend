import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./EditItem.css";

function EditItem() {
    const { id } = useParams();
    const navigate = useNavigate();

    const token = localStorage.getItem("authToken");

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        status: "lost",
        location: "",
        contact_email: "",
        image: null,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 🔹 Load existing item data
    useEffect(() => {
        fetch(`http://127.0.0.1:8000/lostandfoundboard/items/${id}/`, {
            headers: {
                Authorization: `Token ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to load item");
                return res.json();
            })
            .then((data) => {
                setFormData({
                    title: data.title || "",
                    description: data.description || "",
                    status: data.status || "lost",
                    location: data.location || "",
                    contact_email: data.contact_email || "",
                    image: null, // optional on edit
                });
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [id, token]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== "") {
                data.append(key, value);
            }
        });

        const response = await fetch(
            `http://127.0.0.1:8000/lostandfoundboard/items/${id}/`,
            {
                method: "PUT",
                headers: {
                    Authorization: `Token ${token}`,
                },
                body: data,
            }
        );

        if (response.ok) {
            navigate(`/items/${id}`);
        } else {
            alert("Failed to update item");
        }
    };

    if (loading) return <p className="loading">Loading edit form...</p>;
    if (error) return <p className="error">Error: {error}</p>;

    return (
        <div className="edit-page">
            <div className="edit-card">
                <h1>Edit Item</h1>

                <form onSubmit={handleSubmit} className="edit-form">
                    <label>
                        Title
                        <input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label>
                        Description
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label>
                        Status
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="lost">Lost</option>
                            <option value="found">Found</option>
                        </select>
                    </label>

                    <label>
                        Location
                        <input
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                        />
                    </label>

                    <label>
                        Contact Email
                        <input
                            type="email"
                            name="contact_email"
                            value={formData.contact_email}
                            onChange={handleChange}
                        />
                    </label>

                    <label>
                        Update Image (optional)
                        <input
                            type="file"
                            name="image"
                            onChange={handleChange}
                        />
                    </label>

                    <div className="edit-buttons">
                        <button type="submit" className="save-btn">
                            Save Changes
                        </button>

                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={() => navigate(-1)}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditItem;


// import { useParams, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import "./EditItem.css";


// function EditItem() {
//     const { id } = useParams();
//     const navigate = useNavigate();

//     const token = localStorage.getItem("authToken");

//     const [formData, setFormData] = useState({
//         title: "",
//         description: "",
//         status: "lost",
//         location: "",
//         contact_email: "",
//         image: null,
//     });

//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     // 🔹 Load existing item data
//     useEffect(() => {
//         fetch(`http://127.0.0.1:8000/lostandfoundboard/items/${id}/`, {
//             headers: {
//                 Authorization: `Token ${token}`,
//             },
//         })
//             .then((res) => {
//                 if (!res.ok) throw new Error("Failed to load item");
//                 return res.json();
//             })
//             .then((data) => {
//                 setFormData({
//                     title: data.title,
//                     description: data.description,
//                     status: data.status,
//                     location: data.location,
//                     contact_email: data.contact_email,
//                     image: null, // image optional on edit
//                 });
//                 setLoading(false);
//             })
//             .catch((err) => {
//                 setError(err.message);
//                 setLoading(false);
//             });
//     }, [id, token]);

//     const handleChange = (e) => {
//         const { name, value, files } = e.target;
//         setFormData((prev) => ({
//             ...prev,
//             [name]: files ? files[0] : value,
//         }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         const data = new FormData();
//         Object.entries(formData).forEach(([key, value]) => {
//             if (value !== null && value !== "") {
//                 data.append(key, value);
//             }
//         });

//         const response = await fetch(
//             `http://127.0.0.1:8000/lostandfoundboard/items/${id}/`,
//             {
//                 method: "PUT",
//                 headers: {
//                     Authorization: `Token ${token}`,
//                 },
//                 body: data,
//             }
//         );

//         if (response.ok) {
//             navigate(`/items/${id}`);
//         } else {
//             alert("Failed to update item");
//         }
//     };

//     if (loading) return <p>Loading edit form...</p>;
//     if (error) return <p>Error: {error}</p>;

//     return (
//         <div style={styles.page}>
//             <h1>Edit Item</h1>

//             <form onSubmit={handleSubmit} style={styles.form}>
//                 <label>
//                     Title
//                     <input
//                         name="title"
//                         value={formData.title}
//                         onChange={handleChange}
//                         required
//                     />
//                 </label>

//                 <label>
//                     Description
//                     <textarea
//                         name="description"
//                         value={formData.description}
//                         onChange={handleChange}
//                         rows="4"
//                         required
//                     />
//                 </label>

//                 <label>
//                     Status
//                     <select
//                         name="status"
//                         value={formData.status}
//                         onChange={handleChange}
//                     >
//                         <option value="lost">Lost</option>
//                         <option value="found">Found</option>
//                     </select>
//                 </label>

//                 <label>
//                     Location
//                     <input
//                         name="location"
//                         value={formData.location}
//                         onChange={handleChange}
//                     />
//                 </label>

//                 <label>
//                     Contact Email
//                     <input
//                         type="email"
//                         name="contact_email"
//                         value={formData.contact_email}
//                         onChange={handleChange}
//                     />
//                 </label>

//                 <label>
//                     Update Image (optional)
//                     <input
//                         type="file"
//                         name="image"
//                         onChange={handleChange}
//                     />
//                 </label>

//                 <div style={styles.buttons}>
//                     <button type="submit" style={styles.saveButton}>
//                         Save Changes
//                     </button>

//                     <button
//                         type="button"
//                         onClick={() => navigate(-1)}
//                         style={styles.cancelButton}
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
//         maxWidth: "700px",
//         margin: "40px auto",
//         padding: "20px",
//     },
//     form: {
//         display: "flex",
//         flexDirection: "column",
//         gap: "16px",
//     },
//     buttons: {
//         display: "flex",
//         gap: "12px",
//         marginTop: "20px",
//     },
//     saveButton: {
//         padding: "12px 20px",
//         backgroundColor: "#2563eb",
//         color: "#fff",
//         border: "none",
//         borderRadius: "8px",
//         cursor: "pointer",
//         fontSize: "16px",
//     },
//     cancelButton: {
//         padding: "12px 20px",
//         backgroundColor: "#6b7280",
//         color: "#fff",
//         border: "none",
//         borderRadius: "8px",
//         cursor: "pointer",
//         fontSize: "16px",
//     },
// };

// export default EditItem;

