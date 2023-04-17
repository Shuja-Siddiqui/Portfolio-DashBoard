import { useState } from "react";
import { projectData } from "../components/Navbar/Array";
import { MdDelete } from "react-icons/md";


export default function Projects() {
  const [data, setData] = useState({
    field: "",
    message: "",
    image: "",
    url: "",
    projectDescription: "",
  });
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("field", data.field);
    formData.append("message", data.message);
    formData.append("image", data.image);
    formData.append("projectDescription", data.projectDescription);
    formData.append("url", data.url);
  };

  return (
    <div>
      <h1 style={{ color: "white", textAlign: "center" }}>Projects</h1>
      <form method="post" onSubmit={handleSubmit}>
        <textarea
          name="message"
          id=""
          onChange={handleChange}
          value={data.message}
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
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="name"
          id=""
          onChange={handleChange}
          value={data.name}
          placeholder="Project Name"
          required
        />
        <textarea
          name="projectDescription"
          id=""
          onChange={handleChange}
          value={data.projectDescription}
          col="30"
          rows="5"
          placeholder="Project Discription"
          required
        />
        <input
          type="url"
          name="url"
          id=""
          onChange={handleChange}
          value={data.url}
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
            {projectData.map((i, index) => (
              <tbody>
                <tr>
                  <th scope="row">{i.id}</th>
                  <td>{i.p_name}</td>
                  <td>{i.description}</td>
                  <td>{i.link}</td>
                  <td style={{color:"red", cursor:"pointer"}}><MdDelete /></td>
                </tr>
              </tbody>
            ))}
          </table>
          </div>
    </div>
  );
}
