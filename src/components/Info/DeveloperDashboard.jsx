import React, { useCallback, useEffect, useMemo, useState } from "react";
import { getDevelopers, baseURL } from "../../api";
import { useNavigate } from "react-router-dom";
import { UserInfoCard } from "./UserInfoCard";
import "./AdminEntity.css";

export const DeveloperDashboard = () => {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const fetchDev = useCallback(async () => {
    const users = await getDevelopers();
    setData(users || []);
  }, []);

  useEffect(() => {
    fetchDev();
  }, [fetchDev]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter((d) => {
      const name = String(d?.name || "").toLowerCase();
      const id = String(d?.devId || "").toLowerCase();
      const skills = (d?.skills || [])
        .map((s) => s?.title?.skillName || "")
        .join(" ")
        .toLowerCase();
      return name.includes(q) || id.includes(q) || skills.includes(q);
    });
  }, [data, query]);

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2>Developers</h2>
        <div className="admin-header-actions">
          <button
            type="button"
            className="admin-btn-primary"
            onClick={() => navigate("/info")}
          >
            + Add Developer
          </button>
          <button type="button" onClick={() => navigate("/experienceDashboard")}>
            Experience
          </button>
          <button type="button" onClick={() => navigate("/educationDashboard")}>
            Education
          </button>
          <button type="button" onClick={() => navigate("/experience")}>
            + Experience
          </button>
          <button type="button" onClick={() => navigate("/education")}>
            + Education
          </button>
        </div>
      </div>

      <input
        className="admin-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name, ID, or skill…"
      />
      <p className="admin-meta">
        Showing {filtered.length} of {data.length} developers
      </p>

      <div>
        {filtered.map((dev) => (
          <UserInfoCard
            key={dev._id}
            name={dev.name}
            devId={dev.devId}
            skills={dev.skills}
            education={dev.education}
            experience={dev.experience}
            projects={dev.projects}
            avatar={dev.avatar}
            baseURL={baseURL}
            onEdit={() => navigate(`edit/${dev._id}`)}
            onView={() => navigate(`view/${dev._id}`)}
          />
        ))}
        {filtered.length === 0 && (
          <p className="admin-meta">No developers match your search.</p>
        )}
      </div>
    </div>
  );
};
