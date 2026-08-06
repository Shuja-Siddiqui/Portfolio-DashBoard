import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { FaEye, FaPen } from "react-icons/fa";
import { useNavigate } from "react-router";
import { fetchServices } from "../../api";
import { getServiceIcon } from "../../utils/serviceIcons";

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
        <h1 style={{ color: "white", textAlign: "center" }}>Services</h1>
        <button onClick={() => navigate("/services")}>+Add Service</button>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr className="border-0">
            <th className="border-0">Icon</th>
            <th className="border-0 w-60">Service Name</th>
            <th className="border-0">Service Description</th>
            <th className="border-0">Actions </th>
          </tr>
        </thead>
        <tbody style={{ width: "100%" }}>
          {formData?.map(({ name, description, icon, _id }) => {
            const Icon = getServiceIcon(icon);
            return (
              <tr
                className="text-white border-success-subtle"
                key={_id}
                style={{ width: "100%" }}
              >
                <td className="text-white border-success-subtle">
                  <Icon size={20} color="#069c7a" />
                </td>
                <td
                  className="text-white border-success-subtle"
                  style={{ width: "10%" }}
                >
                  {name}
                </td>
                <td
                  className="text-white border-success-subtle"
                  style={{ width: "40%" }}
                >
                  {description?.length > 40
                    ? description.substring(0, 40) + "..."
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
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};
