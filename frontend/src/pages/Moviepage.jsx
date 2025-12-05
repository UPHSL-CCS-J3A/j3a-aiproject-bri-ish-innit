import { Play } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router';

const MoviePage = () => {
    const {id} = useParams();
    const [movie, setMovie] = useState(null);
    const[recommendations, setRecommendations] = useState([]);
    const [trailerKey, setTrailerKey] = useState(null);
    const [reviews, setReviews] = useState([]);
    
    const token = import.meta.env.VITE_TMDB_TOKEN;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${token}`
      }
    };

useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, options)
    .then(res => res.json())
    .then(res => setMovie(res))
    .catch(err => console.error(err));

    fetch(`https://api.themoviedb.org/3/movie/${id}/recommendations?language=en-US&page=1`, options)
      .then(res => res.json())
      .then(res => {
        console.log('Recommendations:', res);
        setRecommendations(res.results || []);
      })
      .then(() => console.log('Recommendations length:', recommendations.length))
      .catch(err => console.error(err));

    fetch(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`, options)
      .then(res => res.json())
      .then(res => {
          const trailer = res.results?.find((vid) => vid.site === "YouTube" && vid.type === "Trailer")
          setTrailerKey(trailer?.key || null);
      })
      .catch(err => console.error(err));

    fetch(`https://api.themoviedb.org/3/movie/${id}/reviews?language=en-US&page=1`, options)
      .then(res => res.json())
      .then(res => {
        setReviews(res.results?.slice(0, 3) || []);
      })
      .catch(err => console.error(err));
}, [id]);

    if(!movie) {
        return <div className='flex items-center justify-center h-screen'><span className="text-xl text-blue-500">Loading...</span></div>
    }


  return (
    <div className='min-h-screen bg-[#29354B] text-white'>
        <div className='relative h-[60vh] flex item-end ' style={{backgroundImage: `url(https://image.tmdb.org/t/p/original/${movie.
        backdrop_path})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
        }}>

          <div className='absolute inset-0 bg-gradient-to-t from-[#29354B] via-transparent to-transparent'>
          </div>

          <div className='relative x-10 flex items-end p-8 gap-8'>
            <img src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`} 
            className='rounded-lg shadow-lg w-48 hidden md:block'
            />

            <div>
              <h1 className='text-4xl font-bold mb-2'>{movie.title}</h1>
              <div className='flex items-center gap-4 mb-2'>
                <span>⭐ {movie.vote_average?.toFixed(1)}</span>
                <span>{movie.release_date}</span>
                <span>{movie.runtime} min</span>
              </div>
              <div className='flex flex-wrap gap-2 mb-4'>
                {movie.genres.map((genre) =>(
                  <span className='bg-gray-800 px-3 py-1 rounded-full text-sm'>
                    {genre.name}
                  </span>
                ))}
              </div>
              <p className='max-w-2xl text-gray-200'>{movie.overview}</p>
              <Link 
                to={`https://www.youtube.com/watch?v=${trailerKey}`}
                target="_blank" 
              >
                <button className="flex justify-center items-center bg-[#1B5B7E]
                                  hover:bg-[#90a7c4] text-[#FFFFFF]
                                  py-3 px-4 rounded-full cursor-pointer text-sm md:text-base mt-2 md:mt-4">
                                  <Play className="mr-2 w-4 h-5 md:w-5 md:h-5" /> Watch Now
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className='p-8'>
          <h2 className='text-2xl font-semibold mb-4'>Details</h2>
          <div className='bg-[#232323] rounded-lg shadow-lg p-6 flex fle-col md:flex-row gap-8'>
            <div className='flex-1'>
              <ul className='text-gray-300 space-y-3'>

                <li>
                  <span className='font-semibold text-white'>Status: </span>
                  <span className='ml-2'>{movie.status}</span>
                </li>

                <li>
                  <span className='font-semibold text-white'>Release Date: </span>
                  <span className='ml-2'>{movie.release_date}</span>
                </li>

                <li>
                  <span className='font-semibold text-white'>Original Language: </span>
                  <span className='ml-2'>{movie.original_language?.toUpperCase()}</span>
                </li>

                <li>
                  <span className='font-semibold text-white'>Budget: </span>
                  <span className='ml-2'>{movie.budget ? `$ ${movie.budget.toLocaleString()}` : "N/A"}</span>
                </li>

                <li>
                  <span className='font-semibold text-white'>Revenue: </span>
                  <span className='ml-2'>{movie.revenue ? `$ ${movie.revenue.toLocaleString()}` : "N/A"}</span>
                </li>

                <li>
                  <span className='font-semibold text-white'>Production Companies: </span>
                  <span className='ml-2'>{movie.production_companies && movie.production_companies.length > 0 ? movie.production_companies.map((c) => c.name).join(", ") : "N/A"}</span>
                </li>

                <li>
                  <span className='font-semibold text-white'>Countries: </span>
                  <span className='ml-2'>{movie.production_countries && movie.production_countries.length > 0 ? movie.production_countries.map((c) => c.name).join(", ") : "N/A"}</span>                  
                </li>

                <li>
                  <span className='font-semibold text-white'>Spoken Languages: </span>
                  <span className='ml-2'>{movie.spoken_languages && movie.spoken_languages.length > 0 ? 
                  movie.spoken_languages.map((l) => l.english_name).join(", ") : "N/A"}</span>                  
                </li>

              </ul>
            </div>
            <div className='flex-1'>
              <h3 className='font-semibold text-white mb-2'>Tagline:</h3>
              <p className='italic text-gray-400 mb-6'>{movie.tagline || "No tagline available."}</p>

              <h3 className='font-semibold text-white mb-2'>Overview: </h3>
              <p className='text-gray-200 mb-6'>{movie.overview}</p>
            </div>
          </div>

        </div>

        {reviews.length > 0 && (
          <div className='p-8'>
            <h2 className='text-2xl font-semibold mb-4'>User Reviews</h2>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              {reviews.map((review) => (
                <div key={review.id} className='bg-[#232323] rounded-lg p-4'>
                  <div className='flex items-center mb-2'>
                    <div className='w-8 h-8 bg-gradient-to-r from-[#7a051d] to-[#d2172d] rounded-full flex items-center justify-center text-white font-bold mr-2 text-sm'>
                      {review.author.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className='font-semibold text-white text-sm'>{review.author}</h4>
                      {review.author_details?.rating && (
                        <div className='flex items-center text-xs text-gray-400'>
                          <span>⭐ {review.author_details.rating}/10</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className='text-gray-200 leading-relaxed text-sm'>
                    {review.content.length > 200 
                      ? `${review.content.substring(0, 200)}...` 
                      : review.content
                    }
                  </p>
                  <div className='mt-2 text-xs text-gray-400'>
                    {new Date(review.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {recommendations.length > 0 && (
          <div className='p-8'>
            <h2 className='text-2xl font-semibold mb-4'>You might also like...
            </h2>

            <div className='grid grid-cols-2 md:grid-cols-5 gap-6'>
              {recommendations.slice(0, 10).map((rec) => (
                <div key={rec.id} className='bg-[#232323] rounded-lg overflow-hidden hover:scale-105 transition'>
                  <Link to={`/movie/${rec.id}`}>
                     <img 
                     src={`https://image.tmdb.org/t/p/w300/${rec.poster_path}`}
                     className='w-full h-48 object-cover'
                     />
                     <div className='p-2'>
                      <h3 className='text-sm font-semibold'>{rec.title}</h3>
                      <span className='text-sm text-gray-400'>
                        {rec.release_date?.slice(0,4)}
                      </span>
                     </div>
                  </Link>
                </div>
              ))}
              </div>
          </div>
        )}
      </div>
  );
};

export default MoviePage