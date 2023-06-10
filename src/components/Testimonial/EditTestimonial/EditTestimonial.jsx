import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { editTestimonialTextRequest } from "../../../api";
export const EditTestimonial = ({ data, onClose, getData }) => {
  const [editData, setEditData] = useState(data);

  const handleEditTestimonial = async () => {
    const response = await editTestimonialTextRequest(editData?._id, editData);

    response?.status === 200 && getData();
  };

  return (
    <Modal show={true} onHide={onClose} style={{ color: "white" }}>
      <Modal.Header style={{ backgroundColor: "#191923" }}>
        <Modal.Title>Edit Testimonial</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: "#191923" }}>
        {editData && (
          <div>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
               style={{ backgroundColor: "#2C2C36", color: "white" }}
                type="text"
                name="client_name"
                value={editData.client_name}
                onChange={(e) =>
                  setEditData({ ...editData, client_name: e.target.value })
                }
                placeholder="Project Name"
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Field</Form.Label>
              <Form.Control
               style={{ backgroundColor: "#2C2C36", color: "white" }}
                type="text"
                name="client_name"
                value={editData.field}
                onChange={(e) =>
                  setEditData({ ...editData, field: e.target.value })
                }
                placeholder="Project Name"
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Field</Form.Label>
              <Form.Control
               style={{ backgroundColor: "#2C2C36", color: "white" }}
                type="number"
                name="stars"
                value={editData.stars}
                onChange={(e) =>
                  setEditData({ ...editData, stars: e.target.value })
                }
                placeholder="Stars"
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Review</Form.Label>
              <Form.Control
                style={{ backgroundColor: "#2C2C36", color: "white" }}
                as="textarea"
                rows={5}
                name="description"
                value={editData.review}
                onChange={(e) =>
                  setEditData({ ...editData, review: e.target.value })
                }
                placeholder="Project Description"
                required
              />
            </Form.Group>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: "#191923" }}>
        <Button
          className="btn btn-sm btn-primary"
          onClick={() => {
            onClose();
          }}
        >
          Cancel
        </Button>
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
