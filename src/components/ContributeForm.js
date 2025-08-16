import React, { useState } from 'react';
import styled from 'styled-components';

const FormContainer = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 30px;
  background-color: #FFFFFF;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const FormTitle = styled.h2`
  color: #87CEEB; /* Sky Blue */
  font-size: 2em;
  margin-bottom: 20px;
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-weight: bold;
  margin-bottom: 8px;
  color: #2F4F4F; /* Dark Gray */
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
  width: 100%;
  padding: 15px;
  background-color: #FF69B4; /* Hot Pink */
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  font-size: 1.1em;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #e55a9b; /* A slightly darker hot pink */
  }
`;

const StatusMessage = styled.p`
  text-align: center;
  margin-top: 20px;
  font-weight: bold;
  color: ${props => props.success ? '#00A86B' : '#D22B2B'};
`;

const ContributeForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    year: '',
    season: '',
    pv_url: '',
    opening_url: '',
    ending_url: '',
    contributor: ''
  });
  const [status, setStatus] = useState({ message: '', success: false });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ message: '등록 중...', success: false });

    try {
      const response = await fetch('/api/manage-animation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      
      if (response.ok) {
        setStatus({ message: '애니메이션이 성공적으로 등록되었습니다!', success: true });
        setFormData({ title: '', image: '', year: '', season: '', pv_url: '', opening_url: '', ending_url: '', contributor: '' });
      } else {
        setStatus({ message: `오류: ${data.error}`, success: false });
      }
    } catch (error) {
      setStatus({ message: '서버 연결에 실패했습니다.', success: false });
    }
  };

  return (
    <FormContainer>
      <FormTitle>새 애니메이션 추가</Form</FormTitle>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>제목</Label>
          <Input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </FormGroup>
        <FormGroup>
          <Label>이미지 URL</Label>
          <Input type="text" name="image" value={formData.image} onChange={handleChange} />
        </FormGroup>
        <FormGroup>
          <Label>연도</Label>
          <Input type="number" name="year" value={formData.year} onChange={handleChange} required />
        </FormGroup>
        <FormGroup>
          <Label>분기</Label>
          <Input type="text" name="season" value={formData.season} onChange={handleChange} placeholder="예: 1분기" required />
        </FormGroup>
        <FormGroup>
          <Label>PV URL</Label>
          <Input type="text" name="pv_url" value={formData.pv_url} onChange={handleChange} />
        </FormGroup>
        <FormGroup>
          <Label>오프닝곡 URL</Label>
          <Input type="text" name="opening_url" value={formData.opening_url} onChange={handleChange} />
        </FormGroup>
        <FormGroup>
          <Label>엔딩곡 URL</Label>
          <Input type="text" name="ending_url" value={formData.ending_url} onChange={handleChange} />
        </FormGroup>
        <FormGroup>
          <Label>작성자 이름</Label>
          <Input type="text" name="contributor" value={formData.contributor} onChange={handleChange} required />
        </FormGroup>
        <Button type="submit">애니메이션 등록</Button>
      </form>
      {status.message && <StatusMessage success={status.success}>{status.message}</StatusMessage>}
    </FormContainer>
  );
};

export default ContributeForm;
