import React, { useState, useEffect, useContext } from 'react'
import './AllProjectsPage.css'
import { useNavigate } from 'react-router-dom'
import { ProjectMetadata } from '../../../../Pages/Dashboard/ProjectPage/ProjectNestedPages/AllProjects'
import axios from 'axios'
import { FaCheck, FaCog, FaDotCircle, FaEllipsisH, FaInfo, FaLock, FaMinus, FaTimes } from 'react-icons/fa';
import users_icon from './../../../../assets/users_icon.png'
import { isSpaceAdmin } from '../../../../networking/spaces'
import { isProjectAdmin } from '../../../../networking/projects'
import { getSessionCookie } from '../../../../utils/session';

import { AppContext } from '../../../../context/AppContext'
import { notify } from '../../../Inc/Toastr';
import { Loader } from '../../../SubComponents/Loader';

const config = require('../../../../config/config')[process.env.NODE_ENV || 'development'];

const BASE_URL = config.base_url;
const visibl = false;

interface Props {
  projects: ProjectMetadata[],
}



export const AllProjectsCardsList: React.FC<Props> = (props: Props) => {
  let navigate = useNavigate()
  
  const [join, setJoin] = useState(props.projects);
  const [isMember, setIsMember] = useState(props.projects);
  const [hovering, setHovering] = useState(props.projects);
  const [spaceAdmin, setSpaceAdmin] = useState<Boolean>(false);
  const [hasprojectApproval, setHasProjectApproval] = useState<Boolean>(false);
  const [projectAdmin, setProjectAdmin] = useState<Boolean>(false);

  const { isAuthenticated, authenticate, user, widget, setWidget, loadSpace, setNavHeadData } = useContext(AppContext);
  const pendingProjectTitle = 'Pending Projects';
  const [pendingCounter, setPendingCounter] = useState(0);
  const yourProjectTitle = 'Your Projects';
  const [yourCounter, setYourCounter]  = useState(0);
  const allProjectTitle = 'All Projects';
  const [allCounter, setAllCounter]  = useState(0);

  const pathArray = window.location.pathname.split('/');
  const spaceId = pathArray[3];

  const userObj = getSessionCookie();
  const userid = userObj.userId;
  const address = userObj.address;

  const handleExploreProject = async (pid:any) => {
    if(!isAuthenticated){
      let response = null;
      try{
       // response = await authenticate();
      }catch(error){
        
      }
    }
   // const paramsEncoded = title.replace(/\s+/g, '-');
    navigate(`/space/project/${spaceId}/${pid}`)
  }


  const showStatus = (status:string) => {
    let statusIcon;
    if(status == 'approved'){
      status = 'pending';// This is to ensure that the project status doesnot not display 'Approved'
    }
     switch(status){
        case 'in-progress':
          statusIcon = <FaCog/>
          break;
        case 'released':
          statusIcon = <FaCheck/>
          break;
         case 'defunct':
          statusIcon = <FaMinus/>
          break;
          case 'reject':
          statusIcon = <FaMinus/>
          break;
        default:
          statusIcon = <FaInfo/> 
      }

    return (
       <>
       <span className={`pb ${status}`}>{statusIcon}</span>
       <span className='pl-1 pr-2 uppercase'>{status}</span>
       </>
    )
  }


  const ifIsSpaceAdmin = async (address:string, spaceId:string) => {
    await isSpaceAdmin(address, spaceId).then(res => {
       setSpaceAdmin(res);
    })
}

  useEffect(() => {
    ifIsSpaceAdmin(address, spaceId);    
  }, []);

  let yourProject:Array<ProjectMetadata> = [];
  let pendingProject:Array<ProjectMetadata> = [];
  let allProject:Array<ProjectMetadata> = [];


  props.projects.map((data) => {
     if(address == data.address) {
        yourProject.push(data)
     }
      if(data.status == 'pending') {
         pendingProject.push(data)
      }

      allProject.push(data);
   })


  return (
    <div className="m-4 sm:m-10 xl:pr-20">  
      <div className="grid grid-cols-12 gap-y-5 xl:gap-y-0 sm:gap-x-5 mt-8">
       
       {spaceAdmin && (pendingProject.map((data, ind) => (  
            <>
             
              {ind < 1 && (
                <div className='col-span-12 mb-6'>
                   <h1 className='text-white'>{pendingProjectTitle}  {pendingProject.length}</h1>
                </div>
              )}

              <div key={ind+'all'+ + 1} className="col-span-12 sm:col-span-6 xl:col-span-4 mb-5">
            <div className="border border-gray-700 rounded-xl overflow-hidden relative">
              <div className='flex projectBadge absolute top-4 left-4'>
                  {showStatus(data.status)}
              </div>
              <div onClick={(e) => handleExploreProject(data.id)} className='cursor-pointer'>
              <div
                className={`${
                  data.projectTitle === 'Nuclear Nerds' ? 'nerdsImg_bg' : ''
                } "flex justify-center w-full  sm:h-48 2xl:h-60 object-cover"`}
              >
                <img
                  src={data.featuredImg}
                  className={`${
                    data.projectTitle === 'Nuclear Nerds' ? 'w-3/4' : 'w-full'
                  } sm:h-48 2xl:h-60 object-cover`}
                />
              </div>
               <div className="flex  items-center justify-between gap-x-5 px-4 mt-2">
                  <small className='text-white text-xs uppercase' style={{fontSize: '8px'}}>lonamoney.eth</small>
                  <div className='projectBadge' style={{background: 'none'}}>
                    <div className='flex'>
                      <span className='pb arrow'><FaLock style={{fontSize: '10px'}} /></span>
                      <span className='pr-2 ml-1 cursor-pointer'>0</span>
                    </div>
                 </div>
               </div>
              <div className="items-center gap-x-5 px-4 pb-2 pt-2">
                <h2 className="text-white font-semibold text-md mb-0 pb-0" style={{marginBottom: 'none'}}>
                  {data.projectTitle}
                  <span style={{fontSize: '10px', display: 'block', color: '#999'}}>{data.projectCategory}</span>
                </h2>    
              </div>
              </div>
               <div className="border-t border-gray-700 flex items-center justify-between p-4">
               <button type="button" className="text-white text-sm font-semibold rounded-full w-20 py-1 projectBtn successBtn">Approve</button> 
               <button type="button" className="text-white text-sm font-semibold rounded-full w-20 py-1 projectBtn dangerBtn">Reject</button>               
              </div>
            </div>
          </div>
            </>
        )
        ))}
        

        {yourProject.map((data, ind) => (  
            <>
             
              {ind < 1 && (
                <div className='col-span-12 mb-6'>
                   <h1 className='text-white'>{yourProjectTitle}  {yourProject.length}</h1>
                </div>
              )}

              <div key={ind+'all'+ + 1} className="col-span-12 sm:col-span-6 xl:col-span-4 mb-5">
            <div className="border border-gray-700 rounded-xl overflow-hidden relative">
              <div className='flex projectBadge absolute top-4 left-4'>
                  {showStatus(data.status)}
              </div>
              <div onClick={(e) => handleExploreProject(data.id)} className='cursor-pointer'>
              <div
                className={`${
                  data.projectTitle === 'Nuclear Nerds' ? 'nerdsImg_bg' : ''
                } "flex justify-center w-full  sm:h-48 2xl:h-60 object-cover"`}
              >
                <img
                  src={data.featuredImg}
                  className={`${
                    data.projectTitle === 'Nuclear Nerds' ? 'w-3/4' : 'w-full'
                  } sm:h-48 2xl:h-60 object-cover`}
                />
              </div>
               <div className="flex  items-center justify-between gap-x-5 px-4 mt-2">
                  <small className='text-white text-xs uppercase' style={{fontSize: '8px'}}>lonamoney.eth</small>
                  <div className='projectBadge' style={{background: 'none'}}>
                    <div className='flex'>
                      <span className='pb arrow'><FaLock style={{fontSize: '10px'}} /></span>
                      <span className='pr-2 ml-1 cursor-pointer'>0</span>
                    </div>
                 </div>
               </div>
              <div className="items-center gap-x-5 px-4 pb-2 pt-2">
                <h2 className="text-white font-semibold text-md mb-0 pb-0" style={{marginBottom: 'none'}}>
                  {data.projectTitle}
                  <span style={{fontSize: '10px', display: 'block', color: '#999'}} className="">{data.projectCategory}</span>
                </h2>    
              </div>
              </div>
              <div className="border-t border-gray-700 flex items-center justify-between p-4">
                 {data.status == 'approved' ?( <button type="button" className="text-white text-sm font-semibold rounded-full w-20 py-1 projectBtn">Stake</button>) : (<span></span>)}
              </div>
            </div>
          </div>
            </>
        )
        )}

      {allProject.map((data, ind) => (  
            <>
             
              {ind < 1 && (
                <div className='col-span-12 mt-5 mb-6'>
                   <h1 className='text-white'>{allProjectTitle}  {allProject.length}</h1>
                </div>
              )}

              <div key={ind+'all'+ + 1} className="col-span-12 sm:col-span-6 xl:col-span-4 mb-5">
            <div className="border border-gray-700 rounded-xl overflow-hidden relative">
              <div className='flex projectBadge absolute top-4 left-4'>
                  {showStatus(data.status)}
              </div>
              <div onClick={(e) => handleExploreProject(data.id)} className='cursor-pointer'>
              <div
                className={`${
                  data.projectTitle === 'Nuclear Nerds' ? 'nerdsImg_bg' : ''
                } "flex justify-center w-full  sm:h-48 2xl:h-60 object-cover"`}
              >
                <img
                  src={data.featuredImg}
                  className={`${
                    data.projectTitle === 'Nuclear Nerds' ? 'w-3/4' : 'w-full'
                  } sm:h-48 2xl:h-60 object-cover`}
                />
              </div>
               <div className="flex  items-center justify-between gap-x-5 px-4 mt-2">
                  <small className='text-white text-xs uppercase' style={{fontSize: '8px'}}>lonamoney.eth</small>
                  <div className='projectBadge' style={{background: 'none'}}>
                    <div className='flex'>
                      <span className='pb arrow'><FaLock style={{fontSize: '10px'}} /></span>
                      <span className='pr-2 ml-1 cursor-pointer'>0</span>
                    </div>
                 </div>
               </div>
              <div className="items-center gap-x-5 px-4 pb-2 pt-2">
                <h2 className="text-white font-semibold text-md mb-0 pb-0" style={{marginBottom: 'none'}}>
                  {data.projectTitle}
                  <span style={{fontSize: '10px', display: 'block', color: '#999'}}>{data.projectCategory}</span>
                </h2>    
              </div>
              </div>
               <div className="border-t border-gray-700 flex items-center justify-between p-4">
                
              </div>
            </div>
          </div>
            </>
        )
        )}
      </div>
    </div>
  )
}
