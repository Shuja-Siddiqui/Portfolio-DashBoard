import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { editProjectRequest } from "../../../api";
export const EditProject = ({
  data,
  onClose,
  getData,
  setToasterMessage,
  setShowToaster,
}) => {
  const [editData, setEditData] = useState(data);

  const handleEditProject = async () => {
    const response = await editProjectRequest(editData);
    setShowToaster(true);
    setToasterMessage("project updated successfuly");
    response?.status === 200 && getData();
  };

  return (
    <Modal show={true} onHide={onClose} style={{ color: "white" }}>
      <Modal.Header style={{ backgroundColor: "#2C2C36" }}>
        <Modal.Title>Edit Project</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: "#2C2C36" }}>
        {editData && (
          <div>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                style={{ backgroundColor: "#2C2C36", color: "white" }}
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
            <Form.Group>
              <Form.Label>Link</Form.Label>
              <Form.Control
                style={{ backgroundColor: "#2C2C36", color: "white" }}
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
