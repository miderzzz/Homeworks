import { useState } from "react";
import { loginCheck } from "../data/loginCheck";

export function useAuth() {
    const [user, setUser] = useState(null);

    const login = (email, password) => {
        const userFound = loginCheck.find((u) => u.email === email && u.password === password);
        if (userFound) {
            setUser(userFound);
            return true;
        }else{
            return false;
        }
    }

    const logout = () => {
        setUser(null);
    }

    return { user, login, logout };
}