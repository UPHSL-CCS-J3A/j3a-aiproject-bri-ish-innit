import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const HiddenGemsSection = ({ allowAdultContent = false, supportIndie = true, userId }) => {
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [carouselMovies, setCarouselMovies] = useState([]);
  const [swiperRef, setSwiperRef] = useState(null);

  const token = import.meta.env.VITE_TMDB_TOKEN;

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  // Daily caching functions for featured movie
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

  useEffect(() => {
    if (!supportIndie) return;
    if (!userId) return;

    // Check if we have a cached featured movie for today
    const cachedMovie = getCachedMovie();
    if (cachedMovie) {
      setFeaturedMovie(cachedMovie);
    }

    // Fetch multiple pages of movies with indie-friendly criteria
    const fetchPromises = [];
    
    for (let i = 1; i <= 3; i++) {
      const randomPage = Math.floor(Math.random() * 10) + 1;
      const url = `https://api.themoviedb.org/3/discover/movie?language=en-US&page=${randomPage}&sort_by=vote_average.desc&vote_average.gte=6.0&vote_count.gte=50&vote_count.lte=100000&primary_release_date.gte=2010-01-01&include_adult=${allowAdultContent}`;
      fetchPromises.push(fetch(url, options).then(res => res.json()));
    }

    Promise.all(fetchPromises)
      .then(responses => {
        const allMovies = [];
        responses.forEach(res => {
          if (res.results) {
            allMovies.push(...res.results);
          }
        });

        // Filter for indie characteristics
        const indieMovies = allMovies.filter(movie => {
          const hasModerateVotes = movie.vote_count >= 50 && movie.vote_count <= 100000;
          const hasGoodRating = movie.vote_average >= 6.0;
          const hasDescription = movie.overview && movie.overview.length > 50;
          const hasBackdrop = movie.backdrop_path;
          const isNotTooOld = new Date(movie.release_date) >= new Date('2010-01-01');
          
          return hasModerateVotes && hasGoodRating && hasDescription && hasBackdrop && isNotTooOld;
        });

        // Set carousel movies
        const shuffledMovies = indieMovies.sort(() => 0.5 - Math.random()).slice(0, 20);
        setCarouselMovies(shuffledMovies);

        // Set featured movie if not cached
        if (!cachedMovie && indieMovies.length > 0) {
          const randomIndex = Math.floor(Math.random() * indieMovies.length);
          const selectedMovie = indieMovies[randomIndex];
          
          fetch(`https://api.themoviedb.org/3/movie/${selectedMovie.id}?language=en-US`, options)
            .then(res => res.json())
            .then(details => {
              setFeaturedMovie(details);
              setCachedMovie(details);
            })
            .catch(err => console.error(err));
        }
      })
      .catch(err => console.error(err));
  }, [allowAdultContent, supportIndie, userId]);

  if (!supportIndie) {
    return null;
  }

  return (
    <div className="text-white px-5 bg-[#3E4A5C] pb-8">
      <div className="pt-10 pb-5 flex items-center gap-3">
        <h2 className="text-2xl font-bold">HIDDEN GEMS</h2>
        <span className="text-gray-500">•</span>
        <span className="text-lg text-gray-400">Featured Today</span>
      </div>
      
      {/* Featured Movie of the Day */}
      {featuredMovie && (
        <div className="mb-6">
          <Link to={`/movie/${featuredMovie.id}`}>
            <div className="bg-gradient-to-r from-[#7a051d] to-[#d2172d] rounded-lg overflow-hidden shadow-lg hover:scale-[1.005] hover:shadow-2xl transition-all duration-300 ease-in-out">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2">
                  <img
                    src={`https://image.tmdb.org/t/p/w780/${featuredMovie.backdrop_path}`}
                    alt={featuredMovie.title}
                    className="w-full h-48 md:h-64 object-cover"
                  />
                </div>
              
              <div className="md:w-1/2 p-4">
                <h4 className="text-3xl font-bold mb-2 text-white">
                  {featuredMovie.title}
                </h4>
                
                <div className="flex items-center gap-4 mb-3 text-sm text-gray-400">
                  <span>⭐ {featuredMovie.vote_average?.toFixed(1)}</span>
                  <span>{featuredMovie.release_date?.slice(0, 4)}</span>
                  <span>{featuredMovie.runtime} min</span>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {featuredMovie.genres?.slice(0, 3).map((genre) => (
                    <span
                      key={genre.id}
                      className="text-xs px-2 py-1 rounded-full bg-gray-600 text-gray-200"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
                
                <p className="text-gray-200 leading-relaxed text-sm">
                  {featuredMovie.overview?.length > 200 
                    ? `${featuredMovie.overview.substring(0, 200)}...` 
                    : featuredMovie.overview
                  }
                </p>
              </div>
            </div>
            </div>
          </Link>
        </div>
      )}

      {/* Carousel */}
      {carouselMovies.length > 0 && (
        <div className="relative group">
          <Swiper 
            slidesPerView={"auto"} 
            spaceBetween={20} 
            className="mySwiper"
            onSwiper={setSwiperRef}
          >
            <button 
              onClick={() => swiperRef?.slideNext()}
              className="absolute right-4 top-24 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 cursor-pointer"
            >
              <ArrowRight className="text-white bg-black/50 rounded-full p-2" size={40} />
            </button>
            {carouselMovies.map((item, index) => (
              <SwiperSlide key={index} className="max-w-72">
                <Link to={`/movie/${item.id}`}>
                  <img
                    src={`https://image.tmdb.org/t/p/w500/${item.backdrop_path}`}
                    alt=""
                    className="h-44 w-full object-center object-cover shadow-md"
                  />
                  <div className="text-left pt-2">
                    <p className="font-medium mb-1">{item.title}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <span>⭐ {item.vote_average?.toFixed(1)}</span>
                      <span>•</span>
                      <span>{item.release_date?.slice(0, 4)}</span>
                      <span>•</span>
                      <span className="text-xs bg-green-600 px-2 py-1 rounded-full">INDIE</span>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
};

export default HiddenGemsSection;