import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const HiddenGemOfTheDay = ({ allowAdultContent = false, userId }) => {
  const [movie, setMovie] = useState(null);
  const [genreMap, setGenreMap] = useState({});

  const getTodayKey = () => {
    const today = new Date().toDateString();
    return `hiddenGem_${userId}_${today}`;
  };

  const getCachedMovie = () => {
    const key = getTodayKey();
    const cached = localStorage.getItem(key);
    return cached ? JSON.parse(cached) : null;
  };

  const setCachedMovie = (movieData) => {
    const key = getTodayKey();
    localStorage.setItem(key, JSON.stringify(movieData));
  };

  const token = import.meta.env.VITE_TMDB_TOKEN;

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    if (!userId) return;

    // Check if we have a cached movie for today
    const cachedMovie = getCachedMovie();
    if (cachedMovie) {
      setMovie(cachedMovie);
      return;
    }

    // Fetch genre list first
    fetch('https://api.themoviedb.org/3/genre/movie/list?language=en-US', options)
      .then((res) => res.json())
      .then((res) => {
        const genres = res.genres || [];
        const map = {};
        genres.forEach(genre => {
          map[genre.id] = genre.name;
        });
        setGenreMap(map);
      })
      .catch((err) => console.error(err));

    // Use same algorithm as Hidden Gems to find indie films
    const randomPage = Math.floor(Math.random() * 5) + 1;
    const url = `https://api.themoviedb.org/3/discover/movie?language=en-US&page=${randomPage}&sort_by=vote_average.desc&vote_average.gte=6.5&vote_count.gte=50&vote_count.lte=1000&primary_release_date.gte=2000-01-01&with_runtime.gte=80&include_adult=${allowAdultContent}`;

    fetch(url, options)
      .then((res) => res.json())
      .then((res) => {
        const movies = res.results || [];
        
        // Filter for indie characteristics (same as Hidden Gems)
        const indieMovies = movies.filter(movie => {
          const hasModerateVotes = movie.vote_count >= 50 && movie.vote_count <= 1000;
          const hasGoodRating = movie.vote_average >= 6.5;
          const hasDescription = movie.overview && movie.overview.length > 50;
          const hasBackdrop = movie.backdrop_path;
          
          return hasModerateVotes && hasGoodRating && hasDescription && hasBackdrop;
        });

        // Pick a random movie from the filtered results
        if (indieMovies.length > 0) {
          const randomIndex = Math.floor(Math.random() * indieMovies.length);
          const selectedMovie = indieMovies[randomIndex];
          
          // Fetch detailed info for the selected movie
          fetch(`https://api.themoviedb.org/3/movie/${selectedMovie.id}?language=en-US`, options)
            .then(res => res.json())
            .then(details => {
              setMovie(details);
              setCachedMovie(details);
            })
            .catch(err => console.error(err));
        }
      })
      .catch((err) => console.error(err));
  }, [allowAdultContent, userId]);

  if (!movie) {
    return null;
  }

  return (
    <div className="text-white md:px-4 mb-4">
      <h2 className="pt-10 pb-5 text-2xl font-bold">HIDDEN GEM OF THE DAY</h2>
      
      <div className="bg-[#1F1B24] rounded-lg overflow-hidden shadow-lg">
        <div className="flex flex-col md:flex-row">
          {/* Left side - Movie backdrop */}
          <div className="md:w-1/2">
            <Link to={`/movie/${movie.id}`}>
              <img
                src={`https://image.tmdb.org/t/p/w780/${movie.backdrop_path}`}
                alt={movie.title}
                className="w-full h-48 md:h-64 object-cover hover:scale-105 transition-transform duration-300"
              />
            </Link>
          </div>
          
          {/* Right side - Movie details */}
          <div className="md:w-1/2 p-4">
            <Link to={`/movie/${movie.id}`}>
              <h3 className="text-2xl font-bold mb-2 hover:text-gray-300 transition-colors">
                {movie.title}
              </h3>
            </Link>
            
            <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
              <span>⭐ {movie.vote_average?.toFixed(1)}</span>
              <span>{movie.release_date?.slice(0, 4)}</span>
              <span>{movie.runtime} min</span>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {movie.genres?.slice(0, 3).map((genre) => (
                <span
                  key={genre.id}
                  className="text-xs px-2 py-1 rounded-full bg-gray-600 text-gray-200"
                >
                  {genre.name}
                </span>
              ))}
            </div>
            
            <p className="text-gray-200 leading-relaxed mb-4">
              {movie.overview}
            </p>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
              {movie.production_countries?.length > 0 && (
                <span>
                  <strong>Country:</strong> {movie.production_countries[0].name}
                </span>
              )}
              {movie.budget && movie.budget < 50000000 && (
                <span>
                  <strong>Budget:</strong> ${(movie.budget / 1000000).toFixed(1)}M
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HiddenGemOfTheDay;