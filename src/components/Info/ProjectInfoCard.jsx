import React from "react";
import { Card, Container, Row, Col } from "react-bootstrap";

export const ProjectInfoCard = ({
  projectName,
  clientName,
  techStack,
  onEdit,
  onView,
  onRemove,
}) => {
  return (
    <Container fluid>
      <Row className="d-flex justify-content-center">
        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <Card className="bg-dark rounded border-secondary text-white">
            <Card.Body>
              <Card.Title>
                <h5>Project Information</h5>
              </Card.Title>
              <strong style={{ color: "grey" }}>Project Name:</strong>{" "}
              {projectName}
              <br />
              <strong style={{ color: "grey" }}>ClientName:</strong>{" "}
              {clientName}
              <br />
              <strong style={{ color: "grey" }}>Tech Stack:</strong> {techStack}
              <br />
              <div
                style={{ marginTop: "10px" }}
                className="d-flex justify-content-between justify-items-center"
              >
                <button onClick={onEdit}>Edit</button>{" "}
                <button onClick={onView}>View Details</button>{" "}
                <button onClick={onRemove}>Delete</button>{" "}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
