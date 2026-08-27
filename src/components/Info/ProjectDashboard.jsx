import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Row } from "react-bootstrap";
import { fetchProjects, removeProject } from "../../api";
import { useNavigate } from "react-router-dom";
import { ProjectInfoCard } from "./ProjectInfoCard";

export const ProjectDashboard = () => {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const fetchDev = useCallback(async () => {
    const users = await fetchProjects();
    setData(users || []);
  }, []);

  const handleEdit = (id) => {
    navigate(`edit/${id}`);
  };

  const onView = (id) => {
    navigate(`view/${id}`);
  };

  const handleDelete = async (id) => {
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
    <div style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          flexWrap: "wrap",
          marginBottom: "1rem",
        }}
      >
        <h2 className="text-white" style={{ margin: 0 }}>
          Projects
        </h2>
        <button type="button" onClick={() => navigate("/projects")}>
          + Add Project
        </button>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, client, tech stack, or layout…"
          style={{
            width: "100%",
            maxWidth: "420px",
            padding: "0.65rem 0.85rem",
            borderRadius: "8px",
            border: "1px solid #444",
            background: "#1a1a22",
            color: "#fff",
          }}
        />
        <p style={{ color: "#9a9a9a", fontSize: "0.85rem", marginTop: "0.4rem" }}>
          Showing {filtered.length} of {data.length} projects
        </p>
      </div>

      <Row xs={1} md={2} className="g-4">
        {filtered.map(({ projectName, clientName, techStack, _id, detailLayout }) => (
          <div key={_id} className="col">
            <ProjectInfoCard
              projectName={projectName}
              clientName={clientName}
              techStack={
                detailLayout === "showcase"
                  ? `${techStack || ""} · Showcase`
                  : techStack
              }
              onEdit={() => handleEdit(_id)}
              onView={() => onView(_id)}
              onRemove={() => handleDelete(_id)}
              id={_id}
            />
          </div>
        ))}
      </Row>

      {filtered.length === 0 && (
        <p style={{ color: "#aaa", marginTop: "1.5rem" }}>
          No projects match your search.
        </p>
      )}
    </div>
  );
};
