import { TreeItem } from "./TreeItem";

export function TreeView({ tree, onDelete }) {
    return (
        <ul className="tree">
            {tree.map((node) => (
                <TreeItem key={node.id} node={node} onDelete={onDelete} />
            ))}
        </ul>
    );
}