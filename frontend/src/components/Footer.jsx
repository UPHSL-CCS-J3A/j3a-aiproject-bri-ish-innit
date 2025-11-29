import React from 'react'

const Footer = () => {
  return (
    <div className='bg-[#FFFDD0] text-[#737373] md:px-10' >
        <div className='py-10 pt-20'>

            <p>Developed by The Bri'ish Innits</p>
            <p>BOOOMBOCLAAT WAGWAN MI BRODA GET DEM TING DOWN RUN DOWN SHOWDOWN BLODCLAAAT</p>
        </div>
        <p className='pb-5'>For more questions: wag po</p>

        <div className='grid grid-cols-2 md:grid-cols-4 text-sm pb-10 max-w-5xl'>
            <ul className='flex flex-col space-y-2'>
                <li>FAQ</li>
                <li>Investor Relations: None lmao</li>
                <li>Privacy</li>
                <li>Speed Test huh</li>
            </ul>

            <ul className='flex flex-col space-y-2'>
                <li>Help Centre</li>
                <li>Jobs</li>
                <li>Cookie Preferences</li>
                <li>Legal Notices</li>
            </ul>

            <ul className='flex flex-col space-y-2'>
                <li>Account</li>
                <li>Ways to Watch</li>
                <li>Corporate Information</li>
                <li>Only on CineCompass</li>
            </ul>

            <ul className='flex flex-col space-y-2'>
                <li>Media Centre</li>
                <li>Terms of Use</li>
                <li>Contact Us</li>
            </ul>
        </div>
    </div>
  )
}

export default Footer