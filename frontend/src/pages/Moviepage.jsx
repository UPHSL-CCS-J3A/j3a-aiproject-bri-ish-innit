import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';

const MoviePage = () => {
    const {id} = useParams();
    const [movie, setMovie] = useState(null);
  const token = import.meta.env.VITE_TMDB_TOKEN;

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, options)
    .then(res => res.json())
    .then(res => setMovie(res))
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
            <img src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`} 
            className='rounded-lg shadow-lg w-48 hidden md:block'
            />

            <div>
              <h1 className='text-4xl font-bold mb-2'>{movie.title}</h1>
              <div>
                <span>⭐ {movie.vote_average}</span>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}


export default MoviePage