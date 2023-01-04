import React from 'react'
// import { SpacesDashboard } from '../../SpacesDashboard'
import './FAQ.css'
export const FAQ = () => {
  const faqData = [
    {
      title: 'Whitelisted projects',
      desc:
        'When you acquire a license to the Hidden Lakes Cinematic Universe IP, these are the projects that you can draw from.',
      links: [
        'He Who Lives In Hidden Lakes (2021)',
        'The Legend of the Vampire Fern (ongoing)',
        'Project Eleusis (ongoing)',
      ],
    },
    {
      title: 'Watch the films',
      desc:
        'Check out these links to stream all the current films in the HLCU.',
      links: [
        'The Hidden Lakes Cinematic Universe on Beem',
        'He Who Lives In Hidden Lakes - Prime Video',
        'The Legend of the Vampire Fern - OpenSea',
      ],
    },
    {
      title: 'HIDDEN ONES',
      desc: 'The genesis NFT collection of the HLCU.',
      links: [
        'Buy HIDDEN ONES on OpenSea',
        'Buy HIDDEN ONES on LooksRare',
        'HIDDEN ONES Official Sit',
      ],
    },
    {
      title: 'About Proof-of-Stake Licensing',
      desc:
        'Learn more about the innovative licensing model created by the HIDDEN ONES team.',
      links: [
        'FAQ: Proof-of-stake licensing',
        'How to Build an NFT Movie Franchise',
      ],
    }
  ]
  return (
      <div>
        <div className="faqHeader h-52 p-10 flex items-end">
          <div className="flex flex-col sm:flex-row gap-y-8 sm:gap-y-0 justify-between items-center w-full">
            <h1 className="text-xl font-thin text-white">FAQ</h1>
          </div>
        </div>
        <div className='p-5 sm:p-10 flex flex-col gap-y-10'>
          {
            faqData.map((data, ind) => (
              <div key={ind + 1}>
                <h1 className='text-white font-semibold text-2xl'>{data.title}</h1>
                <p className='text-gray-200 text-md mt-2'>{data.desc}</p>
                <div className='flex flex-col gap-y-1 mt-4'>
                  {data.links.map((d, i) => (
                    <span className='text-gray-200 text-md' key={i + 1}><u>{d}</u></span>
                  ))}
                </div>
              </div>
            ))
          }
        </div>
      </div>
  )
}
