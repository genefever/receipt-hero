import styled from "styled-components";

export const StyledCard = styled.div`
  padding: 1.75rem;
  margin-right: 0;
  margin-left: 0;
  margin-bottom: ${(props) => (props.$main ? "1rem" : "0")};
  border-width: 1px;
  border-radius: 0.5rem;
  box-shadow: 0 0.5rem 1rem 0 rgba(0, 0, 0, 0.1);
  background-color: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
`;
