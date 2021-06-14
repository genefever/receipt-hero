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
  const [modalOpenIndex, setModalOpenIndex] = useState(0);

  const handleShowModal = (personIdx) => {
    setModalOpenIndex(personIdx);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

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

        {props.receipt.people.map((person, idx) => {
          return person.deductions.length ? (
            <Row key={idx}>
              <Col md={5}>
                <small>
                  {idx === 0 ? "Your" : `${person.name}'s'`} deductions:
                </small>
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
                    onClick={() => handleShowModal(person.idx)}
                  >
                    {props.calculateDeductionsSum(person.deductions).toFixed(2)}
                  </StyledButton>
                </OverlayTrigger>
              </Col>
            </Row>
          ) : null;
        })}

        <Separator className="my-2" />

        <Row>
          <Col md={6}>
            <small>Shared cost (split): </small>
          </Col>
          <Col className="text-right" md={6}>
            $ {props.receipt.sharedTotal.toFixed(2)}
          </Col>
        </Row>

        <Separator className="mt-2 mb-3" />

        <Row>
          <Col md={6}>
            {props.receipt.settlement.doesOwe
              ? `You owe ${props.receipt.buyer}:`
              : "You lent:"}
          </Col>
          <Col className="text-right">
            <h5>$ {Math.abs(props.receipt.settlement.amount).toFixed(2)}</h5>
          </Col>
        </Row>
      </Container>

      {/* Modal - Edit deduction */}
      <StyledModal show={showModal} onHide={handleCloseModal} size="sm">
        <StyledModal.Header closeButton>
          <StyledModal.Title>
            {props.receipt.people[modalOpenIndex].name}'s deductions
          </StyledModal.Title>
        </StyledModal.Header>
        <StyledModal.Body>
          <ListGroup variant="flush">
            {props.receipt.people[modalOpenIndex].deductions.map(
              (item, idx) => (
                <ListGroup.Item key={idx} action>
                  <div>
                    $ {item.amount.toFixed(2)}{" "}
                    {item.isTaxed ? (
                      <span style={{ color: "grey" }}>(T)</span>
                    ) : null}{" "}
                    {item.itemName ? "- " + item.itemName : null}{" "}
                    <StyledIconButtonSpan
                      $delete
                      className="float-right"
                      onClick={() =>
                        props.onDeductionDelete(
                          props.receipt.people[modalOpenIndex].idx,
                          idx
                        )
                      }
                    >
                      <FaTrashAlt />
                    </StyledIconButtonSpan>
                  </div>
                </ListGroup.Item>
              )
            )}
          </ListGroup>
        </StyledModal.Body>
        <StyledModal.Footer>
          <StyledButton variant="secondary" onClick={handleCloseModal}>
            Done
          </StyledButton>
        </StyledModal.Footer>
      </StyledModal>
    </>
  );
}

export default CalculatorDisplay;
