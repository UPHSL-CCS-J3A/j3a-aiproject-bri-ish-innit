import React, { useState, useEffect } from 'react'
import CardList from '../components/CardList'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import ScrollToTop from '../components/ScrollToTop'
import ScrollBlur from '../components/ScrollBlur'
import GetAIRecommendation from '../components/GetAIRecommendation'
import PersonalRecommendations from '../components/PersonalRecommendations'
import HiddenGemsSection from '../components/HiddenGemsSection'
import WorldCinema from '../components/WorldCinema'
import { useAuthStore } from '../store/authStore'

const Homepage = () => {
  const { user } = useAuthStore()
  const [isLoading, setIsLoading] = useState(true)
  const hasPreferenceTags = (user?.recommendationTags && user.recommendationTags.length > 0) || (user?.questionnairePreferences && user.questionnairePreferences.length > 0) || (user?.favoriteMovies && user.favoriteMovies.length > 0)
  const supportIndie = user?.supportIndie ?? true // Default to true if not set
  const allowAdultContent = user?.allowAdultContent || false

  useEffect(() => {
    // Simulate loading time to prevent visual changes
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Disable scrolling during loading
    if (isLoading) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isLoading])

  return (
    <div className='bg-[#2E3744] text-white min-h-screen relative scroll-smooth snap-y snap-mandatory'>
        <div className='snap-start min-h-screen'>
          <GetAIRecommendation isLoading={isLoading} />
        </div>
        <div className='snap-start min-h-screen'>
          <div className='p-5'>
          {/* <Hero /> */}
          {hasPreferenceTags && (
            <PersonalRecommendations userTags={user.recommendationTags || user.questionnairePreferences} allowAdultContent={allowAdultContent} favoriteMovies={user.favoriteMovies} />
          )}
          </div>
          {user && (
            <HiddenGemsSection allowAdultContent={allowAdultContent} supportIndie={supportIndie} userId={user?._id} />
          )}
          <div className='p-5'>
          <WorldCinema allowAdultContent={allowAdultContent} />
          <CardList title="NOW PLAYING" category="now_playing" />
          <CardList title="TOP RATED" category="top_rated" />
          <CardList title="POPULAR" category="popular" />
          <CardList title="UPCOMING" category="upcoming" /> 
          </div>
        </div>
        <ScrollBlur />
        <Footer />
        <ScrollToTop />

    </div>
  )
}

export default Homepage