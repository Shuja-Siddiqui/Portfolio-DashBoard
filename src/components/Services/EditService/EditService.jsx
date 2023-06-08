import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { editServiceRequest } from "../../../api";
const EditService = ({ data, onClose, getData }) => {
  const [editData, setEditData] = useState(data);
  const [file, setFile] = useState("");

  const handleEditService = async () => {
    const response = await editServiceRequest(editData);
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
      <Modal.Footer>
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

export default EditService;
