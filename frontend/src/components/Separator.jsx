import styled from "styled-components";

export const Separator = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  color: #9d9a9a;
  :before,
  :after {
    content: "";
    flex: 1;
    border-bottom: 1px solid #9d9a9a;
  }

  :not(:empty):before {
    margin-right: 0.4em;
  }

  :not(:empty):after {
    margin-left: 0.4em;
  }
`;
