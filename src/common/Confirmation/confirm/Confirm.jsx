import { Modal, Button } from "react-bootstrap";
export const Confirm = ({ onClose, onConfirm }) => {
  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Body>Are you sure ?</Modal.Body>
      <Modal.Footer>
        <Button
          onClick={() => {
            onClose();
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
