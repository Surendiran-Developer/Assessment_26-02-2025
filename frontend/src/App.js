import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import './App.css';
import { fetchTasks } from './api';

function App() {
  const [authToken, setAuthToken] = useState(sessionStorage.getItem('authToken'));
    const [tasks, setTasks] = useState([]);
    const [showRegisterForm, setShowRegisterForm] = useState(false);

    useEffect(() => {
      if (authToken) {
          fetchTasks(authToken)
              .then((fetchedTasks) => {
                  console.log('Tasks fetched:', fetchedTasks);
                  setTasks(fetchedTasks);
              })
              .catch((error) => {
                  console.error('Error setting tasks:', error);
              });
      }
  }, [authToken]);

    const handleLogin = (token) => {
        setAuthToken(token);
    };

    const handleLogout = () => {
        sessionStorage.removeItem('authToken');
        setAuthToken(null);
    };
    const toggleForm = () => {
      setShowRegisterForm(!showRegisterForm);
  };

    return (
      <div className="app-container">
          {!authToken ? (
              <div className="form-container">
                  {showRegisterForm ? (
                      <RegisterForm onRegister={handleLogin} />
                  ) : (
                      <LoginForm onLogin={handleLogin} />
                  )}
                  {/* ----Toggle Button--- */}
                  <button className="toggle-btn" onClick={toggleForm}>
                      {showRegisterForm ? 'Already have an account? Login' : 'Don’t have an account? Register'}
                  </button>
              </div>
          ) : (
              <div className="">
                  <button className="logout-btn" onClick={handleLogout}>Logout</button>
                  <TaskList tasks={tasks} authToken={authToken} setTasks={setTasks} />
                  <TaskForm authToken={authToken} setTasks={setTasks} />
              </div>
          )}
      </div>
    );
}

export default App;
