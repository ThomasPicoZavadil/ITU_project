import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SavedArticles.css";
import { FaHome, FaTrashAlt } from "react-icons/fa"; // Import trash icon
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function SavedArticles() {
    const [savedArticles, setSavedArticles] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Load saved articles from localStorage
        const articles = localStorage.getItem("bookmarks");
        if (articles) {
            setSavedArticles(JSON.parse(articles));
        }
    }, []);

    const handleRemoveArticle = (index) => {
        // Remove the article at the specified index
        const updatedArticles = savedArticles.filter((_, i) => i !== index);
        setSavedArticles(updatedArticles);
        localStorage.setItem("bookmarks", JSON.stringify(updatedArticles)); // Update localStorage
    };

    return (
        <div className="App">
            <header className="App-header">
                {/* Home Icon */}
                <div className="home-icon" onClick={() => navigate("/")}>
                    <FaHome size={80} title="Go to Home" />
                </div>
                <Container>
                    <h1 className="resultsfor">Saved Articles</h1>
                    <div className="show-groups-container">
                        <button className="show-groups-button" onClick={() => navigate("/groups")}>
                            Show Groups
                        </button>
                    </div>
                    {savedArticles.length === 0 ? (
                        <p className="no-results">No saved articles found.</p>
                    ) : (
                        savedArticles.map((article, index) => (
                            <Row className="d-flex justify-content-center" key={index}>
                                <Col xs={12} md={10} lg={8} className="mt-5">
                                    <a
                                        href={article.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="card-link"
                                    >
                                        <Card>
                                            <Card.Body className="card-body">
                                                <Card.Title className="my-3">{article.title}</Card.Title>
                                                {article.urlToImage && (
                                                    <Card.Img
                                                        src={article.urlToImage}
                                                        className="small-image"
                                                    />
                                                )}
                                            </Card.Body>
                                            <Card.Footer>
                                                <Card.Text className="footer-content">
                                                    {article.description}
                                                </Card.Text>
                                                {/* Icon Container */}
                                                <div className="icon-container">
                                                    <FaTrashAlt
                                                        className="icon delete-icon"
                                                        title="Remove article"
                                                        onClick={(e) => {
                                                            e.preventDefault(); // Prevent link click when deleting
                                                            handleRemoveArticle(index);
                                                        }}
                                                    />
                                                </div>
                                            </Card.Footer>
                                        </Card>
                                    </a>
                                </Col>
                            </Row>
                        ))
                    )}
                </Container>
            </header>
        </div>
    );
}

export default SavedArticles;
