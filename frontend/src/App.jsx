import { Route, Routes } from 'react-router'
import Navbar from './components/Navbar'
import Homepage from './pages/Homepage'
import MoviePage from './pages/Moviepage'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import TVShows from './pages/TVShows'
import Movies from './pages/Movies'
import Anime from './pages/Anime'
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import { useEffect } from 'react'
import AIRecommendations from './pages/AIRecommendations'
import Profile from './pages/Profile'
import Settings from './pages/Settings'


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
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            margin: '0px',
          },
        }}
        containerStyle={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      />
      <Navbar />

      <Routes>
        <Route path={"/"} element={<Homepage />} />
        <Route path={"/tv-shows"} element={<TVShows />} />
        <Route path={"/movies"} element={<Movies />} />
        <Route path={"/anime"} element={<Anime />} />
        <Route path={"/movie/:id"} element={<MoviePage />} />
        <Route path={"/signin"} element={<SignIn />} />
        <Route path={"/signup"} element={<SignUp />} />
        <Route path={"/ai-recommendations"} element={<AIRecommendations />} />
        <Route path={"/profile"} element={<Profile />} />
        <Route path={"/settings"} element={<Settings />} />
      </Routes>
    </div>
  )
}

export default App