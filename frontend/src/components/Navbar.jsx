import { HelpCircle, LogOut, Search, Settings, User } from "lucide-react"
// import Logo from "../assets/logo.png"   
import { Link } from "react-router"
import { useAuthStore } from "../store/authStore";
import { useState, useEffect, useRef } from "react";
import {toast} from "react-hot-toast";

const Navbar = () => {
    const {user, logout} = useAuthStore();
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);

    const avatarUrl = user?.profilePicture || (user ? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.username)}&backgroundColor=0A2472&textColor=ffffff` : "");


    const handleLogOut = async () => {
        const {message} = await logout();
        toast.success(message)
        setShowMenu(false)
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };

        if (showMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showMenu]);



  return (
    <nav className="bg-gradient-to-r from-[#7a051d] to-[#d2172d] text-gray-200 flex items-center justify-between items-center p-4 h-14 text-sm md:text-[15px] font-medium text-nowrap" style={{boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)'}}>
        
        <Link to="/">
        <img src="/cc-icon-logo.png" alt="CineCompass Logo" className="w-12 cursor-pointer brightness-125 cursor-pointer" />
        </Link>





        <div className='flex items-center space-x-4 relative'>
            <div className='relative hidden md:inline-flex'>
                <input type="text" className='bg-[#333333] px-4 py-2 rounded-full min-w-72 pr-10 outline-none' placeholder="Search..." />
            <Search className="absolute top-2 right-4 w-5 h-5" />    
            </div>

            {/* <Link to={user ? "ai-recommendations" : "signin"}>
                <button className='bg-[#0A2472] hover:bg-[#90a7c4] px-5 py-2 text-white cursor-pointer transition-colors duration-200'>
                    Get AI Movie Picks
                </button>
            </Link> */}

                {!user ? (
                    <Link to="/signin">
                    <button className='bg-[#0A2472] border border-[#333333] py-2 px-4 cursor-pointer hover:bg-gray-700 hover:text-white transition-colors duration-200'>
                        Sign In
                    </button>
                </Link>
                ) : (
                     <div className="relative" ref={menuRef}>
                        <img src={avatarUrl} alt={user.username} className="w-10 h-10 rounded-full border-2 border-[#03045E] cursor-pointer hover:border-white transition-colors duration-200 object-cover"
                        onClick={() => {
                            console.log('Avatar clicked, showMenu:', showMenu);
                            setShowMenu(!showMenu);
                        }}
                        />

                        <div className={`absolute right-0 mt-2 w-64 bg-white bg-opacity-95 py-4 px-3 flex flex-col gap-2 border border-[#333333] text-black rounded-lg shadow-lg z-50 transition-all duration-300 origin-top-right ${
                            showMenu ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                        }`}>
                                <div className="flex flex-col items-center border-b pb-2 mb-2">
                                    <p className="text-black font-semibold text-base ">{user.username}</p>
                                    <p className="text-xs text-gray-600">{user.email}</p>
                                </div>

                                <Link to="/profile" onClick={() => setShowMenu(false)} className="flex items-center px-4 py-3 rounded-lg text-black bg-[#ffffff] hover:bg-gray-100 gap-3 cursor-pointer">
                                    <User size={25} />
                                    <span>View Profile</span>
                                </Link>

                                <Link to="/settings" onClick={() => setShowMenu(false)} className="flex items-center px-4 py-3 rounded-lg text-black bg-[#ffffff] hover:bg-gray-100 gap-3 cursor-pointer">
                                    <Settings size={25} />
                                    <span>Settings</span>
                                </Link>

                                <button className="flex items-center px-4 py-3 rounded-lg text-black bg-[#ffffff] hover:bg-gray-100 gap-3 cursor-pointer">
                                    <HelpCircle size={25} />
                                    <span>Help Center</span>
                                </button>

                                <button onClick={handleLogOut} className="flex items-center px-4 py-3 rounded-lg text-black bg-[#ffffff] hover:bg-gray-100 gap-3 cursor-pointer">
                                    <LogOut size={25} />
                                    <span>Log Out</span>
                                </button>

                            </div>
                     </div>
             )}
        </div>
    </nav>
  )
}

export default Navbar