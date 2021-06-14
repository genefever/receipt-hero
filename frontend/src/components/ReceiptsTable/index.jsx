import React, { useState, useRef, useContext } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import cellEditFactory from "react-bootstrap-table2-editor";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css";
import { FaFileCsv, FaPrint, FaTrashAlt } from "react-icons/fa";
import { BsFillPeopleFill } from "react-icons/bs";
import { MdEdit } from "react-icons/md";
import { StyledButton, StyledIconButtonSpan } from "../../components/Button";
import TotalBalance from "../../components/TotalBalance";
import ReactToPrint from "react-to-print";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Input from "../Input";
import emptyTable from "../../assets/empty-table.svg";
import OutsideClickHandler from "react-outside-click-handler";
import ReceiptsTableData from "./ReceiptsTableData";
import { ThemeContext } from "styled-components";
import { UserContext } from "../../UserContext";
import { useHistory } from "react-router-dom";
import { StyledModal } from "../Modal";

function ReceiptsTable(props) {
  const themeContext = useContext(ThemeContext);
  const { userObject } = useContext(UserContext);
  const history = useHistory();
  const [showModal, setShowModal] = useState(false);

  // Table properties
  const columns = ReceiptsTableData(props);
  const printComponentRef = useRef();
  const { SearchBar } = Search;
  const ExportCSVButton = (props) => {
    const handleClick = () => {
      props.onExport();
    };
    return (
      <StyledButton className="btn-sm" variant="link" onClick={handleClick}>
        <div className="d-flex align-items-center">
          <FaFileCsv className="mr-1" /> Export CSV
        </div>
      </StyledButton>
    );
  };
  const cellEdit = cellEditFactory({
    mode: "click",
    blurToSave: true,
    afterSaveCell: (oldValue, newValue, row) => {
      props.onEditReceipt(row);
    },
  });

  // Table save / edits
  const [editTitle, setEditTitle] = useState(false);

  function toggleEditTitle() {
    setEditTitle((prevEditTitle) => !prevEditTitle);
  }

  const handleShowModal = (personIdx) => {
    setShowModal(true);
  };

  function handleCloseModal() {
    setShowModal(false);
  }

  return (
    <>
      <ToolkitProvider
        keyField="id"
        bootstrap4={true}
        data={props.calculationObject.receipts}
        columns={columns}
        exportCSV={{
          fileName: props.calculationObject.title + ".csv",
          ignoreFooter: false,
        }}
        search
      >
        {(toolkitprops) => (
          <div ref={printComponentRef}>
            <Container fluid className="px-0">
              {/* Title */}
              <Row>
                <Col xs={12} sm={6}>
                  <div className="d-inline-flex">
                    {/* Title  */}
                    {editTitle ? (
                      <OutsideClickHandler
                        onOutsideClick={() => setEditTitle(false)}
                      >
                        <Input
                          autoFocus
                          defaultValue={props.calculationObject.title}
                          handleChange={(e) => props.onEditCalculationTitle(e)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") toggleEditTitle();
                          }}
                          onFocus={(e) => {
                            e.target.select();
                          }}
                        />
                      </OutsideClickHandler>
                    ) : (
                      <>
                        <h4
                          onClick={() => {
                            if (props.editMode) toggleEditTitle();
                          }}
                        >
                          {props.calculationObject.title}
                        </h4>
                        {props.editMode && (
                          <StyledIconButtonSpan
                            onClick={toggleEditTitle}
                            className="hide-on-print"
                          >
                            <MdEdit className="ml-2" />
                          </StyledIconButtonSpan>
                        )}
                      </>
                    )}
                  </div>
                </Col>
                <Col xs={12} sm={6}>
                  {/* Show the edit calculation button only if user is logged in
                  and owns the calculation */}
                  {!props.editMode &&
                    userObject &&
                    userObject.calculations.includes(
                      props.calculationObject._id
                    ) && (
                      <div className="float-right">
                        <StyledButton
                          variant={themeContext.toggleButton}
                          className="hide-on-print"
                          size="sm"
                          onClick={() => {
                            history.push(
                              `/calculation/${props.calculationObject._id}/edit`
                            );
                          }}
                        >
                          <div className="d-flex align-items-center">
                            <MdEdit className="mr-1" /> Edit
                          </div>
                        </StyledButton>
                      </div>
                    )}
                </Col>
              </Row>
              {/* People button */}
              <Row className="pb-1 mb-2">
                <Col xs={12} sm={6}>
                  <StyledButton
                    className="btn-sm px-0 py-0"
                    variant="link"
                    onClick={handleShowModal}
                  >
                    <div className="d-flex align-items-center">
                      <BsFillPeopleFill className="mr-1" /> 2 people
                    </div>
                  </StyledButton>
                </Col>
              </Row>
              {/* Search Bar and Print/Export Buttons */}
              <Row className="mb-3 hide-on-print">
                <Col xs={12} sm={6}>
                  <div className="form-inline">
                    <div className="form-group">
                      <SearchBar
                        className="form-control-sm"
                        {...toolkitprops.searchProps}
                      />
                    </div>
                  </div>
                </Col>
                <Col xs={12} sm={6}>
                  <div className="float-right">
                    <ExportCSVButton {...toolkitprops.csvProps} />
                    <ReactToPrint
                      trigger={() => (
                        <StyledButton size="sm" variant="link">
                          <div className="d-flex align-items-center">
                            <FaPrint className="mr-1" /> Print
                          </div>
                        </StyledButton>
                      )}
                      content={() => printComponentRef.current}
                      documentTitle={props.calculationObject.title}
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <BootstrapTable
                    {...toolkitprops.baseProps}
                    cellEdit={cellEdit}
                    bordered={false}
                    condensed
                    noDataIndication={() => (
                      <div>
                        <h4 className="mt-4">
                          {toolkitprops.searchProps.searchText
                            ? "No records found."
                            : props.editMode
                            ? "Add a receipt to begin."
                            : "No receipts to show."}
                        </h4>
                        <img
                          className="mx-auto d-block mt-3"
                          src={emptyTable}
                          width="270"
                          height="270"
                          alt="Empty table."
                        />
                      </div>
                    )}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className="float-right">
                    <TotalBalance calculationObject={props.calculationObject} />
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
        )}
      </ToolkitProvider>

      {/* Modal - Edit people */}
      <StyledModal show={showModal} onHide={handleCloseModal} size="sm">
        <StyledModal.Header closeButton>
          <StyledModal.Title>People</StyledModal.Title>
        </StyledModal.Header>
        <StyledModal.Body>
          <ListGroup variant="flush">
            {props.calculationObject.people.map((person, idx) => (
              <ListGroup.Item key={idx} action>
                <div>
                  {person.name}
                  {idx >= 2 && (
                    <StyledIconButtonSpan $delete className="float-right">
                      {idx >= 2 && <FaTrashAlt />}
                    </StyledIconButtonSpan>
                  )}
                </div>
              </ListGroup.Item>
            ))}
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

export default ReceiptsTable;
