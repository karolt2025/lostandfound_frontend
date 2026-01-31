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


// // src/components/Login.js
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { API } from "../data";

// export default function Login() {
//     const [username, setUsername] = useState("");
//     const [password, setPassword] = useState("");
//     const [message, setMessage] = useState("");
//     const navigate = useNavigate(); // 👈 THIS WAS MISSING

//     const handleLogin = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await fetch(API.LOGIN, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ username, password }),
//             });

//             const data = await response.json();
//             console.log("LOGIN RESPONSE:", data); // 👈 ADD THIS

//             // if (data.token) {
//             //     localStorage.setItem("authToken", data.token);
//             //     setMessage("Login successful!");

//             //     // 🔔 notify NavBar auth state changed
//             //     window.dispatchEvent(new Event("storage"));

//             //     // redirect
//             //     navigate("/");
//             // } 
//             if (data.token) {
//                 localStorage.setItem("authToken", data.token);
//                 localStorage.setItem("userId", data.user_id); // 👈 ADD THIS

//                 // setMessage("Login successful!");
//                 console.log("Saved authToken:", localStorage.getItem("authToken"));
//                 console.log("Saved userId:", localStorage.getItem("userId"));

//                 // 🔔 notify NavBar auth state changed
//                 window.dispatchEvent(new Event("storage"));

//                 navigate("/");
//             }

//             else {
//                 setMessage(JSON.stringify(data));
//             }
//         } catch (err) {
//             console.error(err);
//             setMessage("Error logging in");
//         }
//     };

//     return (
//         <div>
//             <h2>Login</h2>
//             <form onSubmit={handleLogin}>
//                 <input
//                     placeholder="Username"
//                     value={username}
//                     onChange={(e) => setUsername(e.target.value)}
//                 />
//                 <br />
//                 <input
//                     type="password"
//                     placeholder="Password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                 />
//                 <br />
//                 <button type="submit">Login</button>
//             </form>
//             <p>{message}</p>
//         </div>
//     );
// }



// // src/pages/Login.js
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// function Login() {
//     const [username, setUsername] = useState("");
//     const [password, setPassword] = useState("");
//     const [error, setError] = useState(null);
//     const navigate = useNavigate();

//     const handleLogin = async (e) => {
//         e.preventDefault();

//         try {
//             const response = await fetch("http://127.0.0.1:8000/users/api-token-auth/", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({ username, password }),
//             });

//             if (!response.ok) {
//                 throw new Error("Invalid credentials");
//             }

//             const data = await response.json();
//             // Save token to localStorage
//             localStorage.setItem("authToken", data.token);
//             localStorage.setItem("username", username);

//             // Redirect to lost & found board
//             navigate("/lostandfound");
//         } catch (err) {
//             setError(err.message);
//         }
//     };

//     return (
//         <div style={{ maxWidth: "400px", margin: "50px auto" }}>
//             <h2>Login</h2>
//             <form onSubmit={handleLogin}>
//                 <div>
//                     <label>Username:</label>
//                     <input
//                         type="text"
//                         value={username}
//                         onChange={(e) => setUsername(e.target.value)}
//                         required
//                     />
//                 </div>
//                 <div>
//                     <label>Password:</label>
//                     <input
//                         type="password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         required
//                     />
//                 </div>
//                 <button type="submit">Log In</button>
//                 {error && <p style={{ color: "red" }}>{error}</p>}
//             </form>
//         </div>
//     );
// }

// export default Login;
