import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Provider/AuthContext";
import { Input } from "../Components/Input";
import { Button } from "../Components/Button";
import "./Register.scss"

export function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { register, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        const success = await register(email, password);
        if (success) {
            await logout();
            navigate("/tasks");
        } else {
            setError("No se pudo crear la cuenta. El correo ya podría estar en uso.");
        }
    };

    return (
        <div className="register-container">
            <h1>Task-Done</h1>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <Input type="email" placeholder="Type your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Input type="password" placeholder="Type your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button typeButton="submit" type="submit" text="Enter" />
            </form>
            {error && <p>{error}</p>}
            <div className="login-link">
                <p style={{ textAlign: "center", fontWeight: "bold" }}>
                    Already have an account? <a href="/login">Login</a>
                </p>
            </div>
        </div>
    )
}