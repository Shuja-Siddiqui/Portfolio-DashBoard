import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { createProjectRequest, deleteProjectRequest } from "../api";

export default function Projects() {
  const [projectData, setProjectData] = useState(null);
  const [file, setFile] = useState("");
  const [data, setData] = useState({
    project_name: "",
    description: "",
    link: "",
    image: "",
  });

  const getData = async () => {
    const res = await fetch(
      "http://localhost:5000/project/6450cb8a8eb415ba6bd72ae9"
    ).then((res) => res.json());
    setProjectData(res.data);
  };

  const handleCreateProject = async () => {
    const dataWithImage = { ...data, image: file.name };
    const response = await createProjectRequest(dataWithImage);
    setData({
      project_name: "",
      description: "",
      link: "",
      image: "",
    });
    response?.status === 201 && getData();
  };

  const handleDeleteProject = async (p_id) => {
    const response = await deleteProjectRequest(p_id);
    response?.status === 204 && getData();
    console.log("response for delete project request is", response);
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
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {projectData &&
              projectData.map((i, index) => (
                <tr>
                  <th scope="row">{index + 1}</th>
                  <td>{i.project_name}</td>
                  <td>{i.description}</td>
                  <td>{i.link}</td>
                  <td
                    className="delete_icon"
                    onClick={() => handleDeleteProject(i?._id)}
                  >
                    <MdDelete />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
