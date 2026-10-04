import { useContext } from "react";
import { AuthContext } from "../provider/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";


export function Dashboard() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    }

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Welcome, {user.email}!</h1>
            <div className="dashboard-links">
                <Link to="/biblioteca">Go to Biblioteca</Link>
                <Link to="/banco">Go to Banco</Link>
                <Button text="Logout" typeBoton="logout-button" onClick={handleLogout} />
            </div>
        </div>
    )
}