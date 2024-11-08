import React, { useContext } from "react";
import "./mainscr.css";
import { FiMenu } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { ParamContext } from "./App";

function Mainscr() {
    const navigate = useNavigate();
    const { params, setParams } = useContext(ParamContext);

    const handleKeywordChange = (e) => {
        setParams((prev) => ({ ...prev, keyword: e.target.value }));
    };

    const handleLanguageChange = (e) => {
        setParams((prev) => ({ ...prev, language: e.target.value }));
    };

    const handleSearch = () => {
        console.log("Keyword:", params.keyword);
        console.log("Language:", params.language);
        navigate("/App");
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
                    <input
                        type="text"
                        className="input keyword"
                        placeholder="Keyword:"
                        value={params.keyword}
                        onChange={handleKeywordChange}
                    />
                    <input type="text" className="input language" placeholder="Language: " value={params.language} onChange={handleLanguageChange} />
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
