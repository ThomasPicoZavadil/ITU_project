import React, { useContext, useState } from "react";
import "./mainscr.css";
import { FiMenu } from "react-icons/fi"; // For the menu icon
import { useNavigate } from "react-router-dom";
import { KeywordContext } from "./App";

function Mainscr() {
    const navigate = useNavigate()
    const { keyword: contextvalue, setKeyword } = useContext(KeywordContext)

    const handleKeywordChange = (e) => {
        setKeyword((prev) => ({ ...prev, keyword: e.target.value })); // Update state with input value
    };

    const handleSearch = () => {
        console.log("Keyword:", contextvalue); // Use the keyword for your functionality
        navigate("/App")
    };

    return (
        <div className="mainscr">
            <header className="menu">
                <FiMenu size={48} />
            </header>
            <div className="content">
                <h1 className="title">Title placeholder</h1>
                <p className="subtitle">
                    Search for news articles from all around the world based on a topic, date or language
                </p>

                <div className="search-container">
                    <input type="text" className="input keyword" placeholder="Keyword:"
                        value={contextvalue.keyword} onChange={handleKeywordChange} />
                    <input type="text" className="input language" placeholder="Language: " />
                    <input type="date" className="input date" />
                </div>

                <button className="button search-button" onClick={handleSearch}>Search</button>
                <button className="button add-button">Add quicksearch option +</button>

                <button className="button recommendation">Articles recommended for you</button>
            </div>
        </div>
    );
}

export default Mainscr;
