import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";

export default function Projects() {
  const [projectData, setProjectData] = useState(null);

  const getData = async () => {
    const res = await fetch(
      "http://localhost:5000/project/6450cb8a8eb415ba6bd72ae9"
    ).then((res) => res.json());
    setProjectData(res.data);
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

  useEffect(()=>{
    getData();
  },[])

  return (
    <div>
      <h1 style={{ color: "white", textAlign: "center" }}>Projects</h1>
      <form method="post" onSubmit={handleSubmit}>
        <textarea
          name="message"
          id=""
          col="30"
          rows="5"
          placeholder="Discription"
          required
        />
        <input
          type="file"
          name="image"
          id=""
          accept="image/jpg, image/jpeg, image/png"
          required
        />
        <input
          type="text"
          name="name"
          id=""
          placeholder="Project Name"
          required
        />
        <textarea
          name="projectDescription"
          id=""
          col="30"
          rows="5"
          placeholder="Project Discription"
          required
        />
        <input
          type="url"
          name="url"
          id=""
          placeholder="https//:"
          required
        />
        <button>SUBMIT</button>
      </form>
      <div className="table-responsive-lg table-responsive-md table-responsive-sm">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">PROJECT NAME</th>
              <th scope="col">DESCRIPTION</th>
              <th scope="col">LINK</th>
            </tr>
          </thead>
          <tbody>
            {projectData && projectData.map((i, index) => (
              <tr>
                <th scope="row">{index + 1}</th>
                <td>{i.project_name}</td>
                <td>{i.description}</td>
                <td>{i.link}</td>
                <td className="delete_icon">
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
