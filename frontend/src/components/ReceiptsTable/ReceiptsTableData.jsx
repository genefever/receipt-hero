import { useContext } from "react";
import { Type } from "react-bootstrap-table2-editor";
import { FaTrashAlt } from "react-icons/fa";
import { StyledIconButtonSpan } from "../../components/Button";
import { ThemeContext } from "styled-components";

// Returns the formatted table data columns to populate BootstrapTable with.
function ReceiptsTableData(props) {
  const themeContext = useContext(ThemeContext);

  function formatMonetaryCell(content) {
    return content ? "$ " + parseFloat(content).toFixed(2) : "";
  }

  const cellStyle = {
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
  };

  return [
    {
      dataField: "purchaseDate",
      text: "Date",
      type: "date",
      editable: props.editMode,
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
    },
    {
      dataField: "storeName",
      text: "Name",
      style: cellStyle,
      sort: true,
      editable: props.editMode,
    },
    {
      dataField: "buyer",
      text: "Buyer",
      style: cellStyle,
      sort: true,
      editable: false,
      formatExtraData: props.calculationObject.receipts, // pass state as extraData to formatter.
      formatter: (cellContent, row, index, extraData) => {
        return extraData[index].buyer;
      },
    },
    {
      dataField: "total",
      text: "Receipt Total",
      type: "number",
      sort: true,
      editable: props.editMode,
      style: cellStyle,
      formatter: (cellContent) => {
        return formatMonetaryCell(cellContent);
      },
      csvFormatter: (cellContent) => {
        return formatMonetaryCell(cellContent);
      },
      csvType: Number,
    },
    {
      dataField: "settlement.message",
      text: "Settlement",
      editable: false,
      style: function callback(cell, row, rowIndex, colIndex) {
        return {
          whiteSpace: "normal",
          wordWrap: "break-word",
          color: row.settlement.doesOwe
            ? themeContext.cellColorOrange
            : themeContext.cellColorGreen,
        };
      },
    },
    {
      dataField: "id", // TODO find a better way to generate id
      text: "",
      align: "center",
      editable: false,
      searchable: false,
      headerStyle: (colum, colIndex) => {
        return { width: "5%" };
      },
      formatExtraData: props.editMode, // pass state as extraData to formatter.
      formatter: (cellContent, row, index, extraData) => {
        return extraData ? (
          <StyledIconButtonSpan
            $delete
            className="hide-on-print"
            onClick={() => props.onDeleteReceipt(row.id)}
          >
            <FaTrashAlt />
          </StyledIconButtonSpan>
        ) : null;
      },
      csvType: Number,
      csvFormatter: (cellContent) => {
        return "";
      },
    },
  ];
}

export default ReceiptsTableData;
