
import { useState, useEffect } from "react";
import "./App.css";
import { Loader } from "./loader";

const API_KEY = "dc07c35b";
const API_URL = "https://www.omdbapi.com/";

function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch movies by search title
  const fetchMovies = async (searchQuery = "harry potter") => {
    const search = searchQuery.trim() || "harry potter";

    setLoading(true);
    setError("");
    setSelectedMovie(null);

    const response = await fetch(
      `${API_URL}?s=${encodeURIComponent(search)}&apikey=${API_KEY}`
    );

    const data = await response.json();

    if (data.Response === "True") {
      setMovies(data.Search || []);
    } else {
      setMovies([]);
      setError(data.Error || "Movies not found!");
    }

    setLoading(false);
  };

  // Fetch full movie details
  const fetchMovieDetails = async (movieId) => {
    setLoading(true);
    setError("");
    setSelectedMovie(null);

    const response = await fetch(
      `${API_URL}?i=${movieId}&apikey=${API_KEY}&plot=full`
    );

    const data = await response.json();

    if (data.Response === "True") {
      setSelectedMovie(data);
    } else {
      setError(data.Error || "Movie details not found!");
    }

    setLoading(false);
  };

  // Load default movies when the app starts
  useEffect(() => {
    fetchMovies();
  }, []);

  // Handle search form
  const handleSearch = (event) => {
    event.preventDefault();
    fetchMovies(query);
  };

  // Return to movie results
  const handleCloseDetails = () => {
    setSelectedMovie(null);
  };

  return (
    <div className="app">
      <header className="header">
        <h1 className="logo">Cine<span>World</span></h1>

        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search movies..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />

          <button type="submit">Search</button>
        </form>
      </header>

      <main className="main-content">
        {loading && <Loader/>}

        {error && !loading && (
          <h2 className="error-message">{error}</h2>
        )}

        {!loading && selectedMovie && (
          <section className="movie-details">
            <button
              className="close-button"
              onClick={handleCloseDetails}
            >
              Back to Movies
            </button>

            <div className="details-container">
              <div className="details-poster">
                <img
                  src={
                    selectedMovie.Poster !== "N/A"
                      ? selectedMovie.Poster
                      : "https://placehold.co/300x450?text=No+Poster"
                  }
                  alt={selectedMovie.Title}
                />
              </div>

              <div className="details-info">
                <h2>{selectedMovie.Title}</h2>

                <p>
                  <strong>Year:</strong> {selectedMovie.Year}
                </p>

                <p>
                  <strong>Released:</strong> {selectedMovie.Released}
                </p>

                <p>
                  <strong>Genre:</strong> {selectedMovie.Genre}
                </p>

                <p>
                  <strong>Director:</strong> {selectedMovie.Director}
                </p>

                <p>
                  <strong>Actors:</strong> {selectedMovie.Actors}
                </p>

                <p>
                  <strong>Language:</strong> {selectedMovie.Language}
                </p>

                <p>
                  <strong>IMDb Rating:</strong> {selectedMovie.imdbRating}
                </p>

                <p>
                  <strong>Plot:</strong> {selectedMovie.Plot}
                </p>
              </div>
            </div>
          </section>
        )}

        {!loading && !selectedMovie && !error && (
          <section className="movie-section">
            <h2 className="section-title">Popular Movies</h2>

            <div className="movie-container">
              {movies.map((movie) => (
                <div
                  className="movie-card"
                  key={movie.imdbID}
                  onClick={() => fetchMovieDetails(movie.imdbID)}
                >
                  <div className="movie-poster">
                    <img
                      src={
                        movie.Poster !== "N/A"
                          ? movie.Poster
                          : "https://placehold.co/300x450?text=No+Poster"
                      }
                      alt={movie.Title}
                    />
                  </div>

                  <div className="movie-info">
                    <h3>{movie.Title}</h3>
                    <p>{movie.Year}</p>
                    <span>{movie.Type}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
