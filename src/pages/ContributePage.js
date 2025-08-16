// src/pages/ContributePage.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const PageContainer = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  color: #343a40;
  margin-bottom: 30px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: bold;
  margin-bottom: 8px;
  color: #495057;
`;

const Input = styled.input`
  padding: 12px;
  font-size: 1em;
  border: 1px solid #ced4da;
  border-radius: 6px;
  &:focus {
    border-color: #87CEEB;
    outline: none;
    box-shadow: 0 0 0 3px rgba(135, 206, 235, 0.25);
  }
`;

const Select = styled.select`
  padding: 12px;
  font-size: 1em;
  border: 1px solid #ced4da;
  border-radius: 6px;
  &:focus {
    border-color: #87CEEB;
    outline: none;
    box-shadow: 0 0 0 3px rgba(135, 206, 235, 0.25);
  }
`;

const Button = styled.button`
  padding: 15px;
  font-size: 1.1em;
  font-weight: bold;
  color: white;
  background-color: #87CEEB;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  &:hover {
    background-color: #7AC5CD;
  }
`;

const NoticeBox = styled.div`
  background-color: #fff3e0;
  border: 1px solid #ffcc80;
  border-left: 5px solid #ff9800;
  padding: 20px;
  margin-top: 30px;
  border-radius: 8px;
`;

const NoticeTitle = styled.h3`
  color: #ff9800;
  margin-top: 0;
`;

const NoticeList = styled.ul`
  list-style-type: disc;
  padding-left: 20px;
`;

const NoticeItem = styled.li`
  margin-bottom: 10px;
  line-height: 1.5;
`;

const Message = styled.p`
  text-align: center;
  margin-top: 20px;
  font-size: 1.1em;
  color: ${props => (props.success ? 'green' : 'red')};
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  margin-top: 20px;
`;

const AnimationTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  min-width: 800px;
`;

const TableHeader = styled.th`
  background-color: #87CEEB; /* Sky Blue */
  color: white;
  padding: 12px;
  text-align: left;
  border: 1px solid #ddd;
`;

const TableCell = styled.td`
  padding: 12px;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
  vertical-align: top;
`;

const DeleteButton = styled.button`
  background-color: #dc3545; /* Red */
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #c82333;
  }
`;

