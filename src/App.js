import './App.css';
import axios from 'axios';
import { useEffect, useState, useContext, createContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Mainscr from './mainscr';

// Create the context
export const ParamContext = createContext({
  params: { keyword: "", language: "" },
  setParams: () => { }
});


function News() {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { params } = useContext(ParamContext); // Access params from context

  // Make API call to news api
  async function getNewsData() {
    setLoading(true);

    try {
      const resp = await axios.get(`https://newsapi.org/v2/everything?q=${params.keyword}&language=${params.language}
        &apiKey=828bf842c33f483bb89259b6304ecbc5&pageSize=10`);
      setNewsData(resp.data.articles);
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    setLoading(false);
  }

  useEffect(() => {
    if (params.keyword || params.language) getNewsData();
  }, [params.keyword, params.language]);

  return (
    <div className="App">
      <header className="App-header">
        {loading ? "Loading..." : <Container>
          {newsData.map((article, index) =>
            <Row className="d-flex justify-content-center" key={index}>
              <Col xs={12} md={10} lg={8} className="mt-5">
                <a target="_blank" rel="noopener noreferrer" href={article.url}>
                  <Card>
                    <Card.Body className="card-body">
                      <Card.Title className="my-3">  {article.title}</Card.Title>
                      <Card.Img src={article.urlToImage} className="small-image" />
                    </Card.Body>
                    <Card.Footer>
                      <Card.Text>
                        {article.description}
                      </Card.Text>
                    </Card.Footer>
                  </Card>
                </a>
              </Col>
            </Row>
          )}
        </Container>}
      </header>
    </div>
  );
}

// Create a provider component
export const ParamProvider = ({ children }) => {
  const [params, setParams] = useState({ keyword: "", language: "" });

  return (
    <ParamContext.Provider value={{ params, setParams }}>
      {children}
    </ParamContext.Provider>
  );
};

function App() {
  return (
    <ParamProvider>
      <Router>
        <Routes>
          <Route path="/App" element={<News />} />
          <Route path="/" element={<Mainscr />} />
        </Routes>
      </Router>
    </ParamProvider>
  );
}

export default App;
