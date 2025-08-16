import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import AnimationDetailModal from '../components/AnimationDetailModal'; 

const PageContainer = styled.div`
  padding: 40px;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 40px;
`;

const AnimationList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
`;

const AnimationCard = styled.div`
  width: 250px;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0,0,0,0.15);
  }
`;

const AnimationImage = styled.img`
  width: 100%;
  height: 350px;
  object-fit: cover;
`;

const AnimationTitle = styled.p`
  font-weight: bold;
  padding: 15px 10px;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const HomePage = ({isAdmin}) => {
  const [animations, setAnimations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnimation, setSelectedAnimation] = useState(null); 

  useEffect(() => {
    // Fetch animation list on component mount
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
    fetchAnimations();
  }, []);

  // Open modal when clicking animation card
  const handleCardClick = (animation) => {
    setSelectedAnimation(animation);
  };

  // Close modal
  const handleCloseModal = () => {
    setSelectedAnimation(null);
  };

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>오류: {error}</p>;

  return (
    <PageContainer>
      <Title>애니메이션</Title>
      <AnimationList>
        {animations.length > 0 ? (
          animations.map(anim => (
            <AnimationCard key={anim.id} onClick={() => handleCardClick(anim)}>
              <AnimationImage src={anim.image} alt={anim.title} />
              <AnimationTitle>{anim.title}</AnimationTitle>
            </AnimationCard>
          ))
        ) : (
          <p>애니메이션이 없습니다.</p>
        )}
      </AnimationList>
      {selectedAnimation && (
        <AnimationDetailModal 
          animation={selectedAnimation} 
          onClose={handleCloseModal} 
          isAdmin={isAdmin}
        />
      )}
    </PageContainer>
  );
};

export default HomePage;

