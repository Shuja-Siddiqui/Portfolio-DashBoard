import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { editProjectImageRequest, getImageRequest } from "../../../api";
export const EditProjectImage = ({
  data,
  onClose,
  getData,
  setToasterMessage,
  setShowToaster,
}) => {
  const [editData, setEditData] = useState(data);
  const [file, setFile] = useState("");

  const handleEditProject = async () => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await editProjectImageRequest(data?._id, formData);
    response?.status === 200 && getData();
    setShowToaster(true);
    setToasterMessage("Image updated successfuly");
  };

  return (
    <Modal show={true} onHide={onClose} style={{ color: "white" }}>
      <Modal.Header closeButton style={{ backgroundColor: "#2C2C36" }}>
        <Modal.Title>Edit Project</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: "#2C2C36" }}>
        <div>
          <p>Current Image</p>
          <img
            style={{ width: "150px", height: "150px" }}
            src={getImageRequest(editData?.image)}
          />
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>New Image</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </Form.Group>
        </div>
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: "#2C2C36" }}>
        <button
          onClick={() => {
            onClose();
          }}
        >
          Cancel
        </button>
        <button
          onClick={() => {
            handleEditProject();
            onClose();
          }}
        >
          Update
        </button>
      </Modal.Footer>
    </Modal>
  );
};
