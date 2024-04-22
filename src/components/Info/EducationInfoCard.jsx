import React from "react";
import { Card, Container, Row, Col } from "react-bootstrap";

export const EducationInfoCard = ({
  description,
  institution,
  major,
  onEdit,
  onView,
}) => {
  return (
    <Container fluid>
      <Row className="d-flex justify-content-center">
        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <Card className="bg-dark rounded border-secondary text-white">
            <Card.Body>
              <Card.Title>
                <h5>Education</h5>
              </Card.Title>
              <strong style={{ color: "grey" }}>Description:</strong> {description}
              <br />
              <strong style={{ color: "grey" }}>Institution:</strong> {institution}
              <br />
              <strong style={{ color: "grey" }}>Major:</strong> {major}
              <br />
              <div className="d-flex justify-content-between justify-items-center">
                <button onClick={onEdit}>Edit</button>{" "}
                {/* <button onClick={onView}>View Details</button>{" "} */}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
