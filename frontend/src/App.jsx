import { Route, Routes } from 'react-router'
import Navbar from './components/Navbar'
import Homepage from './pages/Homepage'
import MoviePage from './pages/MoviePage'

const App = () => {
  return (
    <div>
      <Navbar />

      <Routes>
        <Route path={"/"} element={<Homepage />} />
        <Route path={"/movie/:id"} element={<MoviePage />} />
      </Routes>
    </div>
  )
}

export default App