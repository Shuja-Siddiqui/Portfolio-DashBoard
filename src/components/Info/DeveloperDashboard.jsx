import React, { useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import { UserInfoCard } from "./UserInfoCard";
import { getDevelopers } from "../../api";
import { useNavigate } from "react-router-dom";

export const DeveloperDashboard = () => {
  const [data, setData] = useState();
  const navigate = useNavigate();
  const fetchDev = async () => {
    const users = await getDevelopers();
    setData(users);
  };
  useEffect(() => {
    fetchDev();
  }, []);

  const handleEdit = (id) => {
    navigate(`edit/${id}`);
  };

  const onView = (id) => {
    navigate(`view/${id}`);
  };
  const pureData = () => {
    return data?.map(({ name, skills, devId }) => ({
      name,
      skills,
      devId,
    }));
  };
  useEffect(() => {
    if (data) pureData();
  }, [data]);
  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 className="text-white">Developers</h2>
        {/* <button onClick={() => navigate("/info")}>+Add Developer</button> */}
      </div>
      <Row xs={1} md={1} className="g-4">
        {data &&
          data.map(({ name, skills, devId, _id, education, experience }) => (
            <div key={_id} className="col">
              <UserInfoCard
                name={name}
                devId={devId}
                skills={skills}
                onEdit={() => handleEdit(_id)}
                onView={() => onView(_id)}
                id={_id}
                education={education}
                experience={experience}
              />
            </div>
          ))}
      </Row>
    </div>
  );
};
