import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './Provider/AuthContext';
import { TasksProvider } from './Provider/TasksContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
<BrowserRouter>
  <AuthProvider>
    <TasksProvider>
      <App />
    </TasksProvider>
  </AuthProvider>
</BrowserRouter>
  </React.StrictMode>
);