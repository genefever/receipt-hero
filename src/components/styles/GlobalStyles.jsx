import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
    html, body, #root, #root>div {
      height: 100%;
    }

    body {
      background-color: ${({ theme }) => theme.background};
    }

    h1,h2,h3,h4,h5,h6 {
      font-family: "Montserrat";
      font-weight: 500;
      color: ${({ theme }) => theme.text};
    }

    th {
      color: ${({ theme }) => theme.text};
    }

    td, tr {
      color: ${({ theme }) => theme.text};
      border-bottom: 1px solid ${({ theme }) => theme.divider} !important;
    }

    hr {
      background-color: ${({ theme }) => theme.divider}
    }

    input, textarea {
      background-color: ${({ theme }) => theme.body} !important;
      color: ${({ theme }) => theme.text} !important;
    }

    .as-text {
      background:none;
      border:none;
      margin:0;
      padding:0;
      cursor: pointer;
    }

`;
