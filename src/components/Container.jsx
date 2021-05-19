import React from "react";
import styled from "styled-components";

export const SignInContainer = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 15px;
  margin: auto;
  &.form-floating:focus-within {
    z-index: 2;
  }
`;
