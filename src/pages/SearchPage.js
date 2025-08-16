import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import AnimationDetailModal from '../components/AnimationDetailModal';

const PageContainer = styled.div`
  padding: 40px;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 40px;
`;

const ResultsCount = styled.p`
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.1em;
  color: #666;
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

/**
 * Returns the Korean name for a given season number string.
 * @param {string} season - Season number ('1' to '4').
 * @returns {string} Season name in Korean.
 */
const getSeasonName = (season) => {
  const names = {
    '1': '1분기 (1월~3월)',
    '2': '2분기 (4월~6월)',
    '3': '3분기 (7월~9월)',
    '4': '4분기 (10월~12월)',
  };
  return names[season] || season;
};

const SearchPage = ({ isAdmin }) => {
  // Get search query parameter from URL
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');

  // State to hold animations grouped by year and season
  const [groupedAnimations, setGroupedAnimations] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnimation, setSelectedAnimation] = useState(null);

  // Fetch and filter animations based on query
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setGroupedAnimations({});
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) {
          throw new Error('검색 결과를 가져오는데 실패했습니다.');
        }
        const data = await response.json();

        // Group animations by year and then season for structured display
        const grouped = data.reduce((acc, anim) => {
          const year = anim.year || '기타';
          const season = anim.season || '기타';

          if (!acc[year]) acc[year] = {};
          if (!acc[year][season]) acc[year][season] = [];
          acc[year][season].push(anim);
          return acc;
        }, {});

        setGroupedAnimations(grouped);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  // Open modal with selected animation details
  const handleCardClick = (animation) => {
    setSelectedAnimation(animation);
  };

  // Close animation detail modal
  const handleCloseModal = () => {
    setSelectedAnimation(null);
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: 50 }}>검색 중...</p>;
  if (error) return <p style={{ textAlign: 'center', marginTop: 50 }}>오류: {error}</p>;

  const years = Object.keys(groupedAnimations).sort((a, b) => a - b);

  return (
    <PageContainer>
      <Title>'{query}' 검색 결과</Title>
      {years.length === 0 && <p style={{ textAlign: 'center' }}>검색 결과가 없습니다.</p>}
      {years.length > 0 && (
        years.map((year) => (
          <YearSection key={year}>
            <YearTitle>{year}년</YearTitle>
            {Object.keys(groupedAnimations[year]).sort((a,b) => {
                const quarterA = parseInt(a, 10);
                const quarterB = parseInt(b, 10);
                return quarterA - quarterB;
            }).map((season) => (
              <SeasonSection key={season}>
                <SeasonTitle>{getSeasonName(season)}</SeasonTitle>
                <AnimationList>
                  {groupedAnimations[year][season].map(anim => (
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

export default SearchPage;

