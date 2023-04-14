import { useState } from "react";
import { testimonialsData } from "../components/Navbar/Array";

export default function Testimonials() {
  const [data, setData] = useState({
    field: "",
    message: "",
    name: "",
    image: "",
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
    formData.append("name", data.url);
  };

  return (
    <div>
      <h1 style={{ color: "white", textAlign: "center" }}>Testimonials</h1>
      <form method="post" onSubmit={handleSubmit}>
        <textarea
          name="message"
          id=""
          onChange={handleChange}
          value={data.message}
          col="30"
          rows="5"
          placeholder="Client Review"
          required
        />
        <input
          type="text"
          name="name"
          id=""
          onChange={handleChange}
          value={data.name}
          placeholder="Client Name"
          required
        />
        <input
          type="text"
          name="field"
          id=""
          onChange={handleChange}
          value={data.field}
          placeholder="Field"
          required
        />
        <select name="star" id="" required>
          <option value="">Select Star...</option>
          <option value={data.star}>1 Star</option>
          <option value={data.star}>2 Stars</option>
          <option value={data.star}>3 Stars</option>
          <option value={data.star}>4 Stars</option>
          <option value={data.star}>5 Stars</option>
        </select>
        <input
          type="file"
          name="image"
          id=""
          accept="image/jpg, image/jpeg, image/png"
          onChange={handleChange}
          required
        />
        <button>SUBMIT</button>
      </form>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Client NAME</th>
            <th scope="col">FIELD</th>
            <th scope="col">STARS</th>
            <th scope="col">REVIEW</th>
          </tr>
        </thead>
      {testimonialsData.map((i,index)=> (
        <tbody>
          <tr>
            <th scope="row">{i.id}</th>
            <td>{i.name}</td>
            <td>{i.field}</td>
            <td>{i.stars}</td>
            <td>{i.review}</td>
          </tr>
        </tbody>
        ))}
      </table>
    </div>
  );
}
