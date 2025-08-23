import React, { useState } from 'react';
import styled from 'styled-components';

const LoginContainer = styled.div`
  max-width: 400px;
  margin: 40px auto;
  padding: 30px;
  background-color: #FFFFFF;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 2px solid #E0E0E0;
  border-radius: 8px;
  background-color: #F8F8F8;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #FF69B4; /* Hot Pink */
  }
`;

const Button = styled.button`
  padding: 15px;
  background-color: #87CEEB; /* Sky Blue */
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  font-size: 1.1em;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #6da2c9;
  }
`;

const StatusMessage = styled.p`
  text-align: center;
  margin-top: 20px;
  font-weight: bold;
  color: ${props => props.success ? '#00A86B' : '#D22B2B'};
`;

const AdminLogin = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState({ message: '', success: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ message: '로그인 중...', success: false });

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setStatus({ message: '로그인 성공!', success: true });
        localStorage.setItem('adminLoggedIn', 'true');
        onLogin();
      } else {
        setStatus({ message: data.message || '로그인 실패', success: false });
      }
    } catch (error) {
      setStatus({ message: '서버 연결에 실패했습니다.', success: false });
    }
  };

  return (
    <LoginContainer>
      <h2>관리자 로그인</h2>
      <LoginForm onSubmit={handleSubmit}>
        <Input type="text" placeholder="아이디" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <Input type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Button type="submit">로그인</Button>
      </LoginForm>
      {status.message && <StatusMessage success={status.success}>{status.message}</StatusMessage>}
    </LoginContainer>
  );
};

export default AdminLogin;
