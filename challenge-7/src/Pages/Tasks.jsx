import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Provider/AuthContext";
import { TasksContext } from "../Provider/TasksContext";
import { Button } from "../Components/Button";
import { Input } from "../Components/Input";
import { Task } from "../Components/Task";
import "./Tasks.scss"

export function Tasks() {
    const { user, logout } = useContext(AuthContext);
    const { tasks, addTask, updateTask, deleteTask, taskDone } = useContext(TasksContext);
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const colors = ["color1", "color2", "color3"];



    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        await addTask(title, description);
        setTitle("");
        setDescription("");
    }

    ;

    return (
        <div className="tasks-container">
            <h1>Tasks</h1>
            <p className="welcome">Welcome, {user?.email?.split("@")[0].toUpperCase()}</p>

            <form onSubmit={handleAddTask}>
                <Input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                <Input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                <Button text="Add Task" typeButton="add-button" type="submit" />
            </form>

            <div className="tasks-list">
                {tasks?.map((task, index) => (
                    <Task
                        key={task.id}
                        task={task}
                        colorClass={colors[index % colors.length]}
                        onToggle={taskDone}
                        onDelete={deleteTask}
                        onUpdate={updateTask}
                    />
                ))}
            </div>

            <div className="logout-link">
                <p style={{ textAlign: "center", fontWeight: "bold" }}>
                    <a onClick={handleLogout}>Log out</a>
                </p>
            </div>
        </div>
    );
}