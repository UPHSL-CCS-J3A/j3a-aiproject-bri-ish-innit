import React, { useState, useMemo } from 'react'
import LiquidEther from './LiquidEther'

const allGenres = [
  'Action', 'Adventure', 'Animation', 'Biopic', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Family', 'Fantasy', 'Historical', 'Horror', 'Musical', 'Mystery', 'Romance', 'Sci-Fi', 'Sport', 'Thriller', 'War', 'Western', 'Body Horror', 'Cyberpunk', 'Dark Comedy', 'Dystopian', 'Epic', 'Found Footage', 'Heist', 'High Fantasy', 'J-Horror', 'Mockumentary', 'Neo-Noir', 'Parody', 'Post-Apocalyptic', 'Procedural', 'Psychological', 'Road Movie', 'Rom-Com', 'Satire', 'Slasher', 'Slice of Life', 'Space Opera', 'Steampunk', 'Superhero', 'Survival', 'Zombie', 'Arthouse', 'B-Movie', 'Blockbuster', 'Bollywood', 'Cult Classic', 'Direct-to-Video', 'Exploitation', 'Hollywood', 'Indie', 'International', 'Limited Series', 'Mainstream', 'Micro-budget', 'Short Film', 'Student Film', 'Underground', 'Absurdist', 'Bleak', 'Campy', 'Cerebral', 'Feel-Good', 'Gritty', 'Lighthearted', 'Melancholic', 'Melodramatic', 'Nostalgic', 'Optimistic', 'Philosophical', 'Quirky', 'Sentimental', 'Surreal', 'Tense', 'Wholesome', 'Witty', 'Anthology', 'Character Study', 'Ensemble', 'Episodic', 'Experimental', 'Linear', 'Meta', 'Non-linear', 'Open-ended', 'Slow Burn', 'Twist Ending', 'Unreliable Narrator', '80s', '90s', '00s', 'Alternative History', 'Contemporary', 'Gothic', 'Medieval', 'Period Piece', 'Prehistoric', 'Retro', 'Rural', 'Urban', 'Victorian', 'Black & White', 'CGI-Heavy', 'Hand-Drawn', 'Minimalist', 'Neon', 'Noir', 'Psychedelic', 'Rotoscoped', 'Stop-Motion', 'Stylized'
];

const getRandomGenres = () => {
  const shuffled = [...allGenres].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 12);
};

const GetAIRecommendation = () => {
  const [genres] = useState(() => getRandomGenres());
  const [selectedGenres, setSelectedGenres] = useState([]);

  const toggleGenre = (genre) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const liquidEtherComponent = useMemo(() => (
    <LiquidEther
      colors={['#5227FF', '#FF9FFC', '#B19EEF']}
      mouseForce={20}
      cursorSize={100}
      autoDemo={true}
      autoSpeed={0.5}
      autoIntensity={2.2}
    />
  ), []);

  return (
    <div className='w-full relative' style={{ height: '700px' }}>
      {liquidEtherComponent}
      <div className='absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent pointer-events-none'></div>
      
      <div className='absolute inset-0 flex flex-col justify-center items-center p-8'>
        <img src='/cinecompass-main.png' alt='CineCompass' className='max-w-4xl h-auto mb-8' />
        
        
        <div className='flex flex-wrap gap-3 justify-center max-w-4xl'>
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => toggleGenre(genre)}
              className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                selectedGenres.includes(genre)
                  ? 'bg-white text-purple-600 shadow-lg transform scale-105'
                  : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
        
        {selectedGenres.length > 0 && (
          <div className='mt-6'>
            <button className='bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg'>
              Get Recommendations ({selectedGenres.length} selected)
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default GetAIRecommendation