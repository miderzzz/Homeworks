import { Routes, Route } from "react-router-dom";
import { menuTree } from "./data/menuTree";
import { SideBar } from "./components/sideBar";
import "./App.css";

const flatten = (node, result = []) => {
  if (node.value.component) result.push(node.value);
  node.children.forEach((child) => flatten(child, result));
  return result;
};

const routes = flatten(menuTree);

function App() {
  return (
    <div className="app-layout">
      <SideBar />
      <main className="app-content">
        <Routes>
          {routes.map(({ link, component: Page }) => (
            <Route key={link} path={link} element={<Page />} />
          ))}
        </Routes>
      </main>
    </div>
  );
}

export default App;