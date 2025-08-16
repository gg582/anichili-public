import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

// Modal overlay for background dimming
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

// Main modal content container
const ModalContent = styled.div`
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

// Close button for the modal
const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
  color: #333;
`;

// Header section containing image and main info
const DetailHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 20px;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

// Animation thumbnail image
const DetailImage = styled.img`
  width: 200px;
  height: 280px;
  object-fit: cover;
  border-radius: 8px;
  display: block;
`;

// Animation details section
const DetailInfo = styled.div`
  h2 {
    margin: 0 0 10px 0;
    color: #333;
  }
  p {
    margin: 5px 0;
    color: #555;
  }
`;

// Section for related links (PV, OP, ED)
const DetailLinks = styled.div`
  margin-top: 20px;

  h3 {
    border-bottom: 2px solid #87CEEB;
    padding-bottom: 5px;
    margin-bottom: 15px;
  }

  a {
    display: block;
    margin-bottom: 10px;
    color: #87CEEB;
    text-decoration: none;
    font-weight: bold;

    &:hover {
      text-decoration: underline;
    }
  }
`;

// Container for multiple OTT links
const OttLinkContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 15px;
`;

// Styling for a single OTT link item
const OttLinkItem = styled.a`
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: #0077B6;
  font-weight: bold;
  
  &:hover {
    text-decoration: underline;
  }
  
  & span {
    font-weight: normal;
    color: #555;
  }
`;

// Admin 'Edit' button
const AdminButton = styled.button`
  width: 100%;
  padding: 10px 15px;
  background-color: #0070f3;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
  font-size: 1em;

  &:hover {
    background-color: #0056b3;
  }
`;

// User 'Request Edit' button
const UserRequestButton = styled(AdminButton)`
  background-color: #28a745;
  
  &:hover {
    background-color: #218838;
  }
`;

const AnimationDetailModal = ({ animation, onClose, isAdmin }) => {
  const [ottLinks, setOttLinks] = useState([]);

  useEffect(() => {
    if (animation && animation.id) {
      const fetchLinks = async () => {
        try {
          const response = await fetch(`/api/get-ott-links?id=${animation.id}`);
          if (response.ok) {
            const data = await response.json();
            setOttLinks(data);
          } else {
            console.error('Failed to fetch OTT links');
          }
        } catch (error) {
          console.error('Error fetching OTT links:', error);
        }
      };
      fetchLinks();
    }
  }, [animation]);

  if (!animation) return null;

  const { id, title, image, year, season, pv_url, opening_url, ending_url, contributor } = animation;

  const getSeasonName = (s) => {
    const names = {
      '1': '1분기 (1월~3월)',
      '2': '2분기 (4월~6월)',
      '3': '3분기 (7월~9월)',
      '4': '4분기 (10월~12월)'
    };
    return names[s] || `${s}`;
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <DetailHeader>
          <DetailImage src={image} alt={title} />
          <DetailInfo>
            <h2>{title}</h2>
            <p><strong>연도:</strong> {year}년</p>
            <p><strong>분기:</strong> {getSeasonName(season)}</p>
            <p><strong>기여자:</strong> {contributor}</p>
          </DetailInfo>
        </DetailHeader>
        <DetailLinks>
          <h3>관련 링크</h3>
          {pv_url && <a href={pv_url} target="_blank" rel="noopener noreferrer">PV 영상 보기</a>}
          {opening_url && <a href={opening_url} target="_blank" rel="noopener noreferrer">오프닝 영상 보기</a>}
          {ending_url && <a href={ending_url} target="_blank" rel="noopener noreferrer">엔딩 영상 보기</a>}
          {!pv_url && !opening_url && !ending_url && <p>등록된 관련 영상이 없습니다.</p>}
        </DetailLinks>
        
        {/* OTT Links Section */}
        <DetailLinks>
          <h3>OTT 링크</h3>
          <OttLinkContainer>
            {ottLinks.length > 0 ? (
              ottLinks.map((link, index) => (
                <OttLinkItem key={index} href={link.url} target="_blank" rel="noopener noreferrer">
                  <strong>{link.provider_name}:</strong> <span>{link.url}</span>
                </OttLinkItem>
              ))
            ) : (
              <p>등록된 OTT 링크가 없습니다.</p>
            )}
          </OttLinkContainer>
        </DetailLinks>

        {isAdmin ? (
          <Link to={`/edit-item/${id}`}>
            <AdminButton>수정</AdminButton>
          </Link>
        ) : (
          <Link to={`/edit-item/${id}`}>
            <UserRequestButton>수정 요청하기</UserRequestButton>
          </Link>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default AnimationDetailModal;
