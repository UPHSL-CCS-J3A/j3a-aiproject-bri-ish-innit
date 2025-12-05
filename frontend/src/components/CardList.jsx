import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import  {Link} from "react-router"
import { ArrowRight } from "lucide-react"

const CardList = ({ title, category }) => {
   const [data, setData] = useState([]);
   const [swiperRef, setSwiperRef] = useState(null);

  // ✅ Use your environment variable for the TMDB token
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
      `https://api.themoviedb.org/3/movie/${category}?language=en-US&page=1`,
      options
    )
      .then((res) => res.json())
      .then((res) => setData(res.results))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="text-white md:px-4 group">
      <h2 className="pt-10 pb-5 text-2xl font-bold">{title}</h2>

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
            <p className="text-left pt-2">{item.title}</p>

            </Link>
          </SwiperSlide>
        ))}
        </Swiper>
      </div>
    </div>
  );
};

export default CardList;
