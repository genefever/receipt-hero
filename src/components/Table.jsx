import React, { useRef, useState } from "react";
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
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function Table(props) {
  const { SearchBar } = Search;

  const cellStyle = {
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
  };

  const cellEdit = cellEditFactory({
    mode: "click",
  });

  const pagination = paginationFactory({
    page: 1,
    alwaysShowAllBtns: true,
    sizePerPage: 10,
    withFirstAndLast: false,
    sizePerPageRenderer: ({
      options,
      currSizePerPage,
      onSizePerPageChange,
    }) => (
      <div className="form-inline hide-on-print">
        <div className="form-group">
          <label className="d-inline-block">
            Show{" "}
            {
              <select
                className="form-control form-control-sm d-inline-block"
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
      </div>
    ),
  });

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

  const columnSettings = [
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
      csvFormatter: (cell) => {
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
      csvFormatter: (cellContent) => {
        return "$ " + cellContent;
      },
      csvType: Number,
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
      csvFormatter: (cellContent) => {
        return "$ " + cellContent;
      },
      csvType: Number,
    },
    {
      dataField: "id",
      text: "",
      align: "center",
      editable: false,
      csvExport: false,
      formatter: (cellContent, row) => {
        return (
          <StyledButton
            $google
            className="btn-sm py-0 px-1 pb-1"
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

  const [columns, setColumns] = useState(columnSettings);
  const printComponentRef = useRef();

  const toggleDeleteColumn = () => {
    const newColumns = columns.map((column) => {
      if (column.dataField !== "id") return column;
      return { ...column, hidden: !column.hidden };
    });

    setColumns(newColumns);
  };

  const printPageStyle = `
  @page {
    margin: 10%;
  }

  @media all {
    .pagebreak {
      display: none;
    }
  }

  @media print {
    .pagebreak {
      page-break-before: always;
    }

    .hide-on-print, .react-bootstrap-table-page-btns-ul{
      display: none;
      visibility: hidden;
    }
  }
`;

  return (
    <ToolkitProvider
      keyField="id"
      bootstrap4={true}
      data={props.receipts}
      columns={columns}
      exportCSV={{
        fileName: "title.csv", // TODO: Pass in dynamic dashboard title,
        // ignoreFooter: false, // TODO: Activate once footer is set
      }}
      search
      columnToggle
    >
      {(props) => (
        <div ref={printComponentRef}>
          <h3>Title</h3>
          <Container fluid className="px-0 mb-2 hide-on-print">
            <Row className="align-items-end">
              <Col xs={12} sm={6}>
                <div className="form-inline">
                  <div className="form-group">
                    <SearchBar
                      className="form-control-sm"
                      {...props.searchProps}
                    />
                  </div>
                </div>
              </Col>
              <Col xs={12} sm={6}>
                <div className="float-right">
                  <ExportCSVButton {...props.csvProps} />
                  <ReactToPrint
                    trigger={() => (
                      <StyledButton size="sm" variant="link">
                        <FaPrint /> Print
                      </StyledButton>
                    )}
                    content={() => printComponentRef.current}
                    documentTitle={"Title"} // TODO: replace with dynamic title
                    onBeforeGetContent={() => toggleDeleteColumn()}
                    onAfterPrint={() => toggleDeleteColumn()}
                    pageStyle={printPageStyle}
                  />
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
            condensed
            // ref={printComponentRef}
            // rowStyle={(row, rowIndex) =>
            //   row.buyer === "Me"
            //     ? { backgroundColor: "green" }
            //     : { backgroundColor: "red" }
            // }
          />
        </div>
      )}
    </ToolkitProvider>
  );
}

export default Table;
