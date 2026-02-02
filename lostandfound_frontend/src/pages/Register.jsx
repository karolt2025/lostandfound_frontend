import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Auth.module.css";

function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const redirectTo = location.state?.redirectTo || "/login";


    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://127.0.0.1:8000/users/register/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, email, password }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data?.username || data?.email || data?.password || "Registration failed");
            }

            const data = await response.json();
            console.log("Registered successfully:", data);

            // Redirect to login page after successful registration
            navigate("/login");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.card}>
                    <h1 className={styles.title}>Create an account</h1>
                    <p className={styles.subtitle}>
                        Join the Lost & Found community
                    </p>

                    <form className={styles.form} onSubmit={handleRegister}>
                        <div className={styles.field}>
                            <label>Username</label>
                            <input
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className={styles.field}>
                            <label>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                            Register
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

export default Register;