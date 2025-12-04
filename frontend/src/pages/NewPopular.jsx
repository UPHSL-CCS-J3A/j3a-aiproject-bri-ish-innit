import CardList from '../components/CardList'
import Footer from '../components/Footer'

const NewPopular = () => {
  return (
    <div className='p-5'>
        <div className='mb-8'>
            <h1 className='text-4xl font-bold text-[#023e8a] mb-4'>New & Popular</h1>
            <p className='text-gray-600'>What's trending right now</p>
        </div>
        <CardList title="Trending Movies" category="popular" />
        <CardList title="Trending TV Shows" category="popular" type="tv" />
        <CardList title="Now Playing in Theaters" category="now_playing" />
        <CardList title="Airing Today" category="airing_today" type="tv" />
        <Footer />
    </div>
  )
}

export default NewPopular