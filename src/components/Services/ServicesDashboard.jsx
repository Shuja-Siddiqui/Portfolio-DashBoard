import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { FaEye, FaPen } from "react-icons/fa";
import { useNavigate } from "react-router";
import { fetchServices } from "../../api";

export const ServicesDashboard = () => {
  const [formData, setFormData] = useState([]);
  const navigate = useNavigate();

  const getServices = async () => {
    const data = await fetchServices();
    if (data) {
      setFormData(data);
    }
  };

  useEffect(() => {
    getServices();
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
        <button onClick={() => navigate("/services")}>+Add Service</button>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr className="border-0">
            <th className="border-0 w-60">Service Name</th>
            <th className="border-0">Service Description</th>
            <th className="border-0">Actions </th>
          </tr>
        </thead>
        <tbody style={{ width: "100%" }}>
          {formData?.map(({ name, description, _id, index }) => (
            <tr
              className="text-white border-success-subtle"
              key={index}
              style={{ width: "100%" }}
            >
              <td className="text-white border-success-subtle" style={{ width: "10%" }}>
                {name}
              </td>
              <td className="text-white border-success-subtle" style={{ width: "40%" }}>
                {description.length > 20
                  ? description.substring(0, 20) + "..."
                  : description}
              </td>

              <td
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <button
                  className="border-0 p-0 m-0"
                  style={{ background: "transparent" }}
                  onClick={() => navigate(`/services/view/${_id}`)}
                >
                  <FaEye />
                </button>
                <button
                  className="border-0 p-0 m-0"
                  style={{ background: "transparent" }}
                  onClick={() => navigate(`/services/edit/${_id}`)}
                >
                  <FaPen />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};
