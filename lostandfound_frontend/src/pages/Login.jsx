import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./Auth.module.css";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();

    const redirectTo = location.state?.redirectTo || "/";

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
            navigate(redirectTo);
            // navigate("/lostandfound");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
<div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.card}>
                    <h1 className={styles.title}>Welcome back</h1>
                    <p className={styles.subtitle}>
                        Sign in to continue to Lost & Found
                    </p>

                    <form className={styles.form} onSubmit={handleLogin}>
                        <div className={styles.field}>
                            <label>Username</label>
                            <input
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className={styles.field}>
                            <label>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button className={styles.primaryButton} type="submit">
                            Log in
                        </button>

                        {error && (
                            <p className={styles.error}>{error}</p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;