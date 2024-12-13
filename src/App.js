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
import { FaHome } from 'react-icons/fa';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Create the context
export const ParamContext = createContext({
  params: { keyword: "", language: "", country: "", from: "", to: "" },
  setParams: () => { }
});

function News() {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0); // Store totalResults
  const [bookmarks, setBookmarks] = useState(() => {
    // Load bookmarks from localStorage on initial render
    const savedBookmarks = localStorage.getItem("bookmarks");
    return savedBookmarks ? JSON.parse(savedBookmarks) : [];
  });
  const [likedArticles, setLikedArticles] = useState(() => {
    // Load from localStorage or initialize with the default structure
    const savedLikes = localStorage.getItem("likedArticles");
    return savedLikes
      ? JSON.parse(savedLikes)
      : {
        likedKeywords: [],
        likedCategories: [],
        likedSources: [],
      };
  });


  const { params } = useContext(ParamContext); // Access params from context
  const navigate = useNavigate(); // Hook to navigate between routes

  // Make API call to news api
  async function getNewsData() {
    setLoading(true);

    try {
      const resp = await axios.get(
        `https://newsapi.org/v2/everything?q=${params.keyword}&language=${params.language}&from=${params.from}&to=${params.to}&apiKey=828bf842c33f483bb89259b6304ecbc5&pageSize=5`
      );
      setNewsData(resp.data.articles);
      setTotalResults(resp.data.totalResults); // Extract and store totalResults
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    setLoading(false);
  }

  useEffect(() => {
    if (params.keyword || params.language) getNewsData();
  }, [params.keyword, params.language]);

  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem("likedArticles", JSON.stringify(likedArticles));
  }, [likedArticles]);

  const handleBookmark = (article) => {
    // Check if article is already bookmarked
    const isBookmarked = bookmarks.some((b) => b.url === article.url);
    if (isBookmarked) {
      // Remove bookmark
      setBookmarks(bookmarks.filter((b) => b.url !== article.url));
    } else {
      // Add bookmark
      setBookmarks([...bookmarks, article]);
    }
  };

  const isBookmarked = (article) => {
    return bookmarks.some((b) => b.url === article.url);
  };

  const handleLikeArticle = (article) => {
    const articleInfo = {
      keyword: params.keyword || "Unknown Keyword", // Use the current search keyword
      category: params.language || "General", // Use the current language as category
      source: article.source?.name || "Unknown Source", // Use the article's source
    };

    setLikedArticles((prev) => {
      // Create a copy of the existing structure
      const updatedLikedArticles = { ...prev };

      // Add the keyword if it doesn't already exist
      if (!updatedLikedArticles.likedKeywords.includes(articleInfo.keyword)) {
        updatedLikedArticles.likedKeywords.push(articleInfo.keyword);
      }

      // Add the category if it doesn't already exist
      if (!updatedLikedArticles.likedCategories.includes(articleInfo.category)) {
        updatedLikedArticles.likedCategories.push(articleInfo.category);
      }

      // Add the source if it doesn't already exist
      if (!updatedLikedArticles.likedSources.includes(articleInfo.source)) {
        updatedLikedArticles.likedSources.push(articleInfo.source);
      }

      return updatedLikedArticles; // Return the updated structure
    });
  };

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
                              e.preventDefault(); // Prevent navigation when clicking the icon
                              handleBookmark(article);
                            }}
                            title={isBookmarked(article) ? "Remove Bookmark" : "Add Bookmark"}
                          ></i>
                          <i
                            className="fas fa-thumbs-up"
                            onClick={(e) => {
                              e.preventDefault(); // Prevent default action
                              handleThumbClick(e); // Add animation
                              handleLikeArticle(article); // Add to likedArticles
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
            <button className="button show-more">Show more</button>
          </Container>
        )}
      </header>
    </div>
  );
}

// Create a provider component
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
          <Route path="/" element={<Mainscr />} />
        </Routes>
      </Router>
    </ParamProvider>
  );
}

export default App;
