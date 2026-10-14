import { useState } from "react";
import { NavLink } from "react-router-dom";

export function MenuItem({ node }) {
  const [open, setOpen] = useState(false);
  const hasChildren = node.children.length > 0;

  return (
    <li className="menu-item">
      <div className="menu-item_row">
        {node.value.component ? (
          <NavLink className="menu-item_link" to={node.value.link} end>
            {node.value.title}
          </NavLink>
        ) : (
          <button
            className="menu-item__button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
          >
            {node.value.title}
          </button>
        )}

        {hasChildren && node.value.component && (
          <button
            className="menu-item_toggle"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label={`${open ? "Ocultar" : "Mostrar"} ${node.value.title}`}
          >
            {open ? "-" : "+"}
          </button>
        )}
      </div>

      {hasChildren && open && (
        <ul className="menu-item_children">
          {node.children.map((child) => (
            <MenuItem key={child.value.link} node={child} />
          ))}
        </ul>
      )}
    </li>
  );
}
