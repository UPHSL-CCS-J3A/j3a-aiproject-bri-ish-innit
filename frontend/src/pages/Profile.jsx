import React, { useState, useEffect } from 'react'
import { User, Mail, Calendar, Tag, Star, Bookmark, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import Footer from '../components/Footer'

const Profile = () => {
  const { user, updateUser } = useAuthStore()
  const [favoriteMovies, setFavoriteMovies] = useState([])
  const [bookmarkedMovies, setBookmarkedMovies] = useState([])
  
  const token = import.meta.env.VITE_TMDB_TOKEN
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  }

  useEffect(() => {
    console.log('Profile user:', user)
    console.log('User favorite movies:', user?.favoriteMovies)
    if (user?.favoriteMovies) {
      fetchFavoriteMovies(user.favoriteMovies)
    }
    if (user?.bookmarkedMovies) {
      fetchBookmarkedMovies(user.bookmarkedMovies)
    }
  }, [user])


  
  const fetchFavoriteMovies = async (movieIds) => {
    console.log('fetchFavoriteMovies called with:', movieIds)
    if (!movieIds || movieIds.length === 0) {
      console.log('No movie IDs, setting empty array')
      setFavoriteMovies([])
      return
    }
    
    try {
      console.log('Fetching movies for IDs:', movieIds)
      const moviePromises = movieIds.map(id => 
        fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, options)
          .then(res => res.json())
      )
      
      const movies = await Promise.all(moviePromises)
      console.log('Fetched movies:', movies)
      const validMovies = movies.filter(movie => movie && movie.id && !movie.success)
      console.log('Valid movies:', validMovies)
      setFavoriteMovies(validMovies)
    } catch (error) {
      console.error('Error fetching favorite movies:', error)
    }
  }
  
  const fetchBookmarkedMovies = async (movieIds) => {
    if (!movieIds || movieIds.length === 0) {
      setBookmarkedMovies([])
      return
    }
    
    try {
      const moviePromises = movieIds.map(id => 
        fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, options)
          .then(res => res.json())
      )
      
      const movies = await Promise.all(moviePromises)
      const validMovies = movies.filter(movie => movie && movie.id && !movie.success)
      setBookmarkedMovies(validMovies)
    } catch (error) {
      console.error('Error fetching bookmarked movies:', error)
    }
  }

  const removeFavorite = async (movieId) => {
    try {
      const response = await fetch('http://localhost:5000/api/movie-action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ movieId, action: 'favorite' })
      })
      
      if (response.ok) {
        const data = await response.json()
        updateUser(data.user)
        setFavoriteMovies(prev => prev.filter(movie => movie.id !== movieId))
      }
    } catch (error) {
      console.error('Error removing favorite:', error)
    }
  }

  const removeBookmark = async (movieId) => {
    try {
      const response = await fetch('http://localhost:5000/api/movie-action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ movieId, action: 'bookmark' })
      })
      
      if (response.ok) {
        const data = await response.json()
        updateUser(data.user)
        setBookmarkedMovies(prev => prev.filter(movie => movie.id !== movieId))
      }
    } catch (error) {
      console.error('Error removing bookmark:', error)
    }
  }

  if (!user) {
    return (
      <div className='min-h-screen bg-[#2E3744] flex items-center justify-center'>
        <div className='text-white text-xl'>Loading...</div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-[#2E3744] text-white flex flex-col'>
      <div className='flex-1 p-8'>
      <div className='max-w-7xl mx-auto'>
        <div className='flex gap-8'>
          {/* Left Column - Profile Info (30%) */}
          <div className='w-[30%]'>
            <div className='bg-[#1F1B24] rounded-lg p-6 space-y-6'>
          {/* Profile Picture & Basic Info */}
          <div className='flex items-center justify-between mb-6'>
            <div className='relative'>
              {user?.profilePicture ? (
                <img 
                  src={user.profilePicture} 
                  alt="Profile" 
                  className='w-20 h-20 rounded-full object-cover'
                />
              ) : (
                <div className='w-20 h-20 rounded-full bg-gray-600 flex items-center justify-center'>
                  <User size={40} />
                </div>
              )}
            </div>
            <div className='text-right'>
              <h2 className='text-2xl font-bold mb-1'>{user?.displayName || user?.username}</h2>
              <p className='text-gray-400'>@{user?.username}</p>
            </div>
          </div>

          {/* User Information */}
          <div className='space-y-4'>
            <div className='bg-[#2E3744] rounded-lg p-4'>
              <div className='flex items-center gap-3 mb-2'>
                <Mail className='text-red-400' size={20} />
                <h3 className='font-semibold'>Email</h3>
              </div>
              <p className='text-gray-300'>{user?.email}</p>
            </div>

            <div className='bg-[#2E3744] rounded-lg p-4'>
              <div className='flex items-center gap-3 mb-2'>
                <Calendar className='text-red-400' size={20} />
                <h3 className='font-semibold'>Member Since</h3>
              </div>
              <p className='text-gray-300'>
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>


          </div>

          {/* Recommendation Tags */}
          {user?.recommendationTags && user.recommendationTags.length > 0 && (
            <div>
              <h3 className='text-lg font-semibold mb-3'>Movie Preferences</h3>
              <div className='flex flex-wrap gap-2'>
                {user.recommendationTags.map((tag, index) => (
                  <span
                    key={index}
                    className='bg-red-600/20 text-red-300 px-3 py-1 rounded-full text-sm'
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          

            </div>
          </div>
          
          {/* Right Column - Favorites (70%) */}
          <div className='w-[70%]'>
            <div className='bg-[#1F1B24] rounded-lg p-6'>
          <div className='flex items-center gap-2 mb-4'>
            <Star className='text-red-400' size={20} fill='currentColor' />
            <h3 className='text-lg font-semibold'>Favorited</h3>
          </div>
          
          {favoriteMovies.length > 0 ? (
            <div className='space-y-4'>
              {favoriteMovies.map((movie) => (
                <div key={movie.id} className='flex items-center gap-4 p-3 bg-[#2E3744] rounded-lg hover:bg-[#3E4A5C] transition-colors mb-3'>
                  <Link to={`/movie/${movie.id}`} className='flex items-center gap-4 flex-1'>
                    <img 
                      src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                      alt={movie.title}
                      className='w-12 h-16 object-cover rounded'
                    />
                    <div className='flex-1'>
                      <h4 className='font-medium text-white'>{movie.title}</h4>
                      <p className='text-sm text-gray-400'>{movie.release_date?.slice(0, 4)} • ⭐ {movie.vote_average?.toFixed(1)}</p>
                    </div>
                  </Link>
                  <button
                    onClick={() => removeFavorite(movie.id)}
                    className='p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-colors'
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className='text-center py-8'>
              <Star className='text-gray-400 mx-auto mb-2' size={40} />
              <p className='text-gray-400'>No favorited movies yet. Start exploring and add some favorites!</p>
            </div>
          )}
            </div>
            
            {/* Bookmarked Movies */}
            <div className='bg-[#1F1B24] rounded-lg p-6 mt-6'>
              <div className='flex items-center gap-2 mb-4'>
                <Bookmark className='text-red-400' size={20} fill='currentColor' />
                <h3 className='text-lg font-semibold'>Bookmarked</h3>
              </div>
              
              {bookmarkedMovies.length > 0 ? (
                <div className='space-y-4'>
                  {bookmarkedMovies.map((movie) => (
                    <div key={movie.id} className='flex items-center gap-4 p-3 bg-[#2E3744] rounded-lg hover:bg-[#3E4A5C] transition-colors mb-3'>
                      <Link to={`/movie/${movie.id}`} className='flex items-center gap-4 flex-1'>
                        <img 
                          src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                          alt={movie.title}
                          className='w-12 h-16 object-cover rounded'
                        />
                        <div className='flex-1'>
                          <h4 className='font-medium text-white'>{movie.title}</h4>
                          <p className='text-sm text-gray-400'>{movie.release_date?.slice(0, 4)} • ⭐ {movie.vote_average?.toFixed(1)}</p>
                        </div>
                      </Link>
                      <button
                        onClick={() => removeBookmark(movie.id)}
                        className='p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-colors'
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='text-center py-8'>
                  <Bookmark className='text-gray-400 mx-auto mb-2' size={40} />
                  <p className='text-gray-400'>No bookmarked movies yet. Start exploring and bookmark some movies!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  )
}

export default Profile