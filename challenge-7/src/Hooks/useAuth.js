import { useState, useEffect } from "react";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "firebase/auth";
import { auth } from "../Firebase/config";



export function useAuth() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        })
        return () => unsubscribe();
    })

    const login = async (email, password) => {
        try {
            setError(null);
            const result = await signInWithEmailAndPassword(auth, email, password);
            setUser(result.user);
            return true;
        }catch (error) {
            setError(error.message);
            return false;
        }
    };

    const register = async (email, password) => {
        try {
            setError(null);
            const result = await createUserWithEmailAndPassword(auth, email, password);
            setUser(result.user);
            return true;
        } catch (error) {
            setError(error.message);
            return false;
        }
    };

    const logout = async () => {
        await signOut(auth);
        setUser(null);
    }

    return { user, login, register, logout, error };
}