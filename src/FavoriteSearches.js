/*****************
Soubor FavoriteSearches.js pro stránku pro upravování preferencí
Autor - Tomáš Zavadil (xzavadt00)
*****************/

import React, { useState, useEffect } from "react";
import "./FavoriteSearches.css";
import { FaHome, FaTrashAlt, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function FavoriteSearches() {
    const navigate = useNavigate();

    // Stav pro uživatelem přidané položky, načítání z localStorage
    const [userAddedItems, setUserAddedItems] = useState(() => {
        const savedUserAddedItems = localStorage.getItem("userAddedItems");
        return savedUserAddedItems
            ? JSON.parse(savedUserAddedItems)
            : {
                categories: [],
                sources: [],
                keywords: [],
            };
    });

    // Stav pro oblíbené články, načítání z localStorage
    const [likedArticles, setLikedArticles] = useState(() => {
        const savedLikes = localStorage.getItem("likedArticles");
        return savedLikes
            ? JSON.parse(savedLikes)
            : {
                likedKeywords: [],
                likedCategories: [],
                likedSources: [],
            };
    });

    // Stav pro sledování, zda uživatel přidává novou položku
    const [isAdding, setIsAdding] = useState({
        categories: false,
        sources: false,
        keywords: false,
    });

    const [newItem, setNewItem] = useState(""); // Stav pro text nové položky

    // Funkce pro zahájení přidávání nové položky
    const handleStartAdding = (type) => {
        setIsAdding((prev) => ({ ...prev, [type]: true }));
        setNewItem(""); // Resetování vstupu
    };

    // Funkce pro přidání nové položky do uživatelských dat
    const handleAddItem = (type) => {
        if (newItem.trim() !== "") {
            setUserAddedItems((prev) => {
                const updatedItems = {
                    ...prev,
                    [type]: [...prev[type], newItem.trim()],
                };
                localStorage.setItem("userAddedItems", JSON.stringify(updatedItems)); // Uložení do localStorage
                return updatedItems;
            });
            setIsAdding((prev) => ({ ...prev, [type]: false }));
            setNewItem(""); // Resetování vstupu
        }
    };

    // Funkce pro odebrání položky z uživatelských dat
    const handleRemoveUserItem = (type, index) => {
        setUserAddedItems((prev) => {
            const updatedItems = {
                ...prev,
                [type]: prev[type].filter((_, i) => i !== index),
            };
            localStorage.setItem("userAddedItems", JSON.stringify(updatedItems)); // Aktualizace v localStorage
            return updatedItems;
        });
    };

    // Funkce pro odebrání položky z oblíbených článků
    const handleRemoveLikedItem = (type, index) => {
        setLikedArticles((prev) => ({
            ...prev,
            [type]: prev[type].filter((_, i) => i !== index),
        }));
    };

    // Uložení oblíbených článků do localStorage při změně
    useEffect(() => {
        localStorage.setItem("likedArticles", JSON.stringify(likedArticles));
    }, [likedArticles]);

    // Uložení uživatelem přidaných položek do localStorage při změně
    useEffect(() => {
        localStorage.setItem("userAddedItems", JSON.stringify(userAddedItems));
    }, [userAddedItems]);

    return (
        <div className="favorite-searches">
            <header className="header">
                <FaHome
                    size={80}
                    className="home-icon"
                    title="Go to Home"
                    onClick={() => navigate("/")}
                />
                <h1>Favorite Searches</h1>
            </header>

            <div className="section">
                <h2>Favorite Categories</h2>
                <div className="items-container">
                    {userAddedItems.categories.map((category, index) => (
                        <div className="item" key={index}>
                            {category}
                            <FaTrashAlt
                                className="remove-icon"
                                title="Remove"
                                onClick={() => handleRemoveUserItem("categories", index)}
                            />
                        </div>
                    ))}
                    {isAdding.categories ? (
                        <div className="add-input">
                            <input
                                type="text"
                                value={newItem}
                                onChange={(e) => setNewItem(e.target.value)}
                                placeholder="Enter category"
                            />
                            <button onClick={() => handleAddItem("categories")}>Save</button>
                            <button onClick={() => setIsAdding((prev) => ({ ...prev, categories: false }))}>
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <button
                            className="add-button"
                            onClick={() => handleStartAdding("categories")}
                        >
                            Add <FaPlus />
                        </button>
                    )}
                </div>
                <p>Based on your likes:</p>
                <div className="based-on-likes">
                    {likedArticles.likedCategories.length > 0 ? (
                        likedArticles.likedCategories.map((category, index) => (
                            <div className="liked-item" key={index}>
                                {category}
                                <FaTrashAlt
                                    className="remove-icon"
                                    title="Remove"
                                    onClick={() => handleRemoveLikedItem("likedCategories", index)}
                                />
                            </div>
                        ))
                    ) : (
                        <p>None</p>
                    )}
                </div>
            </div>

            <div className="section">
                <h2>Favorite Sources</h2>
                <div className="items-container">
                    {userAddedItems.sources.map((source, index) => (
                        <div className="item" key={index}>
                            {source}
                            <FaTrashAlt
                                className="remove-icon"
                                title="Remove"
                                onClick={() => handleRemoveUserItem("sources", index)}
                            />
                        </div>
                    ))}
                    {isAdding.sources ? (
                        <div className="add-input">
                            <input
                                type="text"
                                value={newItem}
                                onChange={(e) => setNewItem(e.target.value)}
                                placeholder="Enter source"
                            />
                            <button onClick={() => handleAddItem("sources")}>Save</button>
                            <button onClick={() => setIsAdding((prev) => ({ ...prev, sources: false }))}>
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <button
                            className="add-button"
                            onClick={() => handleStartAdding("sources")}
                        >
                            Add <FaPlus />
                        </button>
                    )}
                </div>
                <p>Based on your likes:</p>
                <div className="based-on-likes">
                    {likedArticles.likedSources.length > 0 ? (
                        likedArticles.likedSources.map((source, index) => (
                            <div className="liked-item" key={index}>
                                {source}
                                <FaTrashAlt
                                    className="remove-icon"
                                    title="Remove"
                                    onClick={() => handleRemoveLikedItem("likedSources", index)}
                                />
                            </div>
                        ))
                    ) : (
                        <p>None</p>
                    )}
                </div>
            </div>

            <div className="section">
                <h2>Favorite Keywords</h2>
                <div className="items-container">
                    {userAddedItems.keywords.map((keyword, index) => (
                        <div className="item" key={index}>
                            {keyword}
                            <FaTrashAlt
                                className="remove-icon"
                                title="Remove"
                                onClick={() => handleRemoveUserItem("keywords", index)}
                            />
                        </div>
                    ))}
                    {isAdding.keywords ? (
                        <div className="add-input">
                            <input
                                type="text"
                                value={newItem}
                                onChange={(e) => setNewItem(e.target.value)}
                                placeholder="Enter keyword"
                            />
                            <button onClick={() => handleAddItem("keywords")}>Save</button>
                            <button onClick={() => setIsAdding((prev) => ({ ...prev, keywords: false }))}>
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <button
                            className="add-button"
                            onClick={() => handleStartAdding("keywords")}
                        >
                            Add <FaPlus />
                        </button>
                    )}
                </div>
                <p>Based on your likes:</p>
                <div className="based-on-likes">
                    {likedArticles.likedKeywords.length > 0 ? (
                        likedArticles.likedKeywords.map((keyword, index) => (
                            <div className="liked-item" key={index}>
                                {keyword}
                                <FaTrashAlt
                                    className="remove-icon"
                                    title="Remove"
                                    onClick={() => handleRemoveLikedItem("likedKeywords", index)}
                                />
                            </div>
                        ))
                    ) : (
                        <p>None</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default FavoriteSearches;
