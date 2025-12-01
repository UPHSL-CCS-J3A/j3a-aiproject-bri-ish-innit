import React from 'react'

const AIRecommendations = () => {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-[#023e8a] via-[#48cae4] to-[#caf0f8] relative overflow-hidden'>
        <div className='relative w-full max-w-md mx-auto rounded-2xl bg-[#caf0f8]/90 shadow-2xl border-3 border-[#333] px-8 py-10 mt-4 flex flex-col items-center min-h-[480px] '>
        <h2 className="text-3xl font-extrabold mb-8 text-center text-black tracking-tight drop-shadow-lg">AI Movie Recommendation</h2>

            <div className='w-full flex items-center mb-8'>
            <div className='flex-1 h-2 bg-gray-300 rounded-full mr-4 overflow-hidden'>
                    <div className='h-full bg-[#023e8a] transition-all duration-300'
                    style={{width: "50%"}}></div>
                </div>

                <span className="ml-4 text-black text-sm font-semibold">2/5</span>
            </div>

            <div className="w-full flex flex-col flex-1">
                <div className='mb-6'>
                    <h3 className='text-lg font-semibold text-black mb-6 text-center'>What is your preferred genre?</h3>

                    <div className='grid grid-cols-1 gap-3'>
                        <button className='w-full py-3 rounded-xl border-2 transition font-semibold text-base flex items-center justify-center bg-[#48cae4] hover:bg-[#023e8a] hover:text-white gap-2 cursor-pointer'>
                            Option 1
                        </button>

                        <button className='w-full py-3 rounded-xl border-2 transition font-semibold text-base flex items-center justify-center bg-[#48cae4] hover:bg-[#023e8a] hover:text-white gap-2 cursor-pointer'>
                            Option 2
                        </button>

                        <button className='w-full py-3 rounded-xl border-2 transition font-semibold text-base flex items-center justify-center bg-[#48cae4] hover:bg-[#023e8a] hover:text-white gap-2 cursor-pointer'>
                            Option 3
                        </button>

                        <button className='w-full py-3 rounded-xl border-2 transition font-semibold text-base flex items-center justify-center bg-[#48cae4] hover:bg-[#023e8a] hover:text-white gap-2 cursor-pointer'>
                            Option 4
                        </button>
                    </div>
                </div>

                <div className='flex justify-between items-center mt-6'>
                    <button type='button' className="px-6 py-2 rounded-lg font-semibold bg-[#caf0f8] hover:bg-[#d7f3fb] transition-colors duration-200 cursor-pointer border-2">
                        Back
                    </button>

                    <button type='button' className="px-6 py-2 rounded-lg font-semibold bg-[#023e8a] text-white hover:bg-[#0353a4] transition-colors duration-200 cursor-pointer border-2 border-[#023e8a] hover:border-[#0353a4]">
                        Next
                    </button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default AIRecommendations
