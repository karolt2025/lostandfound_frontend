// src/pages/CreateItem.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createItem } from "../data";

function CreateItem() {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("lost");
    const [location, setLocation] = useState("");
    const [contactEmail, setContactEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const itemData = {
            title,         
            description,
            status,
            location,
            contact_email: contactEmail,
        };

        try {
            await createItem(itemData);
            // const data = await createItem(itemData);
            setMessage("Item successfully created!");
            setTitle("");
            setDescription("");
            setStatus("lost");
        } catch (error) {
            setMessage("Error creating item");
        }
    };

    return (
        <div>
            <h1>Add a Lost / Found Item</h1>

            {message && <p>{message}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Description:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Status:</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="lost">Lost</option>
                        <option value="found">Found</option>
                    </select>
                </div>

                <div>
                    <label>Location:</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Contact Email:</label>
                    <input
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        required
                    />
                </div>

                <button type="submit">Submit Item</button>
            </form>
        </div>
    );
}

export default CreateItem;
