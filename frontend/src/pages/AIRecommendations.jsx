import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast';
import { getAIRecommendations } from '../lib/AIModel';
import RecommendedMovies from '../components/RecommendedMovies';
import LiquidChrome from '../components/LiquidChrome';
import { useAuthStore } from '../store/authStore';
import Footer from '../components/Footer';

const steps = [{
        name: "genre",
        label: "What's your favorite genre?",
        options: ["Action", "Comedy", "Drama", "Horror", "Romance", "Sci-Fi", "Animation"]
    },
    {
        name: "mood",
        label: "What mood are you in?",
        options: ["Excited", "Relaxed", "Thoughtful", "Adventurous", "Romantic"]
    }, {
        name: "decade",
        label: "Preferred decade?",
        options: ["1980s", "1990s", "2000s", "2010s", "2020s"]
    }, {
        name: "language",
        label: "Preferred language?",
        options: ["English", "Korean", "Spanish", "French", "Other"]
    }, {
        name: "length",
        label: "Preferred movie length?",
        options: ["Short (<90 mins)", "Standard (90-120 mins)", "Long (>120 mins)"]
    },
];

const initialState = steps.reduce((acc, step) => {
    acc[step.name] = "";
    return acc
}, {});

const AIRecommendations = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [inputs, setInputs] = useState(initialState);
    const [step, setStep] = useState(0);
    const [error, setError] = useState("");
    const [recommendation, setRecommendation] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showWelcome, setShowWelcome] = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const handleProceed = () => {
        setIsTransitioning(true);
        setTimeout(() => {
            setShowWelcome(false);
            setIsTransitioning(false);
        }, 500);
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const genres = urlParams.get('genres');
        if (genres) {
            setShowWelcome(false);
            generateGenreRecommendations(genres.split(','));
        }
    }, [location]);

    const generateGenreRecommendations = async (selectedGenres) => {
        setIsLoading(true);
        
        // Add randomness seed
        const randomSeed = Math.floor(Math.random() * 1000);
        const timeStamp = Date.now();
        
        // Separate countries/languages from genres
        const countries = ['Korean', 'Japanese', 'Chinese', 'French', 'Spanish', 'Italian', 'German', 'Russian', 'Indian', 'Bollywood', 'Filipino', 'Thai', 'Vietnamese', 'Brazil', 'Mexican', 'British', 'Australian'];
        const genreTerms = selectedGenres.filter(term => !countries.some(country => term.toLowerCase().includes(country.toLowerCase())));
        const countryTerms = selectedGenres.filter(term => countries.some(country => term.toLowerCase().includes(country.toLowerCase())));
        
        let userPrompt;
        if (countryTerms.length > 0 && genreTerms.length > 0) {
            userPrompt = `[Seed: ${randomSeed}-${timeStamp}] Recommend 15 ${countryTerms.join(' and ')} movies in the ${genreTerms.join(', ')} genres. Focus on films from ${countryTerms.join(' and ')} cinema. Return as plain JSON array of movie titles only.`;
        } else if (countryTerms.length > 0) {
            userPrompt = `[Seed: ${randomSeed}-${timeStamp}] Recommend 15 popular ${countryTerms.join(' and ')} movies. Focus on acclaimed films from ${countryTerms.join(' and ')} cinema. Return as plain JSON array of movie titles only.`;
        } else {
            userPrompt = `[Seed: ${randomSeed}-${timeStamp}] Recommend 15 movies based on these genres: ${selectedGenres.join(', ')}. Return as plain JSON array of movie titles only.`;
        }
        
        const result = await getAIRecommendations(userPrompt);
        setIsLoading(false);
        
        if (result === 'QUOTA_EXCEEDED') {
            toast.error('AI quota exceeded. Redirecting to home...');
            setTimeout(() => navigate('/'), 2000);
            return;
        }
        
        if (result) {
            const cleanedResult = result.replace(/```json\n/i, '').replace(/\n```/i, '');
            try {
                const recommendationArray = JSON.parse(cleanedResult);
                setRecommendation(recommendationArray);
            } catch (error) {
                toast.error('Failed to parse recommendations');
            }
        } else {
            toast.error('Failed to get recommendations');
        }
    }; 

    const handleOption = (value) => {
        setInputs({...inputs, [steps[step].name]: value});
    };

    const handleNext = () => {
        if(!inputs[steps[step].name]){
            setError("Please choose one before proceeding");
            return;
        }
        setError("");
        if(step < steps.length - 1){
            setStep(step + 1);
        }else{
            console.log(inputs);
        }
    };

    const handleBack = () => {
        if(step > 0){
            setStep(step - 1);
        }
    };

    const { updateUser } = useAuthStore();

    const generateRecommendations = async () => {
        console.log("Generate recommendations called");
        console.log("Inputs:", inputs);
        
        if(!inputs){
            toast("Please enter your inputs.")
            return;
        }

        // Save questionnaire preferences
        const questionnairePrefs = Object.values(inputs).filter(Boolean);
        try {
            await updateUser({ questionnairePreferences: questionnairePrefs });
        } catch (error) {
            console.log("Failed to save questionnaire preferences:", error);
        }

        setIsLoading(true);

        const randomSeed = Math.floor(Math.random() * 1000);
        const timeStamp = Date.now();
        
        const userPrompt = `[Seed: ${randomSeed}-${timeStamp}] Given the following user inputs:

- Decade: ${inputs.decade}
- Genre: ${inputs.genre}
- Language: ${inputs.language}
- Length: ${inputs.length}
- Mood: ${inputs.mood}

Recommend 15 diverse ${inputs.mood.toLowerCase()} ${
      inputs.language
    }-language ${inputs.genre.toLowerCase()} movies released in the ${
      inputs.decade
    } with a runtime between ${
      inputs.length
    }. Include both popular and lesser-known films. Return as plain JSON array of movie titles only.`

    console.log("Calling AI with prompt:", userPrompt);
    const result = await getAIRecommendations(userPrompt);
    console.log("AI result:", result);

    setIsLoading(false);

    if(result === 'QUOTA_EXCEEDED'){
        toast.error("AI quota exceeded. Redirecting to home...");
        setTimeout(() => navigate('/'), 2000);
        return;
    }

    if(result){
        const cleanedResult = result.replace(/```json\n/i, '').replace(/\n```/i, '');
        console.log("Cleaned result:", cleanedResult);
        try {
            const recommendationArray = JSON.parse(cleanedResult);
            setRecommendation(recommendationArray);
            console.log("Parsed recommendations:", recommendationArray);
        } catch (error) {
            console.log("JSON parse error:", error);
            console.log("Raw result that failed to parse:", cleanedResult);
        }
    }else{
        console.log("No result from AI");
        toast.error("Failed to get recommendations.")
    }
    };

  return (
    <>
      {recommendation && recommendation.length > 0 ? (
        <>
          <div className='min-h-screen flex items-center justify-center relative overflow-hidden'>
            <div className='absolute inset-0 w-full h-full'>
              <LiquidChrome
                  baseColor={[0.18, 0.22, 0.27]}
                  speed={1}
                  amplitude={0.6}
                  interactive={true}
              />
            </div>
            <div className='absolute inset-0 bg-black/40'></div>
            <div className='relative z-10 flex items-center justify-center min-h-screen'>
              <div className='bg-black/60 backdrop-blur-md rounded-xl p-6 mx-auto max-w-4xl'>
                <h2 className='text-4xl font-bold text-white text-center'>Your CineCompass points to these films:</h2>
              </div>
            </div>
          </div>
          <div className='bg-[#2E3744] min-h-screen'>
            <div className='w-full max-w-6xl mx-auto p-6'>
              <RecommendedMovies movieTitles={recommendation} hideTitle={true} />
            </div>
            <Footer />
          </div>
        </>
      ) : (
        <div className='min-h-screen flex items-center justify-center relative overflow-hidden'>
          <div className='absolute inset-0 w-full h-full'>
              <LiquidChrome
                  baseColor={[0.18, 0.22, 0.27]}
                  speed={1}
                  amplitude={0.6}
                  interactive={true}
              />
          </div>
          <div className='absolute inset-0 bg-black/40'></div>

          {isLoading ? (
              <div className='relative z-10 w-full max-w-md mx-auto rounded-2xl bg-black/60 backdrop-blur-md shadow-2xl px-8 py-10 mt-4 flex flex-col items-center justify-center min-h-[480px]'>
                  <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-white mb-4'></div>
                  <h3 className='text-xl font-semibold text-white mb-2'>Generating Recommendations...</h3>
                  <p className='text-gray-300 text-center'>Our AI is analyzing your preferences to find the perfect movies for you.</p>
              </div>
          ) : showWelcome ? (
              <div className={`relative z-10 flex flex-col items-center justify-center min-h-screen transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                  <h1 className="text-9xl font-black mb-2 text-center text-white tracking-tight" style={{textShadow: '4px 4px 8px rgba(0,0,0,0.8)'}}>Welcome Sailor!</h1>
                  <p className="text-2xl text-white mb-12 text-center font-light">Before we start, let's take a quiz</p>
                  <button 
                      onClick={handleProceed}
                      className="px-8 py-3 rounded-lg font-semibold bg-gradient-to-r from-[#7a051d] to-[#d2172d] text-white hover:from-[#6a0419] hover:to-[#b8152a] transition-all duration-200 shadow-lg"
                  >
                      Proceed
                  </button>
              </div>
          ) : (
              <div className={`relative z-10 w-full max-w-md mx-auto rounded-2xl bg-black/60 backdrop-blur-md shadow-2xl px-8 py-10 mt-4 flex flex-col items-center min-h-[480px] transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>

                  <div className='w-full mb-8'>
                      <div className='w-full h-2 bg-gray-600 rounded-full overflow-hidden'>
                          <div className='h-full bg-gradient-to-r from-[#7a051d] to-[#d2172d] transition-all duration-300'
                               style={{width: `${((step + 1) / steps.length) * 100}%`}}></div>
                      </div>
                  </div>

                  <div className="w-full flex flex-col flex-1">
                      <div className='mb-6'>
                          <h3 className='text-lg font-semibold text-white mb-6 text-center'>{steps[step].label}</h3>

                          <div className='grid grid-cols-1 gap-3'>
                              {steps[step].options.map((opt, index) => (
                                  <button 
                                  key={index} 
                                  onClick={() => handleOption(opt)} 
                                  className={`w-full cursor-pointer py-3 rounded-xl transition font-semibold text-base flex items-center justify-center gap-2 focus:outline-none active:scale-95 duration-150 shadow-sm ${
                                      inputs[steps[step].name] === opt
                                          ? "bg-gradient-to-r from-[#7a051d] to-[#d2172d] text-white shadow-lg"
                                          : "bg-white/10 text-white hover:bg-gradient-to-r hover:from-[#7a051d] hover:to-[#d2172d] backdrop-blur-sm"
                                  }`}>
                                      {opt}
                                  </button>
                              ))}
                          </div>
                          {error && <p className='text-red-300 text-sm mt-2 text-center'>{error}</p>}
                      </div>

                      <div className='flex justify-center items-center mt-4'>
                          <button type='button' 
                                  onClick={step === steps.length - 1 ? generateRecommendations : handleNext}
                                  disabled = {!inputs[steps[step].name] || isLoading}
                                  className="px-12 py-2 rounded-lg font-semibold transition-colors duration-200 cursor-pointer bg-gradient-to-r from-[#7a051d] to-[#d2172d] text-white hover:from-[#6a0419] hover:to-[#b8152a] shadow-lg">
                              {step === steps.length - 1 ? "Finish" : "Next"}
                          </button>
                      </div>
                  </div>
              </div>
          )}
        </div>
      )}
    </>
  )
}

export default AIRecommendations
