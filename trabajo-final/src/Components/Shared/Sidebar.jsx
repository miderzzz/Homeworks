import { NavLink } from 'react-router-dom';
import SidebarNode from './SidebarNode';
import styles from './Sidebar.module.scss';

const Sidebar = ({ tree, activePath }) => {
  const root = tree?.root;
  if (!root) return null;

  return (
    <aside className={styles.sidebar}>
      <NavLink to={root.path} end className={styles.title}>
        {root.label}
      </NavLink>
      {root.isLeaf() ? (
        <p className={styles.empty}>Aún no hay uniformes</p>
      ) : (
        <ul className={styles.list}>
          {root.children.map((child) => (
            <SidebarNode key={child.id} node={child} activePath={activePath} />
          ))}
        </ul>
      )}
    </aside>
  );
};

export default Sidebar;
