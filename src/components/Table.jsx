import React, { useRef } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory, { Type } from "react-bootstrap-table2-editor";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css";
import { FaTrashAlt, FaFileCsv, FaPrint } from "react-icons/fa";
import { StyledButton } from "../components/Button";
import ReactToPrint from "react-to-print";
import Container from "react-bootstrap/Container";

import ButtonGroup from "react-bootstrap/ButtonGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function Table(props) {
  const printComponentRef = useRef();

  const cellStyle = {
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
  };

  const cellEdit = cellEditFactory({
    mode: "click",
  });

  // const pagination = paginationFactory({
  //   hideSizePerPage: true,
  //   sizePerPage: 10,
  // });

  const pagination = paginationFactory({
    page: 1,
    alwaysShowAllBtns: true,
    showTotal: true,
    withFirstAndLast: false,
    sizePerPageRenderer: ({
      options,
      currSizePerPage,
      onSizePerPageChange,
    }) => (
      <div className="dataTables_length" id="datatable-basic_length">
        <label>
          Show{" "}
          {
            <select
              name="datatable-basic_length"
              aria-controls="datatable-basic"
              className="form-control form-control-sm"
              onChange={(e) => onSizePerPageChange(e.target.value)}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value={props.receipts.length}>All</option>
            </select>
          }{" "}
          entries.
        </label>
      </div>
    ),
  });

  const { SearchBar } = Search;

  const ExportCSVButton = (props) => {
    const handleClick = () => {
      props.onExport();
    };
    return (
      <StyledButton className="btn-sm" onClick={handleClick}>
        <FaFileCsv /> Export
      </StyledButton>
    );
  };

  const columns = [
    {
      dataField: "purchaseDate",
      text: "Purchase Date",
      type: "date",
      style: cellStyle,
      sort: true,
      formatter: (cell) => {
        let dateObj = cell;
        if (typeof cell !== "object") {
          dateObj = new Date(cell);
        }
        return `${("0" + (dateObj.getUTCMonth() + 1)).slice(-2)}/${(
          "0" + dateObj.getUTCDate()
        ).slice(-2)}/${dateObj.getUTCFullYear()}`;
      },
      editor: {
        type: Type.DATE,
      },
      // headerStyle: (colum, colIndex) => {
      //   return { width: "110px" };
      // },
    },
    {
      dataField: "storeName",
      text: "Store Name",
      style: cellStyle,
      sort: true,
      // headerStyle: (colum, colIndex) => {
      //   return { width: "110px" };
      // },
    },
    {
      dataField: "buyer",
      text: "Buyer",
      style: cellStyle,
      sort: true,
      editor: {
        type: Type.SELECT,
        options: [
          { value: 1, label: "Me" },
          { value: 2, label: "Other" },
        ],
      },
      // headerStyle: (colum, colIndex) => {
      //   return { width: "90px" };
      // },
    },
    {
      dataField: "total",
      text: "Receipt Total",
      type: "number",
      sort: true,
      style: cellStyle,
      formatter: (cellContent) => {
        return "$ " + cellContent;
      },
      // headerStyle: (colum, colIndex) => {
      //   return { width: "110px" };
      // },
    },
    {
      dataField: "balanceOwed",
      text: "Balance Owed",
      type: "number",
      sort: true,
      style: cellStyle,
      formatter: (cellContent) => {
        return "$ " + cellContent;
      },
      // headerStyle: (colum, colIndex) => {
      //   return { width: "110px" };
      // },
    },
    {
      dataField: "id",
      text: "",
      align: "center",
      editable: false,
      formatter: (cellContent, row) => {
        return (
          <StyledButton
            $google
            className="btn-sm"
            onClick={() => props.onDelete(row.id)}
          >
            <FaTrashAlt />
          </StyledButton>
        );
      },
      headerStyle: (colum, colIndex) => {
        return { width: "60px" };
      },
    },
  ];

  return (
    <ToolkitProvider
      keyField="id"
      bootstrap4={true}
      data={props.receipts}
      columns={columns}
      exportCSV
      search
    >
      {(props) => (
        <div>
          <h3>Title</h3>
          <Container fluid>
            <Row>
              <Col xs={12} sm={6}>
                <ButtonGroup>
                  <ExportCSVButton {...props.csvProps} />
                  <ReactToPrint
                    trigger={() => (
                      <StyledButton size="sm">
                        <FaPrint /> Print
                      </StyledButton>
                    )}
                    content={() => printComponentRef.current}
                  />
                </ButtonGroup>
              </Col>
              <Col xs={12} sm={6}>
                <div className="float-right">
                  <label>
                    Search:
                    <SearchBar
                      className="form-control-sm"
                      {...props.searchProps}
                    />
                  </label>
                </div>
              </Col>
            </Row>
          </Container>

          <BootstrapTable
            {...props.baseProps}
            hover
            pagination={pagination}
            cellEdit={cellEdit}
            bordered={false}
            ref={printComponentRef}
          />
        </div>
      )}
    </ToolkitProvider>
  );
}

export default Table;
