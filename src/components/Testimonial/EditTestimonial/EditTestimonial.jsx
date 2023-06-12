import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { editTestimonialTextRequest } from "../../../api";
export const EditTestimonial = ({
  data,
  onClose,
  getData,
  setShowToaster,
  setToasterMessage,
}) => {
  const [editData, setEditData] = useState(data);

  const handleEditTestimonial = async () => {
    const response = await editTestimonialTextRequest(editData?._id, editData);
    setShowToaster(true);
    setToasterMessage("Testimonial updated succesfuly");
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
                placeholder="Select field"
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Select
                name="star"
                id=""
                value={editData.stars}
                required
                onChange={(e) =>
                  setEditData({ ...editData, stars: e.target.value })
                }
              >
                <option value="">Select Star...</option>
                <option value="1">1 Star</option>
                <option value="2">2 Stars</option>
                <option value="3">3 Stars</option>
                <option value="4">4 Stars</option>
                <option value="5">5 Stars</option>
              </Form.Select>
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
                placeholder="Client review"
                required
              />
            </Form.Group>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: "#191923" }}>
        <button
          onClick={() => {
            onClose();
          }}
        >
          Cancel
        </button>
        <button
          onClick={() => {
            handleEditTestimonial();
            onClose();
          }}
        >
          Update
        </button>
      </Modal.Footer>
    </Modal>
  );
};
