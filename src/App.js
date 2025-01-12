/*****************
Soubor App.js pro stránku zobrazující články
Autor - Tomáš Zavadil (xzavadt00)
*****************/


import './App.css';
import axios from 'axios';
import { useEffect, useState, useContext, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Mainscr from './mainscr';
import SavedArticles from "./SavedArticles";
import FavoriteSearches from "./FavoriteSearches";
import RecommendedArticles from "./RecommendedArticles";
import Groups from "./Groups";
import GroupDetails from "./GroupDetails";
import { FaHome } from 'react-icons/fa';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Vytvoření kontextu pro sdílení parametrů mezi komponentami
export const ParamContext = createContext({
  params: { keyword: "", language: "", country: "", from: "", to: "" },
  setParams: () => { }
});

function News() {
  const [newsData, setNewsData] = useState([]); // Stav pro ukládání dat o novinkách
  const [loading, setLoading] = useState(false); // Stav načítání
  const [totalResults, setTotalResults] = useState(0); // Celkový počet výsledků z API
  const [page, setPage] = useState(1); // Aktuální stránka pro volání API
  const [bookmarks, setBookmarks] = useState(() => {
    // Načtení záložek z localStorage při inicializaci
    const savedBookmarks = localStorage.getItem("bookmarks");
    return savedBookmarks ? JSON.parse(savedBookmarks) : [];
  });
  const [likedArticles, setLikedArticles] = useState(() => {
    // Načtení oblíbených článků z localStorage nebo inicializace výchozí strukturou
    const savedLikes = localStorage.getItem("likedArticles");
    return savedLikes
      ? JSON.parse(savedLikes)
      : {
        likedKeywords: [],
        likedCategories: [],
        likedSources: [],
      };
  });


  const { params } = useContext(ParamContext); // Přístup k parametrům z kontextu
  const navigate = useNavigate(); // Hook pro navigaci mezi stránkami

  // Funkce pro získání dat z API
  const getNewsData = async (append = false) => {
    setLoading(true); // Nastavení stavu načítání
    try {
      const response = await axios.get(
        `https://newsapi.org/v2/everything?q=${params.keyword}&language=${params.language}&from=${params.from}&to=${params.to}&apiKey=828bf842c33f483bb89259b6304ecbc5&pageSize=5&page=${page}`
      );
      setNewsData((prev) => (append ? [...prev, ...response.data.articles] : response.data.articles));
      setTotalResults(response.data.totalResults);  // Nastavení celkového počtu výsledků
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);  // Ukončení stavu načítání
  }

  // Načtení dat při změně parametrů vyhledávání
  useEffect(() => {
    if (params.keyword || params.language) getNewsData();
  }, [params.keyword, params.language]);

  // Uložení záložek do localStorage při každé změně
  useEffect(() => {
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Uložení oblíbených článků do localStorage při každé změně
  useEffect(() => {
    localStorage.setItem("likedArticles", JSON.stringify(likedArticles));
  }, [likedArticles]);

  // Funkce pro zobrazení více článků
  const handleShowMore = () => {
    setPage((prev) => prev + 1);
  };

  // Načtení dalších článků při změně stránky
  useEffect(() => {
    if (page > 1) getNewsData(true);  // Přidání nových článků k již existujícím
  }, [page]);

  // Funkce pro přidání nebo odstranění článku ze záložek
  const handleBookmark = (article) => {
    const isBookmarked = bookmarks.some((b) => b.url === article.url); // Kontrola, zda je článek již v záložkách
    if (isBookmarked) {
      setBookmarks(bookmarks.filter((b) => b.url !== article.url)); // Odstranění ze záložek
    } else {
      setBookmarks([...bookmarks, article]); // Přidání do záložek
    }
  };

  // Funkce pro kontrolu, zda je článek v záložkách
  const isBookmarked = (article) => {
    return bookmarks.some((b) => b.url === article.url);
  };

  // Funkce pro přidání článku mezi oblíbené
  const handleLikeArticle = (article) => {
    const articleInfo = {
      keyword: params.keyword || "Unknown Keyword", // Použití aktuálního klíčového slova
      category: article.category || "General", // Použití kategorie článku
      source: article.source?.name || "Unknown Source", // Použití zdroje článku
    };

    setLikedArticles((prev) => {
      const updatedLikedArticles = { ...prev }; // Kopírování existující struktury

      // Přidání klíčového slova, pokud ještě neexistuje
      if (!updatedLikedArticles.likedKeywords.includes(articleInfo.keyword)) {
        updatedLikedArticles.likedKeywords.push(articleInfo.keyword);
      }

      // Přidání kategorie, pokud ještě neexistuje
      if (!updatedLikedArticles.likedCategories.includes(articleInfo.category)) {
        updatedLikedArticles.likedCategories.push(articleInfo.category);
      }

      // Přidání zdroje, pokud ještě neexistuje
      if (!updatedLikedArticles.likedSources.includes(articleInfo.source)) {
        updatedLikedArticles.likedSources.push(articleInfo.source);
      }

      return updatedLikedArticles; // Vrácení aktualizované struktury
    });
  };

  // Animace pro tlačítko "To se mi líbí"
  const handleThumbClick = (e) => {
    const target = e.currentTarget;
    target.classList.add("thumb-clicked");
    setTimeout(() => {
      target.classList.remove("thumb-clicked");
    }, 300);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="home-icon" onClick={() => navigate("/")}>
          <FaHome size={80} title="Go to Home" />
        </div>
        {loading ? (
          "Loading..."
        ) : (
          <Container>
            <h1 className="resultsfor">Results for: {params.keyword}</h1>
            <p className="totalresults">Total results: {totalResults}</p>
            {newsData.map((article, index) => (
              <Row className="d-flex justify-content-center" key={index}>
                <Col xs={12} md={10} lg={8} className="mt-5">
                  <a target="_blank"
                    rel="noopener noreferrer"
                    href={article.url}
                    className="card-link">
                    <Card>
                      <Card.Body className="card-body">
                        <Card.Title className="my-3">{article.title}</Card.Title>
                        <Card.Img src={article.urlToImage} className="small-image" />
                      </Card.Body>
                      <Card.Footer>
                        <Card.Text className="footer-content">{article.description}</Card.Text>
                        <div className="icon-container">
                          <i
                            className={`fas fa-bookmark ${isBookmarked(article) ? "bookmarked" : ""}`}
                            onClick={(e) => {
                              e.preventDefault();
                              handleBookmark(article);
                            }}
                            title={isBookmarked(article) ? "Remove Bookmark" : "Add Bookmark"}
                          ></i>
                          <i
                            className="fas fa-thumbs-up"
                            onClick={(e) => {
                              e.preventDefault();
                              handleThumbClick(e);
                              handleLikeArticle(article);
                            }}
                            title="Like this article"
                          ></i>
                        </div>
                      </Card.Footer>
                    </Card>
                  </a>
                </Col>
              </Row>
            ))}
            {!loading && newsData.length < totalResults && (
              <button className="button show-more" onClick={handleShowMore}>
                Show more
              </button>
            )}
          </Container>
        )}
      </header>
    </div>
  );
}

export const ParamProvider = ({ children }) => {
  const [params, setParams] = useState({ keyword: "", language: "", country: "", from: "", to: "" });

  return <ParamContext.Provider value={{ params, setParams }}>{children}</ParamContext.Provider>;
};

function App() {
  return (
    <ParamProvider>
      <Router>
        <Routes>
          <Route path="/App" element={<News />} />
          <Route path="/saved-articles" element={<SavedArticles />} />
          <Route path="/favorite-searches" element={<FavoriteSearches />} />
          <Route path="/recommended-articles" element={<RecommendedArticles />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/group/:groupId" element={<GroupDetails />} />
          <Route path="/" element={<Mainscr />} />
        </Routes>
      </Router>
    </ParamProvider>
  );
}

export default App;
