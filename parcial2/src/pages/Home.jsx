import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useNodes } from "../hooks/useNodes";
import { TreeView } from "../components/TreeView";
import { AuthContext } from "../provider/AuthContext";

export function Home(){
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const { tree, nodes, isPending, error, addNode, deleteNode } = useNodes(user);

    const [name, setName] = useState("");
    const [type, setType] = useState("folder");
    const [parentId, setParentId] = useState("");

    const handleLogout = async () => {
        await logout();
        navigate("/login")
    }

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        await addNode(name.trim(), type, parentId);
        setName("");
    }

    return (
        <div>
            <h1>ORGANIZANTREE</h1>
            <p>User: {user?.email}</p>
            <button onClick={handleLogout}>Log out</button>

            <form onSubmit={handleAdd}>
                <input placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="folder">Folder</option>
                    <option value="file">Archive</option>
                </select>
                <select value={parentId} onChange={(e) => setParentId(e.target.value)}>
                    <option value="">(raíz)</option>
                    {nodes.filter((n) => n.type === "folder").map((n) => (
                        <option key={n.id} value={n.id}>{n.name}</option>
                    ))}
                </select>
                <button type="submit">Create</button>
            </form>

            {error && <p>{error}</p>}
            {isPending ? <p>Loading...</p> : <TreeView tree={tree} onDelete={deleteNode} />}
        </div>
    );
}