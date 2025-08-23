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
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchAnimations = async (page) => {
    try {
      const response = await fetch(`/api/animations?_page=${page}&_limit=20`, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch animations');
      }
      const data = await response.json();
      
      if (data.length === 0) {
        setHasMore(false); // No more data to fetch
      } else {
        setAnimations(prevAnimations => [...prevAnimations, ...data]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false); // Ensure loading state is turned off
    }
  };

  useEffect(() => {
    fetchAnimations(page);
  }, [page]); // Re-fetch data when the page state changes

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 200 && !loading && hasMore) {
        setLoading(true);
        setPage(prevPage => prevPage + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  // Open modal when clicking animation card
  const handleCardClick = (animation) => {
    setSelectedAnimation(animation);
  };

  // Close modal
  const handleCloseModal = () => {
    setSelectedAnimation(null);
  };

  if (loading && animations.length === 0) return <p>로딩 중...</p>;
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
          !loading && <p>애니메이션이 없습니다.</p>
        )}
      </AnimationList>
      {loading && animations.length > 0 && <p>더 많은 애니메이션을 불러오는 중...</p>}
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
