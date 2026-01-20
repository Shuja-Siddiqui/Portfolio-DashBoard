import { useEffect, useState, useCallback } from "react";
import {
  createVideo,
  updateVideo,
  fetchVideo,
  fetchAllDevelopers,
  fetchProjects,
} from "../api";
import { Toaster } from "../common";
import { Button } from "react-bootstrap";
import { useParams, useNavigate, useLocation } from "react-router-dom";

export default function Videos() {
  const [isLoading, setIsLoading] = useState(false);
  const [showToaster, setShowToaster] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [developers, setDevelopers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    link: "",
    developerID: "",
    projectID: "",
  });
  const [view, setView] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.split("/")[2] === "view") {
      setView(true);
    }
  }, [location]);

  const params = useParams();
  const navigate = useNavigate();

  // Fetch developers and projects
  const fetchData = async () => {
    const devs = await fetchAllDevelopers();
    const projs = await fetchProjects();
    setDevelopers(devs?.data || []);
    setProjects(projs || []);
  };

  // Fetch video
  const getVideo = useCallback(async () => {
    const res = await fetchVideo(params?.id);
    if (res) {
      setFormData({
        title: res.title || "",
        link: res.link || "",
        developerID: res.developerID?._id || "",
        projectID: res.projectID?._id || "",
      });
    }
  }, [params?.id]);

  useEffect(() => {
    fetchData();
    if (params?.id) {
      getVideo();
    }
  }, [params?.id, getVideo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        title: formData.title,
        link: formData.link,
        developerID: formData.developerID || null,
        projectID: formData.projectID || null,
      };

      if (params?.id) {
        // Update
        const response = await updateVideo(payload, params.id);
        if (response?.status === 200) {
          setToasterMessage("Video updated successfully!");
          setShowToaster(true);
          setTimeout(() => {
            navigate("/videosDashboard");
          }, 1500);
        }
      } else {
        // Create
        const response = await createVideo(payload);
        if (response?.status === 200) {
          setToasterMessage("Video created successfully!");
          setShowToaster(true);
          setTimeout(() => {
            navigate("/videosDashboard");
          }, 1500);
        }
      }
    } catch (error) {
      setToasterMessage("Error: " + (error?.message || "Something went wrong"));
      setShowToaster(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {showToaster && (
        <Toaster
          text={toasterMessage}
          showToaster={showToaster}
          setShowToaster={setShowToaster}
        />
      )}
      <h1 style={{ color: "white", textAlign: "center" }}>Videos</h1>
      <form method="post" onSubmit={handleSubmit}>
        <fieldset disabled={view ? "disabled" : ""}>
          <label htmlFor="title" className="text-white">
            Title: *
          </label>
          <input
            type="text"
            name="title"
            value={formData?.title}
            onChange={handleChange}
            placeholder="Video Title"
            required
          />

          <label htmlFor="link" className="text-white">
            Link: *
          </label>
          <input
            type="url"
            name="link"
            value={formData?.link}
            onChange={handleChange}
            placeholder="Video URL (e.g., https://youtube.com/watch?v=...)"
            required
          />

          <label htmlFor="developerID" className="text-white">
            Developer (Optional):
          </label>
          <select
            name="developerID"
            value={formData?.developerID}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              backgroundColor: "#2C2C36",
              color: "white",
              border: "1px solid #555",
            }}
          >
            <option value="">-- Select Developer (Optional) --</option>
            {developers.map((dev) => (
              <option key={dev._id} value={dev._id}>
                {dev.name} ({dev.devId})
              </option>
            ))}
          </select>

          <label htmlFor="projectID" className="text-white">
            Project (Optional):
          </label>
          <select
            name="projectID"
            value={formData?.projectID}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              backgroundColor: "#2C2C36",
              color: "white",
              border: "1px solid #555",
            }}
          >
            <option value="">-- Select Project (Optional) --</option>
            {projects.map((proj) => (
              <option key={proj._id} value={proj._id}>
                {proj.projectName} ({proj.clientName})
              </option>
            ))}
          </select>

          {!view && (
            <Button
              type="submit"
              disabled={isLoading}
              style={{
                marginTop: "20px",
                width: "100%",
                padding: "12px",
                backgroundColor: "#667eea",
                border: "none",
                borderRadius: "6px",
                color: "white",
                fontWeight: "600",
                cursor: isLoading ? "not-allowed" : "pointer",
              }}
            >
              {isLoading
                ? "Processing..."
                : params?.id
                ? "Update Video"
                : "Create Video"}
            </Button>
          )}

          {view && (
            <Button
              type="button"
              onClick={() => navigate("/videosDashboard")}
              style={{
                marginTop: "20px",
                width: "100%",
                padding: "12px",
                backgroundColor: "#6c757d",
                border: "none",
                borderRadius: "6px",
                color: "white",
                fontWeight: "600",
              }}
            >
              Back to Videos
            </Button>
          )}
        </fieldset>
      </form>
    </div>
  );
}
