import React, { useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import { fetchVideos, removeVideo } from "../../api";
import { useNavigate } from "react-router-dom";
import { VideoInfoCard } from "./VideoInfoCard";

export const VideosDashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch
  const fetchVids = async () => {
    try {
      setLoading(true);
      const videos = await fetchVideos();
      setData(videos || []);
    } catch (error) {
      console.error("Error fetching videos:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Edit
  const handleEdit = (id) => {
    navigate(`/videos/edit/${id}`);
  };

  // Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      try {
        await removeVideo(id);
        await fetchVids();
      } catch (error) {
        console.error("Error deleting video:", error);
        alert("Failed to delete video. Please try again.");
      }
    }
  };

  useEffect(() => {
    fetchVids();
  }, []);

  return (
    <div style={{ width: "100%", padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2 className="text-white">Videos</h2>
        <button onClick={() => navigate("/videos")}>+Add Video</button>
      </div>
      
      {loading ? (
        <div className="text-white">Loading videos...</div>
      ) : data && data.length > 0 ? (
        <Row xs={1} md={2} className="g-4">
          {data.map(({ title, link, developerID, projectID, _id }) => (
            <div key={_id} className="col">
              <VideoInfoCard
                title={title}
                link={link}
                developerID={developerID}
                projectID={projectID}
                onEdit={() => handleEdit(_id)}
                onRemove={() => handleDelete(_id)}
                id={_id}
              />
            </div>
          ))}
        </Row>
      ) : (
        <div className="text-white">No videos found. Click "+Add Video" to create one.</div>
      )}
    </div>
  );
};
