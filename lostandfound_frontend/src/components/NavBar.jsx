import { Link, Outlet, useNavigate } from "react-router-dom";

function NavBar() {
    const navigate = useNavigate();

    // Always check token directly
    const isLoggedIn = !!localStorage.getItem("authToken");

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        navigate("/login");
    };

    return (
        <div>
            <nav style={{ padding: "10px", backgroundColor: "#f0f0f0" }}>
                <Link to="/" style={{ marginRight: "15px" }}>Home</Link>
                <Link to="/lostandfound" style={{ marginRight: "15px" }}>
                    Lost & Found
                </Link>

                {isLoggedIn ? (
                    <>
                        <Link to="/create-item" style={{ marginRight: "15px" }}>
                            Add Item
                        </Link>
                        <button onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={{ marginRight: "15px" }}>
                            Login
                        </Link>
                        <Link to="/register" style={{ marginRight: "15px" }}>
                            Register
                        </Link>
                    </>
                )}
            </nav>

            <Outlet />
        </div>
    );
}

export default NavBar;
