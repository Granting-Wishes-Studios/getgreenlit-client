import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import './ProjectsSidebar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { NavLink } from 'react-router-dom'
import twittIcon from './../../../.././../assets/twittIcon.png'
import discordIcon from './../../../.././../assets/discordIcon.png'
import website from './../../../.././../assets/website.png'
import { AppContext } from './../../../../../context/AppContext'
import { getRoles } from '../../../../../networking/spaces'

const config = require('../../../../../config/config')[process.env.NODE_ENV || 'development'];


interface Props {
  showProjectsSidebar: Boolean
  setShowProjectsSidebar: Dispatch<SetStateAction<Boolean>>
}
const ProjectsSidebar: React.FC<Props> = (props) => {
  const { isAuthenticated, navHeadData, setNavHeadData, user } = useContext(AppContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathArray = window.location.pathname.split('/');
  const spaceId = pathArray[3];

  
  const getSpaceRoles = async () => {
    
    await getRoles(spaceId, user.address).then((res:any) => {   
      if(res.data.role! === "SPACE_ADMIN"){
         setIsAdmin(true);
      }else{
       setIsAdmin(false);
      }
   setNavHeadData({
     title: res.data.title, img:res.data.logoImg, id: res.data.id, banner: res.data.bannerImg, website: res.data.officialWebsite, twitter: res.data.twitter, discord: res.data.discord
   })
 })
 .catch((err:any) => {
     console.error('Error:', err);
 });
  }

  useEffect(() => {
    getSpaceRoles();    
  }, [isAuthenticated]);

  return (
    <div
      className={`${
        props.showProjectsSidebar
          ? 'fixed left-0 z-10 top-0'
          : 'fixed top-0 -left-full'
      } lg:relative lg:left-0 duration-500 block  z-10 w-48 h-full pb-20 mainSidebar border-r border-gray-700`}
    >
      <div className="flex justify-end px-5 items-center h-14 block lg:hidden">
        <button
          onClick={() => {
            props.setShowProjectsSidebar(false)
          }}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-white text-lg" />
        </button>
      </div>
      <div className="h-full overflow-y-auto py-4 flex flex-col gap-y-5">
        <NavLink
          to={`/space/projects/${navHeadData.id}`}
          className={({ isActive }) =>
            [
              'px-8 py-1 text-white text-sm font-semibold border-r-4 border-white',
              isActive ? 'border-opacity-100' : 'border-opacity-0 hover:border-opacity-100',
            ]
              .filter(Boolean)
              .join(' ')
          }
        >
          <span>{isAdmin && isAuthenticated ? 'All': ''} Projects</span>
        </NavLink>
        <NavLink
          to={`/space/about/${navHeadData.id}`}
          className={({ isActive }) =>
            [
              'px-8 py-1 text-white text-sm font-semibold border-r-4 border-white',
              isActive ? 'border-opacity-100' : 'border-opacity-0 hover:border-opacity-100',
            ]
              .filter(Boolean)
              .join(' ')
          }
        >
          <span>About</span>
        </NavLink>
      {isAdmin && isAuthenticated && (
        <>
        <div className="mx-8 border-b border-gray-700"></div>
        <NavLink
          to="/admin"
          className={({ isActive }) =>
            [
              'px-8 py-1 text-white text-sm font-semibold border-r-4 border-white',
              isActive ? 'border-opacity-100' : 'border-opacity-0 hover:border-opacity-100',
            ]
              .filter(Boolean)
              .join(' ')
          }
        >
          <span>Admin</span>
        </NavLink>
        <NavLink
          to={`/space/settings/${navHeadData.id}`}
          className={({ isActive }) =>
            [
              'px-8 py-1 text-white text-sm font-semibold border-r-4 border-white',
              isActive ? 'border-opacity-100' : 'border-opacity-0 hover:border-opacity-100',
            ]
              .filter(Boolean)
              .join(' ')
          }
        >
          <span>Space settings</span>
        </NavLink>
        <NavLink
          to={`/space/licensing/${navHeadData.id}`}
          className={({ isActive }) =>
            [
              'px-8 py-1 text-white text-sm font-semibold border-r-4 border-white',
              isActive ? 'border-opacity-100' : 'border-opacity-0 hover:border-opacity-100',
            ]
              .filter(Boolean)
              .join(' ')
          }
        >
          <span>Licensing</span>
        </NavLink>
        </>
        )}
    
        <div className="mx-8 border-b border-gray-700"></div>
        <div className="px-8 flex items-center justify-center gap-x-3">
        {navHeadData.website !== '' && (
           <a target="_blank" rel="noreferrer" href={navHeadData.website}><img src={website} alt="discordIcon" className="w-6" /></a> 
        )}
        {navHeadData.twitter !== '' && (
           <a target="_blank" rel="noreferrer" href={navHeadData.twitter}><img src={twittIcon} alt="twittIcon" className="w-6" /></a>
        )}
         {navHeadData.discord !== '' && (
           <a target="_blank" rel="noreferrer" href={navHeadData.discord}><img src={discordIcon} alt="discordIcon" className="w-6" /></a> 
        )}
        </div>
      </div>
    </div>
  )
}

export default ProjectsSidebar
