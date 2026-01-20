import React, { useCallback, useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import { fetchEducations } from "../../api";
import { useNavigate } from "react-router-dom";
import { EducationInfoCard } from "./EducationInfoCard";

export const EducationDashboard = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const fetchEducation = useCallback(async () => {
    const users = await fetchEducations();
    setData(users.data);
  }, []);

  useEffect(() => {
    fetchEducation();
  }, [fetchEducation]);

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
      <Row xs={1} md={2} className="g-4">
        {data &&
          data.map(({ description, institution, major, _id }) => (
            <div key={_id} className="col">
              <EducationInfoCard
                description={description}
                institution={institution}
                major={major}
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
