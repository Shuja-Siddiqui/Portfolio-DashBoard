import React from "react";
import { Card, Container, Row, Col } from "react-bootstrap";

export const UserInfoCard = ({ name, skills, devId, onEdit, onView }) => {
  return (
    <Container fluid>
      <Row className="d-flex justify-content-center">
        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <Card className="bg-dark rounded border-secondary text-white">
            <Card.Body>
              <Card.Title className="text-white">User Information</Card.Title>
              <strong>Name:</strong> {name}
              <br />
              <strong>Dev Id:</strong> {devId}
              <br />
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
              <div className="d-flex justify-content-between justify-items-center">
                <button onClick={onEdit}>Edit</button>{" "}
                <button onClick={onView}>View Details</button>{" "}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
