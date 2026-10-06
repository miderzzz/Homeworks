import { createContext, useContext } from "react";
import { useTasks } from "../Hooks/useTasks";
import { AuthContext } from "./AuthContext"

export const TasksContext = createContext()

export function TasksProvider({ children }) {
    const { user } = useContext(AuthContext)
    const { tasks, isPending, error, addTask, updateTask, deleteTask, taskDone, getAllTasks } = useTasks(user)

    return (
        <TasksContext.Provider value={{ tasks, isPending, error, addTask, updateTask, deleteTask, taskDone, getAllTasks }}>
            {children}
        </TasksContext.Provider>

    )}