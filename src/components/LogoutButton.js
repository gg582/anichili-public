import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const LogoutBtn = styled.button`
  padding: 10px 15px;
  background-color: #ff6347; /* Tomato color for logout */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: #ff4500; /* Darker red on hover */
  }
`;

const LogoutButton = ({ onLogoutSuccess }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Send a POST request to the server's logout API.
      // The server will handle deleting the HttpOnly cookie.
      const response = await fetch('/api/logout', { method: 'POST' });

      if (response.ok) {
        // Since HttpOnly cookies cannot be deleted by client-side JS,
        // we can trigger the onLogoutSuccess handler and navigate away.
        onLogoutSuccess();
        navigate('/login');
      } else {
        alert('Failed to log out. Please try again.');
      }
    } catch (err) {
      console.error('Error during logout:', err);
      alert('A network error occurred during logout.');
    }
  };

  return (
    <LogoutBtn onClick={handleLogout}>
      Logout
    </LogoutBtn>
  );
};

export default LogoutButton;
