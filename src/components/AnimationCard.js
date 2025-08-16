import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  position: relative;
  background-color: #FFFFFF;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 12px rgba(255, 105, 180, 0.4);
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
`;

const CardContent = styled.div`
  padding: 20px;
`;

const CardTitle = styled.h3`
  font-size: 1.5em;
  color: #87CEEB;
  margin-bottom: 10px;
`;

const CardInfo = styled.p`
  font-size: 0.9em;
  color: #A9A9A9;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #FF69B4;
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  font-size: 1.2em;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.8;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 1;
  }
`;

const AnimationCard = ({ animation, onDelete, isAdmin }) => {
  return (
    <Card>
      {isAdmin && (
        <DeleteButton onClick={() => onDelete(animation.id)}>
          &times;
        </DeleteButton>
      )}
      <CardImage src={animation.image || 'https://via.placeholder.com/300x200'} alt={animation.title} />
      <CardContent>
        <CardTitle>{animation.title}</CardTitle>
        <CardInfo>{animation.year}년 - {animation.season}</CardInfo>
      </CardContent>
    </Card>
  );
};

export default AnimationCard;
