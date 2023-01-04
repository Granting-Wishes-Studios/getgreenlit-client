import React, { Dispatch, SetStateAction } from 'react'
import './SpacesSidebar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { NavLink } from 'react-router-dom'
interface Props {
  showSpacesSidebar: Boolean
  setShowSpacesSidebar: Dispatch<SetStateAction<Boolean>>
}
const SpacesSidebar: React.FC<Props> = (props) => {
  return (
    <div
      className={`${
        props.showSpacesSidebar
          ? 'fixed left-0 z-10 top-0'
          : 'fixed top-0 -left-full'
      } lg:relative lg:left-0 duration-500 block z-10 w-48 h-full pb-20 mainSidebar border-r border-gray-700`}
    >
      <div className="flex justify-end px-5 items-center h-14 block lg:hidden">
        <button
          onClick={() => {
            props.setShowSpacesSidebar(false)
          }}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-white text-lg" />
        </button>
      </div>
      <div className="h-full flex flex-col gap-y-4 overflow-y-auto py-4">
        <NavLink
          to="/greenlit-home"
          className={({ isActive }) =>
            [
              'px-8 py-1 text-white text-sm font-semibold border-r-4 border-white',
              isActive ? 'border-opacity-100' : "border-opacity-0 hover:border-opacity-100",
            ]
              .filter(Boolean)
              .join(' ')
          }
        >
          <span>All Spaces</span>
        </NavLink>
        <NavLink
          to="/faq"
          className={({ isActive }) =>
            [
              'px-8 py-1 text-white text-sm font-semibold border-r-4 border-white',
              isActive ? 'border-opacity-100' : "border-opacity-0 hover:border-opacity-100",
            ]
              .filter(Boolean)
              .join(' ')
          }
        >
          <span>FAQ</span>
        </NavLink>
      </div>
    </div>
  )
}

export default SpacesSidebar
