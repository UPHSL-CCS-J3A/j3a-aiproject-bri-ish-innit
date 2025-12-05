import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

const HiddenGems = ({ allowAdultContent = false }) => {
  const [data, setData] = useState([]);
  const [swiperRef, setSwiperRef] = useState(null);

  const token = import.meta.env.VITE_TMDB_TOKEN;

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    // Fetch multiple pages of movies with indie-friendly criteria
    const fetchPromises = [];
    
    // Fetch from different years and pages for variety
    for (let i = 1; i <= 3; i++) {
      const randomPage = Math.floor(Math.random() * 10) + 1;
      const url = `https://api.themoviedb.org/3/discover/movie?language=en-US&page=${randomPage}&sort_by=vote_average.desc&vote_average.gte=6.0&vote_count.gte=50&vote_count.lte=100000&primary_release_date.gte=2010-01-01&include_adult=${allowAdultContent}`;
      fetchPromises.push(fetch(url, options).then(res => res.json()));
    }

    Promise.all(fetchPromises)
      .then(responses => {
        const allMovies = [];
        responses.forEach(res => {
          if (res.results) {
            allMovies.push(...res.results);
          }
        });

        // Filter and fetch detailed info for budget filtering
        const moviePromises = allMovies.map(movie => 
          fetch(`https://api.themoviedb.org/3/movie/${movie.id}?language=en-US`, options)
            .then(res => res.json())
            .catch(() => null)
        );

        Promise.all(moviePromises)
          .then(detailedMovies => {
            const hiddenGems = detailedMovies
              .filter(movie => {
                if (!movie) return false;
                
                // Filter criteria for hidden gems
                const hasLowBudget = !movie.budget || movie.budget <= 50000000; // $50M or less
                const hasGoodRating = movie.vote_average >= 6.0;
                const hasModerateVotes = movie.vote_count >= 50 && movie.vote_count <= 100000;
                const isNotTooOld = new Date(movie.release_date) >= new Date('2010-01-01');
                
                // Check for indie production companies (common indie distributors)
                const indieStudios = [
                  'A24', 'Neon', 'Searchlight', 'Focus Features', 'Sony Pictures Classics',
                  'IFC Films', 'Magnolia Pictures', 'The Orchard', 'Bleecker Street',
                  'Annapurna Pictures', 'Plan B Entertainment', 'FilmNation'
                ];
                
                const hasIndieStudio = movie.production_companies?.some(company =>
                  indieStudios.some(indie => company.name.includes(indie))
                );

                return hasLowBudget && hasGoodRating && hasModerateVotes && isNotTooOld;
              })
              .sort(() => 0.5 - Math.random()) // Randomize
              .slice(0, 20);

            setData(hiddenGems);
          })
          .catch(err => console.error(err));
      })
      .catch(err => console.error(err));
  }, []);

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="text-white md:px-4 group mt-2">


      <div className="relative">
        <Swiper 
          slidesPerView={"auto"} 
          spaceBetween={20} 
          className="mySwiper"
          onSwiper={setSwiperRef}
        >
        <button 
          onClick={() => swiperRef?.slideNext()}
          className="absolute right-4 top-24 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 cursor-pointer"
        >
          <ArrowRight className="text-white bg-black/50 rounded-full p-2" size={40} />
        </button>
        {data?.map((item, index) => (
          <SwiperSlide key={index} className="max-w-72">
            <Link to={`/movie/${item.id}`}>
            <img
              src={`https://image.tmdb.org/t/p/w500/${item.backdrop_path}`}
              alt=""
              className="h-44 w-full object-center object-cover shadow-md"
            />
            <div className="text-left pt-2">
              <p className="font-medium mb-1">{item.title}</p>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <span>⭐ {item.vote_average?.toFixed(1)}</span>
                <span>•</span>
                <span>{item.release_date?.slice(0, 4)}</span>
                {item.budget && item.budget <= 50000000 && (
                  <>
                    <span>•</span>
                    <span className="text-xs bg-green-600 px-2 py-1 rounded-full">INDIE</span>
                  </>
                )}
              </div>
            </div>
            </Link>
          </SwiperSlide>
        ))}
        </Swiper>
      </div>
    </div>
  );
};

export default HiddenGems;