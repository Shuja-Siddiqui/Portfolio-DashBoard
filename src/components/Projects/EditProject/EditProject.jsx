import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { editProjectRequest } from "../../../api";
export const EditProject = ({ data, onClose, getData }) => {
  const [editData, setEditData] = useState(data);

  const handleEditProject = async () => {
    const response = await editProjectRequest(editData);

    response?.status === 200 && getData();
  };

  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Project</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {editData && (
          <div>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="project_name"
                value={editData.project_name}
                onChange={(e) =>
                  setEditData({ ...editData, project_name: e.target.value })
                }
                placeholder="Project Name"
                required
              />
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
            <Form.Group>
              <Form.Label>Link</Form.Label>
              <Form.Control
                type="text"
                name="project_name"
                value={editData.link}
                onChange={(e) =>
                  setEditData({ ...editData, link: e.target.value })
                }
                placeholder="Project Link"
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

