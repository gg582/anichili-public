import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { jwtDecode } from 'jwt-decode';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ContributePage from './pages/ContributePage';
import LoginPage from './pages/LoginPage';
import YearlyPage from './pages/YearlyPage';
import QuarterlyPage from './pages/QuarterlyPage';
import SearchPage from './pages/SearchPage';
import GlobalStyles from './GlobalStyles';
import EditItemPage from './pages/EditItemPage';
import PendingRequestsPage from './pages/PendingRequestsPage';
import AnimationDetailModal from './components/AnimationDetailModal';

const AppContainer = styled.div`
  min-height: 100vh;
`;

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  // Helper function to check admin status from the cookie
  const checkAdminStatus = () => {
    try {
      const cookieString = document.cookie;
      const tokenRow = cookieString.split('; ').find(row => row.startsWith('auth-token='));
      if (tokenRow) {
        const tokenValue = tokenRow.split('=')[1];
        if (tokenValue) {
          const decodedToken = jwtDecode(tokenValue);
          if (decodedToken && decodedToken.role === 'admin') {
            setIsAdmin(true);
            return true;
          }
        }
      }
    } catch (error) {
      console.error("Failed to decode token:", error);
    }
    setIsAdmin(false);
    return false;
  };

  // Check login status on app load
  useEffect(() => {
    checkAdminStatus();
  }, []);

  const handleLoginSuccess = () => {
    checkAdminStatus();
    navigate('/');
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', { method: 'POST' });
      if (response.ok) {
        setIsAdmin(false);
        navigate('/login');
      } else {
        alert('로그아웃에 실패했습니다. 다시 시도해 주세요.');
      }
    } catch (err) {
      console.error('로그아웃 중 오류:', err);
      alert('로그아웃 중 네트워크 오류가 발생했습니다.');
    }
  };

  return (
    <AppContainer>
      <GlobalStyles />
      <Header isAdmin={isAdmin} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<HomePage isAdmin={isAdmin} />} />
        <Route path="/yearly" element={<YearlyPage isAdmin={isAdmin} />} />
        <Route path="/quarterly" element={<QuarterlyPage isAdmin={isAdmin} />} />
        <Route path="/search" element={<SearchPage isAdmin={isAdmin} />} />
        <Route path="/contribute" element={<ContributePage isAdmin={isAdmin} />} />
        <Route path="/edit-item/:id" element={<EditItemPage isAdmin={isAdmin} />} />
        <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/pending-requests" element={<PendingRequestsPage isAdmin={isAdmin} />} />
      </Routes>
    </AppContainer>
  );
}

export default App;
