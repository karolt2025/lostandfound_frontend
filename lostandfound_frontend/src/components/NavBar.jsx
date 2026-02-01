import { Link, Outlet, useNavigate } from "react-router-dom";
import styles from "./NavBar.module.css";

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
        <>
            <nav className={styles.nav}>
                {/* LEFT SIDE */}
                <div className={styles.left}>
                    <Link to="/" className={styles.logo}>
                        Home
                    </Link>

                    <Link to="/lostandfound" className={styles.link}>
                        Lost & Found
                    </Link>
                </div>

                {/* RIGHT SIDE */}
                <div className={styles.right}>
                    {isLoggedIn ? (
                        <>
                            <Link to="/create-item" className={styles.link}>
                                Add Item
                            </Link>

                            <Link to="/inbox" className={styles.link}>
                                📨 Inbox
                            </Link>

                            <button
                                onClick={handleLogout}
                                className={styles.logoutButton}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className={styles.link}>
                                Login
                            </Link>

                            <Link to="/register" className={styles.primaryLink}>
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            <Outlet />
        </>
    );
}
export default NavBar;