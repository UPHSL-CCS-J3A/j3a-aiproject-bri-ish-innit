import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

const PersonalRecommendations = ({ userTags, allowAdultContent = false }) => {
  const [data, setData] = useState([]);
  const [swiperRef, setSwiperRef] = useState(null);
  const [genreMap, setGenreMap] = useState({});
  const [movieDetails, setMovieDetails] = useState({});

  const token = import.meta.env.VITE_TMDB_TOKEN;

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  // Map user tags to TMDB genres and keywords
  const getGenreIds = (tags) => {
    const genreMap = {
      'action': 28, 'adventure': 12, 'animation': 16, 'comedy': 35,
      'crime': 80, 'documentary': 99, 'drama': 18, 'family': 10751,
      'fantasy': 14, 'history': 36, 'horror': 27, 'music': 10402,
      'mystery': 9648, 'romance': 10749, 'sci-fi': 878, 'thriller': 53,
      'war': 10752, 'western': 37
    };

    return tags
      .map(tag => genreMap[tag.toLowerCase()])
      .filter(Boolean)
      .slice(0, 3); // Limit to 3 genres for better results
  };

  useEffect(() => {
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

    if (!userTags || userTags.length === 0) return;

    const genreIds = getGenreIds(userTags);
    
    // Fetch movies from multiple different approaches for better variety
    const fetchPromises = [];
    
    // 1. Fetch with all user genres
    if (genreIds.length > 0) {
      const randomPage1 = Math.floor(Math.random() * 3) + 1;
      let url1 = `https://api.themoviedb.org/3/discover/movie?language=en-US&page=${randomPage1}&sort_by=vote_average.desc&with_genres=${genreIds.join(',')}&vote_average.gte=6.5&vote_count.gte=100&include_adult=${allowAdultContent}`;
      fetchPromises.push(fetch(url1, options).then(res => res.json()));
    }
    
    // 2. Fetch with individual genres for variety
    genreIds.slice(0, 2).forEach(genreId => {
      const randomPage2 = Math.floor(Math.random() * 5) + 1;
      let url2 = `https://api.themoviedb.org/3/discover/movie?language=en-US&page=${randomPage2}&sort_by=popularity.desc&with_genres=${genreId}&vote_average.gte=6.0&vote_count.gte=50&include_adult=${allowAdultContent}`;
      fetchPromises.push(fetch(url2, options).then(res => res.json()));
    });
    
    // 3. Add time-based filters for variety
    const tagString = userTags.join(' ').toLowerCase();
    if (tagString.includes('retro') || tagString.includes('classic')) {
      const randomPage3 = Math.floor(Math.random() * 3) + 1;
      let url3 = `https://api.themoviedb.org/3/discover/movie?language=en-US&page=${randomPage3}&sort_by=vote_average.desc&primary_release_date.lte=1999-12-31&vote_average.gte=6.5&vote_count.gte=100&include_adult=${allowAdultContent}`;
      fetchPromises.push(fetch(url3, options).then(res => res.json()));
    }
    if (tagString.includes('new') || tagString.includes('recent')) {
      const randomPage4 = Math.floor(Math.random() * 3) + 1;
      let url4 = `https://api.themoviedb.org/3/discover/movie?language=en-US&page=${randomPage4}&sort_by=popularity.desc&primary_release_date.gte=2020-01-01&vote_average.gte=6.0&vote_count.gte=50&include_adult=${allowAdultContent}`;
      fetchPromises.push(fetch(url4, options).then(res => res.json()));
    }

    Promise.all(fetchPromises)
      .then(responses => {
        // Combine all results
        const allMovies = [];
        responses.forEach(res => {
          if (res.results) {
            allMovies.push(...res.results);
          }
        });
        
        // Remove duplicates based on movie ID
        const uniqueMovies = allMovies.filter((movie, index, self) => 
          index === self.findIndex(m => m.id === movie.id)
        );
        
        // Score movies based on how many user preferences they match
        const scoredMovies = uniqueMovies.map(movie => {
          let score = 0;
          let matchedPreferences = new Set();
          const movieGenres = movie.genre_ids?.map(id => genreMap[id]).filter(Boolean) || [];
          const userPrefs = userTags.map(tag => tag.toLowerCase());
          
          // Score for direct genre matches
          movieGenres.forEach(genre => {
            userPrefs.forEach(pref => {
              if (pref === genre.toLowerCase()) {
                score += 5; // High score for direct matches
                matchedPreferences.add(pref);
              }
            });
          });
          
          // Score for synonym matches
          const synonyms = {
            'dark': ['horror', 'thriller', 'crime'],
            'indie': ['drama', 'documentary'],
            'retro': ['western', 'music'],
            'classic': ['drama', 'romance'],
            'funny': ['comedy'],
            'scary': ['horror'],
            'romantic': ['romance'],
            'action-packed': ['action'],
            'mysterious': ['mystery', 'thriller']
          };
          
          userPrefs.forEach(pref => {
            if (synonyms[pref]) {
              movieGenres.forEach(genre => {
                if (synonyms[pref].includes(genre.toLowerCase())) {
                  score += 3; // Medium score for synonym matches
                  matchedPreferences.add(pref);
                }
              });
            }
          });
          
          // Diversity bonus: reward movies that match multiple different preferences
          const diversityBonus = Math.min(matchedPreferences.size * 2, userPrefs.length * 2);
          score += diversityBonus;
          
          // Penalty for movies that only match one preference when user has many
          if (userPrefs.length > 2 && matchedPreferences.size === 1) {
            score -= 2;
          }
          
          // Bonus for higher ratings (but less impact than preference matching)
          if (movie.vote_average >= 7.5) score += 0.5;
          if (movie.vote_average >= 8.0) score += 0.5;
          
          return { ...movie, preferenceScore: score, matchedCount: matchedPreferences.size };
        });
        
        // Sort by preference score and diversity, then by rating
        const sortedByScore = scoredMovies.sort((a, b) => {
          // First priority: movies that match more different preferences
          if (b.matchedCount !== a.matchedCount) {
            return b.matchedCount - a.matchedCount;
          }
          // Second priority: total preference score
          if (b.preferenceScore !== a.preferenceScore) {
            return b.preferenceScore - a.preferenceScore;
          }
          // Third priority: rating
          if (b.vote_average !== a.vote_average) {
            return b.vote_average - a.vote_average;
          }
          // Finally: random for variety
          return Math.random() - 0.5;
        });
        
        const selectedMovies = sortedByScore.slice(0, 20);
        setData(selectedMovies);
        
        // Fetch detailed info for each movie to get origin countries
        selectedMovies.forEach(movie => {
          fetch(`https://api.themoviedb.org/3/movie/${movie.id}?language=en-US`, options)
            .then(res => res.json())
            .then(details => {
              setMovieDetails(prev => ({
                ...prev,
                [movie.id]: details
              }));
            })
            .catch(err => console.error(err));
        });
      })
      .catch((err) => console.error(err));
  }, [userTags]);

  const getMovieGenres = (movie) => {
    if (!movie.genre_ids || !genreMap) return { highlighted: [], normal: [] };
    
    const movieGenres = movie.genre_ids.map(id => genreMap[id]).filter(Boolean);
    const userPrefs = userTags.map(tag => tag.toLowerCase());
    const details = movieDetails[movie.id];
    
    // Country mapping for preferences
    const countryMap = {
      'filipino': ['PH'],
      'korean': ['KR'],
      'k-drama': ['KR'],
      'japanese': ['JP'],
      'chinese': ['CN'],
      'indian': ['IN'],
      'bollywood': ['IN'],
      'french': ['FR'],
      'german': ['DE'],
      'italian': ['IT'],
      'spanish': ['ES'],
      'mexican': ['MX'],
      'british': ['GB'],
      'american': ['US'],
      'canadian': ['CA'],
      'australian': ['AU']
    };
    
    // Enhanced matching with synonyms and country origins
    const isHighlighted = (genre) => {
      const genreLower = genre.toLowerCase();
      return userPrefs.some(userPref => {
        // Direct match
        if (userPref === genreLower) return true;
        
        // Synonym matching
        const synonyms = {
          'dark': ['horror', 'thriller', 'crime'],
          'indie': ['drama', 'documentary'],
          'retro': ['western', 'music'],
          'classic': ['drama', 'romance'],
          'funny': ['comedy'],
          'scary': ['horror'],
          'romantic': ['romance'],
          'action-packed': ['action'],
          'mysterious': ['mystery', 'thriller']
        };
        
        return synonyms[userPref]?.includes(genreLower) || false;
      });
    };
    
    const highlighted = movieGenres.filter(isHighlighted);
    const normal = movieGenres.filter(genre => !isHighlighted(genre));
    
    // Check for country-based preferences and add country names
    const countryTags = [];
    const countryNames = [];
    if (details?.production_countries) {
      const movieCountries = details.production_countries.map(c => c.iso_3166_1);
      
      userPrefs.forEach(pref => {
        const requiredCountries = countryMap[pref];
        if (requiredCountries && requiredCountries.some(country => movieCountries.includes(country))) {
          countryTags.push(pref.charAt(0).toUpperCase() + pref.slice(1));
        }
      });
      
      // Also add actual country names for display
      details.production_countries.forEach(country => {
        if (country.name && !countryNames.includes(country.name)) {
          countryNames.push(country.name);
        }
      });
    }
    
    // Add other custom tags that don't match genres or countries (only non-country preferences)
    const otherCustomTags = userPrefs.filter(pref => {
      const hasDirectMatch = movieGenres.some(genre => genre.toLowerCase() === pref);
      const hasSynonymMatch = movieGenres.some(genre => isHighlighted(genre));
      const isCountryPref = countryMap[pref]; // Don't show country prefs unless they actually match
      return !hasDirectMatch && !hasSynonymMatch && !isCountryPref && ['dark', 'indie'].includes(pref);
    });
    
    return { 
      highlighted: [
        ...highlighted, 
        ...countryTags,
        ...otherCustomTags.map(tag => tag.charAt(0).toUpperCase() + tag.slice(1))
      ], 
      normal: [
        ...normal,
        ...countryNames.slice(0, 2) // Show up to 2 country names
      ]
    };
  };

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="text-white md:px-4 group">
      <h2 className="pt-10 pb-5 text-2xl font-bold">PERSONAL RECOMMENDATIONS</h2>

      <div className="relative">
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
        {data?.map((item, index) => (
          <SwiperSlide key={index} className="max-w-72">
            <Link to={`/movie/${item.id}`}>
            <img
              src={`https://image.tmdb.org/t/p/w500/${item.backdrop_path}`}
              alt=""
              className="h-44 w-full object-center object-cover shadow-md"
            />
            <div className="text-left pt-2">
              <p className="font-medium mb-2">{item.title}</p>
              <div className="flex flex-wrap gap-1">
                {(() => {
                  const { highlighted, normal } = getMovieGenres(item);
                  const allGenres = [...highlighted, ...normal];
                  
                  return allGenres.map((genre, idx) => (
                    <span
                      key={idx}
                      className={`text-xs px-2 py-1 rounded-full ${
                        highlighted.includes(genre)
                          ? 'bg-gradient-to-r from-[#7a051d] to-[#d2172d] text-white'
                          : 'bg-gray-600 text-gray-200'
                      }`}
                    >
                      {genre}
                    </span>
                  ));
                })()}
              </div>
            </div>

            </Link>
          </SwiperSlide>
        ))}
        </Swiper>
      </div>
    </div>
  );
};

export default PersonalRecommendations;