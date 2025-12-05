import React, { useState, useEffect, useRef } from 'react'
import { User, Camera, Tag, Save, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'

const Settings = () => {
  const { user, updateUser } = useAuthStore()
  const [localUser, setLocalUser] = useState(null)
  const [profilePicture, setProfilePicture] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [recommendationTags, setRecommendationTags] = useState([])
  const [newTag, setNewTag] = useState('')
  const [supportIndie, setSupportIndie] = useState(false)
  const [allowAdultContent, setAllowAdultContent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  const userpics = [
    '20002.png', '20006.png', '20007.png', '20008.png', '2000a.png',
    '21006.png', '21015.png', '21016.png', '21019.png', '21036.png',
    '21043.png', '2802e.png'
  ]

  useEffect(() => {
    fetchUser()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/fetch-user', {
        credentials: 'include'
      })
      const data = await response.json()
      if (data.user) {
        setLocalUser(data.user)
        setProfilePicture(data.user.profilePicture || '')
        setDisplayName(data.user.displayName || data.user.username)
        setRecommendationTags(data.user.recommendationTags || [])
        setSupportIndie(data.user.supportIndie ?? true)
        setAllowAdultContent(data.user.allowAdultContent || false)
      }
    } catch (error) {
      console.error('Error fetching user:', error)
    }
  }

  const addTag = () => {
    if (newTag.trim() && !recommendationTags.includes(newTag.trim())) {
      setRecommendationTags([...recommendationTags, newTag.trim()])
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove) => {
    setRecommendationTags(recommendationTags.filter(tag => tag !== tagToRemove))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          profilePicture,
          displayName,
          recommendationTags,
          supportIndie,
          allowAdultContent
        })
      })

      const data = await response.json()
      if (response.ok) {
        toast.success('Profile updated successfully!')
        setLocalUser(data.user)
        updateUser(data.user) // Update the global auth store
      } else {
        toast.error(data.message || 'Failed to update profile')
      }
    } catch (error) {
      toast.error('Error updating profile')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!localUser) {
    return (
      <div className='min-h-screen bg-[#2E3744] flex items-center justify-center'>
        <div className='text-white text-xl'>Loading...</div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-[#2E3744] text-white p-8'>
      <div className='max-w-2xl mx-auto'>
        <h1 className='text-3xl font-bold mb-8 text-center'>Settings</h1>
        
        <div className='bg-[#1F1B24] rounded-lg p-6 space-y-6'>
          {/* Profile Picture */}
          <div className='text-center'>
            <div className='relative inline-block mb-4'>
              {profilePicture ? (
                <img 
                  src={profilePicture} 
                  alt="Profile" 
                  className='w-24 h-24 rounded-full object-cover'
                />
              ) : (
                <div className='w-24 h-24 rounded-full bg-gray-600 flex items-center justify-center'>
                  <User size={40} />
                </div>
              )}
              <div className='absolute bottom-0 right-0 bg-purple-600 rounded-full p-2'>
                <Camera size={16} />
              </div>
            </div>
            
            <div className='max-w-xs mx-auto relative' ref={dropdownRef}>
              <label className='block text-sm font-medium mb-2'>Choose Avatar</label>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className='w-full bg-[#2E3744] border border-gray-600 rounded-lg px-4 py-2 text-white flex items-center justify-between hover:border-purple-400 transition-colors'
              >
                <span>{profilePicture ? `Avatar ${profilePicture.split('/').pop().replace('.png', '')}` : 'Select an avatar...'}</span>
                <ChevronDown size={20} className={`transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showDropdown && (
                <div className='absolute top-full left-0 right-0 mt-1 bg-[#2E3744] border border-gray-600 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto'>
                  {userpics.map((pic) => (
                    <div
                      key={pic}
                      onClick={() => {
                        setProfilePicture(`/userpics/${pic}`)
                        setShowDropdown(false)
                      }}
                      className='flex items-center gap-3 px-4 py-3 hover:bg-[#1F1B24] cursor-pointer transition-colors'
                    >
                      <img
                        src={`/userpics/${pic}`}
                        alt={`Avatar ${pic}`}
                        className='w-8 h-8 rounded-full object-cover'
                      />
                      <span className='text-white'>Avatar {pic.replace('.png', '')}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Display Name */}
          <div>
            <label className='block text-sm font-medium mb-2'>Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className='w-full bg-[#2E3744] border border-gray-600 rounded-lg px-4 py-2 text-white'
              placeholder="Enter your display name"
            />
          </div>

          {/* Recommendation Tags */}
          <div>
            <label className='block text-sm font-medium mb-2'>Recommendation Tags</label>
            <p className='text-gray-400 text-sm mb-3'>Add tags that describe your movie preferences (e.g., "Retro", "Dark", "Comedy")</p>
            
            <div className='flex gap-2 mb-3'>
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
                className='flex-1 bg-[#2E3744] border border-gray-600 rounded-lg px-4 py-2 text-white'
                placeholder="Add a tag..."
              />
              <button
                onClick={addTag}
                className='bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors'
              >
                <Tag size={20} />
              </button>
            </div>

            <div className='flex flex-wrap gap-2'>
              {recommendationTags.map((tag, index) => (
                <span
                  key={index}
                  className='bg-purple-600/20 text-purple-300 px-3 py-1 rounded-full text-sm flex items-center gap-2 cursor-pointer hover:bg-purple-600/30'
                  onClick={() => removeTag(tag)}
                >
                  {tag}
                  <span className='text-xs'>×</span>
                </span>
              ))}
            </div>
          </div>

          {/* Support Indie Toggle */}
          <div>
            <label className='flex items-center gap-3 cursor-pointer'>
              <input
                type="checkbox"
                checked={supportIndie}
                onChange={(e) => setSupportIndie(e.target.checked)}
                className='w-5 h-5 text-purple-600 bg-[#2E3744] border-gray-600 rounded focus:ring-purple-500'
              />
              <div>
                <span className='text-sm font-medium'>Support Indie Films</span>
                <p className='text-gray-400 text-xs'>Prioritize independent and lesser-known films in recommendations</p>
              </div>
            </label>
          </div>

          {/* Adult Content Toggle */}
          <div>
            <label className='flex items-center gap-3 cursor-pointer'>
              <input
                type="checkbox"
                checked={allowAdultContent}
                onChange={(e) => setAllowAdultContent(e.target.checked)}
                className='w-5 h-5 text-red-600 bg-[#2E3744] border-gray-600 rounded focus:ring-red-500'
              />
              <div>
                <span className='text-sm font-medium'>Allow Adult Content (R18+)</span>
                <p className='text-gray-400 text-xs'>Include mature/adult-rated films in recommendations</p>
              </div>
            </label>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={loading}
            className='w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50'
          >
            <Save size={20} />
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Settings