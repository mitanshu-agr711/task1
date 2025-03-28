import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './router/login.jsx';
import './App.css';
import UserList from './router/userList.jsx';

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route 
          path="/users" 
          element={
           
              <UserList />
          } 
        />
      </Routes>
    </div>
  );
};

export default App;
