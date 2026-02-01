import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch(
                "http://127.0.0.1:8000/users/api-token-auth/",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ username, password }),
                }
            );

            const data = await response.json();
            console.log("LOGIN RESPONSE:", data);

            if (!response.ok) {
                throw new Error("Invalid credentials");
            }

            // ✅ SAVE AUTH DATA
            localStorage.setItem("authToken", data.token);
            localStorage.setItem("userId", data.user_id);
            localStorage.setItem("username", username);

            console.log("Saved authToken:", localStorage.getItem("authToken"));
            console.log("Saved userId:", localStorage.getItem("userId"));

            // 🔔 notify app auth state changed (navbar, etc)
            window.dispatchEvent(new Event("storage"));

            // redirect
            navigate("/lostandfound");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "50px auto" }}>
            <h2>Login</h2>

            <form onSubmit={handleLogin}>
                <div>
                    <label>Username</label>
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit">Log In</button>
            </form>

            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}

export default Login;
