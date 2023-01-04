import { Container } from '@mui/material'
import React from 'react'
import licensing from './../../../assets/licensing.png'
import revenue from './../../../assets/revenue.png'
import web3Content from './../../../assets/web3Content.png'
import './About.css'
export const About = () => {
  return (
    <div className="py-20 about">
      <Container maxWidth={'xl'} className="aboutContainer">
        <div className="flex flex-col gap-y-14 about-main mx-auto items-center">
          <div className="flex flex-col-reverse sm:grid sm:grid-cols-10 gap-x-8 gap-y-5 sm:gap-y-0">
            <div className="col-span-10 sm:col-span-5">
              <div className="flex flex-col gap-y-2">
                <h1 className="aboutHeading font-semibold text-white">
                  Decentralized licensing
                </h1>
                <p className="aboutContent text-white">
                  Allow your community to license your IP
                  <br className="hidden md:block" /> at scale and tap into the
                  power of
                  <br className="hidden md:block" /> completely permissionless
                  co-creation.
                </p>
              </div>
            </div>
            <div className="col-span-10 sm:col-span-5">
              <div className="flex items-start justify-center sm:justify-start gap-x-10 sm:pl-14">
                <img src={licensing} alt="licensing" className="w-32" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-10 gap-y-5 sm:gap-y-0 gap-x-8">
            <div className="col-span-10 sm:col-span-5">
              <div className="flex justify-center gap-x-10">
                <img src={web3Content} alt="web3Content" className="w-32" />
              </div>
            </div>
            <div className="col-span-10 sm:col-span-5 flex items-center">
              <div className="flex flex-col gap-y-2">
                <h1 className="aboutHeading font-semibold text-white">
                  Web3 content distribution
                </h1>
                <p className="text-white aboutContent">
                  Drop a turnkey theater in the metaverse,{' '}
                  <br className="hidden md:block" /> create token-powered
                  events, & screen <br className="hidden md:block" /> your
                  content for the world.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col-reverse sm:grid sm:grid-cols-10 gap-x-8 gap-y-5 sm:gap-y-0">
            <div className="col-span-10 sm:col-span-5">
              <div className="flex flex-col gap-y-2">
                <h1 className="aboutHeading font-semibold text-white">
                  Manage revenue from
                  <br className="hidden md:block" /> anywhere
                </h1>
                <p className="text-white aboutContent">
                  Automatically recoup revenue, track{' '}
                  <br className="hidden md:block" /> schedules, & pay out
                  royalties—all in
                  <br className="hidden md:block" /> fiat or crypto.
                </p>
              </div>
            </div>
            <div className="col-span-10 sm:col-span-5">
              <div className="flex items-start justify-center sm:justify-start gap-x-10 sm:pl-14">
                <img src={revenue} alt="revenue" className="w-40" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
