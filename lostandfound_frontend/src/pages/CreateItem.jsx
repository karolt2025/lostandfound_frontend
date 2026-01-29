// src/pages/CreateItem.jsx
import { useState } from "react";

function CreateItem() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("lost"); // "lost" or "found"
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Build the request body
        const itemData = { name, description, status };

        try {
            const response = await fetch("http://localhost:8000/lostandfoundboard/items/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(itemData),
            });

            if (!response.ok) {
                throw new Error("Failed to create item");
            }

            setMessage("Item successfully created!");
            setName("");
            setDescription("");
            setStatus("lost");
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    return (
        <div>
            <h1>Add a Lost/Found Item</h1>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
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
                    <select value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="lost">Lost</option>
                        <option value="found">Found</option>
                    </select>
                </div>

                <button type="submit">Submit Item</button>
            </form>
        </div>
    );
}

export default CreateItem;
