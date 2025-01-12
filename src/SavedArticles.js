/*****************
Soubor SavedArticles.js pro stránku pro práci s uloženými články
Autor - Tomáš Zavadil (xzavadt00)
*****************/
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SavedArticles.css";
import { FaHome, FaTrashAlt } from "react-icons/fa";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function SavedArticles() {
    const [savedArticles, setSavedArticles] = useState([]); // Stav pro uložené články
    const navigate = useNavigate(); // Navigační funkce pro změnu stránky

    useEffect(() => {
        // Načtení uložených článků z localStorage při načtení komponenty
        const articles = localStorage.getItem("bookmarks");
        if (articles) {
            setSavedArticles(JSON.parse(articles)); // Aktualizace stavu s uloženými články
        }
    }, []);

    const handleRemoveArticle = (index) => {
        // Odebrání článku na specifickém indexu
        const updatedArticles = savedArticles.filter((_, i) => i !== index); // Odstranění článku z pole
        setSavedArticles(updatedArticles); // Aktualizace stavu
        localStorage.setItem("bookmarks", JSON.stringify(updatedArticles)); // Uložení změn do localStorage
    };

    return (
        <div className="App">
            <header className="App-header">
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
                                                            e.preventDefault();
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
