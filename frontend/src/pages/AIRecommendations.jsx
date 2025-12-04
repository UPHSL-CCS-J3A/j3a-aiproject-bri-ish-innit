import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { getAIRecommendations } from '../lib/AIModel';
import RecommendedMovies from '../components/RecommendedMovies';

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

    const [inputs, setInputs] = useState(initialState);
    const [step, setStep] = useState(0);
    const [error, setError] = useState("");
    const [recommendation, setRecommendation] = useState([]);
    const [isLoading, setIsLoading] = useState(false); 

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

    const generateRecommendations = async () => {
        console.log("Generate recommendations called");
        console.log("Inputs:", inputs);
        
        if(!inputs){
            toast("Please enter your inputs.")
            return;
        }

        setIsLoading(true);

        const userPrompt = `Given the following user inputs:

- Decade: ${inputs.decade}
- Genre: ${inputs.genre}
- Language: ${inputs.language}
- Length: ${inputs.length}
- Mood: ${inputs.mood}

Recommend 10 ${inputs.mood.toLowerCase()} ${
      inputs.language
    }-language ${inputs.genre.toLowerCase()} movies released in the ${
      inputs.decade
    } with a runtime between ${
      inputs.length
    }. Return the list as plain JSON array of movie titles only, No extra text, no explanations, no code blocks, no markdown, just the JSON array.
    example:
[
  "Movie Title 1",
  "Movie Title 2",
  "Movie Title 3",
  "Movie Title 4",
  "Movie Title 5",
  "Movie Title 6",
  "Movie Title 7",
  "Movie Title 8",
  "Movie Title 9",
  "Movie Title 10"
]`

    console.log("Calling AI with prompt:", userPrompt);
    const result = await getAIRecommendations(userPrompt);
    console.log("AI result:", result);

    setIsLoading(false);

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
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-[#023e8a] via-[#48cae4] to-[#caf0f8] relative overflow-hidden'>

        {!(recommendation && recommendation.length > 0) && (
            <img src="/Background_banner.jpg" className="absolute inset-0 w-full h-full object-cover opacity-20 blur-[2px]" />
            )}


        {recommendation && recommendation.length > 0 ? (
            <div className='w-full max-w-7xl mx-auto mt-2'>
                <h2 className="text-2xl font-bold mb-4 text-center text-black">AI Recommended Movies</h2>
             <RecommendedMovies movieTitles={recommendation} />
            </div>
        ) : (
            <div className='relative w-full max-w-md mx-auto rounded-2xl bg-[#caf0f8]/90 shadow-2xl border-3 border-[#333] px-8 py-10 mt-4 flex flex-col items-center min-h-[480px] '>
                <h2 className="text-3xl font-extrabold mb-8 text-center text-black tracking-tight drop-shadow-lg">AI Movie Recommendation</h2>

                <div className='w-full flex items-center mb-8'>
                    <div className='flex-1 h-2 bg-gray-300 rounded-full mr-4 overflow-hidden'>
                        <div className='h-full bg-[#023e8a] transition-all duration-300'
                             style={{width: `${((step + 1) / steps.length) * 100}%`}}></div>
                    </div>
                    <span className="ml-4 text-black text-sm font-semibold">{step + 1}/{steps.length}</span>
                </div>

                <div className="w-full flex flex-col flex-1">
                    <div className='mb-6'>
                        <h3 className='text-lg font-semibold text-black mb-6 text-center'>{steps[step].label}</h3>

                        <div className='grid grid-cols-1 gap-3'>
                            {steps[step].options.map((opt, index) => (
                                <button 
                                key={index} 
                                onClick={() => handleOption(opt)} 
                                className={`w-full cursor-pointer py-3 rounded-xl border-2 transition font-semibold text-base flex items-center justify-center gap-2 focus:outline-none focus:ring-4 active:scale-95 duration-150 focus:ring-[#023e8a] shadow-sm ${
                                    inputs[steps[step].name] === opt
                                        ? "bg-[#023e8a] border-[#023e8a] text-white shadow-lg"
                                        : "bg-[#48cae4] border-[#48cae4] text-black hover:bg-[#023e8a] hover:border-[#023e8a] hover:text-white"
                                }`}>
                                    {opt}
                                </button>
                            ))}
                        </div>
                        {error && <p className='text-red-600 text-sm mt-2 text-center'>{error}</p>}
                    </div>

                    <div className='flex justify-between items-center mt-6'>
                        {step > 0 && (
                            <button type='button' 
                                    onClick={handleBack}
                                    className="px-6 py-2 rounded-lg font-semibold bg-[#caf0f8] hover:bg-[#d7f3fb] transition-colors duration-200 cursor-pointer border-2">
                                Back
                            </button>
                        )}

                        <button type='button' 
                                onClick={step === steps.length - 1 ? generateRecommendations : handleNext}
                                disabled = {!inputs[steps[step].name] || isLoading}
                                className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-200 cursor-pointer border-2 ${
                                    step === 0 ? 'ml-auto' : ''
                                } bg-[#023e8a] text-white hover:bg-[#0353a4] border-[#023e8a] hover:border-[#0353a4]`}>
                            {step === steps.length - 1 ? "Finish" : "Next"}
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  )
}

export default AIRecommendations
