import React, { useCallback, useEffect, useMemo, useState } from "react";
import { fetchProjects, removeProject, baseURL } from "../../api";
import { useNavigate } from "react-router-dom";
import "./AdminEntity.css";

export const ProjectDashboard = () => {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const fetchDev = useCallback(async () => {
    const users = await fetchProjects();
    setData(users || []);
  }, []);

  const handleEdit = (id) => navigate(`edit/${id}`);
  const onView = (id) => navigate(`view/${id}`);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project? This cannot be undone.")) return;
    await removeProject(id);
    await fetchDev();
  };

  useEffect(() => {
    fetchDev();
  }, [fetchDev]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter((p) => {
      const name = String(p?.projectName || "").toLowerCase();
      const client = String(p?.clientName || "").toLowerCase();
      const stack = String(p?.techStack || "").toLowerCase();
      const thumb = String(p?.thumbNail || "").toLowerCase();
      const layout = String(p?.detailLayout || "classic").toLowerCase();
      return (
        name.includes(q) ||
        client.includes(q) ||
        stack.includes(q) ||
        thumb.includes(q) ||
        layout.includes(q)
      );
    });
  }, [data, query]);

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2>Projects</h2>
        <div className="admin-header-actions">
          <button
            type="button"
            className="admin-btn-primary"
            onClick={() => navigate("/projects")}
          >
            + Add Project
          </button>
        </div>
      </div>

      <input
        className="admin-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name, client, stack, or layout…"
      />
      <p className="admin-meta">
        Showing {filtered.length} of {data.length} projects
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "0.85rem",
        }}
      >
        {filtered.map((p) => (
          <div key={p._id} className="admin-card" style={{ marginBottom: 0 }}>
            {p.hero ? (
              <div
                style={{
                  width: "100%",
                  height: 120,
                  borderRadius: 8,
                  marginBottom: "0.75rem",
                  backgroundImage: `url(${baseURL}/file/${p.hero})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  border: "1px solid #3a3a48",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: 80,
                  borderRadius: 8,
                  marginBottom: "0.75rem",
                  background: "#1a1a22",
                  border: "1px solid #3a3a48",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#666",
                  fontSize: "0.85rem",
                }}
              >
                No thumbnail
              </div>
            )}
            <h3 className="admin-card-title">
              {p.projectName}
              <span className="admin-layout-badge">
                {p.detailLayout === "showcase" ? "Showcase" : "Classic"}
              </span>
            </h3>
            <p className="admin-card-sub">
              {p.clientName || "—"} · {p.techStack || "No stack"}
            </p>
            <div className="admin-card-actions">
              <button
                type="button"
                className="admin-btn-primary"
                onClick={() => handleEdit(p._id)}
              >
                Edit
              </button>
              <button type="button" onClick={() => onView(p._id)}>
                View
              </button>
              <button type="button" onClick={() => handleDelete(p._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="admin-meta">No projects match your search.</p>
      )}
    </div>
  );
};
