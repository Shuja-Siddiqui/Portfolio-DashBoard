import React, { useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import { UserInfoCard } from "./UserInfoCard";
import { fetchProjects, getDevelopers, removeProject } from "../../api";
import { useNavigate } from "react-router-dom";
import { ProjectInfoCard } from "./ProjectInfoCard";

export const ProjectDashboard = () => {
  const [data, setData] = useState();
  const navigate = useNavigate();
  
  // Fetch
  const fetchDev = async () => {
    const users = await fetchProjects();
    setData(users);
  };
  // Edit
  const handleEdit = (id) => {
    navigate(`edit/${id}`);
  };
  // View
  const onView = (id) => {
    navigate(`view/${id}`);
  };
  // Delete
  const handleDelete = async (id) => {
    await removeProject(id);
    await fetchDev();
  };

  const pureData = () => {
    return data?.map(({ projectName, clientName, techStack }) => ({
      projectName,
      clientName,
      techStack,
    }));
  };

  useEffect(() => {
    fetchDev();
  }, []);

  useEffect(() => {
    pureData();
  }, []);

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 className="text-white">Projects</h2>
        <button onClick={() => navigate("/projects")}>+Add Project</button>
      </div>
      <Row xs={1} md={2} className="g-4">
        {data &&
          data.map(({ projectName, clientName, techStack, _id }) => (
            <div key={_id} className="col">
              <ProjectInfoCard
                projectName={projectName}
                clientName={clientName}
                techStack={techStack}
                onEdit={() => handleEdit(_id)}
                onView={() => onView(_id)}
                onRemove={() => handleDelete(_id)}
                id={_id}
              />
            </div>
          ))}
      </Row>
    </div>
  );
};
