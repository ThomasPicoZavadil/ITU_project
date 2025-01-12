/*****************
Soubor mainscr.js pro hlavní stránku aplikace
Autor - Tomáš Zavadil (xzavadt00)
*****************/

import React, { useState, useEffect, useContext } from "react";
import "./mainscr.css";
import { FiMenu } from "react-icons/fi";
import { FaBookmark, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ParamContext } from "./App";

function Mainscr() {
    const navigate = useNavigate();
    const { params, setParams } = useContext(ParamContext);

    // Stav pro otevření nebo zavření modálního okna
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Stav pro otevření nebo zavření bočního panelu
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Načtení seznamu rychlého vyhledávání z localStorage při inicializaci
    const [quickSearchList, setQuickSearchList] = useState(() => {
        const savedQuickSearches = localStorage.getItem("quickSearchList");
        return savedQuickSearches ? JSON.parse(savedQuickSearches) : [];
    });

    // Data aktuálního rychlého vyhledávání
    const [quickSearch, setQuickSearch] = useState({ keyword: "", country: "", language: "", source: "" }); // Current quicksearch data

    // Uložení seznamu rychlého vyhledávání do localStorage při každé změně
    useEffect(() => {
        localStorage.setItem("quickSearchList", JSON.stringify(quickSearchList));
    }, [quickSearchList]);

    // Funkce pro zpracování změn ve vyhledávacích polích
    const handleChange = (name, e) => {
        setParams((prev) => ({ ...prev, [name]: e.target.value }));
    };

    // Funkce pro spuštění vyhledávání a přesměrování na stránku výsledků
    const handleSearch = () => {
        console.log("Keyword:", params.keyword);
        console.log("Language:", params.language);
        console.log("Country:", params.country);
        console.log("From:", params.from);
        console.log("To:", params.to);
        navigate("/App");
    };

    // Funkce pro zpracování vstupu v modálním okně
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setQuickSearch((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Zpracování dat specifických pro datum
    const handleDateInputChange = (name, value) => {
        setQuickSearch((prev) => ({
            ...prev,
            [name]: value ? new Date(value).toISOString().split("T")[0] : "",
        }));
    };

    // Formátování dat pro zobrazení v rychlém vyhledávání
    const formatDate = (date) => {
        return date ? new Date(date).toLocaleDateString("en-GB") : "Any date";
    };


    const handleSaveQuickSearch = () => {
        // Uložení nového rychlého vyhledávání
        setQuickSearchList((prevList) => [...prevList, quickSearch]);
        setIsModalOpen(false); // Zavření modálního okna
        setQuickSearch({ keyword: "", country: "", language: "", source: "" }); // Reset aktuálního vyhledávání
    };

    // Kliknutí na tlačítko rychlého vyhledávání
    const handleQuickSearchClick = (search) => {
        setParams(search); // Nastavení parametrů
        navigate("/App"); // Přesměrování na stránku vyhledávání
    };

    // Odstranění rychlého vyhledávání ze seznamu
    const handleDeleteQuickSearch = (index) => {
        setQuickSearchList((prevList) => prevList.filter((_, i) => i !== index));
    };

    return (
        <div className="mainscr">
            <header className="menu">
                <FiMenu size={48} onClick={() => setIsSidebarOpen(!isSidebarOpen)} />
            </header>
            <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
                {/* Close Button */}
                <button className="close-btn" onClick={() => setIsSidebarOpen(false)}>×</button>
                <ul>
                    <li onClick={() => navigate("/saved-articles")}>
                        <span>Saved articles</span>
                        <FaBookmark className="icon" />
                    </li>
                    <li onClick={() => navigate("/favorite-searches")}>
                        <span>Favorite searches</span>
                        <FaStar className="icon" />
                    </li>
                </ul>
            </div>
            <div className={`overlay ${isSidebarOpen ? "visible" : ""}`} onClick={() => setIsSidebarOpen(false)}></div>
            <div className="content">
                <h1 className="title">FreshNews</h1>
                <p className="subtitle">
                    Search for news articles from all around the world based on a topic, date, or language.
                </p>

                <div className="search-container">
                    <input
                        type="text"
                        className="input keyword"
                        placeholder="Keyword:"
                        value={params.keyword}
                        onChange={(e) => handleChange('keyword', e)}
                    />
                    <select
                        className="input language"
                        value={params.language}
                        onChange={(e) => handleChange('language', e)}
                    >
                        <option value="" disabled>Select Language</option>
                        <option value="">All</option>
                        <option value="en">English</option>
                        <option value="de">German</option>
                        <option value="fr">French</option>
                        <option value="es">Spanish</option>
                        <option value="it">Italian</option>
                        <option value="no">Norwegian</option>
                        <option value="sv">Swedish</option>
                        <option value="nl">Dutch</option>
                        <option value="pt">Portuguese</option>
                        <option value="ru">Russian</option>
                        <option value="ar">Arabic</option>
                        <option value="he">Hebrew</option>
                        <option value="ud">Urdu</option>
                        <option value="zh">Chinese</option>
                    </select>

                    {/* From Date */}
                    <input
                        type="text"
                        className="input from"
                        placeholder="From: "
                        value={params.from || ""}
                        onChange={(e) => handleChange('from', e)}
                        onFocus={(e) => (e.target.type = "date")}
                        onBlur={(e) => {
                            e.target.type = "text";
                            e.target.value = params.from
                                ? new Date(params.from).toLocaleDateString("en-GB") // Format date as dd/mm/yyyy
                                : "";
                        }}
                    />

                    {/* To Date */}
                    <input
                        type="text"
                        className="input to"
                        placeholder="To: "
                        value={params.to || ""}
                        onChange={(e) => handleChange('to', e)}
                        onFocus={(e) => (e.target.type = "date")}
                        onBlur={(e) => {
                            e.target.type = "text";
                            e.target.value = params.to
                                ? new Date(params.to).toLocaleDateString("en-GB") // Format date as dd/mm/yyyy
                                : "";
                        }}
                    />
                </div>

                <button className="button search-button" onClick={handleSearch}>
                    Search
                </button>
                <button className="button add-button" onClick={() => setIsModalOpen(true)}>
                    Add quicksearch option +
                </button>

                {/* Render quicksearch buttons */}
                <div className="quicksearch-buttons">
                    {quickSearchList.map((search, index) => (
                        <div key={index} className="quicksearch-item">
                            <button
                                className="button quicksearch-button"
                                onClick={() => handleQuickSearchClick(search)}
                            >
                                <span className="quicksearch-text">
                                    {search.keyword || "All Keywords"} - {search.language || "All Languages"} - {formatDate(search.from)} to {formatDate(search.to)}
                                </span>
                                <span
                                    className="quicksearch-delete"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent triggering the search action
                                        handleDeleteQuickSearch(index);
                                    }}
                                    title="Delete this quicksearch"
                                >
                                    ✖
                                </span>
                            </button>
                        </div>

                    ))}
                </div>

                <button
                    className="button recommendation"
                    onClick={() => navigate("/recommended-articles")}
                >
                    Recommended Articles for You
                </button>

            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Add Quicksearch Option</h2>
                        <input
                            type="text"
                            name="keyword"
                            placeholder="Keyword"
                            value={quickSearch.keyword}
                            onChange={handleInputChange}
                        />
                        <select
                            name="language"
                            placeholder="Language"
                            value={quickSearch.language}
                            onChange={handleInputChange}
                        >
                            <option value="" disabled>Select Language</option>
                            <option value="">All</option>
                            <option value="en">English</option>
                            <option value="de">German</option>
                            <option value="fr">French</option>
                            <option value="es">Spanish</option>
                            <option value="it">Italian</option>
                            <option value="no">Norwegian</option>
                            <option value="sv">Swedish</option>
                            <option value="nl">Dutch</option>
                            <option value="pt">Portuguese</option>
                            <option value="ru">Russian</option>
                            <option value="ar">Arabic</option>
                            <option value="he">Hebrew</option>
                            <option value="ud">Urdu</option>
                            <option value="zh">Chinese</option>
                        </select>
                        <input
                            type="date"
                            name="from"
                            placeholder="From:"
                            value={quickSearch.from || ""}
                            onChange={(e) => handleDateInputChange("from", e.target.value)}
                        />
                        <input
                            type="date"
                            name="to"
                            placeholder="To:"
                            value={quickSearch.to || ""}
                            onChange={(e) => handleDateInputChange("to", e.target.value)}
                        />
                        <div className="modal-actions">
                            <button className="button save-button" onClick={handleSaveQuickSearch}>
                                Save
                            </button>
                            <button className="button cancel-button" onClick={() => setIsModalOpen(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Mainscr;
