
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';

const RecommendedMovies = ({movieTitles}) => {
  const token = import.meta.env.VITE_TMDB_TOKEN;
  
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  };

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMovie = async (title) => {
    const encodedTitle = encodeURIComponent(title);
    const url = `https://api.themoviedb.org/3/search/movie?query=${encodedTitle}&include_adult=false&language=en-US&page=1`

    try {
        const res = await fetch(url, options)
        const data = await res.json();
        return data.results?.[0] || null;

    } catch (error) {
        console.log("Error fetching movie data: ", error);
        return null;
    }

  };

  useEffect(() => {
    const loadMovies = async () => {
        setLoading(true);
        const results = await Promise.all(movieTitles.map((title) => fetchMovie(title)));
        setMovies(results.filter(Boolean));
        setLoading(false);
    };

    if(movieTitles?.length){
        loadMovies();
    }
  }, [movieTitles]);

  if(loading){
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[#023e8a] mx-auto mb-4'></div>
          <p className='text-[#023e8a] font-semibold'>Finding your perfect movies...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='w-full max-w-6xl mx-auto p-6'>
      <h2 className='text-2xl font-bold text-[#023e8a] mb-6 text-center'>Your AI Recommendations</h2>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
        {movies.map(movie => (
          <Link 
            to={`/movie/${movie.id}`} 
            key={movie.id} 
            className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden hover:scale-105"
          >
            {movie.poster_path ? (
              <img 
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                className='w-full h-64 object-cover group-hover:brightness-110 transition-all duration-300' 
                alt={movie.title} 
              />
            ) : (
              <div className='w-full h-64 bg-gradient-to-br from-[#48cae4] to-[#023e8a] flex items-center justify-center'>
                <span className='text-white font-semibold text-center px-2'>No Image</span>
              </div>
            )}
            <div className='p-3'>
              <h3 className='text-sm font-bold text-[#023e8a] truncate mb-1 group-hover:text-[#48cae4] transition-colors'>
                {movie.title}
              </h3>
              <p className='text-xs text-gray-500 font-medium'>
                {movie.release_date ? movie.release_date.slice(0,4) : "N/A"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default RecommendedMovies
