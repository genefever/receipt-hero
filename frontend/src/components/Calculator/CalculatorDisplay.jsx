import React, { useState } from "react";
import { StyledButton, StyledIconButtonSpan } from "../../components/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import { StyledModal } from "../Modal";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Row from "react-bootstrap/Row";
import Tooltip from "react-bootstrap/Tooltip";
import { Separator } from "../Separator";
import { FaTrashAlt } from "react-icons/fa";

function CalculatorDisplay(props) {
  const [showModal, setShowModal] = useState(false);

  const [deductionModalItem, setDeductionModalItem] = useState({
    name: "", // variable name
    list: [],
    title: "", // modal title display name
  });
  const handleShowModal = (deductionItem) => {
    setDeductionModalItem(deductionItem);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const deleteDeductionFromModal = (indexToRemove) => {
    setDeductionModalItem((prevValue) => {
      const updatedList = prevValue["list"].filter((item, index) => {
        return index !== indexToRemove;
      });
      return { ...prevValue, list: updatedList };
    });
  };

  const reincludeDeductions =
    (props.receipt.buyer === "Me" &&
      props.receipt.theirDeductions.list.length) ||
    (props.receipt.buyer === "Them" && props.receipt.myDeductions.list.length);
  const sharedSplitCost = (
    (props.receipt.total -
      props.receipt.myDeductions.sum -
      props.receipt.theirDeductions.sum) /
    2
  ).toFixed(2);

  return (
    <>
      <h6>Calculation:</h6>

      <Container fluid>
        <Row>
          <Col md={5}>
            <small>Receipt total:</small>
          </Col>
          <Col md={7} className="text-right">
            $ {props.receipt.total.toFixed(2)}
          </Col>
        </Row>

        {/* Show / hide myDeductions */}
        {props.receipt.myDeductions.list.length > 0 ? (
          <Row>
            <Col md={5}>
              <small>My deductions:</small>
            </Col>
            <Col md={7} className="text-right">
              - ${" "}
              <OverlayTrigger
                placement="bottom"
                delay={{ show: 0, hide: 0 }}
                overlay={<Tooltip>Edit</Tooltip>}
              >
                <StyledButton
                  size="sm"
                  variant="link"
                  className="px-0"
                  onClick={() =>
                    handleShowModal({
                      name: "myDeductions",
                      title: "My",
                      list: props.receipt.myDeductions.list,
                    })
                  }
                >
                  {props.receipt.myDeductions.sum.toFixed(2)}
                </StyledButton>
              </OverlayTrigger>
            </Col>
          </Row>
        ) : null}

        {/* Show / hide otherDeductions */}
        {props.receipt.theirDeductions.list.length > 0 ? (
          <Row>
            <Col md={5}>
              <small>Their deductions:</small>
            </Col>
            <Col md={7} className="text-right">
              - ${" "}
              <OverlayTrigger
                placement="bottom"
                delay={{ show: 0, hide: 0 }}
                overlay={<Tooltip>Edit</Tooltip>}
              >
                <StyledButton
                  size="sm"
                  variant="link"
                  className="px-0"
                  onClick={() =>
                    handleShowModal({
                      name: "theirDeductions",
                      title: "Their",
                      list: props.receipt.theirDeductions.list,
                    })
                  }
                >
                  {props.receipt.theirDeductions.sum.toFixed(2)}
                </StyledButton>
              </OverlayTrigger>
            </Col>
          </Row>
        ) : null}

        <Separator className="my-2" />

        <Row>
          <Col md={6}>
            <small>Shared cost (split): </small>
          </Col>
          <Col className="text-right" md={6}>
            $ {sharedSplitCost}
          </Col>
        </Row>

        {reincludeDeductions ? (
          <Row>
            <Col md={6}>
              <small>
                {props.receipt.buyer === "Me" ? "Their" : "My"} deductions:{" "}
              </small>
            </Col>
            <Col className="text-right" md={6}>
              + ${" "}
              {props.receipt.buyer === "Me"
                ? props.receipt.theirDeductions.sum.toFixed(2)
                : props.receipt.myDeductions.sum.toFixed(2)}
            </Col>
          </Row>
        ) : null}

        <Separator className="mt-2 mb-3" />

        <Row>
          <Col md={6}>
            {props.receipt.buyer === "Me" ? "They owe you" : "You owe them"} :{" "}
          </Col>
          <Col className="text-right" md={6}>
            <h4>
              ${" "}
              {props.receipt.buyer === "Me"
                ? props.receipt.themToPay
                : props.receipt.meToPay}
            </h4>
          </Col>
        </Row>
      </Container>

      {/* Modal - Edit deduction */}
      <StyledModal show={showModal} onHide={handleCloseModal} size="sm">
        <StyledModal.Header closeButton>
          <StyledModal.Title>
            {deductionModalItem.title} deductions
          </StyledModal.Title>
        </StyledModal.Header>
        <StyledModal.Body>
          <ListGroup variant="flush">
            {deductionModalItem.list.map((item, index) => (
              <ListGroup.Item key={index} action>
                <div>
                  $ {item}
                  <StyledIconButtonSpan
                    $delete
                    className="float-right"
                    onClick={() => deleteDeductionFromModal(index)}
                  >
                    <FaTrashAlt />
                  </StyledIconButtonSpan>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </StyledModal.Body>
        <StyledModal.Footer>
          <StyledButton variant="secondary" onClick={handleCloseModal}>
            Cancel
          </StyledButton>
          <StyledButton
            $primary
            onClick={() => {
              props.onDeductionsListChange(
                deductionModalItem.name,
                deductionModalItem.list
              );
              handleCloseModal();
            }}
          >
            Save Changes
          </StyledButton>
        </StyledModal.Footer>
      </StyledModal>
    </>
  );
}

export default CalculatorDisplay;
