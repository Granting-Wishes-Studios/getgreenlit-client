import React, { useState, useEffect, useContext } from 'react'
import './AllSpacesPage.css'
import { FaCheck, FaTimes } from 'react-icons/fa';
import users_icon from './../../../../assets/users_icon.png'
import { useNavigate } from 'react-router-dom'
import { SpaceMetadata } from '../../../../Pages/Dashboard/SpacePage/SpaceNestedPages/AllSpaces'
import axios from 'axios'
import { AppContext } from '../../../../context/AppContext'
import { notify } from '../../../Inc/Toastr';
import { Loader } from '../../../SubComponents/Loader';

const config = require('../../../../config/config')[process.env.NODE_ENV || 'development'];

const BASE_URL = config.base_url;
const visibl = false;

interface Props {
  spaces: SpaceMetadata[],
  handleSearch: (searchTerm: string) => void
}



export const AllSpacesCardsList: React.FC<Props> = (props: Props) => {
  let navigate = useNavigate()
  
  const [join, setJoin] = useState(props.spaces);
  const [isMember, setIsMember] = useState(props.spaces);
  const [hovering, setHovering] = useState(props.spaces);

  const { isAuthenticated, authenticate, user, widget, setWidget, loadSpace, setNavHeadData } = useContext(AppContext);


  const handleMouseOver = (event: any, space_id:any) => {
    setHovering(prev => [...prev].map(
      obj => (parseInt(obj.id) === parseInt(space_id) ? Object.assign(obj, { hovering: true }) : obj)
   ))
  }
  const handleMouseLeave = (event: any, space_id:any) => {
    setHovering(prev => [...prev].map(
      obj => (parseInt(obj.id) === parseInt(space_id) ? Object.assign(obj, { hovering: false }) : obj)
   ))
  }


  const handleExploreSpace = async (title:any, spaceId:any, img:string) => {
    if(!isAuthenticated){
      let response = null;
      try{
       // response = await authenticate();
      }catch(error){
        
      }
    }
   // const paramsEncoded = title.replace(/\s+/g, '-');
    navigate(`/space/projects/${spaceId}`)
  }

  const handleJoinOrLeave =  async (space_id: any, itemKey: any, event:any, linkTo:any,linkTitle:any, img:any) => {

    if(event.currentTarget.innerText === "Join"){
      let response = null;
      setJoin(prev => [...prev].map(
        obj => (parseInt(obj.id) === parseInt(space_id) ? Object.assign(obj, { joining: true }) : obj)
     ))  
     if(!isAuthenticated){
      try{
        response = await authenticate();
      }catch(error){
        setJoin(prev => [...prev].map(
          obj => (parseInt(obj.id) === parseInt(space_id) ? Object.assign(obj, { joining: false }) : obj)
       ))
      }
    } 

    const user_id = user.userId?user.userId: response.userId;

     axios.get(`${BASE_URL}/api/spaces/join`, {params: {'spaceId': space_id, 'userId': user_id}}).then(res => {
      if(res.status){
          notify('Space joined!', "success", 6000);
          setIsMember(prev => [...prev].map(
            obj => (parseInt(obj.id) === parseInt(space_id) ? Object.assign(obj, { isMember: true }) : obj)
         ))
          setJoin(prev => [...prev].map(
           obj => (parseInt(obj.id) === parseInt(space_id) ? Object.assign(obj, { joining: false }) : obj)
        ))

        // handle widget change
        setWidget((prev:any) => [...prev, {linkTo:linkTo, linkTitle: linkTitle, img: img}])
      }
    })
    
    }else{
      setJoin(prev => [...prev].map(
        obj => (parseInt(obj.id) === parseInt(space_id) ? Object.assign(obj, { joining: true }) : obj)
     ))   
     axios.get(`${BASE_URL}/api/spaces/leave`, {params: {'spaceId': space_id, 'userId': user.userId}}).then(res => {
      if(res.status){
          notify('Space left!', "success", 6000);
          
          setIsMember(prev => [...prev].map(
            obj => (parseInt(obj.id) === parseInt(space_id) ? Object.assign(obj, { isMember: false }) : obj)
         ))
          setJoin(prev => [...prev].map(
           obj => (parseInt(obj.id) === parseInt(space_id) ? Object.assign(obj, { joining: false }) : obj)
        ))
         // handle widget change
         const newArr = [...widget];
         newArr.splice(newArr.findIndex(item => item.linkTo === linkTo), 1)
         setWidget(newArr)
      }
    })
    }
      
   
  }

  return (
    <div className="m-4 sm:m-10 xl:pr-20">
      <div className="flex flex-col-reverse sm:flex-row gap-y-8 sm:gap-y-0 sm:items-center justify-between">
        <div className="flex items-center gap-x-6">
          <span className="text-2xl font-semibold text-white">All spaces</span>
          <span className="text-lg text-white mt-2">{props.spaces.length}</span>
        </div>
        <div>
          <input
            type={'text'}
            placeholder="Search spaces..."
            onChange={(e) => {
              props.handleSearch(e.target.value)
            }}
            style={{ outline: 'none', boxShadow: 'none' }}
            className="searchInput shadow-none outline-none px-4 py-2 rounded-full w-full sm:w-80 text-sm bg-transparent text-gray-400 font-semibold"
          />
        </div>
      </div>
      <div className="grid grid-cols-12 gap-y-5 xl:gap-y-0 sm:gap-x-5 mt-8">
        {props.spaces.map((data, ind) => (
          <div key={ind + 1} className="col-span-12 sm:col-span-6 xl:col-span-4 mb-5">
            <div className="border border-gray-700 rounded-xl overflow-hidden">
              <div onClick={(e) => handleExploreSpace(data.name,data.id, data.avatarImg)} className='cursor-pointer'>
              <div
                className={`${
                  data.name === 'Nuclear Nerds' ? 'nerdsImg_bg' : ''
                } "flex justify-center w-full  sm:h-48 2xl:h-60 object-cover"`}
              >
                <img
                  src={data.featuredImg}
                  className={`${
                    data.name === 'Nuclear Nerds' ? 'w-3/4' : 'w-full'
                  } sm:h-48 2xl:h-60 object-cover`}
                />
              </div>
              <div className="flex items-center gap-x-5 px-4 py-8">
                <img
                  src={data.avatarImg}
                  className="w-10 h-10 rounded-full"
                />
                <h1 className="text-white font-semibold text-lg">
                  {data.name}
                </h1>
              </div>
              </div>
               <div className="border-t border-gray-700 flex items-center justify-between p-4">
                
                <button  data-id={data.id} onMouseOver={(e) => handleMouseOver(e, data.id)} onMouseLeave={(e) => handleMouseLeave(e, data.id)} onClick={(event) => handleJoinOrLeave(data.id, event.currentTarget.dataset.id, event,data.id, data.name, data.avatarImg)} disabled={join[ind].joining}
                
                  className={`rounded-full text-white text-sm font-bold px-10 h-6 ${(data.isMember ? "joined_btn" : "join_btn")}`}
                >
                  {(data.isMember) ? hovering[ind].hovering ? <span><FaTimes style={{display: 'inline-block', marginRight: 10, 'color': '#e74c3c'}}/>Leave</span> : <span><FaCheck style={{display: 'inline-block', marginRight: 10, 'color': '#2ecc71'}}/>Joined</span> : 'Join'}
                   
                   {join[ind].joining && (<Loader />)} 
                </button> 
                 {visibl && (
                  <div className="flex items-center border border-gray-700 px-2 gap-x-1 py-1 rounded-full">
                  <img src={users_icon} alt="users_icon" className="w-4" />
                  <span className="text-xs text-white"></span>
                </div>
                 )}

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
