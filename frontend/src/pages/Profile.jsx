import React, { useState, useEffect } from 'react'
import { User, Mail, Calendar, Tag } from 'lucide-react'

const Profile = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/fetch-user', {
        credentials: 'include'
      })
      const data = await response.json()
      if (data.user) {
        setUser(data.user)
      }
    } catch (error) {
      console.error('Error fetching user:', error)
    }
  }

  if (!user) {
    return (
      <div className='min-h-screen bg-[#2E3744] flex items-center justify-center'>
        <div className='text-white text-xl'>Loading...</div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-[#2E3744] text-white p-8'>
      <div className='max-w-2xl mx-auto'>
        <h1 className='text-3xl font-bold mb-8 text-center'>My Profile</h1>
        
        <div className='bg-[#1F1B24] rounded-lg p-6 space-y-6'>
          {/* Profile Picture & Basic Info */}
          <div className='text-center'>
            <div className='relative inline-block mb-4'>
              {user?.profilePicture ? (
                <img 
                  src={user.profilePicture} 
                  alt="Profile" 
                  className='w-32 h-32 rounded-full object-cover'
                />
              ) : (
                <div className='w-32 h-32 rounded-full bg-gray-600 flex items-center justify-center'>
                  <User size={60} />
                </div>
              )}
            </div>
            <h2 className='text-2xl font-bold mb-2'>{user?.displayName || user?.username}</h2>
            <p className='text-gray-400'>@{user?.username}</p>
          </div>

          {/* User Information */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='bg-[#2E3744] rounded-lg p-4'>
              <div className='flex items-center gap-3 mb-2'>
                <User className='text-purple-400' size={20} />
                <h3 className='font-semibold'>Username</h3>
              </div>
              <p className='text-gray-300'>{user?.username}</p>
            </div>

            <div className='bg-[#2E3744] rounded-lg p-4'>
              <div className='flex items-center gap-3 mb-2'>
                <Mail className='text-purple-400' size={20} />
                <h3 className='font-semibold'>Email</h3>
              </div>
              <p className='text-gray-300'>{user?.email}</p>
            </div>

            <div className='bg-[#2E3744] rounded-lg p-4'>
              <div className='flex items-center gap-3 mb-2'>
                <Calendar className='text-purple-400' size={20} />
                <h3 className='font-semibold'>Member Since</h3>
              </div>
              <p className='text-gray-300'>
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>

            <div className='bg-[#2E3744] rounded-lg p-4'>
              <div className='flex items-center gap-3 mb-2'>
                <Tag className='text-purple-400' size={20} />
                <h3 className='font-semibold'>Preference Tags</h3>
              </div>
              <p className='text-gray-300'>
                {user?.recommendationTags?.length || 0} tags
              </p>
            </div>
          </div>

          {/* Recommendation Tags */}
          {user?.recommendationTags && user.recommendationTags.length > 0 && (
            <div>
              <h3 className='text-lg font-semibold mb-3'>Movie Preferences</h3>
              <div className='flex flex-wrap gap-2'>
                {user.recommendationTags.map((tag, index) => (
                  <span
                    key={index}
                    className='bg-purple-600/20 text-purple-300 px-3 py-1 rounded-full text-sm'
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile