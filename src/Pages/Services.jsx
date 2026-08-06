import React, { useState, useEffect } from "react";
import { addService, fetchService, updateService } from "../api";
import { useLocation, useNavigate, useParams } from "react-router";
import { SERVICE_ICON_OPTIONS, getServiceIcon } from "../utils/serviceIcons";

export default function Services() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "code",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState(false);
  const [id, setId] = useState("");
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const SelectedIcon = getServiceIcon(formData.icon);

  useEffect(() => {
    if (params?.id) setId(params.id);
    else setId("");

    setView(location.pathname.split("/")[2] === "view");
  }, [params?.id, location.pathname]);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const service = await fetchService(id);
      if (service) {
        setFormData({
          name: service.name || "",
          description: service.description || "",
          icon: service.icon || "code",
        });
      }
    })();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let res;
      if (!id) {
        res = await addService(formData);
      } else {
        res = await updateService(id, formData);
      }
      if (res) {
        navigate("/servicesDashboard");
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const handleDescriptionChange = (e) => {
    const text = e.target.value;
    const wordLimit = 60;
    const words = text.trim().split(/\s+/).filter(Boolean);
    if (words.length <= wordLimit || text.length < formData.description.length) {
      setFormData({ ...formData, description: text });
    }
  };

  return (
    <div>
      <h1 style={{ color: "white", textAlign: "center" }}>
        {id ? "Edit Service" : "Add Service"}
      </h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Name (e.g. RAG Knowledge Assistants)"
          required
          readOnly={view}
          className="mb-3"
        />

        <label className="text-white mb-2 d-block">Service Icon</label>
        <div
          className="mb-3 d-flex align-items-center gap-3"
          style={{ width: "100%" }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "#212223",
              border: "1px solid #069c7a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#069c7a",
              flexShrink: 0,
            }}
          >
            <SelectedIcon size={24} />
          </div>
          <select
            name="icon"
            value={formData.icon || "code"}
            disabled={view}
            onChange={(e) =>
              setFormData({ ...formData, icon: e.target.value })
            }
            style={{ width: "100%", padding: "0.65rem", borderRadius: 8 }}
          >
            {SERVICE_ICON_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div
          className="mb-3"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
            gap: "0.5rem",
            width: "100%",
          }}
        >
          {SERVICE_ICON_OPTIONS.map(({ value, label, Icon }) => (
            <button
              key={value}
              type="button"
              disabled={view}
              onClick={() => setFormData({ ...formData, icon: value })}
              title={label}
              style={{
                background:
                  formData.icon === value ? "rgba(6,156,122,0.25)" : "#212223",
                border:
                  formData.icon === value
                    ? "1px solid #069c7a"
                    : "1px solid #333",
                color: "#fff",
                borderRadius: 10,
                padding: "0.55rem 0.35rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                cursor: view ? "default" : "pointer",
              }}
            >
              <Icon size={18} color="#069c7a" />
              <span style={{ fontSize: 10, lineHeight: 1.2 }}>{label}</span>
            </button>
          ))}
        </div>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleDescriptionChange}
          cols="30"
          rows="5"
          placeholder="Short outcome + what client gets (keep it scannable)"
          required
          readOnly={view}
          className="mb-3"
        />

        {location.pathname.split("/")[2] === "view" ? null : (
          <button type="submit" disabled={isLoading}>
            {isLoading
              ? "Loading..."
              : location.pathname.split("/")[2] === "edit"
              ? "UPDATE"
              : "SUBMIT"}
          </button>
        )}
      </form>
    </div>
  );
}
