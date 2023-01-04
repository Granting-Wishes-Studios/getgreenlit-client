import React from 'react'
import './Header.css'
import logo from './../../../assets/logo.png'
import landingHeaderImg from './../../../assets/landingHeaderImg.png'
import { Container } from '@mui/material'
import { useNavigate } from 'react-router-dom'
export const Header = () => {
  let navigate = useNavigate()
  return (
    <div className='main-header'>
      <div className="navbar_main pt-5 xl:px-40 2xl:px-48">
        <Container maxWidth={'xl'}>
          <div className="flex items-center justify-between">
            <img src={logo} alt="logo3" className="w-32 sm:w-40" />
            {/* <button onClick={() => {navigate("/greenlit-home")}} className="px-4 sm:px-5 py-2 text-white text-xs sm:text-sm launch-btn rounded-full">
              Launch app
            </button> */}
            <a href="/greenlit-home"><button  className="px-4 sm:px-5 py-2 text-white text-xs sm:text-sm launch-btn rounded-full">
              Get Greenlit
            </button></a>
          </div>
        </Container>
      </div>
      <div className="header py-20">
        <Container maxWidth={'xl'}>
          <div className='flex flex-col sm:flex-row justify-center lg:justify-between items-center gap-y-8 sm:gap-y-0 sm:gap-x-5 sm:px-5 md:px-16 lg:px-20 xl:px-44'>
            <div className="flex flex-col gap-y-5 sm:w-1/2">
              <h1 className="header-heading text-white text-center sm:text-left font-bold text-xl sm:text-2xl md:text-3xl 2xl:text-4xl tracking-wider">
                Supercharge your
                <br className='hidden md:block'/> intellectual property.
              </h1>
              <p className="sm:text-lg 2xl:text-xl text-white text-center sm:text-left">
                Web3 tools for decentralized rights
                <br className='hidden md:block'/> management, royalty recoupment,
                <br className='hidden md:block'/> & content distribution.
              </p>
            </div>
            <div className='flex justify-center sm:justify-end sm:w-1/2'>
              <img src={landingHeaderImg} alt="landingHeaderImg" className='object-cover w-5/6' />
            </div>
          </div>
        </Container>
      </div>
    </div>
  )
}
