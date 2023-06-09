import { useEffect, useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { EditProject } from "../components";
import {
  createProjectRequest,
  deleteProjectRequest,
  getImageRequest,
} from "../api";

import { EditProjectImage } from "../components";
import { Confirm } from "../common";

export default function Projects() {
  const [projectId, setProjectId] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [projectData, setProjectData] = useState(null);
  const [isImageEditing, setIsImageEditing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [file, setFile] = useState("");
  const [data, setData] = useState({
    project_name: "",
    description: "",
    link: "",
  });

  const getData = async () => {
    const res = await fetch(
      "http://localhost:5000/project/6450cb8a8eb415ba6bd72ae9"
    ).then((res) => res.json());
    setProjectData(res.data);
  };

  const handleEditClick = (id) => {
    const project = projectData.find((project) => project._id === id);
    setIsEditing(true);
    setModalData(project);
  };
  const handleDeleteClick = (id) => {
    const project = projectData.find((project) => project._id === id);
    setProjectId(id);
    setShowConfirm(true);
    setModalData(project);
  };

  const handleCloseModal = () => {
    setIsEditing(false);
  };

  const handleCloseImageModel = () => {
    setIsImageEditing(false);
  };

  const handleImageEditClick = (id) => {
    const project = projectData.find((project) => project._id === id);
    setIsImageEditing(true);
    setModalData(project);
  };

  const handleCreateProject = async () => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("project_name", data.project_name);
    formData.append("description", data.description);
    formData.append("link", data.link);
    const response = await createProjectRequest(formData);
    setData({
      project_name: "",
      description: "",
      link: "",
    });
    response?.status === 201 && getData();
  };

  const handleDeleteProject = async () => {
    const response = await deleteProjectRequest(projectId);
    response?.status === 204 && getData();
    setShowConfirm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("field", projectData?.field);
    formData.append("message", projectData?.message);
    formData.append("image", projectData?.image);
    formData.append("projectDescription", projectData?.projectDescription);
    formData.append("url", projectData?.url);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <h1 style={{ color: "white", textAlign: "center" }}>Projects</h1>
      <form method="post" onSubmit={handleSubmit}>
        <input
          type="file"
          name="image"
          id=""
          value=""
          onChange={(e) => setFile(e.target.files[0])}
          accept="image/jpg, image/jpeg, image/png"
        />
        <input
          type="text"
          name="project_name"
          id=""
          value={data.project_name}
          onChange={(e) => setData({ ...data, project_name: e.target.value })}
          placeholder="Project Name"
          required
        />
        <textarea
          name="description"
          id=""
          col="30"
          rows="5"
          value={data.description}
          onChange={(e) => setData({ ...data, description: e.target.value })}
          placeholder="Project Discription"
          required
        />
        <input
          type="url"
          name="link"
          value={data.link}
          onChange={(e) => setData({ ...data, link: e.target.value })}
          id=""
          placeholder="https//:"
          required
        />
        <button onClick={handleCreateProject}>SUBMIT</button>
      </form>
      <div className="table-responsive-lg table-responsive-md table-responsive-sm">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">PROJECT NAME</th>
              <th scope="col">DESCRIPTION</th>
              <th scope="col">LINK</th>
              <th scope="col">IMAGE</th>
              <th scope="col">EDIT</th>
              <th scope="col">DELETE</th>
            </tr>
          </thead>
          <tbody>
            {projectData &&
              projectData.map((i, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{i.project_name}</td>
                  <td>{i.description}</td>
                  <td>{i.link}</td>
                  <td
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      handleImageEditClick(i?._id);
                    }}
                  >
                    <img
                      alt="project"
                      style={{ width: "40px", height: "40px" }}
                      src={getImageRequest(i?.image)}
                    />
                  </td>
                  <td
                    style={{ cursor: "pointer" }}
                    className="edit_icon"
                    onClick={() => handleEditClick(i?._id)}
                  >
                    <MdEdit />
                  </td>
                  <td
                    className="delete_icon"
                    onClick={() => {
                      handleDeleteClick(i?._id);
                    }}
                  >
                    <MdDelete />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {isEditing && (
        <EditProject
          data={modalData}
          onClose={handleCloseModal}
          getData={getData}
        />
      )}
      {isImageEditing && (
        <EditProjectImage
          data={modalData}
          onClose={handleCloseImageModel}
          getData={getData}
        />
      )}
      {showConfirm && (
        <Confirm
          data={modalData}
          onClose={setShowConfirm}
          onConfirm={handleDeleteProject}
        />
      )}
    </div>
  );
}
