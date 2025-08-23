import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

// Styled components for layout
const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  padding: 40px;
  background-color: #f0f8ff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  gap: 15px;
  min-width: 300px;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 1em;
  border: 1px solid #ff69b4;
  border-radius: 5px;
`;

const Button = styled.button`
  padding: 10px;
  font-size: 1.1em;
  font-weight: bold;
  color: white;
  background-color: #87ceeb;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #7ac5cd;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
`;

// LoginPage component
const LoginPage = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Send login request
      const loginResponse = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include', // Include cookies
      });

      const loginData = await loginResponse.json();
      console.log('Login response:', loginResponse.status, loginData);

      if (!loginResponse.ok || !loginData.success) {
        setError(loginData.message || '로그인에 실패했습니다.');
        return;
      }

      // Verify cookie by calling check-auth endpoint
      const checkResponse = await fetch('/api/check-auth', {
        method: 'GET',
        credentials: 'include', // Include cookies
      });

      const checkData = await checkResponse.json();
      console.log('Check-auth response:', checkResponse.status, checkData);

      if (checkResponse.ok && checkData.authenticated) {
        onLoginSuccess();
        navigate('/'); // Navigate to home page
      } else {
        setError('로그인에 성공했으나, 보안 토큰이 발급되지 않았습니다.');
      }
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다.');
      console.error('Login error:', err);
    }
  };

  return (
    <LoginContainer>
      <LoginForm onSubmit={handleSubmit}>
        <h2>관리자 로그인</h2>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Input
          type="text"
          placeholder="사용자명"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit">로그인</Button>
      </LoginForm>
    </LoginContainer>
  );
};

export default LoginPage;
