import { Search } from "lucide-react"
import Logo from "../assets/logo.png"   
import { Link } from "react-router"

const Navbar = () => {
  return (
    <nav className="bg-[#496595] text-gray-200 flex items-center justify-between items-center p-4 h-20 text-sm md:text-[15px] font-medium text-nowrap">
        
        <Link to="/">
        <img src={Logo} alt="CineCompass Logo" className="w-24 cursor-pointer brightness-125 cursor-pointer" />
        </Link>


        <ul className='hidden xl:flex space-x-6'>
            <li className='cursor-pointer hover:text-[#e50914]'>Home</li>
            <li className='cursor-pointer hover:text-[#e50914]'>TV Shows</li>
            <li className='cursor-pointer hover:text-[#e50914]'>Movies</li>
            <li className='cursor-pointer hover:text-[#e50914]'>Anime</li>
            <li className='cursor-pointer hover:text-[#e50914]'>Games</li>
            <li className='cursor-pointer hover:text-[#e50914]'>New & Popular</li>
            <li className='cursor-pointer hover:text-[#e50914]'>Upcoming</li>
        </ul>


        <div className='flex items-center space-x-4 relative'>
            <div className='relative hidden md:inline-flex'>
                <input type="text" className='bg-[#333333] px-4 py-2 rounded-full min-w-72 pr-10 outline-none' placeholder="Search..." />
            <Search className="absolute top-2 right-4 w-5 h-5" />    
            </div>
                <button className='bg-[#0A2472] hover:bg-[#90a7c4] px-5 py-2 text-white cursor-pointer'>
                    Get AI Movie Picks
                </button>

                <Link to="/signin">
                    <button className='bg-[#0A2472] border border-[#333333] py-2 px-4 cursor-pointer hover:bg-gray-700 hover:text-white'>
                        Sign In
                    </button>
                </Link>
        </div>
    </nav>
  )
}

export default Navbar