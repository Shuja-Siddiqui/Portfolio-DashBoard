import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { editTestimonialTextRequest } from "../../../api";
export const EditTestimonial = ({ data, onClose, getData }) => {
  const [editData, setEditData] = useState(data);

  console.log("Data", editData);

  const handleEditTestimonial = async () => {
    const response = await editTestimonialTextRequest(editData?._id, editData);

    response?.status === 200 && getData();
  };

  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Testimonial</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {editData && (
          <div>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
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
