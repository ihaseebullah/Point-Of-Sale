import { Spinner } from "react-bootstrap";
export default function Loader() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "50vh",
      }}
    >
      <Spinner animation="border" role="status" />
    </div>
  );
}
