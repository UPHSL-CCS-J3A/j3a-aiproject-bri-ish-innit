import CardList from '../components/CardList'
import Footer from '../components/Footer'
import AIRecommendationShortcut from '../components/ScrollToTop'

const Movies = () => {
  return (
    <div className='p-5'>
        <div className='mb-8'>
            <h1 className='text-4xl font-bold text-[#023e8a] mb-4'>Movies</h1>
            <p className='text-gray-600'>Explore the world of cinema</p>
        </div>
        <CardList title="Now Playing" category="now_playing" />
        <CardList title="Popular Movies" category="popular" />
        <CardList title="Top Rated Movies" category="top_rated" />
        <CardList title="Upcoming Movies" category="upcoming" />
        <Footer />
        <AIRecommendationShortcut />
    </div>
  )
}

export default Movies