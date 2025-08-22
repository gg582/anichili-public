import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { jwtDecode } from 'jwt-decode';

// Container for the entire page
const PageContainer = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

// Main page title
const Title = styled.h2`
  text-align: center;
  color: #343a40;
  margin-bottom: 30px;
`;

// Form container
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

// Input group for label and input
const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

// Label for form inputs
const Label = styled.label`
  font-weight: bold;
  margin-bottom: 8px;
  color: #495057;
`;

// Styled input field
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

// Styled select dropdown
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

// Submit button
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

// Notice box for guidelines
const NoticeBox = styled.div`
  background-color: #fff3e0;
  border: 1px solid #ffcc80;
  border-left: 5px solid #ff9800;
  padding: 20px;
  margin-top: 30px;
  border-radius: 8px;
`;

// Notice title
const NoticeTitle = styled.h3`
  color: #ff9800;
  margin-top: 0;
`;

// Notice list
const NoticeList = styled.ul`
  list-style-type: disc;
  padding-left: 20px;
`;

// Notice list item
const NoticeItem = styled.li`
  margin-bottom: 10px;
  line-height: 1.5;
`;

// Message for user feedback
const Message = styled.p`
  text-align: center;
  margin-top: 20px;
  font-size: 1.1em;
  color: ${props => (props.success ? 'green' : 'red')};
`;

// Table wrapper for responsiveness
const TableWrapper = styled.div`
  overflow-x: auto;
  margin-top: 20px;
`;

// Table for animations list
const AnimationTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  min-width: 800px;
`;

// Table header cells
const TableHeader = styled.th`
  background-color: #87CEEB; /* Sky Blue */
  color: white;
  padding: 12px;
  text-align: left;
  border: 1px solid #ddd;
`;

// Table data cells
const TableCell = styled.td`
  padding: 12px;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
  vertical-align: top;
`;

// Delete button (admin-only)
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

// Labels for form fields
const fieldLabels = {
  title: '제목',
  image: '이미지 URL',
  year: '연도',
  season: '분기',
  pv_url: 'PV URL',
  opening_url: '오프닝 URL',
  ending_url: '엔딩 URL',
  contributor: '기여자',
};

// Season options for the select dropdown
const seasonOptions = ['1분기', '2분기', '3분기', '4분기'];

export default function ContributePage() {
  const [isAdmin, setIsAdmin] = useState(false);
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
    contributor: '', // Contributor field is now back in the form
  });
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Checks user's admin status from JWT in the cookie on component load
  const checkAdminStatus = () => {
    try {
      const cookieString = document.cookie;
      const tokenRow = cookieString.split('; ').find(row => row.startsWith('auth-token='));
      if (tokenRow) {
        const decodedToken = jwtDecode(tokenRow.split('=')[1]);
        if (decodedToken.role === 'admin') {
          setIsAdmin(true);
        }
      }
    } catch (err) {
      console.error("Failed to decode token:", err);
      setIsAdmin(false);
    }
  };

  // Fetches the list of all animations from the public API
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
    checkAdminStatus();
    fetchAnimations();
  }, []);

  // Handles changes to form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // The handleSubmit function sends a new 'ADD' request to the pending queue
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    // Client-side validation for required fields
    if (!formData.title || !formData.year || !formData.season || !formData.contributor) {
      setMessage('제목, 연도, 분기, 기여자는 필수 입력 항목입니다.');
      setIsSuccess(false);
      return;
    }

    try {
      // Send the request to the new endpoint for pending requests
      const response = await fetch('/api/submit-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // The payload now includes a request_type and the form data, including contributor
        body: JSON.stringify({
          request_type: 'ADD',
          request_data: formData,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        // The success message now confirms the request is pending
        setMessage(data.message || '요청이 성공적으로 접수되었습니다. 관리자 승인 후 반영됩니다.');
        setFormData({
          title: '',
          image: '',
          year: new Date().getFullYear(),
          season: '1분기',
          pv_url: '',
          opening_url: '',
          ending_url: '',
          contributor: '',
        });
        fetchAnimations(); // Refresh the list
      } else {
        setIsSuccess(false);
        setMessage(data.error || '요청 접수에 실패했습니다.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setIsSuccess(false);
      setMessage('An error occurred during server communication.');
    }
  };

  // The handleDelete function for admins
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
          <Input type="text" id="contributor" name="contributor" value={formData.contributor} onChange={handleChange} required placeholder="기여자 이름을 입력하세요" />
        </InputGroup>
        <Button type="submit">제출</Button>
      </Form>
      {message && <Message success={isSuccess}>{message}</Message>}

      <NoticeBox>
        <NoticeTitle>기여 가이드라인</NoticeTitle>
        <NoticeList>
          <NoticeItem><strong>PV, 오프닝, 엔딩 URL</strong>은 https로 시작하는 YouTube 링크여야 합니다. 여러 개일 경우 YouTube 재생목록 링크를 사용하거나, 모두 이은 영상을 유튜브에서 찾아야 합니다.</NoticeItem>
          <NoticeItem><strong>이미지 URL</strong>은 접속 시 이미지가 바로 떠야 합니다.</NoticeItem>
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
                    <a href={anim.pv_url} target="_blank" rel="noopener noreferrer">PV</a>,&nbsp;
                    <a href={anim.opening_url} target="_blank" rel="noopener noreferrer">OP</a>,&nbsp;
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
}
