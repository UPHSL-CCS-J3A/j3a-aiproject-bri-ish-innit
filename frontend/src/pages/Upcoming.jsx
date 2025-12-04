import CardList from '../components/CardList'
import Footer from '../components/Footer'

const Upcoming = () => {
  return (
    <div className='p-5'>
        <div className='mb-8'>
            <h1 className='text-4xl font-bold text-[#023e8a] mb-4'>Upcoming</h1>
            <p className='text-gray-600'>Coming soon to theaters and streaming</p>
        </div>
        <CardList title="Upcoming Movies" category="upcoming" />
        <CardList title="Upcoming TV Shows" category="on_the_air" type="tv" />
        <Footer />
    </div>
  )
}

export default Upcoming