import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { editProjectImageRequest, getImageRequest } from "../../../api";
export const EditProjectImage = ({ data, onClose, getData }) => {
  const [editData, setEditData] = useState(data);
  const [file, setFile] = useState("");

  const handleEditProject = async () => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await editProjectImageRequest(data?._id, formData);

    response?.status && getData();
  };

  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Project</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <p>Current Image</p>
          <img src={getImageRequest(editData?.image)} />
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>New Image</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </Form.Group>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button className="btn btn-sm"
          onClick={() => {
            onClose();
          }}
        >
          Cancel
        </Button>
        <Button
          className="btn btn-sm btn-secondary"
          onClick={() => {
            handleEditProject();
            onClose();
          }}
        >
          Update
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
