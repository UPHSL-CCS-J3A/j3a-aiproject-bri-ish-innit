import { Route, Routes } from 'react-router'
import Navbar from './components/Navbar'
import Homepage from './pages/Homepage'
import MoviePage from './pages/Moviepage'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import TVShows from './pages/TVShows'
import Movies from './pages/Movies'
import Anime from './pages/Anime'
import NewPopular from './pages/NewPopular'
import Upcoming from './pages/Upcoming'
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import { useEffect } from 'react'
import AIRecommendations from './pages/AIRecommendations'


const App = () => {
  const {fetchUser, fetchingUser} = useAuthStore();

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  if(fetchingUser){
   return <p>Loading...</p>
  }

  return (
    <div>
      <Toaster />
      <Navbar />

      <Routes>
        <Route path={"/"} element={<Homepage />} />
        <Route path={"/tv-shows"} element={<TVShows />} />
        <Route path={"/movies"} element={<Movies />} />
        <Route path={"/anime"} element={<Anime />} />
        <Route path={"/new-popular"} element={<NewPopular />} />
        <Route path={"/upcoming"} element={<Upcoming />} />
        <Route path={"/movie/:id"} element={<MoviePage />} />
        <Route path={"/signin"} element={<SignIn />} />
        <Route path={"/signup"} element={<SignUp />} />
        <Route path={"/ai-recommendations"} element={<AIRecommendations />} />
      </Routes>
    </div>
  )
}

export default App