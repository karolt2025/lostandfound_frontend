import { Link, Outlet, useNavigate } from "react-router-dom";

function NavBar() {
    const navigate = useNavigate();

    // Always check token directly
    const isLoggedIn = !!localStorage.getItem("authToken");

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userId");
        navigate("/login");
    };

    return (
        <div>
            <nav style={styles.nav}>
                <Link to="/" style={styles.link}>Home</Link>

                <Link to="/lostandfound" style={styles.link}>
                    Lost & Found
                </Link>

                {isLoggedIn ? (
                    <>
                        <Link to="/create-item" style={styles.link}>
                            Add Item
                        </Link>

                        {/* ✅ NEW: Inbox link */}
                        <Link to="/inbox" style={styles.link}>
                            📨 Inbox
                        </Link>

                        <button onClick={handleLogout} style={styles.logoutButton}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={styles.link}>
                            Login
                        </Link>

                        <Link to="/register" style={styles.link}>
                            Register
                        </Link>
                    </>
                )}
            </nav>

            <Outlet />
        </div>
    );
}

const styles = {
    nav: {
        padding: "12px 20px",
        backgroundColor: "#f0f0f0",
        display: "flex",
        alignItems: "center",
        gap: "15px",
    },
    link: {
        textDecoration: "none",
        color: "#111827",
        fontWeight: "500",
    },
    logoutButton: {
        marginLeft: "10px",
        padding: "6px 12px",
        backgroundColor: "#dc2626",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
    },
};

export default NavBar;