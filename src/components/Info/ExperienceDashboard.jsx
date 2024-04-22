import React, { useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import { fetchExperiences } from "../../api";
import { useNavigate } from "react-router-dom";
import { ExperienceInfoCard } from "./ExperienceInfoCard";

export const ExperienceDashboard = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const fetchExperience = async () => {
    const users = await fetchExperiences();
    setData(users.data);
  };

  useEffect(() => {
    fetchExperience();
  }, []);

  const handleEdit = (id) => {
    navigate(`edit/${id}`);
  };

  const onView = (id) => {
    navigate(`view/${id}`);
  };

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 className="text-white">Educations</h2>
        <button onClick={() => navigate("/education")}>+Add Education</button>
      </div>
      {console.log("data.length", data.length)}
      <Row xs={1} md={2} className="g-4">
        {data &&
          data.map(({ description, company, role, _id }) => (
            <div key={_id} className="col">
              <ExperienceInfoCard
                description={description}
                company={company}
                role={role}
                onEdit={() => handleEdit(_id)}
                onView={() => onView(_id)}
                id={_id}
              />
            </div>
          ))}
      </Row>
    </div>
  );
};
