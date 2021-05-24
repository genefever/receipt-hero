import Button from "react-bootstrap/Button";
import styled from "styled-components";

export const StyledButton = styled(Button)`
  font-size: 1rem;

  // Primary button
  ${(props) =>
    props.$primary &&
    `
    background-color: #5abf71 !important;
    border-color: #5abf71;

    &:hover, &:visited {
      background-color: #40a558 !important;
      border-color: #40a558;
    }
    &:active, &:focus {
      background-color: #328044 !important;
      border-color: #328044;
    }
    `}

  // Google button
  ${(props) =>
    props.$google &&
    `
    background-color: #ea4335 !important;
    border-color: #ea4335;
    color: white;

    &:active, &:hover, &:focus, &:visited {
      color: white;
      background-color: #d33c30 !important;
      border-color: #d33c30;
    }

    `}

  // Facebook button
  ${(props) =>
    props.$facebook &&
    `
    border-color: #3b5998;
    color: white;
    background-color: #3b5998 !important;
    &:active, &:hover, &:focus, &:visited {
      color: white;
      background-color: #355089 !important;
      border-color: #355089;
    }
    `}
`;

export const StyledDeleteButtonSpan = styled.span`
  color: #ea4335;
  &:active,
  &:hover,
  &:focus,
  &:visited {
    color: #d33c30;
  }
`;
