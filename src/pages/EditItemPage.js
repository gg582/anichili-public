import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// Container for the entire page
const EditItemContainer = styled.div`
  padding: 40px;
  text-align: center;
  background-color: #f0f4f8;
  min-height: 100vh;
`;

// Main page title
const PageTitle = styled.h1`
  font-size: 2.4em;
  color: #0077B6;
  margin-bottom: 30px;
  font-weight: 700;
`;

// Table for item details
const Table = styled.table`
  width: 100%;
  margin: 0 auto;
  border-collapse: collapse;
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  background-color: #F5F9FF;
  border-radius: 10px;
  overflow: hidden;
`;

// Alternating row colors for readability
const TableRow = styled.tr`
  &:nth-child(odd) {
    background-color: #ffffff;
  }
  &:nth-child(even) {
    background-color: #eaf2fb;
  }
`;

// Table header cells
const TableHeader = styled.th`
  padding: 18px 20px;
  background-color: #FF6F61;
  color: white;
  text-align: left;
  font-weight: 600;
  font-size: 1.1em;
  border: 1px solid #ddd;
  width: 30%;
  white-space: nowrap;
`;

// Table data cells
const TableData = styled.td`
  padding: 14px 20px;
  border: 1px solid #ddd;
  text-align: left;
  width: 70%;
`;

// Styled input fields
const Input = styled.input`
  width: 100%;
  padding: 10px 14px;
  box-sizing: border-box;
  border-radius: 6px;
  border: 1.8px solid #ccc;
  font-size: 1em;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #0077B6;
    outline: none;
    background-color: #eef7ff;
  }
`;

// Styled select fields
const Select = styled.select`
  width: 100%;
  padding: 10px 14px;
  box-sizing: border-box;
  border-radius: 6px;
  border: 1.8px solid #ccc;
  font-size: 1em;
  background-color: white;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #0077B6;
    outline: none;
    background-color: #eef7ff;
  }
`;

// Button container
const ButtonContainer = styled.div`
  text-align: center;
  margin-top: 30px;
  display: flex;
  justify-content: center;
  gap: 15px;
`;

// General button style
const Button = styled.button`
  padding: 14px 28px;
  background-color: #FF6F61;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.15em;
  font-weight: 600;
  box-shadow: 0 4px 8px rgba(255, 111, 97, 0.4);
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #e85a4f;
  }
`;

// Delete button
const DeleteButton = styled(Button)`
  background-color: #DC3545;
  box-shadow: 0 4px 8px rgba(220, 53, 69, 0.4);

  &:hover {
    background-color: #BD2130;
  }
`;

// OTT update button
const OttButton = styled(Button)`
  background-color: #4CAF50;
  box-shadow: 0 4px 8px rgba(76, 175, 80, 0.4);

  &:hover {
    background-color: #45a049;
  }
`;

// Container for the list of OTT links
const OttListContainer = styled.div`
  margin-top: 20px;
  text-align: left;
`;

// Single OTT entry in the list
const OttEntry = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  gap: 10px;
`;

// Button to remove an OTT link
const RemoveOttButton = styled.button`
  background-color: #DC3545;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

// Field labels
const fieldLabels = {
  title: '제목',
  year: '년도',
  season: '분기',
  pv_url: 'PV URL',
  opening_url: '오프닝 URL',
  ending_url: '엔딩 URL',
  contributor: '기여자',
  image: '이미지 URL',
};

// Season options
const seasonOptions = ['1분기', '2분기', '3분기', '4분기'];

