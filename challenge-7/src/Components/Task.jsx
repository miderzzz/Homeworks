import { useState } from "react";
import { Button } from "./Button";
import { Input } from "./Input";



export function Task({task, colorClass, onToggle, onDelete, onUpdate}) {

const [isEditing, setIsEditing] = useState(false);
const [editedTitle, setEditedTitle] = useState(task.title);
const [editedDescription, setEditedDescription] = useState(task.description);


const startEditing = () => {
    setEditedTitle(task.title);
    setEditedDescription(task.description);
    setIsEditing(true);
}

const cancelEditing = () => {
    setIsEditing(false);
}

const saveChanges = async (e) => {
    e.preventDefault();
    await onUpdate(task.id, { title: editedTitle, description: editedDescription });
    setIsEditing(false);
}

if (isEditing) {
    return (
        <div className="tasks-card"> 
            <form onSubmit={saveChanges}>
                <Input type="text" value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} />
                <Input type="text" value={editedDescription} onChange={(e) => setEditedDescription(e.target.value)} />
                <Button text="Save" typeBoton="save-button" type="submit" />
                <Button text="Cancel" typeBoton="cancel-button" onClick={cancelEditing} />
            </form>
        </div>
    );
}
        
        
        
return (
    <div className={`tasks-card ${colorClass}`}>
        <p className="TitleTask">{task.title}</p>
        <p className="DescriptionTask">{task.description}</p>
        <p className="status">{task.done ? "Completed" : "Pending"}</p>

        <Button text={task.done ? "Mark as pending" : "Mark as completed"} typeBoton="toggle-button" onClick={() => onToggle(task.id, !task.done)} />
        <Button text="Edit" typeBoton="edit-button" onClick={startEditing} />
        <Button text="Delete" typeBoton="delete-button" onClick={() => onDelete(task.id)} />
    </div>


)}
