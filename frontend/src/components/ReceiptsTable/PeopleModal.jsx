import React, { useState } from "react";
import { StyledModal } from "../Modal";
import Input from "../Input";
import ListGroup from "react-bootstrap/ListGroup";
import { FaTrashAlt } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import OutsideClickHandler from "react-outside-click-handler";
import { StyledButton, StyledIconButtonSpan } from "../../components/Button";

function EditPeopleModal(props) {
  const [modalEditPerson, setModalEditPerson] = useState({
    isEditing: false,
    idx: null,
  });

  function toggleEditPerson(editIdx = null) {
    setModalEditPerson((prevModalEditPerson) => ({
      isEditing: !prevModalEditPerson.isEditing,
      idx: editIdx,
    }));
  }

  return (
    <StyledModal show={props.showModal} onHide={props.onCloseModal} size="sm">
      <StyledModal.Header closeButton>
        <StyledModal.Title as={"h5"}>Split between</StyledModal.Title>
      </StyledModal.Header>
      <StyledModal.Body>
        <ListGroup variant="flush">
          {props.calculationObject.people.map((person, idx) => (
            <ListGroup.Item key={idx} action>
              {modalEditPerson.isEditing && idx === modalEditPerson.idx ? (
                <OutsideClickHandler onOutsideClick={toggleEditPerson}>
                  <Input
                    autoFocus
                    defaultValue={person.name}
                    handleChange={(e) => props.onChangePersonName(e, idx)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        toggleEditPerson();
                      }
                    }}
                    onFocus={(e) => {
                      e.target.select();
                    }}
                  />
                </OutsideClickHandler>
              ) : (
                person.name
              )}

              {(!props.id || (props.isUsersCalculation && props.editMode)) &&
                !modalEditPerson.isEditing && (
                  <div className="float-right d-flex align-items-center">
                    {idx === 0 && (
                      <p className="text-muted mr-3 mb-0">{`(You)`}</p>
                    )}
                    {idx >= 2 && (
                      <StyledIconButtonSpan $delete className="mr-3">
                        <FaTrashAlt />
                      </StyledIconButtonSpan>
                    )}

                    <StyledIconButtonSpan>
                      <MdEdit onClick={() => toggleEditPerson(idx)} />
                    </StyledIconButtonSpan>
                  </div>
                )}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </StyledModal.Body>
      <StyledModal.Footer>
        <StyledButton variant="secondary" onClick={props.onCloseModal}>
          Done
        </StyledButton>
      </StyledModal.Footer>
    </StyledModal>
  );
}

export default EditPeopleModal;
