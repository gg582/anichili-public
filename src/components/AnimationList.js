import React from 'react';
import styled from 'styled-components';
import AnimationCard from './AnimationCard';

const ListContainer = styled.div`
  padding: 40px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
`;

const AnimationList = ({ animations, onDelete, isAdmin }) => {
  if (animations.length === 0) {
    return (
      <p style={{ textAlign: 'center', marginTop: '50px', fontSize: '1.2em', color: '#A9A9A9' }}>
        아직 등록된 애니메이션이 없습니다. 자유롭게 참여하여 추가해 주세요!
      </p>
    );
  }

  return (
    <ListContainer>
      {animations.map(animation => (
        <AnimationCard key={animation.id} animation={animation} onDelete={onDelete} isAdmin={isAdmin} />
      ))}
    </ListContainer>
  );
};

export default AnimationList;
