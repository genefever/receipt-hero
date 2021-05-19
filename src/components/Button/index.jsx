import Button from "react-bootstrap/Button";
import styled from "styled-components";

export const StyledButton = styled(Button)`
  font-size: 1rem;

  ${(props) =>
    props.$primary &&
    `
    background-color: #5abf71 !important;
    border-color: #5abf71;
    &:hover {
      background-color: #40a558 !important;
      border-color: #40a558;
    }
    &:active {
      background-color: #328044 !important;
      border-color: #328044;
    }
    `}

  ${(props) =>
    props.$google &&
    `
    border-color: #ea4335;
    color: white;
    background-color: #ea4335;
    &:hover {
      color: white;
      background-color: #d33c30;
      border-color: #d33c30;
    }
    `}

  ${(props) =>
    props.$facebook &&
    `
    border-color: #3b5998;
    color: white;
    background-color: #3b5998;
    &:hover {
      color: white;
      background-color: #355089;
      border-color: #355089;
    }
    `}
`;
