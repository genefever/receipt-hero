import React, { useState } from "react";
import { StyledModal } from "../Modal";
import { StyledButton } from "../../components/Button";

function ReceiptModal(props) {
  return (
    <StyledModal show={props.showModal} onHide={props.onCloseModal}>
      <StyledModal.Header closeButton>
        <StyledModal.Title as={"h5"}>Split between</StyledModal.Title>
      </StyledModal.Header>
      <StyledModal.Body></StyledModal.Body>
      <StyledModal.Footer>
        <StyledButton variant="secondary" onClick={props.onCloseModal}>
          Done
        </StyledButton>
      </StyledModal.Footer>
    </StyledModal>
  );
}

export default ReceiptModal;
