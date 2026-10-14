import { menuTree } from "../data/menuTree";
import { MenuItem } from "./menuItem";

export function SideBar() {
  return (
    <nav className="sidebar" aria-label="Navegación principal">
      <h1 className="sidebar_title">Challenge 9</h1>
      <ul className="sidebar_list">
        {menuTree.children.map((node) => (
          <MenuItem key={node.value.link} node={node} />
        ))}
      </ul>
    </nav>
  );
}