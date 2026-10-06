import './App.scss';
import { Routes, Route, Navigate } from "react-router-dom"
import PrivateRoutes from "./Components/PrivateRoutes";
import { Login } from "./Pages/Login";
import { Register } from "./Pages/Register";
import { Tasks } from "./Pages/Tasks";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<PrivateRoutes />}>
        <Route path="/tasks" element={<Tasks />} />
      </Route>

      <Route path="/*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;