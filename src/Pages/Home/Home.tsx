import React from 'react'
import { useNavigate } from 'react-router-dom'
import { About } from '../../Components/LandingPageComponents/About/About'
import { Header } from '../../Components/LandingPageComponents/Header/Header'
import logo from './../../assets/logo.png'
import twitter from './../../assets/path5.png'
import discord from './../../assets/discord.png'
import './Home.css'
export const Home = () => {
    let navigate = useNavigate()
  return (
    <div>
      <Header></Header>
      <About></About>
      <div className="beta py-28 flex justify-center">
        <div className='flex flex-col gap-y-10'>
          <h1 className='text-white  font-bold text-xl text-center'>Now in private beta</h1>
          <div className='flex items-center gap-x-8 margin-auto'>
            {/* <button onClick={() => {navigate("/greenlit-home")}} className="px-4 sm:px-5 py-2 text-white text-xs sm:text-sm beta-btn rounded-full"><span className="beta-text">Launch app</span></button>
            <button className="px-4 sm:px-5 py-2 text-white text-xs sm:text-sm beta-btn rounded-full"><span className="beta-text">Get Greenlit</span></button> */}
            <a href='https://twitter.com/GWSTUDIOS_' target="_blank"><img src={twitter} alt="logo" className='social-link' /></a>
            <a href='https://discord.gg/gpEDKm7S' target="_blank"><img src={discord} alt="logo" className='social-link' /></a>
          </div>
        </div>
      </div>
      <div className='footer py-20 flex justify-center'>
          <img src={logo} alt="logo" className='w-32 sm:w-40' />
      </div>
    </div>
  )
}
