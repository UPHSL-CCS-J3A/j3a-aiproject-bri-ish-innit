import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, Search } from 'lucide-react'
import LiquidEther from './LiquidEther'

const allGenres = [
  'Action', 'Adventure', 'Animation', 'Biopic', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Family', 'Fantasy', 'Historical', 'Horror', 'Musical', 'Mystery', 'Romance', 'Sci-Fi', 'Sport', 'Thriller', 'War', 'Western', 'Body Horror', 'Cyberpunk', 'Dark Comedy', 'Dystopian', 'Epic', 'Found Footage', 'Heist', 'High Fantasy', 'J-Horror', 'Mockumentary', 'Neo-Noir', 'Parody', 'Post-Apocalyptic', 'Procedural', 'Psychological', 'Road Movie', 'Rom-Com', 'Satire', 'Slasher', 'Slice of Life', 'Space Opera', 'Steampunk', 'Superhero', 'Survival', 'Zombie', 'Arthouse', 'B-Movie', 'Blockbuster', 'Bollywood', 'Cult Classic', 'Direct-to-Video', 'Exploitation', 'Hollywood', 'Indie', 'International', 'Limited Series', 'Mainstream', 'Micro-budget', 'Short Film', 'Student Film', 'Underground', 'Absurdist', 'Bleak', 'Campy', 'Cerebral', 'Feel-Good', 'Gritty', 'Lighthearted', 'Melancholic', 'Melodramatic', 'Nostalgic', 'Optimistic', 'Philosophical', 'Quirky', 'Sentimental', 'Surreal', 'Tense', 'Wholesome', 'Witty', 'Anthology', 'Character Study', 'Ensemble', 'Episodic', 'Experimental', 'Linear', 'Meta', 'Non-linear', 'Open-ended', 'Slow Burn', 'Twist Ending', 'Unreliable Narrator', '80s', '90s', '00s', 'Alternative History', 'Contemporary', 'Gothic', 'Medieval', 'Period Piece', 'Prehistoric', 'Retro', 'Rural', 'Urban', 'Victorian', 'Black & White', 'CGI-Heavy', 'Hand-Drawn', 'Minimalist', 'Neon', 'Noir', 'Psychedelic', 'Rotoscoped', 'Stop-Motion', 'Stylized'
];

const getRandomGenres = () => {
  const shuffled = [...allGenres].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 12);
};

const GetAIRecommendation = ({ isLoading }) => {
  const navigate = useNavigate();
  const [genres] = useState(() => getRandomGenres());
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [showScrollArrow, setShowScrollArrow] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [searchError, setSearchError] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 100) {
        setShowScrollArrow(false);
      } else {
        setShowScrollArrow(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleGenre = (genre) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };
  
  const validateAndSearch = () => {
    if (!searchInput.trim()) {
      setSearchError('Please enter some genres to search');
      return;
    }
    
    const inputGenres = searchInput
      .split(',')
      .map(genre => genre.trim())
      .filter(genre => genre.length > 0);
    
    if (inputGenres.length === 0) {
      setSearchError('Please enter valid genres separated by commas');
      return;
    }
    
    setSearchError('');
    navigate(`/ai-recommendations?genres=${inputGenres.join(',')}`);
  };
  
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      validateAndSearch();
    }
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
      
      <div className='absolute inset-0 flex items-center justify-center'>
        {isLoading ? (
          <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-white'></div>
        ) : (
          <div className='flex flex-col justify-center items-center p-8 opacity-0 animate-fade-in'>
            <img src='/cinecompass-main.png' alt='CineCompass' className='max-w-4xl h-auto mb-6' />
            
            <div className='w-full max-w-md mb-8'>
              <div className='relative'>
                <input
                  type='text'
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    setSearchError('');
                  }}
                  onKeyPress={handleSearchKeyPress}
                  placeholder='Search (e.g. Horror, Anime, Documentary, etc.)'
                  className='w-full bg-transparent border-b-2 border-white/50 focus:border-white outline-none pb-2 pr-10 text-white placeholder-white/70 text-center'
                />
                <button
                  onClick={validateAndSearch}
                  className='absolute right-0 bottom-2 text-white/70 hover:text-white transition-colors'
                >
                  <Search size={20} />
                </button>
              </div>
              {searchError && (
                <p className='text-red-300 text-sm mt-2 text-center'>{searchError}</p>
              )}
            </div>
            
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
                <button 
                  onClick={() => navigate(`/ai-recommendations?genres=${selectedGenres.join(',')}`)}
                  className='bg-gradient-to-r from-[#7a051d] to-[#d2172d] text-white px-8 py-3 rounded-full font-semibold hover:from-[#6a0419] hover:to-[#b8152a] transition-all duration-200 shadow-lg'
                >
                  Navigate ({selectedGenres.length} selected)
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Scroll Down Arrow */}
      <button 
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-opacity duration-300 cursor-pointer hover:scale-110 ${
          showScrollArrow && !isLoading ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <ChevronDown className="text-white w-8 h-8 animate-bounce" />
      </button>
    </div>
  )
}

export default GetAIRecommendation