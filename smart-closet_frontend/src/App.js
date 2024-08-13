import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login/login';
import Dashboard from './pages/Dashboard/Dashboard';
import CreateNewCloset from './pages/NewCloset/CreateNewCloset';
import GenerateCombination from './pages/GenerateCombination/GenerateCombination';
import AddNewItem from './pages/AddNewItem/AddNewItem';
import CheckIfLiked from './pages/CheckIfLiked/CheckIfLiked';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/create-new-closet" element={<CreateNewCloset />} />
        <Route path="/generate-combination" element={<GenerateCombination />} />
        <Route path="/add-new-item" element={<AddNewItem />} />
        <Route path="/check-if-liked" element={<CheckIfLiked />} />
      </Routes>
    </Router>
  );
}

export default App;
