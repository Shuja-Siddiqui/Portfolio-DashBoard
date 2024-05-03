import { useEffect, useState } from "react";
import { baseURL, fetchTestimonials } from "../api";
import { Table } from "react-bootstrap";
import { FaEye, FaPen } from "react-icons/fa";
import { useNavigate } from "react-router";

export const TestimonialsDashboard = () => {
  const [heroToShow, setHeroToShow] = useState("");
  const [formData, setFormData] = useState([]);
  const navigate = useNavigate();

  const getTestimonials = async () => {
    const data = await fetchTestimonials();
    if (data) {
      setFormData(data);
    }
  };

  useEffect(() => {
    getTestimonials();
  }, []);

  return (
    <div className="container">
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <h1 style={{ color: "white", textAlign: "center" }}>Testimonials</h1>
        <button onClick={() => navigate("/testimonials")}>
          +Add Testimonial
        </button>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr className="border-0">
            <th className="border-0">Client Name</th>
            <th className="border-0">Client Designation</th>
            <th className="border-0">Client Review</th>
            <th className="border-0">Stars</th>
            <th className="border-0">Image</th>
            <th className="border-0 text-center">Actions</th>
          </tr>
        </thead>
        <tbody style={{ width: "100%" }}>
          {formData?.map(
            ({ clientName,clientDesignation, clientReview, stars, index, _id, clientImage }) => (
              <tr
                className="text-white border-success-subtle  "
                key={index}
                style={{ width: "100%" }}
              >
                <td
                  className="text-white border-success-subtle"
                  style={{ width: "10%" }}
                >
                  {clientName}
                </td>
                <td
                  className="text-white border-success-subtle"
                  style={{ width: "10%" }}
                >
                  {clientDesignation}
                </td>
                <td
                  className="text-white border-success-subtle"
                  style={{ width: "40%" }}
                >
                  {clientReview.length > 20
                    ? clientReview.substring(0, 20) + "..."
                    : clientReview}
                </td>
                <td
                  className="text-white border-success-subtle"
                  style={{ width: "10%" }}
                >
                  {stars}
                </td>
                <td style={{ width: "20%" }}>
                  <div
                    style={{
                      backgroundImage: `url(${baseURL}/file/${clientImage})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      width: "100%",
                      height: "100px",
                      border: "2px solid #aaa",
                    }}
                  ></div>
                </td>
                <td className="border-success-subtle">
                  <div style={{ display: "flex", width: "auto" }}>
                    <button
                      className="border-0 p-0 m-0"
                      style={{ width: "100%", background: "transparent" }}
                      onClick={() => navigate(`/testimonials/view/${_id}`)}
                    >
                      <FaEye />
                    </button>
                    <button
                      className="border-0 p-0 m-0"
                      style={{ width: "100%", background: "transparent" }}
                      onClick={() => navigate(`/testimonials/edit/${_id}`)}
                    >
                      <FaPen />
                    </button>
                  </div>
                </td>
              </tr>
            )
          )}
        </tbody>
      </Table>
    </div>
  );
};
