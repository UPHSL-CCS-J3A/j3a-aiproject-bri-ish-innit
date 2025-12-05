import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const AIRecommendationShortcut = () => {
  const [isVisible, setIsVisible] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomepage = location.pathname === '/';

  useEffect(() => {
    const toggleVisibility = () => {
      if (isHomepage) {
        // On homepage, show when scrolled down
        if (window.pageYOffset > 300) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      } else {
        // On other pages, always show
        setIsVisible(true);
      }
    };

    toggleVisibility(); // Check initial state
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [isHomepage]);

  const handleClick = () => {
    if (isHomepage) {
      // On homepage, scroll to top
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      // On other pages, navigate to homepage
      navigate('/');
    }
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-opacity duration-500 ${
      isVisible ? 'animate-slide-up opacity-100' : 'opacity-0 pointer-events-none'
    }`}>
      <div className="relative w-18 h-18">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#5227FF] via-[#FF9FFC] to-[#B19EEF]" style={{animation: 'spin 6s linear infinite'}}></div>
        <button
          onClick={handleClick}
          className="absolute inset-1 bg-[#2E3744]/50 hover:bg-[#3E4A5C]/50 text-white w-16 h-16 flex items-center justify-center rounded-full shadow-lg transition-all duration-300"
        >
          <img src="/cc-icon-logo.png" alt="Home" className="w-12 h-12" />
        </button>
      </div>
    </div>
  );
};

export default AIRecommendationShortcut;