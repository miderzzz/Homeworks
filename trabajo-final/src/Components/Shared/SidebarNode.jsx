import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.scss';

const SidebarNode = ({ node, activePath = '' }) => {
  const isOnPath = activePath === node.path || activePath.startsWith(`${node.path}/`);
  const [open, setOpen] = useState(isOnPath);
  const [lastOnPath, setLastOnPath] = useState(isOnPath);

  if (isOnPath !== lastOnPath) {
    setLastOnPath(isOnPath);
    if (isOnPath) setOpen(true);
  }

  return (
    <li>
      <div className={styles.row}>
        {!node.isLeaf() && (
          <button
            type="button"
            className={styles.toggle}
            onClick={() => setOpen(!open)}
            aria-label={open ? `Cerrar ${node.label}` : `Abrir ${node.label}`}
          >
            {open ? '−' : '+'}
          </button>
        )}
        <NavLink to={node.path} end className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}>
          {node.label}
        </NavLink>
      </div>

      {!node.isLeaf() && open && (
        <ul className={styles.list}>
          {node.children.map((child) => (
            <SidebarNode key={child.id} node={child} activePath={activePath} />
          ))}
        </ul>
      )}
    </li>
  );
};

export default SidebarNode;
