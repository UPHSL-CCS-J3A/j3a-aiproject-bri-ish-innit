import CardList from '../components/CardList'
import Footer from '../components/Footer'

const TVShows = () => {
  return (
    <div className='p-5'>
        <div className='mb-8'>
            <h1 className='text-4xl font-bold text-[#023e8a] mb-4'>TV Shows</h1>
            <p className='text-gray-600'>Discover the best television series</p>
        </div>
        <CardList title="Popular TV Shows" category="popular" type="tv" />
        <CardList title="Top Rated TV Shows" category="top_rated" type="tv" />
        <CardList title="Airing Today" category="airing_today" type="tv" />
        <CardList title="On The Air" category="on_the_air" type="tv" />
        <Footer />
    </div>
  )
}

export default TVShows