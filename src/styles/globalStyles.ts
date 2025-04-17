import { createGlobalStyle } from "styled-components";
import { Theme } from "./theme";

const GlobalStyles = createGlobalStyle<{ theme: Theme }>`

  /* CSS Reset */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body, #root {
    height: 100%;
    width: 100%;
  }

  body {
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    line-height: ${({ theme }) => theme.typography.lineHeight.normal};
    color: ${({ theme }) => theme.colors.text.primary};
    background-color: ${({ theme }) => theme.colors.background};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }

  /* Smooth scrolling for the whole page */
  html {
    scroll-behavior: smooth;
  }

  /* Remove default styling from buttons */
  button {
    background: none;
    border: none;
    font-family: inherit;
    cursor: pointer;
    outline: none;
    color: inherit;
    font-size: inherit;
  }

  /* Remove default styling from inputs */
  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
    outline: none;
    border: none;
    background: none;
    color: inherit;
  }

  /* Make images and videos responsive by default */
  img, video {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* Remove list styling */
  ul, ol {
    list-style: none;
  }

  /* Remove default link styling */
  a {
    text-decoration: none;
    color: inherit;
  }

  /* Better handling of long words/URLs */
  p, h1, h2, h3, h4, h5, h6 {
    overflow-wrap: break-word;
    hyphens: auto;
  }

  /* Higher contrast focus styles */
  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  /* Subtle scrollbars that match the theme */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.divider};
    border-radius: ${({ theme }) => theme.borderRadius.md};
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.text.disabled};
  }

  /* Adjust selection color */
  ::selection {
    background-color: ${({ theme }) =>
      theme.colors.primary}80; /* 50% opacity */
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

export default GlobalStyles;
