import Modal from "react-bootstrap/Modal";
import styled from "styled-components";

export const StyledModal = styled(Modal)`
  .modal-content {
    background-color: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
  }

  .modal-header {
    border: none;
  }

  .modal-footer {
    border: none;
  }

  .close {
    color: ${({ theme }) => theme.text};
  }

  .list-group-item {
    background-color: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
  }
`;
