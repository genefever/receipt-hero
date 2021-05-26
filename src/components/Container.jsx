import styled from "styled-components";
import Container from "react-bootstrap/Container";

export const Wrapper = styled(Container).attrs(() => ({
  fluid: "true",
  className: "mt-4",
}))`
  padding: 0 3%;
`;

export const SignInContainer = styled(Container)`
  width: 100%;
  max-width: 400px;
  padding: 15px;
  margin: auto;
`;
