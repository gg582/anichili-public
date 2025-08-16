import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    background-color: #F0F8FF; /* Cool White */
    color: #2F4F4F; /* Dark Slate Gray */
    font-family: 'Arial', sans-serif;
  }
`;

export default GlobalStyles;
