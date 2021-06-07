import React, { useState, useRef, useContext } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import cellEditFactory from "react-bootstrap-table2-editor";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css";
import { FaFileCsv, FaPrint } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { StyledButton, StyledIconButtonSpan } from "../../components/Button";
import ReactToPrint from "react-to-print";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Input from "../Input";
import emptyTable from "../../assets/empty-table.svg";
import OutsideClickHandler from "react-outside-click-handler";
import ReceiptsTableData from "./ReceiptsTableData";
import { UserContext } from "../../UserContext";
import * as api from "../../api";
import { useHistory } from "react-router-dom";

function ReceiptsTable(props) {
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
        <FaFileCsv /> Export
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
  const { userObject } = useContext(UserContext);
  const [editTitle, setEditTitle] = useState(false);

  const history = useHistory();

  function toggleEditTitle() {
    setEditTitle((prevEditTitle) => !prevEditTitle);
  }

  // TODO: Handle error
  async function updateTable() {
    try {
      const newCalculation = {
        title: props.calculationObject.title,
        receipts: props.calculationObject.receipts,
      };
      await api.createCalculation(newCalculation);
      history.push("/user/" + userObject._id);
    } catch (err) {
      console.log(err);
    }
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
            <div className="d-inline-flex">
              {/* Edit Title  */}
              {editTitle ? (
                <OutsideClickHandler onOutsideClick={() => setEditTitle(false)}>
                  <Input
                    autoFocus
                    defaultValue={props.calculationObject.title}
                    handleChange={(e) => props.onEditCalculationTitle(e)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") toggleEditTitle();
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

            <Container fluid className="px-0 mb-3 hide-on-print">
              <Row className="align-items-end">
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
                          <FaPrint /> Print
                        </StyledButton>
                      )}
                      content={() => printComponentRef.current}
                      documentTitle={props.calculationObject.title}
                    />
                  </div>
                </Col>
              </Row>
            </Container>

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
          </div>
        )}
      </ToolkitProvider>

      {/* Create button TODO: change from publish/save on edit */}
      {userObject && props.editMode && (
        <StyledButton onClick={updateTable}>Publish</StyledButton>
      )}
    </>
  );
}

export default ReceiptsTable;
