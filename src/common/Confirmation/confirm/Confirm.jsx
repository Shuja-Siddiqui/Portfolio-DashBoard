import { Modal, Button } from "react-bootstrap";
export const Confirm = ({ data, onClose, onConfirm }) => {
  return (
    <Modal show={true} onHide={onClose} style={{ color: "white" }}>
      <Modal.Header style={{ backgroundColor: "#2C2C36" }}>
        <h2>Confirmation!</h2>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: "#2C2C36" }}>
        Are you sure to delete{" "}
        <b>{data?.client_name || data?.project_name || data?.name}</b>
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: "#2C2C36" }}>
        <button
          onClick={() => {
            onClose(false);
          }}
        >
          Cancel
        </button>
        <button
          onClick={() => {
            onConfirm();
          }}
        >
          Confirm
        </button>
      </Modal.Footer>
    </Modal>
  );
};
