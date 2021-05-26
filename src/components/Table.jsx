import React, { useState, useRef, useContext } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory, { Type } from "react-bootstrap-table2-editor";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css";
import { FaTrashAlt, FaFileCsv, FaPrint } from "react-icons/fa";
import { StyledButton, StyledDeleteButtonSpan } from "../components/Button";
import ReactToPrint from "react-to-print";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import emptyTable from "../assets/empty-table.svg";
import { ThemeContext } from "styled-components";

function Table(props) {
  const [meToPayTotal, setMeToPayTotal] = useState(0);
  const [themToPayTotal, setThemToPayTotal] = useState(0);
  const themeContext = useContext(ThemeContext);

  const printComponentRef = useRef();

  const { SearchBar } = Search;

  const cellStyle = {
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
  };

  const footerStyle = {
    whiteSpace: "normal",
    wordWrap: "break-word",
    fontWeight: "bold",
  };

  const cellEdit = cellEditFactory({
    mode: "click",
    afterSaveCell: (oldValue, newValue, row) => {
      props.onEdit(row);
    },
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

  function formatMonetaryCell(content) {
    return content ? "$ " + parseFloat(content).toFixed(2) : "";
  }

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
      footer: "",
    },
    {
      dataField: "storeName",
      text: "Store Name",
      style: cellStyle,
      sort: true,
      footer: "",
    },
    {
      dataField: "buyer",
      text: "Buyer",
      style: cellStyle,
      sort: true,
      editor: {
        type: Type.SELECT,
        options: [
          { value: "Me", label: "Me" },
          { value: "Them", label: "Them" },
        ],
      },
      footer: "Total:",
    },
    {
      dataField: "total",
      text: "Receipt Total",
      type: "number",
      sort: true,
      style: cellStyle,
      formatter: (cellContent) => {
        return formatMonetaryCell(cellContent);
      },
      csvFormatter: (cellContent) => {
        return formatMonetaryCell(cellContent);
      },
      csvType: Number,
      footer: (columnData) => {
        const receiptTotal = columnData.reduce(
          (acc, item) => acc * 1 + item * 1,
          0
        );
        return "$ " + parseFloat(receiptTotal).toFixed(2);
      },
    },
    {
      dataField: "meToPay",
      text: "You Owe Them",
      type: "number",
      sort: true,
      style: cellStyle,
      formatter: (cellContent) => {
        return formatMonetaryCell(cellContent);
      },
      csvFormatter: (cellContent) => {
        return formatMonetaryCell(cellContent);
      },
      csvType: Number,
      footer: (columnData) => {
        const meToPayTotal = columnData.reduce(
          (acc, item) => acc * 1 + item * 1,
          0
        );
        setTimeout(() => {
          setMeToPayTotal(meToPayTotal);
        }, 0);
        return "$ " + parseFloat(meToPayTotal).toFixed(2);
      },
      footerStyle: footerStyle,
    },
    {
      dataField: "themToPay",
      text: "They Owe You",
      type: "number",
      sort: true,
      style: cellStyle,
      formatter: (cellContent) => {
        return formatMonetaryCell(cellContent);
      },
      csvFormatter: (cellContent) => {
        return formatMonetaryCell(cellContent);
      },
      csvType: Number,
      footer: (columnData) => {
        const themToPayTotal = columnData.reduce(
          (acc, item) => acc * 1 + item * 1,
          0
        );
        setTimeout(() => {
          setThemToPayTotal(themToPayTotal);
        }, 0);
        return "$ " + parseFloat(themToPayTotal).toFixed(2);
      },
      footerStyle: footerStyle,
    },
    {
      dataField: "id",
      text: "",
      isDummyField: true,
      align: "center",
      editable: false,
      searchable: false,
      type: "number",
      formatter: (cellContent, row) => {
        return (
          <StyledDeleteButtonSpan
            className="btn btn-default py-0 px-0"
            role="button"
            id="deleteButton"
            onClick={() => props.onDelete(row.id)}
          >
            <FaTrashAlt />
          </StyledDeleteButtonSpan>
        );
      },
      csvType: Number,
      csvFormatter: (cellContent) => {
        return "";
      },
      footer: () => {
        const whoPaysMessage =
          meToPayTotal > themToPayTotal ? "You owe them" : "They owe you";
        const diff = Math.abs(themToPayTotal * 1 - meToPayTotal * 1);
        return diff !== 0
          ? whoPaysMessage + " $" + parseFloat(diff).toFixed(2)
          : "";
      },
      footerStyle:
        meToPayTotal > themToPayTotal
          ? {
              ...footerStyle,
              backgroundColor: themeContext.cellColorYellow,
              color: "black",
            }
          : {
              ...footerStyle,
              backgroundColor: themeContext.cellColorGreen,
            },
    },
  ];

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

    .hide-on-print, #deleteButton {
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
        ignoreFooter: false,
      }}
      search
    >
      {(props) => (
        <div ref={printComponentRef}>
          <h4>Title</h4>
          <Container fluid className="px-0 mb-3 hide-on-print">
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
                    pageStyle={printPageStyle}
                  />
                </div>
              </Col>
            </Row>
          </Container>

          <BootstrapTable
            {...props.baseProps}
            cellEdit={cellEdit}
            bordered={false}
            condensed
            noDataIndication={() => (
              <div>
                <h4 className="mt-4">
                  {props.searchProps.searchText
                    ? "No records found."
                    : "Add a receipt to begin."}
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
  );
}

export default Table;
