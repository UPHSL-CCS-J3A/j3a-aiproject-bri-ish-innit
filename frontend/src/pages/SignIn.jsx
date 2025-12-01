import React, { useState } from 'react'
import backgroundImage from '/Background_banner.jpg'
import { useNavigate } from 'react-router'
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const SignIn = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const {login, isLoading, error} = useAuthStore();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const {message} = await login(username, password);
            console.log("form submitted");
            toast.success(message);
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    }

  return (
    <div className="min-h-screen bg-center bg-no-repeat px-4 md:px-8 py-5" style={{
        backgroundImage: `linear-gradient(rgba(0, 157, 255, 0.47), rgba(2, 25, 81, 0.5)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
    }}>
        <div className='rounded-lg max-w-[450px] w-full bg-black bg-opacity-75 rounded px-8 py-14 mt-40 ml-180 mt-8'>
            <h1 className='text-3xl font-medium text-white mb-7'>Sign In</h1>

            <form onSubmit={handleLogin} className='flex flex-col spacey-4'>
                <input 
                type="text" 
                placeholder="Username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className='w-full h-[50px] bg-[#333] text-white rounded px-5 text-base' />

                <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full h-[50px] bg-[#333] text-white rounded px-5 text-base mt-4' />

                {error && <p className='text-red-500'>{error}</p>}

                <button type="submit" disabled={isLoading} className='w-full bg-[#0f52ba] text-white font-semibold py-3 rounded mt-6 hover:opacity-90 cursor-pointer'>
                    Sign In
                </button>
            </form>

        <div className='mt-10 text-[#737373] text-sm'>
            <p>New to CineCompass? <span onClick={() => navigate("/signup")} className='text-white font-medium cursor-pointer ml-2 hover:underline'>Sign Up Now</span></p>
        </div>

        </div>
    </div>

  )
}

export default SignIn