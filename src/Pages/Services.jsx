import { useState } from "react";
import { servicesData } from "../components/Navbar/Array";
import { MdDelete } from "react-icons/md";

export default function Services() {
  const [data, setData] = useState({ field: "", message: "" });
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
  };

  return (
    <div>
      <h1 style={{ color: "white", textAlign: "center" }}>SERVICES</h1>
      <form method="post" onSubmit={handleSubmit}>
        <select name="field" id="" required>
          <option value="">Select...</option>
          <option value={data.field}>ui/ux designer</option>
          <option value={data.field}>graphic designer</option>
          <option value={data.field}>web designer</option>
          <option value={data.field}>App Development</option>
          <option value={data.field}>Web Development</option>
        </select>
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
        <button>SUBMIT</button>
      </form>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">NAME</th>
            <th scope="col">DESCRIPTION</th>
          </tr>
        </thead>
        {servicesData.map((i,index)=>(
        <tbody>
          <tr>
            <th scope="row">{i.id}</th>
            <td>{i.field}</td>
            <td>{i.description}</td>
            <td style={{color:"red", cursor:"pointer"}}><MdDelete /></td>
          </tr>
        </tbody>
        ))}
      </table>
    </div>
  );
}