const ContributePage = ({ isAdmin }) => {
  const [animations, setAnimations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    year: new Date().getFullYear(),
    season: '1분기',
    pv_url: '',
    opening_url: '',
    ending_url: '',
    contributor: '',
  });
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const fetchAnimations = async () => {
    try {
      const response = await fetch('/api/animations');
      if (!response.ok) {
        throw new Error('Failed to fetch animations');
      }
      const data = await response.json();
      setAnimations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimations();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch('/api/manage-animation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setMessage(data.message);
        setFormData({
          title: '',
          image: '',
          year: new Date().getFullYear(),
          season: '1',
          pv_url: '',
          opening_url: '',
          ending_url: '',
          contributor: '',
        });
        fetchAnimations(); // Fetch updated list after successful submission
      } else {
        setIsSuccess(false);
        setMessage(data.error || 'Failed to add animation.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setIsSuccess(false);
      setMessage('An error occurred during server communication.');
    }
  };

  const handleDelete = async (id) => {
    if (!isAdmin) {
      alert('You do not have permission to delete.');
      return;
    }
    if (window.confirm('Are you sure you want to delete this animation?')) {
      try {
        const response = await fetch('/api/manage-animation', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            // In a real app, this token would be dynamic.
            'Authorization': 'Bearer your_admin_auth',
          },
          body: JSON.stringify({ id }),
        });

        const data = await response.json();
        if (response.ok) {
          alert('Successfully deleted.');
          fetchAnimations(); // Fetch updated list after deletion
        } else {
          alert(data.error || 'Deletion failed.');
        }
      } catch (err) {
        console.error('Delete error:', err);
        alert('An error occurred during deletion.');
      }
    }
  };

  return (
    <PageContainer>
      <Title>애니메이션 정보 기여하기</Title>
        
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Label htmlFor="title">제목</Label>
          <Input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
        </InputGroup>
        <InputGroup>
          <Label htmlFor="image">이미지 URL</Label>
          <Input type="text" id="image" name="image" value={formData.image} onChange={handleChange} placeholder="애니메이션 대표 이미지 URL" />
        </InputGroup>
        <InputGroup>
          <Label htmlFor="year">연도</Label>
          <Input type="number" id="year" name="year" value={formData.year} onChange={handleChange} required />
        </InputGroup>
        <InputGroup>
          <Label htmlFor="season">분기</Label>
          <Select id="season" name="season" value={formData.season} onChange={handleChange} required>
            <option value="1분기">1분기 (1월~3월)</option>
            <option value="2분기">2분기 (4월~6월)</option>
            <option value="3분기">3분기 (7월~9월)</option>
            <option value="4분기">4분기 (10월~12월)</option>
          </Select>
        </InputGroup>
        <InputGroup>
          <Label htmlFor="pv_url">PV URL</Label>
          <Input type="text" id="pv_url" name="pv_url" value={formData.pv_url} onChange={handleChange} placeholder="PV 영상 URL" />
        </InputGroup>
        <InputGroup>
          <Label htmlFor="opening_url">오프닝 URL</Label>
          <Input type="text" id="opening_url" name="opening_url" value={formData.opening_url} onChange={handleChange} placeholder="오프닝 영상 URL" />
        </InputGroup>
        <InputGroup>
          <Label htmlFor="ending_url">엔딩 URL</Label>
          <Input type="text" id="ending_url" name="ending_url" value={formData.ending_url} onChange={handleChange} placeholder="엔딩 영상 URL" />
        </InputGroup>
        <InputGroup>
          <Label htmlFor="contributor">기여자</Label>
          <Input type="text" id="contributor" name="contributor" value={formData.contributor} onChange={handleChange} required placeholder="기여자 이름" />
        </InputGroup>
        <Button type="submit">제출</Button>
      </Form>
      {message && <Message success={isSuccess}>{message}</Message>}

      <NoticeBox>
        <NoticeTitle>기여 가이드라인</NoticeTitle>
        <NoticeList>
          <NoticeItem><strong>PV, 오프닝, 엔딩 URL</strong>은 https로 시작하는 YouTube 링크여야 합니다. 여러 개일 경우 YouTube 재생목록 링크를 사용하거나, 모두 이은 영상을 유튜브에서 찾아야 합니다.</NoticeItem>
          <NoticeItem><strong>이미지 URL</strong>은 접속 시 이미지가 바로 떠야 합니다.</NoticeItem>
          <NoticeItem><strong>나무위키 URL</strong>은 일회용 URL이라 몇 주 이내로 유실 가능성이 큽니다.</NoticeItem>
          <NoticeItem><strong>제목, 연도, 분기, 기여자</strong>는 필수 입력 항목입니다.</NoticeItem>
          <NoticeItem>분기는 현지 방영 시작 기준으로 작성해 주세요.</NoticeItem>
        </NoticeList>
      </NoticeBox>
      <br />
        
      <Title>기여된 애니메이션 목록</Title>
      {loading && <p>로딩 중...</p>}
      {error && <p>오류: {error}</p>}
      {!loading && !error && (
        <TableWrapper>
          <AnimationTable>
            <thead>
              <tr>
                <TableHeader>ID</TableHeader>
                <TableHeader>제목</TableHeader>
                <TableHeader>연도</TableHeader>
                <TableHeader>분기</TableHeader>
                <TableHeader>기여자</TableHeader>
                <TableHeader>PV/OP/ED</TableHeader>
                {isAdmin && <TableHeader>관리</TableHeader>}
              </tr>
            </thead>
            <tbody>
              {animations.map(anim => (
                <tr key={anim.id}>
                  <TableCell>{anim.id}</TableCell>
                  <TableCell>{anim.title}</TableCell>
                  <TableCell>{anim.year}</TableCell>
                  <TableCell>{anim.season}</TableCell>
                  <TableCell>{anim.contributor}</TableCell>
                  <TableCell>
                    <a href={anim.pv_url} target="_blank" rel="noopener noreferrer">PV</a>, 
                    <a href={anim.opening_url} target="_blank" rel="noopener noreferrer">OP</a>, 
                    <a href={anim.ending_url} target="_blank" rel="noopener noreferrer">ED</a>
                  </TableCell>
                  {isAdmin && (
                    <TableCell>
                      <DeleteButton onClick={() => handleDelete(anim.id)}>삭제</DeleteButton>
                    </TableCell>
                  )}
                </tr>
              ))}
            </tbody>
          </AnimationTable>
        </TableWrapper>
      )}
    </PageContainer>
  );
};

export default ContributePage;
