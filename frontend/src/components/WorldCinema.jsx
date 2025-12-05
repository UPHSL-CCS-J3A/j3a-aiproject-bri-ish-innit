import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const WorldCinema = ({ allowAdultContent = false }) => {
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

  // Countries with strong film industries
  const countries = [
    'IN', // India
    'KR', // South Korea
    'JP', // Japan
    'CN', // China
    'TH', // Thailand
    'ID', // Indonesia
    'PH', // Philippines
    'VN', // Vietnam
    'MY', // Malaysia
    'SG', // Singapore
    'NG', // Nigeria
    'ZA', // South Africa
    'EG', // Egypt
    'MA', // Morocco
    'IR', // Iran
    'TR', // Turkey
    'MX', // Mexico
    'BR', // Brazil
    'AR', // Argentina
    'CL', // Chile
    'CO', // Colombia
    'PE', // Peru
  ];

  useEffect(() => {
    const fetchWorldCinema = async () => {
      try {
        // Group countries by region for balanced representation
        const regions = {
          asia: ['IN', 'TH', 'ID', 'PH', 'VN', 'MY', 'SG'],
          eastAsia: ['KR', 'JP', 'CN'],
          africa: ['NG', 'ZA', 'EG', 'MA'],
          middleEast: ['IR', 'TR'],
          latinAmerica: ['MX', 'BR', 'AR', 'CL', 'CO', 'PE']
        };

        const balancedMovies = [];
        
        // Fetch 2-3 movies from each region
        for (const [region, regionCountries] of Object.entries(regions)) {
          const regionPromises = [];
          
          // Take 2 countries per region for balance
          const selectedCountries = regionCountries.slice(0, 2);
          
          selectedCountries.forEach(country => {
            const randomPage = Math.floor(Math.random() * 3) + 1;
            const url = `https://api.themoviedb.org/3/discover/movie?language=en-US&page=${randomPage}&sort_by=vote_average.desc&with_origin_country=${country}&vote_average.gte=6.0&vote_count.gte=20&primary_release_date.gte=2000-01-01&include_adult=${allowAdultContent}`;
            regionPromises.push(fetch(url, options).then(res => res.json()));
          });

          const regionResponses = await Promise.all(regionPromises);
          
          // Get top movie from each country in this region
          regionResponses.forEach(res => {
            if (res.results && res.results.length > 0) {
              const bestMovie = res.results
                .filter(movie => movie.backdrop_path && movie.overview)
                .sort((a, b) => b.vote_average - a.vote_average)[0];
              
              if (bestMovie) {
                balancedMovies.push(bestMovie);
              }
            }
          });
        }

        // Remove duplicates and shuffle for variety
        const uniqueMovies = balancedMovies.filter((movie, index, self) => 
          index === self.findIndex(m => m.id === movie.id)
        );

        const shuffledMovies = uniqueMovies.sort(() => 0.5 - Math.random());
        setData(shuffledMovies);
      } catch (err) {
        console.error('Error fetching world cinema:', err);
      }
    };

    fetchWorldCinema();
  }, [allowAdultContent]);

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="text-white md:px-4 group mb-8">
      <h2 className="pt-10 pb-5 text-2xl font-bold">WORLD CINEMA</h2>

      <div className="relative">
        <Swiper 
          slidesPerView={"auto"} 
          spaceBetween={20} 
          className="mySwiper"
          onSwiper={setSwiperRef}
          loop={true}
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
              onError={(e) => {
                e.target.src = item.poster_path ? `https://image.tmdb.org/t/p/w500/${item.poster_path}` : '/placeholder-movie.jpg';
              }}
            />
            <div className="text-left pt-2">
              <p className="font-medium mb-1">{item.title}</p>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <span>⭐ {item.vote_average?.toFixed(1)}</span>
                <span>•</span>
                <span>{item.release_date?.slice(0, 4)}</span>
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

export default WorldCinema;