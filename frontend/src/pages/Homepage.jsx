import CardList from '../components/CardList'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import ScrollToTop from '../components/ScrollToTop'
import ScrollBlur from '../components/ScrollBlur'
import GetAIRecommendation from '../components/GetAIRecommendation'

const Homepage = () => {
  return (
    <div className='bg-[#2E3744] text-white min-h-screen'>
        <GetAIRecommendation />
        <div className='p-5'>
        {/* <Hero /> */}
        <CardList title="NOW PLAYING" category="now_playing" />
        <CardList title="TOP RATED" category="top_rated" />
        <CardList title="POPULAR" category="popular" />
        <CardList title="UPCOMING" category="upcoming" />
        </div>
        <ScrollBlur />
        <Footer />
        <ScrollToTop />
    </div>
  )
}

export default Homepage