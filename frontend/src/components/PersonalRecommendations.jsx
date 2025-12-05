import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

const PersonalRecommendations = ({ userTags, allowAdultContent = false, favoriteMovies = [] }) => {
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
      'war': 10752, 'western': 37, 'anime': 16
    };

    return tags
      .map(tag => genreMap[tag.toLowerCase()])
      .filter(Boolean)
      .slice(0, 3); // Limit to 3 genres for better results
  };

  useEffect(() => {
    // Add timestamp and random seed to prevent caching same results
    const timestamp = Date.now();
    const randomSeed = Math.floor(Math.random() * 10000);
    console.log('🎬 PersonalRecommendations Debug - Starting fetch');
    console.log('📊 Timestamp:', timestamp, 'Random Seed:', randomSeed);
    console.log('🏷️ User Tags:', userTags);
    console.log('⭐ Favorite Movies:', favoriteMovies);
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

    if ((!userTags || userTags.length === 0) && (!favoriteMovies || favoriteMovies.length === 0)) return;

    const genreIds = getGenreIds(userTags || []);
    
    // Fetch movies from multiple different approaches for better variety
    const fetchPromises = [];
    
    let favoriteApiCallCount = 0;
    
    // Add recommendations based on favorited movies (use more favorites)
    if (favoriteMovies && favoriteMovies.length > 0) {
      favoriteMovies.slice(0, 4).forEach((movieId, idx) => {
        // Get recommendations from different pages for variety
        const randomPage = Math.floor(Math.random() * 3) + 1;
        const url = `https://api.themoviedb.org/3/movie/${movieId}/recommendations?language=en-US&page=${randomPage}&_t=${timestamp + idx + 100}&_r=${randomSeed + idx}`;
        console.log(`🎬 Favorite movie ${movieId} recommendations (page ${randomPage}):`, url);
        fetchPromises.push(fetch(url, options).then(res => res.json()));
        favoriteApiCallCount++;
      });
      
      // Add similar movies for more variety
      favoriteMovies.slice(0, 2).forEach((movieId, idx) => {
        const url = `https://api.themoviedb.org/3/movie/${movieId}/similar?language=en-US&page=1&_t=${timestamp + idx + 200}&_r=${randomSeed + idx + 100}`;
        console.log(`🔄 Similar to favorite movie ${movieId}:`, url);
        fetchPromises.push(fetch(url, options).then(res => res.json()));
        favoriteApiCallCount++;
      });
      
      // Add keyword-based search for animal/furry content
      const animalKeywords = ['animal', 'furry', 'anthropomorphic', 'talking animals', 'cartoon animals'];
      animalKeywords.slice(0, 2).forEach((keyword, idx) => {
        const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(keyword)}&language=en-US&page=1&include_adult=${allowAdultContent}&_t=${timestamp + idx + 400}&_r=${randomSeed + idx + 300}`;
        console.log(`🐾 Animal keyword search (${keyword}):`, url);
        fetchPromises.push(fetch(url, options).then(res => res.json()));
        favoriteApiCallCount++;
      });
    }
    
    // 1. Fetch with all user genres (after favorite calls)
    if (genreIds.length > 0) {
      const randomPage1 = Math.floor(Math.random() * 20) + 1;
      const tagString = (userTags || []).join(' ').toLowerCase();
      let url1 = `https://api.themoviedb.org/3/discover/movie?language=en-US&page=${randomPage1}&sort_by=vote_average.desc&with_genres=${genreIds.join(',')}&vote_average.gte=6.5&vote_count.gte=100&include_adult=${allowAdultContent}`;
      
      // Add country filter for anime
      if (tagString.includes('anime') || tagString.includes('japanese')) {
        url1 += '&with_origin_country=JP';
        console.log('🎌 Adding Japan filter for anime');
      }
      
      url1 += `&_t=${timestamp}&_r=${randomSeed}`;
      console.log('🔗 API Call 1 (Main genres):', url1);
      fetchPromises.push(fetch(url1, options).then(res => res.json()));
    }
    
    // 2. Fetch with individual genres for variety
    genreIds.slice(0, 2).forEach((genreId, idx) => {
      const randomPage2 = Math.floor(Math.random() * 25) + 1;
      const sortOptions = ['popularity.desc', 'vote_average.desc', 'release_date.desc'];
      const randomSort = sortOptions[Math.floor(Math.random() * sortOptions.length)];
      const tagString = (userTags || []).join(' ').toLowerCase();
      let url2 = `https://api.themoviedb.org/3/discover/movie?language=en-US&page=${randomPage2}&sort_by=${randomSort}&with_genres=${genreId}&vote_average.gte=6.0&vote_count.gte=50&include_adult=${allowAdultContent}`;
      
      // Add country filter for anime
      if (tagString.includes('anime') || tagString.includes('japanese')) {
        url2 += '&with_origin_country=JP';
      }
      
      url2 += `&_t=${timestamp + idx}&_r=${randomSeed + idx}`;
      console.log(`🔗 API Call ${idx + 2} (Individual genre ${genreId}):`, url2);
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
    
    // If no user tags, add only 1 high-quality discovery call for minimal variety
    if (!userTags || userTags.length === 0) {
      const randomPage = Math.floor(Math.random() * 3) + 1;
      let url = `https://api.themoviedb.org/3/discover/movie?language=en-US&page=${randomPage}&sort_by=vote_average.desc&vote_average.gte=7.5&vote_count.gte=500&include_adult=${allowAdultContent}&_t=${timestamp + 300}&_r=${randomSeed + 200}`;
      console.log(`🎲 High-quality discovery:`, url);
      fetchPromises.push(fetch(url, options).then(res => res.json()));
    }

    Promise.all(fetchPromises)
      .then(responses => {
        console.log('📥 API Responses received:', responses.length);
        responses.forEach((res, idx) => {
          console.log(`📊 Response ${idx + 1}:`, res.results?.length || 0, 'movies');
        });
        
        // Combine all results and track source
        const allMovies = [];
        const favoriteBasedMovieIds = new Set();
        
        responses.forEach((res, index) => {
          if (res.results) {
            // Mark movies from favorite recommendations (first API calls based on favoriteApiCallCount)
            const isFromFavoriteAPI = index < favoriteApiCallCount;
            
            res.results.forEach(movie => {
              allMovies.push(movie);
              if (isFromFavoriteAPI) {
                favoriteBasedMovieIds.add(movie.id);
              }
            });
          }
        });
        
        // Remove duplicates based on movie ID
        const uniqueMovies = allMovies.filter((movie, index, self) => 
          index === self.findIndex(m => m.id === movie.id)
        );
        
        console.log('🎭 Total movies before dedup:', allMovies.length);
        console.log('🎭 Unique movies after dedup:', uniqueMovies.length);
        
        // Score movies based on how many user preferences they match
        const scoredMovies = uniqueMovies.map(movie => {
          let score = 0;
          let matchedPreferences = new Set();
          const isFromFavorites = favoriteBasedMovieIds.has(movie.id);
          const movieGenres = movie.genre_ids?.map(id => genreMap[id]).filter(Boolean) || [];
          const userPrefs = (userTags || []).map(tag => tag.toLowerCase());
          
          // Analyze title and synopsis for keyword matches
          const movieTitle = (movie.title || '').toLowerCase();
          const movieOverview = (movie.overview || '').toLowerCase();
          const movieText = `${movieTitle} ${movieOverview}`;
          
          // Bonus score for movies from favorites (reduced to ensure mix)
          if (isFromFavorites) {
            score += 3; // Moderate bonus for favorite-based recommendations
          }
          
          // Score for direct genre matches
          movieGenres.forEach(genre => {
            userPrefs.forEach(pref => {
              if (pref === genre.toLowerCase()) {
                score += 5; // High score for direct matches
                matchedPreferences.add(pref);
              }
            });
          });
          
          // Score for title and synopsis keyword matches
          userPrefs.forEach(pref => {
            // Direct keyword match in title (higher weight)
            if (movieTitle.includes(pref)) {
              score += 4;
              matchedPreferences.add(pref);
            }
            // Direct keyword match in synopsis
            else if (movieOverview.includes(pref)) {
              score += 2;
              matchedPreferences.add(pref);
            }
            
            // Keyword variations and related terms
            const keywordVariations = {
              'anime': ['animation', 'animated', 'manga', 'studio ghibli', 'miyazaki', 'japanese animation'],
              'horror': ['scary', 'terrifying', 'nightmare', 'haunted', 'ghost', 'demon', 'zombie'],
              'comedy': ['funny', 'hilarious', 'humor', 'laugh', 'comic', 'parody'],
              'action': ['fight', 'battle', 'combat', 'explosive', 'chase', 'martial arts'],
              'romance': ['love', 'romantic', 'relationship', 'couple', 'dating', 'marriage'],
              'sci-fi': ['science fiction', 'futuristic', 'space', 'alien', 'robot', 'cyberpunk'],
              'thriller': ['suspense', 'tension', 'mystery', 'psychological', 'intense'],
              'drama': ['emotional', 'family', 'life', 'personal', 'character study'],
              'fantasy': ['magic', 'magical', 'wizard', 'dragon', 'mythical', 'supernatural'],
              'crime': ['detective', 'police', 'murder', 'investigation', 'criminal', 'heist'],
              'war': ['military', 'soldier', 'battle', 'combat', 'world war', 'vietnam'],
              'western': ['cowboy', 'frontier', 'gunfighter', 'saloon', 'sheriff'],
              'dark': ['noir', 'gritty', 'disturbing', 'twisted', 'psychological'],
              'indie': ['independent', 'art house', 'festival', 'low budget'],
              'classic': ['timeless', 'legendary', 'iconic', 'masterpiece', 'golden age'],
              'animal': ['animals', 'creature', 'beast', 'wildlife', 'pet', 'dog', 'cat', 'wolf', 'bear', 'lion', 'tiger', 'fox', 'rabbit', 'mouse', 'bird', 'dragon', 'dinosaur'],
              'furry': ['anthropomorphic', 'talking animals', 'cartoon animals', 'animated animals', 'animal characters', 'mascot', 'creature feature'],
              'anthropomorphic': ['furry', 'talking animals', 'humanoid animals', 'animal people', 'cartoon animals'],
              'talking': ['speaking animals', 'animal voices', 'anthropomorphic', 'cartoon animals']
            };
            
            // Enhanced animal/furry content detection
            const animalKeywords = ['animal', 'animals', 'furry', 'anthropomorphic', 'talking', 'creature', 'beast', 'wildlife', 'pet', 'dog', 'cat', 'wolf', 'bear', 'lion', 'tiger', 'fox', 'rabbit', 'mouse', 'bird', 'dragon', 'dinosaur', 'cartoon animals', 'animated animals', 'mascot', 'humanoid', 'animal characters'];
            animalKeywords.forEach(keyword => {
              if (movieText.includes(keyword)) {
                score += 4;
                matchedPreferences.add('animal');
              }
            });
            
            const variations = keywordVariations[pref] || [];
            variations.forEach(variation => {
              if (movieText.includes(variation)) {
                score += 1.5;
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
            'mysterious': ['mystery', 'thriller'],
            'anime': ['animation']
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
          
          return { ...movie, preferenceScore: score, matchedCount: matchedPreferences.size, isFromFavorites };
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
        
        // Ensure a good mix of favorite-based and tag-based movies
        const favoriteBasedMovies = sortedByScore.filter(movie => movie.isFromFavorites);
        const tagBasedMovies = sortedByScore.filter(movie => !movie.isFromFavorites);
        
        // Take up to 15 favorite-based and fill the rest with tag-based
        const selectedFavoriteMovies = favoriteBasedMovies.slice(0, 15);
        const selectedTagMovies = tagBasedMovies.slice(0, 5);
        
        // Combine and shuffle for variety with multiple randomization passes
        const combinedMovies = [...selectedFavoriteMovies, ...selectedTagMovies];
        
        console.log('⭐ Favorite-based movies:', selectedFavoriteMovies.length);
        console.log('🏷️ Tag-based movies:', selectedTagMovies.length);
        console.log('🎲 Combined movies before shuffle:', combinedMovies.length);
        
        // Multiple shuffle passes for better randomization
        for (let i = 0; i < 3; i++) {
          combinedMovies.sort(() => Math.random() - 0.5);
        }
        
        // Take a random slice from the shuffled array (ensure we get variety)
        let selectedMovies;
        let startIndex = 0;
        if (combinedMovies.length <= 20) {
          selectedMovies = combinedMovies;
        } else {
          startIndex = Math.floor(Math.random() * Math.max(1, combinedMovies.length - 20));
          selectedMovies = combinedMovies.slice(startIndex, startIndex + 20);
        }
        
        console.log('🎯 Start index for slice:', startIndex);
        console.log('🎬 Final selected movies:', selectedMovies.length);
        console.log('📋 Movie titles:', selectedMovies.map(m => m.title));
        
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
      'anime': ['JP'],
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
          loop={true}
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
            <div className={`${item.isFromFavorites ? 'border-2 border-yellow-400 rounded-lg overflow-hidden' : ''}`}>
              <img
                src={`https://image.tmdb.org/t/p/w500/${item.backdrop_path}`}
                alt=""
                className="h-44 w-full object-center object-cover shadow-md"
                onError={(e) => {
                  e.target.src = item.poster_path ? `https://image.tmdb.org/t/p/w500/${item.poster_path}` : '/placeholder-movie.jpg';
                }}
              />
            </div>
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