import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
    html, body, #root, #root>div {
      height: 100%;
    }

    body {
      background-color: ${({ theme }) => theme.background};
      color: ${({ theme }) => theme.text};
      // font-family: "Montserrat", sans-serif;
    }

    h1,h2,h3,h4,h5,h6,span {
      font-family: "Montserrat";
      font-weight: 500;
    }

    td, tr {
      color: ${({ theme }) => theme.text};
      border-bottom: 1px solid ${({ theme }) => theme.borderColor} !important;
    }

    th {
      border-top-color: ${({ theme }) => theme.borderColor} !important;
      border-bottom-color: ${({ theme }) => theme.borderColor} !important;
    }

    hr {
      background-color: ${({ theme }) => theme.borderColor}
    }

    input, textarea {
      background-color: ${({ theme }) => theme.body} !important;
      color: ${({ theme }) => theme.text} !important;
      border-color: ${({ theme }) => theme.borderColor} !important;
    }

    .as-text {
      background:none;
      border:none;
      margin:0;
      padding:0;
      cursor: pointer;
    }

    /* Print settings */

    @page {
      margin: 10%;
    }

    @media all {
      .pagebreak {
        display: none;
      }
    }

    @media print {
      .pagebreak {
        page-break-before: always;
      }

      /* Receipts table print settings */

      .hide-on-print, #deleteButton {
        display: none;
        visibility: hidden;
      }

      h1,h2,h3,h4,h5,h6,p,td,tr,th {
        color: black;
      }
    }
`;
