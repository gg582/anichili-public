import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  background-color: #87CEEB;
  color: #FFFFFF;
  position: relative;
  z-index: 1001;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    padding: 15px 20px;
  }
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
`;

const LogoImage = styled.img`
  height: 40px;
  transition: transform 0.3s ease;
  &:hover {
    transform: scale(1.1);
  }
`;

const LogoText = styled.h1`
  font-size: 2em;
  font-weight: bold;
  margin: 0;
  span {
    color: #FF69B4;
  }

  @media (max-width: 768px) {
    font-size: 1.5em;
  }
`;

const NavAndSearchContainer = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
    margin-top: 15px;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    order: 2;
  }
`;

const Nav = styled.nav`
  ul {
    display: flex;
    list-style: none;
    align-items: center;
    margin: 0;
    padding: 0;
  
    @media (max-width: 768px) {
      flex-wrap: wrap;
      justify-content: center;
      gap: 10px;
      margin: 0 auto;
    }
  }
`;

const NavItem = styled.li`
  margin-left: 30px;
  font-size: 1.2em;
  font-weight: bold;
  transition: color 0.3s ease;
  position: relative;
  
  @media (max-width: 768px) {
    margin: 0 5px;
    font-size: 1.1em;
    flex-basis: auto;
  }
  
  a, button {
    color: inherit;
    text-decoration: none;
    background: none;
    border: none;
    font-size: 1em;
    cursor: pointer;
    font-weight: bold;
    &:hover {
      color: #FF69B4;
    }
  }
`;

const SearchForm = styled.form`
  display: flex;
  align-items: center;
  margin-left: 30px;
  
  @media (max-width: 768px) {
    width: 100%;
    margin-left: 0;
    margin-top: 10px;
    justify-content: center;
  }
`;

const SearchInput = styled.input`
  padding: 8px 12px;
  border-radius: 5px;
  border: 1px solid #ff69b4;
  font-size: 1em;
  width: 200px;
  margin-right: 10px;
  
  &:focus {
    outline: none;
    border: 2px solid #ff69b4;
  }

  @media (max-width: 768px) {
    width: 70%;
    margin-right: 5px;
    font-size: 0.9em;
  }
`;

const SearchButton = styled.button`
  background-color: #FF69B4;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  
  &:hover {
    background-color: #e65a9e;
  }

  @media (max-width: 768px) {
    padding: 8px;
    font-size: 0.9em;
  }
`;

const Header = ({ isAdmin, onLogout }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // This log will show the current value of the isAdmin prop
  console.log('isAdmin prop in Header:', isAdmin);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <HeaderContainer>
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <LogoWrapper>
          <LogoImage src="/logo192.png" alt="Anichili Logo" />
          <LogoText>
            <span>Ani</span>chili
          </LogoText>
        </LogoWrapper>
      </Link>

      <NavAndSearchContainer>
        <Nav>
          <ul>
            <NavItem><Link to="/contribute">정보 올리기</Link></NavItem>
            <NavItem><Link to="/quarterly">분기별</Link></NavItem>
            <NavItem><Link to="/yearly">연도별</Link></NavItem>
            {isAdmin ? (
              <>
                <NavItem>
                  <Link to="/pending-requests">수정요청 보기</Link>
                </NavItem>
                <NavItem>
                  <button onClick={onLogout}>로그아웃</button>
                </NavItem>
              </>
            ) : (
              <NavItem>
                <Link to="/login">로그인</Link>
              </NavItem>
            )}
          </ul>
        </Nav>
        <SearchForm onSubmit={handleSearch}>
          <SearchInput
            type="text"
            placeholder="제목으로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <SearchButton type="submit">검색</SearchButton>
        </SearchForm>
      </NavAndSearchContainer>
    </HeaderContainer>
  );
};

export default Header;
