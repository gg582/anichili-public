import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
// jwtDecode is no longer needed here as isAdmin is passed as a prop.

const PendingRequestsContainer = styled.div`
  padding: 40px;
  text-align: center;
  background-color: #f0f4f8;
  min-height: 100vh;
`;

const PageTitle = styled.h1`
  font-size: 2.4em;
  color: #0077B6;
  margin-bottom: 30px;
  font-weight: 700;
`;

const Table = styled.table`
  width: 90%;
  margin: 0 auto;
  border-collapse: collapse;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  background-color: #F5F9FF;
  border-radius: 10px;
  overflow: hidden;
`;

const TableHeader = styled.th`
  padding: 18px 20px;
  background-color: #FF6F61;
  color: white;
  text-align: left;
  font-weight: 600;
  border: 1px solid #ddd;
`;

const TableData = styled.td`
  padding: 14px 20px;
  border: 1px solid #ddd;
  text-align: left;
  word-break: break-all;
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  margin: 0 5px;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9em;
  font-weight: bold;
  background-color: ${props => props.approve ? '#28A745' : '#DC3545'};

  &:hover {
    opacity: 0.8;
  }
`;

const Message = styled.p`
  margin-top: 20px;
  font-weight: bold;
  color: ${props => props.type === 'error' ? 'red' : 'green'};
`;

export default function PendingRequestsPage({ isAdmin }) {
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetches the list of pending requests
  const fetchRequests = async () => {
    try {
      const response = await fetch('/api/get-pending-requests', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      } else {
        setMessage('요청 목록을 불러오는 데 실패했습니다.');
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      setMessage('네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchRequests();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  const handleAction = async (requestId, action) => {
    try {
      const response = await fetch('/api/process-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, action }),
        credentials: 'include'
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        fetchRequests();
      } else {
        setMessage(data.error || '요청 처리 중 오류가 발생했습니다.');
      }
    } catch (error) {
      setMessage('네트워크 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return (
      <PendingRequestsContainer>
        <p>로딩 중...</p>
      </PendingRequestsContainer>
    );
  }

  if (!isAdmin) {
    return (
      <PendingRequestsContainer>
        <PageTitle>접근 권한 없음</PageTitle>
        <p>관리자만 접근할 수 있는 페이지입니다. 로그인 후 다시 시도해 주세요.</p>
      </PendingRequestsContainer>
    );
  }

  return (
    <PendingRequestsContainer>
      <PageTitle>관리자 페이지 - 승인 대기 목록</PageTitle>
      {message && <Message>{message}</Message>}
      {requests.length > 0 ? (
        <Table>
          <thead>
            <tr>
              <TableHeader>ID</TableHeader>
              <TableHeader>Item ID</TableHeader>
              <TableHeader>Request Type</TableHeader>
              <TableHeader>Request Data</TableHeader>
              <TableHeader>Created At</TableHeader>
              <TableHeader>Action</TableHeader>
            </tr>
          </thead>
          <tbody>
            {requests.map(req => (
              <tr key={req.id}>
                <TableData>{req.id}</TableData>
                <TableData>{req.item_id}</TableData>
                <TableData>{req.request_type}</TableData>
                <TableData>
                  <pre>{req.request_data ? JSON.stringify(req.request_data, null, 2) : 'N/A'}</pre>
                </TableData>
                <TableData>{new Date(req.created_at).toLocaleString()}</TableData>
                <TableData>
                  <ActionButton approve onClick={() => handleAction(req.id, 'approve')}>승인</ActionButton>
                  <ActionButton onClick={() => handleAction(req.id, 'reject')}>거절</ActionButton>
                </TableData>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>대기 중인 요청이 없습니다.</p>
      )}
    </PendingRequestsContainer>
  );
}
