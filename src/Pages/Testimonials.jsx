import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import {
  createTestimonialRequest,
  deleteTestimonialRequest,
  getTestimonialRequest,
} from "../api";

export default function Testimonials() {
  const [testimonialData, setTestimonialData] = useState(null);
  const [file, setFile] = useState("");
  const [data, setData] = useState({
    client_name: "",
    review: "",
    stars: "",
    field: "",
    image: "",
  });

  const getData = async () => {
    const { data } = await getTestimonialRequest();
    setTestimonialData(data?.data);
  };

  const handleCreateTestimonial = async () => {
    const dataWithImage = { ...data, image: file.name };
    const response = await createTestimonialRequest(dataWithImage);
    setData({
      client_name: "",
      review: "",
      stars: "",
      field: "",
      image: "",
    });
    response.status && getData();
  };

  const handleDeleteTestimonial = async (t_id) => {
    const response = await deleteTestimonialRequest(t_id);
    response?.status === 204 && getData();
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
  }, []);

  return (
    <div>
      <h1 style={{ color: "white", textAlign: "center" }}>Testimonials</h1>
      <form method="post" onSubmit={handleSubmit}>
        <textarea
          name="review"
          id=""
          col="30"
          rows="5"
          value={data.review}
          onChange={(e) => setData({ ...data, review: e.target.value })}
          placeholder="Client Review"
          required
        />
        <input
          type="text"
          name="client_name"
          id=""
          value={data.client_name}
          onChange={(e) => setData({ ...data, client_name: e.target.value })}
          placeholder="Client Name"
          required
        />
        <input
          type="text"
          name="field"
          value={data.field}
          onChange={(e) => setData({ ...data, field: e.target.value })}
          id=""
          placeholder="Field"
          required
        />
        <select
          name="star"
          id=""
          value={data.stars}
          required
          onChange={(e) => setData({ ...data, stars: e.target.value })}
        >
          <option value="">Select Star...</option>
          <option value="1">1 Star</option>
          <option value="2">2 Stars</option>
          <option value="3">3 Stars</option>
          <option value="4">4 Stars</option>
          <option value="5">5 Stars</option>
        </select>
        <input
          type="file"
          name="image"
          id=""
          value=""
          onChange={(e) => setFile(e.target.files[0])}
          accept="image/jpg, image/jpeg, image/png"
        />
        <button onClick={handleCreateTestimonial}>SUBMIT</button>
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
              <th scope="col">DELETE</th>
            </tr>
          </thead>
          {testimonialData &&
            testimonialData.map((i, index) => (
              <tbody key={index}>
                <tr>
                  <th scope="row">{index + 1}</th>
                  <td>{i.client_name}</td>
                  <td>{i.field}</td>
                  <td>{i.stars}</td>
                  <td>{i.review}</td>
                  <td
                    className="delete_icon"
                    onClick={() => handleDeleteTestimonial(i?._id)}
                  >
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
