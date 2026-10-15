// components/TreeItem.jsx
import { useState } from "react";


export function TreeItem({ node, onDelete }) {
    const [open, setOpen] = useState(true);
    const isFolder = node.isFolder();

    return (
        <li className="tree-item">
            <div
                className={`tree-item__row ${isFolder ? "tree-item__row--folder" : ""}`}
                onClick={() => isFolder && setOpen(!open)}
            >
                <span className="tree-item__icon">
                    {isFolder ? (open ? "📂" : "📁") : "📄"}
                </span>
                <span className="tree-item__name">{node.name}</span>
                <span> - - - - - - - - - </span>
                <span className="tree-item__author">{node.createdBy?.split("@")[0]}</span>
                <button onClick={(e) => { e.stopPropagation(); onDelete(node.id); }}>🗑</button>
            </div>

            {isFolder && open && node.children.length > 0 && (
                <ul className="tree-item__children">
                    {node.children.map((child) => (
                        <TreeItem key={child.id} node={child} onDelete={onDelete} />
                    ))}
                </ul>
            )}
        </li>
    );
}