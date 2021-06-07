import { useContext, useState } from "react";
import { Type } from "react-bootstrap-table2-editor";
import { FaTrashAlt } from "react-icons/fa";
import { ThemeContext } from "styled-components";
import { StyledIconButtonSpan } from "../../components/Button";

// Returns the formatted table data columns to populate BootstrapTable with.
function ReceiptsTableData(props) {
  const [meToPayTotal, setMeToPayTotal] = useState(0);
  const [themToPayTotal, setThemToPayTotal] = useState(0);
  const themeContext = useContext(ThemeContext);

  function formatMonetaryCell(content) {
    return content ? "$ " + parseFloat(content).toFixed(2) : "";
  }

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

  return [
    {
      dataField: "purchaseDate",
      text: "Purchase Date",
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
      footer: "",
    },
    {
      dataField: "storeName",
      text: "Store Name",
      style: cellStyle,
      editable: props.editMode,
      sort: true,
      footer: "",
    },
    {
      dataField: "buyer",
      text: "Buyer",
      style: cellStyle,
      sort: true,
      editable: props.editMode,
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
      editable: props.editMode,
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
      editable: false,
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
      editable: false,
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
      dataField: "id", // TODO find a better way to generate id
      text: "",
      isDummyField: true,
      align: "center",
      editable: false,
      searchable: false,
      type: "number",
      formatter: (cellContent, row) => {
        if (props.editMode)
          return (
            <StyledIconButtonSpan
              $delete
              className="hide-on-print"
              onClick={() => props.onDeleteReceipt(row.id)}
            >
              <FaTrashAlt />
            </StyledIconButtonSpan>
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
      footerAlign: "center",
      footerStyle:
        meToPayTotal > themToPayTotal
          ? {
              ...footerStyle,
              backgroundColor: themeContext.cellColorYellow,
              color: "#2B2B2B",
            }
          : {
              ...footerStyle,
              backgroundColor: themeContext.cellColorGreen,
            },
    },
  ];
}

export default ReceiptsTableData;
