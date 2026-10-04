import './App.css';
import Biblioteca from "./projects/project1/challenge-4/src/App"
import Banco from "./projects/project2/challenge-5/src/App"
import { Routes, Route, Navigate } from "react-router-dom"
import { Login } from "./pages/Login"
import { Dashboard } from "./pages/Dashboard"
import PrivateRoute from "./components/PrivateRoute"

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<PrivateRoute />}>
        <Route path="/biblioteca" element={<Biblioteca />} />
        <Route path="/banco" element={<Banco />} />
        <Route path="/dashboard" element={<Dashboard />} />

      </Route>
      <Route path="/*" element={<Navigate to="/login" />} />

    </Routes>
  );
}

export default App;
