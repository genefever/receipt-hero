import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import BootstrapTable from "react-bootstrap-table-next";

const products = ["apple", "pear", "banana"];
const columns = [
  {
    dataField: "id",
    text: "Product ID",
  },
  {
    dataField: "name",
    text: "Product Name",
  },
  {
    dataField: "price",
    text: "Product Price",
  },
];

function Table() {
  return (
    <BootstrapTable
      keyField="id"
      bootstrap4
      data={products}
      columns={columns}
    />
  );
}

export default Table;
