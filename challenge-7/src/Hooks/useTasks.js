import { useState, useEffect } from "react";
import { db } from "../Firebase/config";
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";

export function useTasks(user) {
    const [tasks, setTasks] = useState([]);
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState(null);

    const getAllTasks = async () => {
        if (!user?.uid) return;
        setIsPending(true);
        setError(null);

        try {
            const q = query(collection(db, "tasks"), where("userId", "==", user.uid));
            const snapshot = await getDocs(q);
            const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setTasks(docs);
        } catch (err) {
            setError("Could not fetch tasks");
        } finally {
            setIsPending(false);
        }
    }

    const addTask = async (title, description) => {
        try {
            await addDoc(collection(db, "tasks"), {
                title,
                description,
                done: false,
                userId: user.uid,
                createdAt: serverTimestamp()
            });
            await getAllTasks();
        } catch (err) {
            setError(err.message);
        }
    }


    const updateTask = async (id, data) => {
        try {
            await updateDoc(doc(db, "tasks", id), data);
            await getAllTasks();
        } catch (err) {
            setError(err.message);
        }
    };

    const deleteTask = async (id) => {
        try {
            await deleteDoc(doc(db, "tasks", id));
            await getAllTasks();
        } catch (err) {
            setError(err.message);
        }
    };

    const taskDone = async (id, done) => {
        try {
            await updateDoc(doc(db, "tasks", id), { done });
            await getAllTasks();
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        getAllTasks();
    }, [user]);

    return { tasks, isPending, error, addTask, updateTask, deleteTask, taskDone, getAllTasks };
}