import React from "react";
import { StyledModal } from "../Modal";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { Formik, FieldArray } from "formik";
import * as yup from "yup";
import { FormTextField } from "../../components/Form";
import ListGroup from "react-bootstrap/ListGroup";
import { FaTrashAlt } from "react-icons/fa";
import { StyledButton, StyledIconButtonSpan } from "../../components/Button";
import { v1 as uuidv1 } from "uuid";

// Formik validation schema
const schema = yup.object({
  people: yup.array().of(
    yup.object({
      name: yup
        .string()
        .max(20, "Must be 20 characters or less")
        .required("Required"),
    })
  ),
});

function EditPeopleModal(props) {
  return (
    <StyledModal show={props.showModal} onHide={props.onCloseModal} size="sm">
      <StyledModal.Header closeButton>
        <StyledModal.Title as={"h5"}>Split between</StyledModal.Title>
      </StyledModal.Header>
      <StyledModal.Body>
        <Formik
          initialValues={{ people: props.calculationObject.people }}
          validationSchema={schema}
          onSubmit={(values) => {
            props.onUpdatePeople(values.people);
            props.onCloseModal();
          }}
        >
          {({ handleSubmit, values }) => (
            <Form noValidate>
              <FieldArray name="people">
                {({ remove, push }) => (
                  <div>
                    {values.people.map((person, idx) => (
                      <ListGroup variant="flush" key={idx}>
                        <ListGroup.Item className="pb-0">
                          <Form.Row>
                            <FormTextField
                              autoFocus
                              as={Col}
                              xs={10}
                              name={`people.${idx}.name`}
                              onFocus={(e) => {
                                e.target.select();
                              }}
                              onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                  handleSubmit();
                                }
                              }}
                              // TODO disabled field needs to be set based on accessibility
                            />

                            <Col xs={2}>
                              {(!props.id ||
                                (props.isUsersCalculation &&
                                  props.editMode)) && (
                                <div className="mt-1 text-right">
                                  {idx === 0 && (
                                    <p className="text-muted mr-3 mb-0">{`(You)`}</p>
                                  )}
                                  {idx >= 2 && (
                                    <StyledIconButtonSpan
                                      $delete
                                      onClick={() => {
                                        remove(idx);
                                      }}
                                    >
                                      <FaTrashAlt />
                                    </StyledIconButtonSpan>
                                  )}
                                </div>
                              )}
                            </Col>
                          </Form.Row>
                        </ListGroup.Item>
                      </ListGroup>
                    ))}

                    <StyledButton
                      block
                      variant="link"
                      onClick={() => {
                        push({
                          idx: uuidv1(), // Creates an RFC version 1 (timestamp) UUID.,
                          name: "",
                          totalAmount: 0,
                        });
                      }}
                    >
                      Add a person
                    </StyledButton>
                  </div>
                )}
              </FieldArray>
              <StyledButton
                type="button"
                onClick={handleSubmit}
                variant="secondary"
                className="mt-4 mb-1 float-right"
              >
                Done
              </StyledButton>
            </Form>
          )}
        </Formik>
      </StyledModal.Body>
    </StyledModal>
  );
}

export default EditPeopleModal;
