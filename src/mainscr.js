import React, { useState, useEffect, useContext } from "react";
import "./mainscr.css";
import { FiMenu } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { ParamContext } from "./App";

function Mainscr() {
    const navigate = useNavigate();
    const { params, setParams } = useContext(ParamContext);

    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
    const [quickSearchList, setQuickSearchList] = useState([]); // List of saved quicksearch options
    const [quickSearch, setQuickSearch] = useState({ keyword: "", country: "", language: "", source: "" }); // Current quicksearch data

    // Load saved quicksearches from localStorage on component mount
    useEffect(() => {
        const savedQuickSearches = localStorage.getItem("quickSearchList");
        if (savedQuickSearches) {
            try {
                setQuickSearchList(JSON.parse(savedQuickSearches)); // Parse JSON data safely
            } catch (error) {
                console.error("Error parsing localStorage data:", error);
                setQuickSearchList([]); // Initialize with an empty array if parsing fails
            }
        }
    }, []);

    // Save quicksearches to localStorage whenever the list changes
    useEffect(() => {
        localStorage.setItem("quickSearchList", JSON.stringify(quickSearchList));
    }, [quickSearchList]);

    const handleChange = (name, e) => {
        setParams((prev) => ({ ...prev, [name]: e.target.value }));
    };

    const handleSearch = () => {
        console.log("Keyword:", params.keyword);
        console.log("Language:", params.language);
        console.log("Country:", params.country);
        navigate("/App");
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setQuickSearch((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSaveQuickSearch = () => {
        // Add the current quicksearch data to the list
        setQuickSearchList((prevList) => [...prevList, quickSearch]);
        setIsModalOpen(false); // Close the modal after saving
        setQuickSearch({ keyword: "", country: "", language: "", source: "" }); // Reset quicksearch data
    };

    const handleQuickSearchClick = (search) => {
        setParams(search); // Set the parameters
        navigate("/App"); // Trigger search navigation immediately
    };

    const handleDeleteQuickSearch = (index) => {
        setQuickSearchList((prevList) => prevList.filter((_, i) => i !== index));
    };

    return (
        <div className="mainscr">
            <header className="menu">
                <FiMenu size={48} />
            </header>
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
                    <input type="date" className="input date" />
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
                                {search.keyword || "All Keywords"} - {search.country || "All Countries"} - {search.language || "All Languages"}
                            </button>
                            <button
                                className="button delete-button"
                                onClick={() => handleDeleteQuickSearch(index)}
                                title="Delete this quicksearch"
                            >
                                ✖
                            </button>
                        </div>
                    ))}
                </div>

                <button className="button recommendation">Articles recommended for you</button>
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
                        <input
                            type="text"
                            name="country"
                            placeholder="Country"
                            value={quickSearch.country}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="language"
                            placeholder="Language"
                            value={quickSearch.language}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="source"
                            placeholder="Source"
                            value={quickSearch.source}
                            onChange={handleInputChange}
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
