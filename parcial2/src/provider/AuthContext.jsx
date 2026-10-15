import { createContext } from "react";
import { useAuth } from "../hooks/useAuth"

export const AuthContext = createContext()

export function AuthProvider({ children }) {
    const { user, login, register, error, logout, loading } = useAuth()

    return (
        <AuthContext.Provider value={{ user, login, register, error, logout, loading }}>
            {children}
        </AuthContext.Provider>

    )}