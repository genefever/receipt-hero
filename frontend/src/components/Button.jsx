import Button from "react-bootstrap/Button";
import styled from "styled-components";

export const StyledButton = styled(Button)`
  font-size: 1rem;

  // Primary button
  ${(props) =>
    props.$primary &&
    `
    background-color: #56B65B !important;
    border-color: #56B65B;

    &:hover, &:visited {
      background-color: #4da452 !important;
      border-color: #4da452;
    }
    &:active, &:focus {
      background-color: #459249 !important;
      border-color: #459249;
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

export const StyledIconButtonSpan = styled.span.attrs(() => ({
  className: "btn btn-default py-0 px-0",
}))`
  color: ${({ theme }) => theme.text};
  &:active,
  &:hover,
  &:focus,
  &:visited {
    opacity: 95%;
  }

  ${(props) =>
    props.$delete &&
    `
    color: #ea4335;
    &:active,
    &:hover,
    &:focus,
    &:visited {
      color: #d33c30;
    }
  `}
`;
