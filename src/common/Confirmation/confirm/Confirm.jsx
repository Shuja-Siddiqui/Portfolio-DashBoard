import { Modal, Button } from "react-bootstrap";
export const Confirm = ({ data, onClose, onConfirm }) => {
  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header>
        <h2>Confirm!</h2>
      </Modal.Header>
      <Modal.Body>
        Are you sure to delete{" "}
        <b>{data?.client_name || data?.project_name || data?.name}</b>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={() => {
            onClose(false);
          }}
          className="btn btn-sm btn-primary"
        >
          Cancel
        </Button>
        <Button
          className="btn btn-sm btn-secondary"
          onClick={() => {
            onConfirm();
          }}
        >
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
