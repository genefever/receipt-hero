import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory, { Type } from "react-bootstrap-table2-editor";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css";
import { FaTrashAlt, FaFileCsv } from "react-icons/fa";
import { StyledButton } from "../components/Button";
import Container from "react-bootstrap/Container";

function Table(props) {
  const cellStyle = {
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
  };

  const cellEdit = cellEditFactory({
    mode: "click",
  });

  const pagination = paginationFactory({
    hideSizePerPage: true,
    sizePerPage: 10,
  });

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

  const ExportCSVButton = (props) => {
    const handleClick = () => {
      props.onExport();
    };
    return (
      <StyledButton variant="link" className="btn-sm" onClick={handleClick}>
        <FaFileCsv /> Export
      </StyledButton>
    );
  };

  return (
    <ToolkitProvider
      keyField="id"
      bootstrap4
      data={props.receipts}
      columns={columns}
      pagination={pagination}
      cellEdit={cellEdit}
      hover
      exportCSV
      search
    >
      {(props) => (
        <div>
          <div className="d-flex justify-content-between">
            <h3>Title</h3>
            <ExportCSVButton {...props.csvProps} />
          </div>

          <hr style={{ marginTop: "0", marginBottom: "0.75rem" }} />

          <BootstrapTable {...props.baseProps} />
        </div>
      )}
    </ToolkitProvider>
  );
}

export default Table;
