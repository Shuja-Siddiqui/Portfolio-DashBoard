import React from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export const UserInfoCard = ({
  name,
  skills,
  devId,
  onEdit,
  onView,
  education,
  experience,
}) => {
  const navigate = useNavigate();
  return (
    <Container fluid>
      <Row className="d-flex justify-content-center">
        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <Card
            className="bg-dark rounded border-secondary text-white"
            style={{ minHeight: "450px" }}
          >
            <Card.Body
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "space-between",
              }}
            >
              <Card.Title className="text-white">
                <h5
                  style={{ padding: "0", marginBottom: "10px", color: "#333" }}
                >
                  Developer Information
                </h5>
              </Card.Title>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <strong>
                  Name: <span style={{ fontSize: "14px" }}>{name}</span>
                </strong>
                <strong>
                  Dev Id: <span style={{ fontSize: "14px" }}>{devId}</span>
                </strong>
              </div>

              <div style={{ width: "100%", flexDirection: "column" }}>
                <strong>Major skills:</strong>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    gap: "10px",
                  }}
                >
                  {skills?.map(({ title, ratings, index, ...skills }) => (
                    <div
                      style={{
                        maxWidth: "20%",
                        display: "flex",
                        gap: "10px",
                      }}
                    >
                      <strong className="text-white" key={index}>
                        {title?.skillName}
                      </strong>
                      <p>{ratings}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  marginBottom: "10px",
                }}
              >
                <h5
                  style={{ padding: "0", marginBottom: "10px", color: "#333" }}
                >
                  Education
                </h5>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    gap: "10px",
                    flexDirection: "column",
                  }}
                >
                  {education?.map(({ major, timeSpan, index, _id }) => (
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        gap: "10px",
                      }}
                    >
                      <div
                        style={{
                          width: "50%",
                          display: "flex",
                          gap: "10px",
                        }}
                      >
                        <strong className="text-white" key={index}>
                          {major}
                        </strong>
                        {/* <p>{timeSpan?.startYear}</p>
                      <span>{timeSpan?.endYear}</span> */}
                      </div>
                      <div
                        style={{
                          width: "50%",
                          display: "flex",
                          gap: "10px",
                        }}
                      >
                        <p style={{ padding: "0", margin: "0" }}>
                          {timeSpan?.startYear}
                        </p>
                        -
                        <p style={{ padding: "0", margin: "0" }}>
                          {timeSpan?.endYear}
                        </p>
                        <button
                          onClick={() => navigate(`/education/edit/${_id}`)}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => navigate(`/education/view/${_id}`)}
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  marginBottom: "1rem",
                }}
              >
                <h5
                  style={{ padding: "0", marginBottom: "10px", color: "#333" }}
                >
                  Experience
                </h5>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    gap: "10px",
                    flexDirection: "column",
                  }}
                >
                  {experience?.map(({ company, timeSpan, index, _id }) => (
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        gap: "10px",
                      }}
                    >
                      <div
                        style={{
                          width: "50%",
                          display: "flex",
                          gap: "10px",
                        }}
                      >
                        <strong className="text-white" key={index}>
                          {company}
                        </strong>
                        {/* <p>{timeSpan?.startYear}</p>
                      <span>{timeSpan?.endYear}</span> */}
                      </div>
                      <div
                        style={{
                          width: "50%",
                          display: "flex",
                          gap: "10px",
                        }}
                      >
                        <p style={{ padding: "0", margin: "0" }}>
                          {timeSpan?.startYear}
                        </p>
                        -
                        <p style={{ padding: "0", margin: "0" }}>
                          {timeSpan?.endYear}
                        </p>
                        <button
                          onClick={() => navigate(`/education/edit/${_id}`)}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => navigate(`/education/view/${_id}`)}
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-100 d-flex justify-content-between justify-items-center">
                <button onClick={onEdit}>Edit Developer</button>{" "}
                <button onClick={onView}>View Developer</button>{" "}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
