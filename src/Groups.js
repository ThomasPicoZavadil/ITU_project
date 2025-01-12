/*****************
Soubor Groups.js pro stránku pro vytváření skupin uložených článků
Autor - Tomáš Zavadil (xzavadt00)
*****************/

import React, { useState, useEffect } from "react";
import "./Groups.css";
import { FaHome, FaPlus, FaTrashAlt, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Groups() {
    const navigate = useNavigate(); // Navigace mezi stránkami

    // Stav pro skupiny, načítá data z localStorage
    const [groups, setGroups] = useState(() => {
        const savedGroups = localStorage.getItem("articleGroups");
        return savedGroups ? JSON.parse(savedGroups) : [];
    });

    // Stav pro uložené články, načítá data z localStorage
    const [savedArticles, setSavedArticles] = useState(() => {
        const saved = localStorage.getItem("bookmarks");
        return saved ? JSON.parse(saved) : [];
    });

    const [isCreating, setIsCreating] = useState(false); // Sleduje, zda uživatel vytváří novou skupinu
    const [newGroupName, setNewGroupName] = useState(""); // Název nové skupiny
    const [selectedGroupIndex, setSelectedGroupIndex] = useState(null); // Index aktuálně vybrané skupiny pro správu článků

    // Aktualizace localStorage při změně skupin
    useEffect(() => {
        localStorage.setItem("articleGroups", JSON.stringify(groups));
    }, [groups]);

    // Aktualizace localStorage při změně uložených článků
    useEffect(() => {
        localStorage.setItem("bookmarks", JSON.stringify(savedArticles));
    }, [savedArticles]);

    // Čištění skupin, odstraňuje články, které již nejsou v uložených článcích
    useEffect(() => {
        setGroups((prevGroups) =>
            prevGroups.map((group) => ({
                ...group,
                articles: group.articles.filter((article) =>
                    savedArticles.some((saved) => saved.url === article.url)
                ),
            }))
        );
    }, [savedArticles]);

    // Vytváří novou skupinu
    const handleCreateGroup = () => {
        if (newGroupName.trim() !== "") {
            const newGroup = { name: newGroupName.trim(), articles: [] };
            setGroups((prev) => [...prev, newGroup]);
            setNewGroupName("");
            setIsCreating(false);
        }
    };

    // Odstranění skupiny
    const handleDeleteGroup = (index) => {
        setGroups((prev) => {
            const updatedGroups = prev.filter((_, i) => i !== index);
            // Zavře správu článků, pokud je aktuální skupina smazána
            if (selectedGroupIndex === index) {
                setSelectedGroupIndex(null);
            }
            return updatedGroups;
        });
    };

    // Přidání nebo odebrání článku ve skupině
    const toggleArticleInGroup = (article) => {
        if (selectedGroupIndex !== null && groups[selectedGroupIndex]) {
            setGroups((prevGroups) => {
                const updatedGroups = prevGroups.map((group, index) => {
                    if (index !== selectedGroupIndex) return group;

                    // Kontrola, zda je článek již ve skupině
                    const articleIndex = group.articles.findIndex((a) => a.url === article.url);
                    if (articleIndex === -1) {
                        return {
                            ...group,
                            articles: [...group.articles, article], // Přidání článku
                        };
                    } else {
                        return {
                            ...group,
                            articles: group.articles.filter((a) => a.url !== article.url), // Odebrání článku
                        };
                    }
                });

                return updatedGroups;
            });
        }
    };

    // Kontrola, zda je článek ve vybrané skupině
    const isArticleInGroup = (article) => {
        if (selectedGroupIndex === null || !groups[selectedGroupIndex]) return false;
        return groups[selectedGroupIndex].articles.some((a) => a.url === article.url);
    };

    // Navigace na detail skupiny
    const handleViewGroup = (index) => {
        navigate(`/group/${index}`);
    };

    // Filtrování článků, které stále existují v uložených článcích
    const getFilteredGroupArticles = (group) => {
        return group.articles.filter((groupArticle) =>
            savedArticles.some((savedArticle) => savedArticle.url === groupArticle.url)
        );
    };

    return (
        <div className="groups-page">
            <header className="header">
                <div className="groups-icon-container">
                    <FaArrowLeft
                        size={50}
                        className="groups-back-icon"
                        title="Go back"
                        onClick={() => navigate(-1)}
                    />
                    <FaHome
                        size={50}
                        className="groups-home-icon"
                        title="Go to Home"
                        onClick={() => navigate("/")}
                    />
                </div>
                <h1>Saved Groups</h1>
            </header>

            <div className="groups-container">
                {groups.map((group, index) => (
                    <div className="group-card" key={index} onClick={() => handleViewGroup(index)}>
                        <h3>{group.name}</h3>
                        <p>Saved articles: {getFilteredGroupArticles(group).length}</p>
                        <FaTrashAlt
                            className="group-delete-icon"
                            title="Delete group"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteGroup(index);
                            }}
                        />
                        <button
                            className="add-to-group-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedGroupIndex(index);
                            }}
                        >
                            Manage Articles
                        </button>
                    </div>
                ))}

                <div className="group-card add-new-group">
                    {isCreating ? (
                        <div className="add-group-input">
                            <input
                                type="text"
                                placeholder="Enter group name"
                                value={newGroupName}
                                onChange={(e) => setNewGroupName(e.target.value)}
                            />
                            <button onClick={handleCreateGroup}>Save</button>
                            <button onClick={() => setIsCreating(false)}>Cancel</button>
                        </div>
                    ) : (
                        <div className="create-new-group" onClick={() => setIsCreating(true)}>
                            <FaPlus size={50} />
                            <p>Create new group</p>
                        </div>
                    )}
                </div>
            </div>

            {selectedGroupIndex !== null && groups[selectedGroupIndex] && (
                <div className="saved-articles-list">
                    <h2>Add or Remove Articles</h2>
                    {savedArticles.length > 0 ? (
                        savedArticles.map((article, index) => (
                            <div className="saved-article" key={index}>
                                <p>{article.title}</p>
                                <div
                                    className="article-toggle-icon"
                                    onClick={() => {
                                        toggleArticleInGroup(article);
                                    }}
                                >
                                    {isArticleInGroup(article) ? (
                                        <FaTrashAlt
                                            className="remove-icon"
                                            title="Remove from group"
                                        />
                                    ) : (
                                        <FaPlus className="add-icon" title="Add to group" />
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No saved articles available.</p>
                    )}
                    <button
                        className="close-selection"
                        onClick={() => setSelectedGroupIndex(null)}
                    >
                        Close
                    </button>
                </div>
            )}
        </div>
    );
}

export default Groups;
