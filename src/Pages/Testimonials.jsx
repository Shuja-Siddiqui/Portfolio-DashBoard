import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";

export default function Testimonials() {
  const [testimonialData, setTestimonialData] = useState(null);

  const getData = async () => {
    const res = await fetch(
      "http://localhost:5000/testimonial/6450cb8a8eb415ba6bd72ae9"
    ).then((res) => res.json());
    setTestimonialData(res.data);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("field", testimonialData?.field);
    formData.append("message", testimonialData?.message);
    formData.append("image", testimonialData?.image);
    formData.append("name", testimonialData?.url);
  };

  useEffect(() => {
    getData();
  },[])

  return (
    <div>
      <h1 style={{ color: "white", textAlign: "center" }}>Testimonials</h1>
      <form method="post" onSubmit={handleSubmit}>
        <textarea
          name="message"
          id=""
          col="30"
          rows="5"
          placeholder="Client Review"
          required
        />
        <input
          type="text"
          name="name"
          id=""
          placeholder="Client Name"
          required
        />
        <input
          type="text"
          name="field"
          id=""
          placeholder="Field"
          required
        />
        <select name="star" id="" required>
          <option value="">Select Star...</option>
          <option value="1 Star">1 Star</option>
          <option value="2 Star">2 Stars</option>
          <option value="3 Star">3 Stars</option>
          <option value="4 Star">4 Stars</option>
          <option value="5 Star">5 Stars</option>
        </select>
        <input
          type="file"
          name="image"
          id=""
          accept="image/jpg, image/jpeg, image/png"
          required
        />
        <button>SUBMIT</button>
      </form>
      <div className="table-responsive-lg table-responsive-md table-responsive-sm">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Client NAME</th>
              <th scope="col">FIELD</th>
              <th scope="col">STARS</th>
              <th scope="col">REVIEW</th>
            </tr>
          </thead>
          {testimonialData && testimonialData.map((i, index) => (
            <tbody>
              <tr>
                <th scope="row">{index + 1}</th>
                <td>{i.client_name}</td>
                <td>{i.field}</td>
                <td>{i.stars}</td>
                <td>{i.review}</td>
                <td className="delete_icon">
                  <MdDelete />
                </td>
              </tr>
            </tbody>
          ))}
        </table>
      </div>
    </div>
  );
}
