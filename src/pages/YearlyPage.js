import React, { useState, useEffect } from 'react';
import AnimationDetailModal from '../components/AnimationDetailModal';
import styled from 'styled-components';

const PageContainer = styled.div`
  padding: 40px;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 40px;
`;

const YearSection = styled.div`
  margin-bottom: 50px;
`;

const YearTitle = styled.h3`
  border-left: 5px solid #87CEEB;
  padding-left: 10px;
  color: #333;
`;

const AnimationList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

const AnimationCard = styled.div`
  width: 200px;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
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
  height: 280px;
  object-fit: cover;
`;

const AnimationTitle = styled.p`
  font-weight: bold;
  padding: 10px;
  margin: 0;
`;

const YearlyPage = ({isAdmin}) => {
  const [animations, setAnimations] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnimation, setSelectedAnimation] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [allAnimations, setAllAnimations] = useState([]);

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
        setAllAnimations(prevAnimations => [...prevAnimations, ...data]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
  
  useEffect(() => {
    // Group animations by year
    const groupedByYear = allAnimations.reduce((acc, anim) => {
      const year = anim.year;
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(anim);
      return acc;
    }, {});
    
    setAnimations(groupedByYear);
  }, [allAnimations]);

  // Handler for card click
  const handleCardClick = (animation) => {
    setSelectedAnimation(animation);
  };
  
  // Handler to close modal
  const handleCloseModal = () => {
    setSelectedAnimation(null);
  };

  if (loading && allAnimations.length === 0) return <p>로딩 중...</p>;
  if (error) return <p>오류: {error}</p>;

  const sortedYears = Object.keys(animations).sort((a, b) => b - a);

  return (
    <PageContainer>
      <Title>연도별 애니메이션</Title>
      {sortedYears.length > 0 ? (
        sortedYears.map(year => (
          <YearSection key={year}>
            <YearTitle>{year}년</YearTitle>
            <AnimationList>
              {animations[year].map(anim => (
                <AnimationCard key={anim.id} onClick={() => handleCardClick(anim)}>
                  <AnimationImage src={anim.image} alt={anim.title} />
                  <AnimationTitle>{anim.title}</AnimationTitle>
                </AnimationCard>
              ))}
            </AnimationList>
          </YearSection>
        ))
      ) : (
        !loading && <p>해당하는 애니메이션이 없습니다.</p>
      )}
      {loading && allAnimations.length > 0 && <p>더 많은 애니메이션을 불러오는 중...</p>}
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

export default YearlyPage;
