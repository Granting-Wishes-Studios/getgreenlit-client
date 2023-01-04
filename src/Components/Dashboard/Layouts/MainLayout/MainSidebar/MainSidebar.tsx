import React, { Dispatch, SetStateAction, useState, useContext, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import eye_circle from '../../../../../assets/eye_circle.png'
import plus_circle from '../../../../../assets/plus_circle.png'
import miniLogo from '../../../../../assets/miniLogo.png'
import greenHalfDot from './../../../../../assets/greenHalfDot.png'
import './MainSidebar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight, faHome } from '@fortawesome/free-solid-svg-icons'
import { CreateSpaceModal } from '../../../../../Components/Dashboard/SpacesComponents/AllSpacesPageComponets/CreateSpaceModal'
import { AppContext } from './../../../../../context/AppContext'

interface Props {
  show: Boolean
  setShow: Dispatch<SetStateAction<Boolean>>
  setNestedSidebarShow: Dispatch<SetStateAction<Boolean>>
} 
const MainSidebar: React.FC<Props> = (props) => {
  const [showModal, setShowModal] = useState<Boolean>(false)
  const { isAuthenticated, widget,setNavHeadData  } =  useContext(AppContext);

const handleLink = (lintTo:string) => {
 return  window.location.href="/space/projects/"+lintTo
}

const pathArray = window.location.pathname.split('/');
const paramPath = pathArray[1];

const pathArray_ = window.location.pathname.split('/');
const spaceId = pathArray_[3];

  return (
    <div
      className={`${
        props.show ? 'w-full left-0 z-10 fixed' : 'fixed -left-full'
      } lg:relative lg:left-0 duration-500 block z-10 w-16 h-full pb-20 mainSidebar border-r border-gray-700`}
    >
      <div className="flex items-center justify-between px-2 gap-x-3 h-14 block lg:hidden">
        <div className="flex justify-center items-center">
          <button
            onClick={() => {
              props.setNestedSidebarShow(false)
              props.setShow(false)
            }}
          >
            <FontAwesomeIcon
              icon={faArrowLeft}
              className="text-white text-lg"
            />
          </button>
        </div>
        <div className="flex justify-center items-center">
          <button
            onClick={() => {
              props.setNestedSidebarShow(true)
            }}
          >
            <FontAwesomeIcon
              icon={faArrowRight}
              className="text-white text-lg"
            />
          </button>
        </div>
      </div>

      <div className="block px-2 flex justify-center items-center">
        <NavLink
          to={'/'}
          className="flex items-center justify-center border-b border-gray-700 h-14"
        >
          <img src={miniLogo} alt="miniLogo" className="w-6" />
        </NavLink>
      </div>
      <div className="h-full flex flex-col gap-y-3 overflow-y-auto py-4">
        <NavLink
          to="/greenlit-home"
          className="flex items-center justify-center py-1 text-white text-sm font-semibold relative"
        >
        <div onClick={() => (setNavHeadData({title: '', img: ''}))} className={`p-1 rounded-full ${paramPath == 'greenlit-home' ? 'eyeImg' : '' }`}>
          <FontAwesomeIcon
              icon={faHome}
              className="text-white text-lg w-5 h-5 rounded-full p-1"
            />    
        </div>
        {paramPath == 'greenlit-home' && (
           <img
           src={greenHalfDot}
           alt="greenHalfDot"
           className="w-1/12 absolute right-0"
         />
        )}
        </NavLink>
          
        { isAuthenticated &&   (       
             widget.map((item:any, ind:any) => ( 
              <div key={item.linkTitle + ind} onClick={(e) => handleLink(item.linkTo)} className="flex items-center justify-center py-1 text-white text-sm font-semibold relative cursor-pointer">
                <div className={`p-1 rounded-full ${spaceId == item.linkTo ? 'eyeImg' : '' }`}>
                   <img src={item.img} alt="eye_circle" className="w-9 h-9 rounded-full" />
                </div>
                <img
                  src={item.img}
                  alt="greenHalfDot"
                  className="w-1/12 absolute right-0"
                />
                 {spaceId == item.linkTo && (
                  <img
                  src={greenHalfDot}
                  alt="greenHalfDot"
                  className="w-1/12 absolute right-0"
                />
                )}
              </div>
            ))
          )
        }


        {isAuthenticated && (
           <button onClick={() => {setShowModal(true)}} className="flex items-center justify-center py-1 text-white text-sm font-semibold">
           <img src={plus_circle} alt="plus_circle" className="w-6" />
         </button>
        )} 
       
      </div>
      {showModal && <CreateSpaceModal setShowAlert={() => {}} showModal={showModal} setShowModal={setShowModal}></CreateSpaceModal>}
    </div>
  )
}

export default MainSidebar
