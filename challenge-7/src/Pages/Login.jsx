import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Provider/AuthContext";
import { Input } from "../Components/Input";
import { Button } from "../Components/Button";
import "./Login.scss"

export function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState("")

    const handleLogin = async (e) => {
        e.preventDefault();
        const success = await login(email, password)
        if (success) {
            setError("")
            navigate("/tasks");
        } else {
            setError("Invalid email or password");
        }
    };


    return (
        <div className="login-container">
            <h1>Task-Done</h1>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <Input
                    type="email"
                    placeholder="Type your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                    type="password"
                    placeholder="Type your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button typeButton="submit" type="submit" text="Enter" />
            </form>
            {error && <p>{error}</p>}
            <div className="register-link">
                <p style={{ textAlign: "center", fontWeight: "bold" }}>
                    Don't have an account? <a href="/register">Register</a>
                </p>
            </div>
        </div>

    )
}
