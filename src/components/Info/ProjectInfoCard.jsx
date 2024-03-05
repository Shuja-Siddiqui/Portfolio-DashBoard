import React from "react";
import { Card, Container, Row, Col } from "react-bootstrap";

export const ProjectInfoCard = ({
  projectName,
  clientName,
  techStack,
  onEdit,
  onView,
}) => {
  return (
    <Container fluid>
      <Row className="d-flex justify-content-center">
        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <Card className="bg-dark rounded border-secondary text-white">
            <Card.Body>
              <Card.Title className="text-white">
                Project Information
              </Card.Title>
              <strong>Project Name:</strong> {projectName}
              <br />
              <strong>ClientName:</strong> {clientName}
              <br />
              <strong>Tech Stack:</strong> {techStack}
              <br />
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
