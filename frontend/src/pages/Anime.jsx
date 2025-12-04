import CardList from '../components/CardList'
import Footer from '../components/Footer'

const Anime = () => {
  return (
    <div className='p-5'>
        <div className='mb-8'>
            <h1 className='text-4xl font-bold text-[#023e8a] mb-4'>Anime</h1>
            <p className='text-gray-600'>Discover amazing anime series and movies</p>
        </div>
        <CardList title="Popular Anime" category="popular" type="tv" genre="16" />
        <CardList title="Top Rated Anime" category="top_rated" type="tv" genre="16" />
        <CardList title="Anime Movies" category="popular" genre="16" />
        <CardList title="Airing Today" category="airing_today" type="tv" genre="16" />
        <Footer />
    </div>
  )
}

export default Anime