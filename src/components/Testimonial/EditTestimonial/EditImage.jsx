import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { editTestimonialImageRequest, getImageRequest } from "../../../api";
export const EditImage = ({ data, onClose, getData }) => {
  const [editData, setEditData] = useState(data);
  const [file, setFile] = useState("");

  console.log("data is", data);

  const handleEditTestimonial = async () => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await editTestimonialImageRequest(data?._id, formData);

    response?.status && getData();
  };

  console.log("data is", data);

  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Testimonial</Modal.Title>
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
        <Button
          className="btn btn-sm btn-secondary"
          onClick={() => {
            handleEditTestimonial();
            onClose();
          }}
        >
          Update
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
