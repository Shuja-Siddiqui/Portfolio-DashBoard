import React from "react";
import { Card, Container, Row, Col } from "react-bootstrap";

export const VideoInfoCard = ({
  title,
  link,
  developerID,
  projectID,
  onEdit,
  onRemove,
}) => {
  return (
    <Container fluid>
      <Row className="d-flex justify-content-center">
        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <Card className="bg-dark rounded border-secondary text-white">
            <Card.Body>
              <Card.Title>
                <h5>Video Information</h5>
              </Card.Title>
              <strong style={{ color: "grey" }}>Title:</strong> {title}
              <br />
              <strong style={{ color: "grey" }}>Link:</strong>{" "}
              <a href={link} target="_blank" rel="noopener noreferrer" style={{ color: "#667eea" }}>
                {link.length > 50 ? link.substring(0, 50) + "..." : link}
              </a>
              <br />
              {developerID && (
                <>
                  <strong style={{ color: "grey" }}>Developer:</strong>{" "}
                  {developerID.name || developerID.devId || "N/A"}
                  <br />
                </>
              )}
              {projectID && (
                <>
                  <strong style={{ color: "grey" }}>Project:</strong>{" "}
                  {projectID.projectName || "N/A"}
                  <br />
                </>
              )}
              {!developerID && !projectID && (
                <>
                  <strong style={{ color: "grey" }}>Status:</strong> No associations
                  <br />
                </>
              )}
              <div
                style={{ marginTop: "10px" }}
                className="d-flex justify-content-between justify-items-center"
              >
                <button 
                  onClick={onEdit}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#667eea",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>
                <button 
                  onClick={onRemove}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
