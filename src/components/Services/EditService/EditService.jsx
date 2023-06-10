import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { editServiceRequest } from "../../../api";
export const EditService = ({ data, onClose, getData }) => {
  const [editData, setEditData] = useState(data);

  const handleEditService = async () => {
    const response = await editServiceRequest(editData);
    response?.status === 200 && getData();
  };

  return (
    <Modal show={true} onHide={onClose} style={{color: "white"}}>
      <Modal.Header style={{ backgroundColor: "#2C2C36" }}>
        <Modal.Title>Edit Testimonial</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: "#2C2C36" }}>
        {editData && (
          <div>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control 
              style={{ backgroundColor: "#2C2C36", color: "white" }}
                as="select"
                required
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
              >
                <option value="">Select...</option>
                <option value="ui/ux designer">ui/ux designer</option>
                <option value="graphic designer">graphic designer</option>
                <option value="web designer">web designer</option>
                <option value="App Development">App Development</option>
                <option value="Web Development">Web Development</option>
              </Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
              style={{ backgroundColor: "#2C2C36", color: "white" }}
                as="textarea"
                rows={5}
                name="description"
                value={editData.description}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
                placeholder="Project Description"
                required
              />
            </Form.Group>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: "#2C2C36" }}>
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
            handleEditService();
            onClose();
          }}
        >
          Update
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
