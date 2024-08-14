import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login/login';
import Dashboard from './pages/Dashboard/Dashboard';
import CreateNewCloset from './pages/NewCloset/CreateNewCloset';
import GenerateCombination from './pages/GenerateCombination/GenerateCombination';
import AddNewItem from './pages/AddNewItem/AddNewItem';
import CheckIfLiked from './pages/CheckIfLiked/CheckIfLiked';
import Signup from './pages/SignUp/SignUp';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/Dashboard" />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/create-new-closet" element={<CreateNewCloset />} />
        <Route path="/generate-combination" element={<GenerateCombination />} />
        <Route path="/add-new-item" element={<AddNewItem />} />
        <Route path="/check-if-liked" element={<CheckIfLiked />} />
        <Route path="/sign-up" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
