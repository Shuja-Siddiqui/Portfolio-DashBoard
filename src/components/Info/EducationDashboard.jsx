import React, { useCallback, useEffect, useMemo, useState } from "react";
import { getDevelopers, removeEducation } from "../../api";
import { useNavigate } from "react-router-dom";
import "./AdminEntity.css";

const formatSpan = (timeSpan) => {
  if (!timeSpan) return "—";
  return `${timeSpan.startYear || "?"} – ${timeSpan.endYear || "?"}`;
};

const sortEducation = (list = []) =>
  [...list].sort((a, b) => {
    const endA = parseInt(a?.timeSpan?.endYear, 10) || 0;
    const endB = parseInt(b?.timeSpan?.endYear, 10) || 0;
    if (endA !== endB) return endB - endA;
    return (b?.timeSpan?.startYear || 0) - (a?.timeSpan?.startYear || 0);
  });

export const EducationDashboard = () => {
  const [developers, setDevelopers] = useState([]);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const load = useCallback(async () => {
    const users = await getDevelopers();
    setDevelopers(users || []);
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

  const visibleGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (developers || [])
      .map((dev) => {
        const items = sortEducation(
          (dev.education || []).filter((item) => item && item._id)
        ).filter((item) => {
          if (!q) return true;
          const hay = [
            item.institution,
            item.major,
            item.description,
            dev.name,
            dev.devId,
          ]
            .map((v) => String(v || "").toLowerCase())
            .join(" ");
          return hay.includes(q);
        });
        return { dev, items };
      })
      .filter((g) => g.items.length > 0);
  }, [developers, query]);

  const totalEntries = visibleGroups.reduce(
    (sum, g) => sum + g.items.length,
    0
  );

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
        placeholder="Search by developer, institution, major…"
      />
      <p className="admin-meta">
        {totalEntries} entr{totalEntries === 1 ? "y" : "ies"} across{" "}
        {visibleGroups.length} developer
        {visibleGroups.length === 1 ? "" : "s"}
      </p>

      {visibleGroups.map(({ dev, items }) => (
        <section key={dev._id} className="admin-dev-group">
          <header className="admin-dev-group-head">
            <div>
              <h3 className="admin-dev-group-title">{dev.name || "Untitled"}</h3>
              <p className="admin-dev-group-sub">
                Dev ID: {dev.devId || "—"} · {items.length} education
                {items.length === 1 ? "" : "s"}
              </p>
            </div>
            <div className="admin-header-actions">
              <button
                type="button"
                onClick={() => navigate(`/developers/edit/${dev._id}`)}
              >
                Edit developer
              </button>
              <button
                type="button"
                className="admin-btn-primary"
                onClick={() => navigate(`/education?devId=${dev._id}`)}
              >
                + Add for this dev
              </button>
            </div>
          </header>

          <ul className="admin-timeline">
            {items.map((item) => (
              <li key={item._id} className="admin-timeline-item">
                <div className="admin-timeline-meta">
                  <h6 className="admin-timeline-company">
                    {item.institution || "—"}
                  </h6>
                  <p className="admin-timeline-years">
                    {formatSpan(item.timeSpan)}
                  </p>
                  <span className="admin-timeline-dot" aria-hidden="true" />
                </div>
                <div className="admin-timeline-body">
                  <h4 className="admin-timeline-role">
                    {item.major || "Untitled major"}
                  </h4>
                  {item.description ? (
                    <p className="admin-timeline-desc">{item.description}</p>
                  ) : null}
                  <div className="admin-card-actions">
                    <button
                      type="button"
                      className="admin-btn-primary"
                      onClick={() =>
                        navigate(
                          `/education/edit/${item._id}?devId=${dev._id}`
                        )
                      }
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="admin-btn-danger"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {visibleGroups.length === 0 && (
        <p className="admin-meta">
          No education entries found. Add one or clear your search.
        </p>
      )}
    </div>
  );
};
