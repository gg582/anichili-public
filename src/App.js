// src/App.js
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ContributePage from './pages/ContributePage';
import LoginPage from './pages/LoginPage';
import YearlyPage from './pages/YearlyPage';
import QuarterlyPage from './pages/QuarterlyPage';
import SearchPage from './pages/SearchPage'; 
import GlobalStyles from './GlobalStyles';
import EditItemPage from './pages/EditItemPage';
import PendingRequestPage from './pages/PendingRequestPage';

const AppContainer = styled.div`
  min-height: 100vh;
`;

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = () => {
    setIsAdmin(true);
  };

  const handleLogout = () => {
    setIsAdmin(false);
  };

  return (
    <AppContainer>
      <GlobalStyles />
      <Header isAdmin={isAdmin} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<HomePage isAdmin={isAdmin} />} />
        <Route path="/yearly" element={<YearlyPage isAdmin={isAdmin} />} />
        <Route path="/quarterly" element={<QuarterlyPage isAdmin={isAdmin} />} />
        <Route path="/search" element={<SearchPage isAdmin={isAdmin} />} /> {/* New route */}
        <Route path="/contribute" element={<ContributePage isAdmin={isAdmin} />} />
        <Route path="/edit-item/:id" element={<EditItemPage isAdmin={isAdmin} />} />
        <Route path="/login" element={<LoginPage onLoginSuccess={handleLogin} />} />
        <Route path="/pending-requests" element={<PendingRequestPage isAdmin={isAdmin} />} />
      </Routes>
    </AppContainer>
  );
}

export default App;