export default function EditItemPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // State for item data
  const [item, setItem] = useState({
    title: '',
    year: '',
    season: '',
    pv_url: '',
    opening_url: '',
    ending_url: '',
    contributor: '',
    image: '',
  });

  // States for OTT functionality
  const [ottProviders, setOttProviders] = useState([]);
  const [ottLinks, setOttLinks] = useState([]);
  const [newOttProvider, setNewOttProvider] = useState('');
  const [newOttUrl, setNewOttUrl] = useState('');

  // State for user feedback messages
  const [message, setMessage] = useState('');

  const fetchAllData = async (itemId) => {
    try {
      const [itemResponse, providersResponse, linksResponse] = await Promise.all([
        fetch(`/api/get-item?id=${itemId}`),
        fetch('/api/get-ott-providers'),
        fetch(`/api/get-ott-links?id=${itemId}`),
      ]);

      // Handle item data
      if (itemResponse.ok) {
        const itemData = await itemResponse.json();
        setItem({
          title: itemData.title || '',
          year: itemData.year !== undefined && itemData.year !== null ? String(itemData.year) : '',
          season: itemData.season || '',
          pv_url: itemData.pv_url || '',
          opening_url: itemData.opening_url || '',
          ending_url: itemData.ending_url || '',
          contributor: itemData.contributor || '',
          image: itemData.image || '',
        });
        setMessage('');
      } else {
        setMessage('아이템 데이터를 불러오는 데 실패했습니다.');
      }

      // Handle OTT providers
      if (providersResponse.ok) {
        const providersData = await providersResponse.json();
        setOttProviders(providersData);
        if (providersData.length > 0) {
          setNewOttProvider(providersData[0].id);
        }
      }

      // Handle OTT links - now the names are included from the backend
      if (linksResponse.ok) {
        const linksData = await linksResponse.json();
        setOttLinks(linksData);
      }
    } catch (error) {
      console.error('Error fetching all data:', error);
      setMessage('데이터를 불러오는 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    if (id) {
      fetchAllData(id);
    }
  }, [id]);

  // Handles changes to the main item input fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setItem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Adds a new OTT link to the state
  const handleAddOttLink = () => {
    if (newOttUrl.trim() && newOttProvider) {
      const selectedProvider = ottProviders.find(p => p.id === Number(newOttProvider));
      setOttLinks(prev => [
        ...prev,
        {
          provider_id: Number(newOttProvider),
          url: newOttUrl,
          provider_name: selectedProvider ? selectedProvider.name : '알 수 없음'
        }
      ]);
      setNewOttUrl('');
    }
  };

  // Removes an OTT link from the state
  const handleRemoveOttLink = (index) => {
    setOttLinks(prev => prev.filter((_, i) => i !== index));
  };
  
  // Handles form submission for all request types
  const handleRequest = async (requestType) => {
    setMessage('요청 처리 중...');

    let payload;
    let endpoint;

    if (requestType === 'EDIT') {
      if (!id || !item.title.trim() || !item.season.trim()) {
        setMessage('ID, 제목, 분기는 필수 입력 항목입니다.');
        return;
      }
      endpoint = `/api/submit-requests`;
      payload = {
        itemId: id,
        request_type: requestType,
        request_data: {
          ...item,
          year: item.year.trim() === '' ? null : Number(item.year),
        },
      };
    } else if (requestType === 'DELETE') {
      endpoint = `/api/submit-requests`;
      payload = {
        itemId: id,
        request_type: requestType,
      };
    } else if (requestType === 'OTT_UPDATE') {
      endpoint = `/api/submit-ott-request`;
      payload = {
        animation_id: id,
        ott_urls: ottLinks.map(({ provider_id, url }) => ({ provider_id, url })),
      };
    } else {
      setMessage('유효하지 않은 요청 타입입니다.');
      return;
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || '요청이 성공적으로 접수되었습니다. 관리자 승인 후 반영됩니다.');
        setTimeout(() => navigate('/'), 2000);
      } else {
        setMessage(data.error || '요청 접수에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      setMessage('오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <EditItemContainer>
      <PageTitle>아이템 수정 페이지 (ID: {id})</PageTitle>
      {id ? (
        <>
          <form onSubmit={(e) => { e.preventDefault(); handleRequest('EDIT'); }}>
            <Table>
              <tbody>
                {Object.entries(item).map(([field, value]) => (
                  <TableRow key={field}>
                    <TableHeader>{fieldLabels[field] || field}</TableHeader>
                    <TableData>
                      {field === 'season' ? (
                        <Select
                          name={field}
                          value={item.season}
                          onChange={handleInputChange}
                        >
                          <option value="">선택하세요</option>
                          {seasonOptions.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </Select>
                      ) : (
                        <Input
                          name={field}
                          value={value}
                          onChange={handleInputChange}
                          autoComplete="off"
                          type={field === 'year' ? 'number' : 'text'}
                        />
                      )}
                    </TableData>
                  </TableRow>
                ))}
              </tbody>
            </Table>
            <ButtonContainer>
              <Button type="submit">수정 요청 접수</Button>
              <DeleteButton type="button" onClick={() => handleRequest('DELETE')}>삭제 요청 접수</DeleteButton>
            </ButtonContainer>
          </form>

          <div style={{ marginTop: '50px' }}>
            <PageTitle style={{ fontSize: '1.8em' }}>OTT 정보 정정</PageTitle>
            <Table>
              <tbody>
                <TableRow>
                  <TableHeader>현재 등록된 OTT</TableHeader>
                  <TableData>
                    <OttListContainer>
                      {ottLinks.length > 0 ? (
                        ottLinks.map((link, index) => (
                          <OttEntry key={index}>
                            <span>
                              <strong>{link.provider_name || '알 수 없음'}:</strong> {link.url}
                            </span>
                            <RemoveOttButton onClick={() => handleRemoveOttLink(index)}>X</RemoveOttButton>
                          </OttEntry>
                        ))
                      ) : (
                        <span>등록된 OTT 링크가 없습니다.</span>
                      )}
                    </OttListContainer>
                  </TableData>
                </TableRow>
                <TableRow>
                  <TableHeader>OTT 링크 추가</TableHeader>
                  <TableData>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <Select
                        value={newOttProvider}
                        onChange={(e) => setNewOttProvider(e.target.value)}
                        style={{ width: '40%' }}
                      >
                        {ottProviders.map((provider) => (
                          <option key={provider.id} value={provider.id}>{provider.name}</option>
                        ))}
                      </Select>
                      <Input
                        type="url"
                        placeholder="OTT URL 입력"
                        value={newOttUrl}
                        onChange={(e) => setNewOttUrl(e.target.value)}
                        style={{ width: '60%' }}
                      />
                    </div>
                    <ButtonContainer style={{ justifyContent: 'flex-start', marginTop: '10px' }}>
                      <OttButton type="button" onClick={handleAddOttLink}>OTT 링크 추가</OttButton>
                    </ButtonContainer>
                  </TableData>
                </TableRow>
              </tbody>
            </Table>
            <ButtonContainer>
              <OttButton type="button" onClick={() => handleRequest('OTT_UPDATE')}>OTT 정보 정정 요청 접수</OttButton>
            </ButtonContainer>
          </div>
        </>
      ) : (
        <p>수정할 아이템이 선택되지 않았습니다.</p>
      )}
      {message && <p>{message}</p>}
    </EditItemContainer>
  );
}
