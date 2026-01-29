// src/components/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../data";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate(); // 👈 THIS WAS MISSING

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(API.LOGIN, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (data.token) {
                localStorage.setItem("authToken", data.token);
                setMessage("Login successful!");

                // 🔔 notify NavBar auth state changed
                window.dispatchEvent(new Event("storage"));

                // redirect
                navigate("/");
            } else {
                setMessage(JSON.stringify(data));
            }
        } catch (err) {
            console.error(err);
            setMessage("Error logging in");
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <br />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <br />
                <button type="submit">Login</button>
            </form>
            <p>{message}</p>
        </div>
    );
}
