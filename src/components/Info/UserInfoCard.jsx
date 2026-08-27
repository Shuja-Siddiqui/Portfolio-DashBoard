import React from "react";
import "./AdminEntity.css";

export const UserInfoCard = ({
  name,
  skills = [],
  devId,
  onEdit,
  onView,
  education = [],
  experience = [],
  projects = [],
  avatar,
  baseURL,
}) => {
  const skillChips = (skills || [])
    .map((s) => ({
      name: s?.title?.skillName || s?.skillName || "",
      featured: Boolean(s?.featured || (s?.typedOrder >= 1 && s?.typedOrder <= 5)),
      order: s?.typedOrder || null,
    }))
    .filter((s) => s.name)
    .sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return (a.order || 99) - (b.order || 99);
    })
    .slice(0, 6);

  const moreSkills = Math.max((skills || []).length - skillChips.length, 0);

  return (
    <div className="admin-card">
      <div style={{ display: "flex", gap: "0.85rem", alignItems: "flex-start" }}>
        {avatar ? (
          <img
            src={`${baseURL}/file/${avatar}`}
            alt=""
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid #3a3a48",
              flexShrink: 0,
            }}
          />
        ) : (
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: "#1a1a22",
              border: "2px solid #3a3a48",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#01be96",
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {(name || "?").charAt(0)}
          </div>
        )}
        <div style={{ minWidth: 0, flex: 1 }}>
          <h3 className="admin-card-title">{name || "Untitled developer"}</h3>
          <p className="admin-card-sub">ID: {devId || "—"}</p>
        </div>
      </div>

      <div className="admin-chip-row">
        {skillChips.map((s) => (
          <span
            key={`${s.name}-${s.order}`}
            className={`admin-chip ${s.featured ? "is-featured" : ""}`}
          >
            {s.featured && s.order ? `#${s.order} ` : ""}
            {s.name}
          </span>
        ))}
        {moreSkills > 0 && (
          <span className="admin-chip">+{moreSkills} more</span>
        )}
        {!skillChips.length && (
          <span className="admin-chip">No skills linked</span>
        )}
      </div>

      <div className="admin-counts">
        <span className="admin-count">{education?.length || 0} education</span>
        <span className="admin-count">{experience?.length || 0} experience</span>
        <span className="admin-count">{projects?.length || 0} projects</span>
        <span className="admin-count">{skills?.length || 0} skills</span>
      </div>

      <div className="admin-card-actions">
        <button type="button" className="admin-btn-primary" onClick={onEdit}>
          Edit
        </button>
        <button type="button" onClick={onView}>
          View
        </button>
      </div>
    </div>
  );
};
