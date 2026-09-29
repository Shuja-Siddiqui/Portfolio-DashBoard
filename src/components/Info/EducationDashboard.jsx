import React, { useCallback, useEffect, useMemo, useState } from "react";
import { fetchEducations, removeEducation } from "../../api";
import { useNavigate } from "react-router-dom";
import "./AdminEntity.css";

const formatSpan = (timeSpan) => {
  if (!timeSpan) return "—";
  const start = timeSpan.startYear || "?";
  const end = timeSpan.endYear || "?";
  return `${start} – ${end}`;
};

export const EducationDashboard = () => {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const load = useCallback(async () => {
    const res = await fetchEducations();
    setData(res?.data || []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this education? This cannot be undone.")) {
      return;
    }
    await removeEducation(id);
    await load();
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter((item) => {
      const institution = String(item?.institution || "").toLowerCase();
      const major = String(item?.major || "").toLowerCase();
      const description = String(item?.description || "").toLowerCase();
      return (
        institution.includes(q) ||
        major.includes(q) ||
        description.includes(q)
      );
    });
  }, [data, query]);

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2>Education</h2>
        <div className="admin-header-actions">
          <button
            type="button"
            className="admin-btn-primary"
            onClick={() => navigate("/education")}
          >
            + Add Education
          </button>
        </div>
      </div>

      <input
        className="admin-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by institution, major, or description…"
      />
      <p className="admin-meta">
        Showing {filtered.length} of {data.length} entries
      </p>

      <div className="admin-resume-grid">
        {filtered.map((item) => (
          <div key={item._id} className="admin-card" style={{ marginBottom: 0 }}>
            <h3 className="admin-card-title">
              {item.major || "Untitled major"}
            </h3>
            <p className="admin-card-sub">
              {item.institution || "—"} · {formatSpan(item.timeSpan)}
            </p>
            {item.description ? (
              <p className="admin-card-snippet">{item.description}</p>
            ) : null}
            <div className="admin-card-actions">
              <button
                type="button"
                className="admin-btn-primary"
                onClick={() => navigate(`/education/edit/${item._id}`)}
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => navigate(`/education/view/${item._id}`)}
              >
                View
              </button>
              <button type="button" onClick={() => handleDelete(item._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="admin-meta">No education entries match your search.</p>
      )}
    </div>
  );
};
