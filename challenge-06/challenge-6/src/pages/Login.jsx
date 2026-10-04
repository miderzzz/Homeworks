import { useState, useContext } from "react";
import { AuthContext } from "../provider/AuthContext";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

export function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = () => {
    const success = login(email, password);
    if (success) {
        navigate("/dashboard");
        setError("");
    }else{
        setError("Invalid email or password");
    }

}

return (
    <div className="login-container">
        <h1>Login</h1>
        <div className="login-form">
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
        <Button text="Login" typeBoton="login-button" onClick={handleLogin} />
        {error && <p className="error">{error}</p>}
        </div>


    </div>
)
}