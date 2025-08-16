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

const SeasonSection = styled.div`
  margin-top: 20px;
`;

const SeasonTitle = styled.h4`
  margin-bottom: 15px;
  color: #555;
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
  cursor: pointer; /* Added cursor for better UX */
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

const getSeasonName = (season) => {
  const names = {
    '1': '1분기 (1월~3월)',
    '2': '2분기 (4월~6월)',
    '3': '3분기 (7월~9월)',
    '4': '4분기 (10월~12월)'
  };
  return names[season] || `${season}`;
};

const QuarterlyPage = ({isAdmin}) => {
  const [animations, setAnimations] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnimation, setSelectedAnimation] = useState(null); // Added state for modal

  useEffect(() => {
    const fetchAnimations = async () => {
      try {
        const response = await fetch('/api/animations');
        if (!response.ok) {
          throw new Error('Failed to fetch animations');
        }
        const data = await response.json();
        
        // Group animations by year and then by season
        const groupedByYearAndSeason = data.reduce((acc, anim) => {
          const year = anim.year;
          const season = anim.season;
          if (!acc[year]) {
            acc[year] = {};
          }
          if (!acc[year][season]) {
            acc[year][season] = [];
          }
          acc[year][season].push(anim);
          return acc;
        }, {});
        
        setAnimations(groupedByYearAndSeason);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAnimations();
  }, []);
  
  // Handler for card click
  const handleCardClick = (animation) => {
    setSelectedAnimation(animation);
  };
  
  // Handler to close modal
  const handleCloseModal = () => {
    setSelectedAnimation(null);
  };

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>오류: {error}</p>;

  const sortedYears = Object.keys(animations).sort((a, b) => b - a);

  return (
    <PageContainer>
      <Title>분기별 애니메이션</Title>
      {sortedYears.length > 0 ? (
        sortedYears.map(year => (
          <YearSection key={year}>
            <YearTitle>{year}년</YearTitle>
            {Object.keys(animations[year]).sort().map(season => (
              <SeasonSection key={season}>
                <SeasonTitle>{getSeasonName(season)}</SeasonTitle>
                <AnimationList>
                  {animations[year][season].map(anim => (
                    <AnimationCard key={anim.id} onClick={() => handleCardClick(anim)}>
                      <AnimationImage src={anim.image} alt={anim.title} />
                      <AnimationTitle>{anim.title}</AnimationTitle>
                    </AnimationCard>
                  ))}
                </AnimationList>
              </SeasonSection>
            ))}
          </YearSection>
        ))
      ) : (
        <p>해당하는 애니메이션이 없습니다.</p>
      )}
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

export default QuarterlyPage;
