import React from "react";
import "./GroupDetails.css";
import { useParams, useNavigate } from "react-router-dom";
import { FaHome, FaArrowLeft } from "react-icons/fa";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function GroupDetails() {
    const { groupId } = useParams();
    const navigate = useNavigate();

    // Load group data from localStorage
    const groups = JSON.parse(localStorage.getItem("articleGroups")) || [];
    const group = groups[groupId];

    if (!group) {
        return (
            <div className="group-details-container">
                <h1>Group not found</h1>
            </div>
        );
    }

    return (
        <div className="group-details-container">
            <header className="group-details-header">
                <div className="group-details-icon-container">
                    <FaArrowLeft
                        size={50}
                        className="group-details-back-icon"
                        title="Go back"
                        onClick={() => navigate(-1)}
                    />
                    <FaHome
                        size={50}
                        className="group-details-home-icon"
                        title="Go to Home"
                        onClick={() => navigate("/")}
                    />
                </div>
                <h1>{group.name}</h1>
                <p>Saved Articles: {group.articles.length}</p>
            </header>

            <Container>
                {group.articles.length === 0 ? (
                    <p>No articles in this group.</p>
                ) : (
                    group.articles.map((article, index) => (
                        <Row className="d-flex justify-content-center" key={index}>
                            <Col xs={12} md={10} lg={8} className="mt-5">
                                <a
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href={article.url}
                                    className="group-details-card-link"
                                >
                                    <Card>
                                        <Card.Body className="card-body">
                                            <Card.Title className="my-3">{article.title}</Card.Title>
                                            {article.urlToImage && (
                                                <Card.Img src={article.urlToImage} className="small-image" />
                                            )}
                                        </Card.Body>
                                        <Card.Footer>
                                            <Card.Text className="footer-content">
                                                {article.description}
                                            </Card.Text>
                                        </Card.Footer>
                                    </Card>
                                </a>
                            </Col>
                        </Row>
                    ))
                )}
            </Container>
        </div>
    );
}

export default GroupDetails;
