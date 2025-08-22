// src/pages/LoginPage.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

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
  background-color: #f0f8ff; /* Alice Blue */
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  gap: 15px;
  min-width: 300px;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 1em;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  padding: 10px;
  font-size: 1.1em;
  font-weight: bold;
  color: white;
  background-color: #87CEEB; /* Sky Blue */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #7AC5CD; /* Darker Sky Blue */
  }
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
`;

const LoginPage = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        onLoginSuccess();
        navigate('/');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다.');
      console.error(err);
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
