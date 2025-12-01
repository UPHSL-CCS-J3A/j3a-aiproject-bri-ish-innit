import { HelpCircle, LogOut, Search, Settings } from "lucide-react"
import Logo from "../assets/logo.png"   
import { Link } from "react-router"
import { useAuthStore } from "../store/authStore";
import { useState } from "react";
import {toast} from "react-hot-toast";

const Navbar = () => {
    const {user, logout} = useAuthStore();
    const [showMenu, setShowMenu] = useState(false);

    const avatarUrl = user ? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.username)}&backgroundColor=0A2472&textColor=ffffff` : "";


    const handleLogOut = async () => {
        const {message} = await logout();
        toast.success(message)
        setShowMenu(false)
    }



  return (
    <nav className="bg-[#496595] text-gray-200 flex items-center justify-between items-center p-4 h-20 text-sm md:text-[15px] font-medium text-nowrap">
        
        <Link to="/">
        <img src={Logo} alt="CineCompass Logo" className="w-24 cursor-pointer brightness-125 cursor-pointer" />
        </Link>


        <ul className='hidden xl:flex space-x-6'>
            <li className='cursor-pointer hover:text-white transition-colors duration-200'>Home</li>
            <li className='cursor-pointer hover:text-white transition-colors duration-200'>TV Shows</li>
            <li className='cursor-pointer hover:text-white transition-colors duration-200'>Movies</li>
            <li className='cursor-pointer hover:text-white transition-colors duration-200'>Anime</li>
            <li className='cursor-pointer hover:text-white transition-colors duration-200'>Games</li>
            <li className='cursor-pointer hover:text-white transition-colors duration-200'>New & Popular</li>
            <li className='cursor-pointer hover:text-white transition-colors duration-200'>Upcoming</li>
        </ul>


        <div className='flex items-center space-x-4 relative'>
            <div className='relative hidden md:inline-flex'>
                <input type="text" className='bg-[#333333] px-4 py-2 rounded-full min-w-72 pr-10 outline-none' placeholder="Search..." />
            <Search className="absolute top-2 right-4 w-5 h-5" />    
            </div>

            <Link to={user ? "ai-recommendations" : "signin"}>
                <button className='bg-[#0A2472] hover:bg-[#90a7c4] px-5 py-2 text-white cursor-pointer transition-colors duration-200'>
                    Get AI Movie Picks
                </button>
            </Link>

                {!user ? (
                    <Link to="/signin">
                    <button className='bg-[#0A2472] border border-[#333333] py-2 px-4 cursor-pointer hover:bg-gray-700 hover:text-white transition-colors duration-200'>
                        Sign In
                    </button>
                </Link>
                ) : (
                     <div className="relative">
                        <img src={avatarUrl} alt={user.username} className="w-10 h-10 rounded-full border-2 border-[#03045E] cursor-pointer hover:border-white transition-colors duration-200"
                        onClick={() => {
                            console.log('Avatar clicked, showMenu:', showMenu);
                            setShowMenu(!showMenu);
                        }}
                        />

                        {showMenu && (
                            <div className="absolute right-0 mt-2 w-64 bg-white bg-opacity-95 py-4 px-3 flex flex-col gap-2 border border-[#333333] text-black rounded-lg shadow-lg z-50">
                                <div className="flex flex-col items-center border-b pb-2 mb-2">
                                    <p className="text-black font-semibold text-base ">{user.username}</p>
                                    <p className="text-xs text-gray-600">{user.email}</p>
                                </div>

                                <button className="flex items-center px-4 py-3 rounded-lg text-black bg-[#ffffff] hover:bg-gray-100 gap-3 cursor-pointer">
                                    <HelpCircle size={25} />
                                    <span>Help Center</span>
                                </button>

                                <button className="flex items-center px-4 py-3 rounded-lg text-black bg-[#ffffff] hover:bg-gray-100 gap-3 cursor-pointer">
                                    <Settings size={25} />
                                    <span>Settings</span>
                                </button>

                                <button onClick={handleLogOut} className="flex items-center px-4 py-3 rounded-lg text-black bg-[#ffffff] hover:bg-gray-100 gap-3 cursor-pointer">
                                    <LogOut size={25} />
                                    <span>Log Out</span>
                                </button>

                            </div>
                            )}
                     </div>
             )}
        </div>
    </nav>
  )
}

export default Navbar