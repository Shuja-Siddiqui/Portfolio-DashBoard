import { useEffect, useMemo, useState } from "react";
import { Table } from "react-bootstrap";
import { FaEye, FaPen } from "react-icons/fa";
import { useNavigate } from "react-router";
import { fetchServices } from "../../api";
import { getServiceIcon } from "../../utils/serviceIcons";
import "../Info/AdminEntity.css";

export const ServicesDashboard = () => {
  const [formData, setFormData] = useState([]);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const getServices = async () => {
    const data = await fetchServices();
    if (data) setFormData(data);
  };

  useEffect(() => {
    getServices();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return formData;
    return formData.filter((s) => {
      const name = String(s?.name || "").toLowerCase();
      const desc = String(s?.description || "").toLowerCase();
      return name.includes(q) || desc.includes(q);
    });
  }, [formData, query]);

  return (
    <div className="admin-page container">
      <div className="admin-page-header">
        <h1>Services</h1>
        <div className="admin-header-actions">
          <button
            type="button"
            className="admin-btn-primary"
            onClick={() => navigate("/services")}
          >
            + Add Service
          </button>
        </div>
      </div>

      <input
        className="admin-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search services…"
      />
      <p className="admin-meta">
        Showing {filtered.length} of {formData.length} services
      </p>

      <Table striped bordered hover responsive>
        <thead>
          <tr className="border-0">
            <th className="border-0">Icon</th>
            <th className="border-0">Service Name</th>
            <th className="border-0">Description</th>
            <th className="border-0">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(({ name, description, icon, _id }) => {
            const Icon = getServiceIcon(icon);
            return (
              <tr className="text-white border-success-subtle" key={_id}>
                <td className="text-white border-success-subtle">
                  <Icon size={20} color="#069c7a" />
                </td>
                <td className="text-white border-success-subtle">{name}</td>
                <td className="text-white border-success-subtle">
                  {description?.length > 60
                    ? `${description.substring(0, 60)}...`
                    : description}
                </td>
                <td>
                  <div className="admin-card-actions">
                    <button
                      type="button"
                      className="border-0 p-0 m-0"
                      style={{ background: "transparent", width: "auto" }}
                      onClick={() => navigate(`/services/view/${_id}`)}
                      title="View"
                    >
                      <FaEye />
                    </button>
                    <button
                      type="button"
                      className="border-0 p-0 m-0"
                      style={{ background: "transparent", width: "auto" }}
                      onClick={() => navigate(`/services/edit/${_id}`)}
                      title="Edit"
                    >
                      <FaPen />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      {filtered.length === 0 && (
        <p className="admin-meta">No services match your search.</p>
      )}
    </div>
  );
};
