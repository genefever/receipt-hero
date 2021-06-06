import Spinner from "react-bootstrap/Spinner";

export const StyledSpinner = () => {
  return (
    <div className="d-flex justify-content-center align-items-center h-75">
      <Spinner animation="grow" variant="success" />
    </div>
  );
};
