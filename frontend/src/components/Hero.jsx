import { Bookmark, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
const Hero = () => {
  const [movie, setMovie] = useState(null);
  const token = import.meta.env.VITE_TMDB_TOKEN;

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    fetch(
      "https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1",
      options
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.results && res.results.length > 0) {
          const randomIndex = Math.floor(Math.random() * res.results.length);
          setMovie(res.results[randomIndex]);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  if (!movie) {
    return <p>Loading...</p>;
  }
  return (
    <div className="text-white relative">
      <img
        src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
        alt="bg-img"
        className="w-full rounded-2xl h-[480px] object-center object-cover border-10 border-[#496595]"
      />

      <div className="flex space-x-2 md:space-x-4 absolute bottom-3 left-4 md:bottom-8 md:left-10 font-medium">
        <button className="flex justify-center items-center bg-[#4C8891]  hover:bg-[#90a7c4] text-[#FFFFFF] py-3 px-4 rounded-full cursor-pointer text-sm md:text-base">
          <Bookmark className="mr-2 w-4 h-5 md:w-5 md:h-5" /> Save for Later
        </button>
        <Link to={`/movie/${movie.id}`}>
        <button className="flex justify-center items-center bg-[#1B5B7E]  hover:bg-[#90a7c4] text-[#FFFFFF] py-3 px-4 rounded-full cursor-pointer text-sm md:text-base">
          <Play className="mr-2 w-4 h-5 md:w-5 md:h-5" /> Watch Now
        </button>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
