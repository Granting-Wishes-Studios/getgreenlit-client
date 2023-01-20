import React, {  Dispatch, SetStateAction, useState, useEffect, useContext, Fragment } from 'react'
import './AllProjectsPage.css'
import { useNavigate } from 'react-router-dom'
import { ProjectMetadata } from '../../../../Pages/Dashboard/ProjectPage/ProjectNestedPages/AllProjects'
import { FaCheck, FaCog, FaInfo, FaLock, FaMinus } from 'react-icons/fa';
import { Token } from '../../../../Components/Dashboard/ProjectsComponets/LicensingComponents/TokenAndLicensing/Token'
import { isSpaceAdmin } from '../../../../networking/spaces'
import {stakeTokens, unStakeTokens, getLicense, signALincense} from '../../../../networking/license'
import { getProject, setProjectStatus } from '../../../../networking/projects'
import { AppContext } from '../../../../context/AppContext'
import { BasicModal } from '../../../SubComponents/Modal'
import { notify } from '../../../Inc/Toastr';
import { Loader } from '../../../SubComponents/Loader';
import   { getDotETH }   from '../../../../utils/utils';


import token1 from './../../../../assets/token4.png'
import token2 from './../../../../assets/token2.png'
import token3 from './../../../../assets/token3.png'
import token4 from './../../../../assets/token1.png'

interface Props {
  setStatus: Dispatch<SetStateAction<Boolean>>
  projects: ProjectMetadata[],
}



export const AllProjectsCardsList: React.FC<Props> = (props: Props) => {
  let navigate = useNavigate()
  
  const [spaceAdmin, setSpaceAdmin] = useState<Boolean>(false);
  const [loading, setLoading] = useState<Boolean>(false);
  const [showApprovalModal, setShowApprovalModal] = useState<Boolean>(false);
  const [showRejectModal, setShowRejectModal] = useState<Boolean>(false);
  const [showStakingModal, setShowStakingModal] = useState<Boolean>(false);
  const [showLicenseIntroModal, setShowLicenseIntroModal] = useState<Boolean>(false);
  const [showLicenseModal, setShowLicenseModal] = useState<Boolean>(false);
  const [license, setLicense] = useState<any>({});
  const [itemLoaded, setItemLoaded] = useState(false);
  const [signee, setSignee]= useState('');
  const [checkBox, setCheckBox] = useState([{id: 1, cbox: false},{id: 2, cbox: false},{id: 3, cbox: false}])
  const [enableLicenseButton, setEnableLicenseButton] = useState(true);
  const [statusNote, setStatusNote] = useState({statusNote: ''})
  const [stakedTokens, setStakedTokens] = useState([]);
  const [requiredStake, setRequiredStake] = useState(0);
  const [requireToken, setRequireToken] = useState('');
  const { user, navHeadData } = useContext(AppContext);
  const pendingProjectTitle = 'Pending Projects';
  const yourProjectTitle = 'Your Projects';
  const allProjectTitle = 'All Projects';

  const pathArray = window.location.pathname.split('/');
  const spaceId = pathArray[3];

  const address = user.address;

  const[projectId, setProjectId] = useState('');
  const[projectTitle, setProjectTitle] = useState('');


  const handleExploreProject = async (pid:any) => {
   // const paramsEncoded = title.replace(/\s+/g, '-');
    navigate(`/space/project/${spaceId}/${pid}`)
  }


  const showStatus = (status:string) => {
    let statusIcon;
    if(status == 'approved'){
      status = 'pending';// This is to ensure that the project status doesnot  display 'Approved'
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

   const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target
    const  value = target.value
    setStatusNote({ ...statusNote, [target.name]: value })
  }
  

   const handleProjectStatus = async (event: React.FormEvent<HTMLFormElement>, status: string) => {
    event.preventDefault()
    let snote = '';
    if(status === 'approved'){       
    }else{
      snote = statusNote.statusNote
    }
    props.setStatus(false);
    setLoading(true)
     const projectRequest = {
      pid: projectId,
      sid: spaceId,
      status: status,
      statusNote: snote
     }
    try{
      await setProjectStatus(projectRequest).then(res => {
         if(res == true){
          props.setStatus(true);
              setLoading(false)
              if(status == 'rejected'){
                setShowRejectModal(false);
                notify("Project status updated!", "success", 6000) 
              }else{
                setShowApprovalModal(false); 
                notify("Project status updated!", "success", 6000)             
              }             
           }
         
      })
    }catch(err){
      console.log(err)
    }
}


const handleSubmitStake = async ()  => {
  props.setStatus(false);
  setLoading(true)
  const stakeRequest = {
   pid: projectId,
   address: address,
   tokens: stakedTokens,
  }
 try{
   await stakeTokens(stakeRequest).then(res => {
      if(res == true){
           props.setStatus(true);
           setLoading(false)
           setShowStakingModal(false);
           setStakedTokens([]);
           notify("Tokens sucessfully staked", "success", 6000)                        
        }else{
          props.setStatus(false);
         setLoading(false)
         notify("Error occured!", "error", 6000) 
       }
      
   })
 }catch(err){
   console.log(err)
 }
}

  const handleApproveModal = (projectId:string, projectTitle:string) => {
    setProjectId(projectId);
    setProjectTitle(projectTitle);
    setShowApprovalModal(true)
  }
  const handleRejectModal = (projectId:string, projectTitle:string) => {
    setProjectId(projectId);
    setProjectTitle(projectTitle);
    setShowRejectModal(true)
  }

  const handleShowStakingModal = async (projectId:string, projectTitle:string) => {
    await getProject(spaceId, projectId).then(res => {
      setLicense(res.license)
    })
    setProjectId(projectId);
    setProjectTitle(projectTitle);
    setShowStakingModal(true);
    setStakedTokens([]);
  }

  const handleShowLicenseIntroModal = async (projectId:string) => {
    setShowLicenseIntroModal(true);
    setProjectId(projectId)
  }

  const handleShowLicenseModal = async () => {
    setShowLicenseIntroModal(false)
    setItemLoaded(false);
    await getProject(spaceId, projectId).then(res => {
      setLicense(res.license)
      setItemLoaded(true);
    })
    setShowLicenseModal(true)  
  }

  const handleSign = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
     setLoading(true)
     props.setStatus(false);
      const signRequest = {
       pid: projectId,
       address: address,
       signee: signee,
       sign: true,
       licenseFile: ''
      }
     try{
       await signALincense(signRequest).then(res => {
          if(res == true){
            props.setStatus(true);
               setLoading(false)
               setShowLicenseModal(false);
               notify("License now active", "success", 6000)                        
            }else{
              props.setStatus(false);
             notify("Error occured!", "error", 6000) 
           }
          
       })
     }catch(err){
       console.log(err)
     }
 }

  const handleUnStake = async (projectId:string) => {
    props.setStatus(false)
    setLoading(true)
    const stakeRequest = {
     pid: projectId
    }
   try{
     await unStakeTokens(stakeRequest).then(res => {
        if(res == true){
             setLoading(false)
             props.setStatus(true)
             setShowStakingModal(false);
             notify("Tokens sucessfully unstaked", "success", 6000)                        
          }else{
            props.setStatus(false);
           setLoading(false)
           notify("Error occured!", "error", 6000) 
         }
        
     })
   }catch(err){
     console.log(err)
   }
  }
  
  const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {  
    const id = event.target.id; 
       if(event.target.checked){
          setCheckBox(checkBox.map(
            obj => (obj.id == parseInt(id) ? Object.assign(obj, { cbox: true }) : obj)
         ))
       }else{
        setCheckBox(checkBox.map(
          obj => (obj.id == parseInt(id) ? Object.assign(obj, { cbox: false }) : obj)
       ))
       }
       const allChecked = checkBox.every(function(v){
        return v.cbox !== false
      }) 

      if(allChecked){
        setEnableLicenseButton(false);
      }else{
        setEnableLicenseButton(true);
      }

}


  const tokens = [
    {name: 'token1', token: token1},
    {name: 'token2', token: token2},
    {name: 'token3', token: token3},
    {name: 'token4', token: token4}
    
   ];



   
  return (
    <>
    <div className="m-4 sm:m-10 xl:pr-20">  
      <div className="grid grid-cols-12 gap-y-5 xl:gap-y-0 sm:gap-x-5 mt-8">
       
       {spaceAdmin && (pendingProject.map((data, ind) => (  
            <Fragment key={ind+'pp'+ + 1}>
             
              {ind < 1 && (
                <div className='col-span-12 mb-6'>
                   <h1 className='text-white'>{pendingProjectTitle}  {pendingProject.length}</h1>
                </div>
              )}

              <div className="col-span-12 sm:col-span-6 xl:col-span-4 mb-5">
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
                  <small className='text-white text-xs uppercase' style={{fontSize: '8px'}}>{getDotETH(data.address)}</small>
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
               <button onClick={() => handleApproveModal(data.id, data.projectTitle)} type="button" className="text-white text-sm font-semibold rounded-full w-20 py-1 projectBtn successBtn">Approve</button> 
               <button onClick={() => handleRejectModal(data.id, data.projectTitle)} type="button" className="text-white text-sm font-semibold rounded-full w-20 py-1 projectBtn dangerBtn">Reject</button>               
              </div>
            </div>
          </div>
            </Fragment>
        )
        ))}
        

        {yourProject.map((data, ind) => (  
            <Fragment key={ind+'yp'+ + 1}>
             
              {ind < 1 && (
                <div className='col-span-12 mb-6'>
                   <h1 className='text-white'>{yourProjectTitle}  {yourProject.length}</h1>
                </div>
              )}

              <div className="col-span-12 sm:col-span-6 xl:col-span-4 mb-5">
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
                  <small className='text-white text-xs uppercase' style={{fontSize: '8px'}}>{getDotETH(data.address)}</small>
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
                 {data.status == 'approved' && !data.staked ?( <button onClick={() => handleShowStakingModal(data.id, data.projectTitle)} type="button" className="text-white text-sm font-semibold rounded-full w-20 py-1 projectBtn">Stake</button>) : ('')}
                 {data.staked && (data.status == 'approved' || data.status == 'defunct' || data.status == 'released') ?( <button onClick={() => handleUnStake(data.id)} type="button" className="text-white text-sm font-semibold rounded-full w-20 py-1 projectBtn" style={{background: 'transparent'}}>Unstake</button>) : ('')}
                 {data.staked && !data.signed ? ( <button onClick={()=>handleShowLicenseIntroModal(data.id)} type="button" className="text-white text-sm font-semibold rounded-full w-25 px-4 py-1 projectBtn successBtn">Sign license</button>) : ('')}
              </div>
            </div>
          </div>
            </Fragment>
        )
        )}

      {allProject.map((data, ind) => (  
            <Fragment key={ind+'ap'+ + 1}>
             
              {ind < 1 && (
                <div className='col-span-12 mt-5 mb-6'>
                   <h1 className='text-white'>{allProjectTitle}  {allProject.length}</h1>
                </div>
              )}

              <div className="col-span-12 sm:col-span-6 xl:col-span-4 mb-5">
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
                  <small className='text-white text-xs uppercase' style={{fontSize: '8px'}}>{getDotETH(data.address)}</small>
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
            </Fragment>
        )
        )}
      </div>
    </div>

    <BasicModal setShowModal={setShowApprovalModal} showModal={showApprovalModal}>
      <div className="tokenModalMain  w-full h-full overflow-hidden rounded-2xl mb-10 ">
     <div className="tokenModalHeader flex items-end justify-between pt-5 px-5 sm:px-8 pb-4">
       <div>
         <p className="text-xs text-gray-200 font-semibold uppercase">
           {navHeadData.title}
         </p>
         <h1 className="text-gray-200 w-1/2 sm:w-auto sm:text-lg font-bold mt-2">
                Approve project
         </h1>
       </div>
       <button
         onClick={() => {
           setShowApprovalModal(false)
           setLoading(false)
         }}
         className="text-gray-200 text-xs sm:text-sm font-bold"
       >
         Cancel
       </button>
     </div>
     <div className="tokenModalContent h-full overflow-auto px-5 sm:px-8 py-8 flex flex-col gap-y-10">
     <div>     
     <form onSubmit={(e) => handleProjectStatus(e, 'approved')}>
     <p className='text-gray-200 text-xs'>
          Are you sure you want to approve the project <b>{projectTitle}?</b> The project owner will be able to <br/>license your space’s IP according to your staking tier’s specifications. This cannot be undone.
       </p>
       <div className='flex items-center gap-x-5 mt-5'>
       <button className='text-gray-200 text-xs font-semibold py-2 px-4 rounded-full addTokenModalBtn'>
         Approve project
       { loading && 
       (
         <Loader />
       )}
       </button>
      
       </div>
     </form>
     </div>
     </div>
   </div>
   </BasicModal>

   <BasicModal setShowModal={setShowRejectModal} showModal={showRejectModal}>
      <div className="tokenModalMain  w-full h-full overflow-hidden rounded-2xl mb-10 ">
     <div className="tokenModalHeader flex items-end justify-between pt-5 px-5 sm:px-8 pb-4">
       <div>
         <p className="text-xs text-gray-200 font-semibold uppercase">
           {navHeadData.title}
         </p>
         <h1 className="text-gray-200 w-1/2 sm:w-auto sm:text-lg font-bold mt-2">
             Reject project
         </h1>
       </div>
       <button
         onClick={() => {
           setShowRejectModal(false)
           setLoading(false)
         }}
         className="text-gray-200 text-xs sm:text-sm font-bold"
       >
         Cancel
       </button>
     </div>
     <div className="tokenModalContent h-full overflow-auto px-5 sm:px-8 py-8 flex flex-col gap-y-10">
         
     <form onSubmit={(e) => handleProjectStatus(e, 'rejected')}>
     <p className='text-gray-200 text-sm'>
          Are you sure you want to reject the project <b>{projectTitle}?</b> This cannot be undone.
       </p>

       <div className='mt-5 mb-5'>
         <h1 className="text-gray-200 text-sm font-semibold mb-0">
            Add a note for the project owner (optional)
         </h1>
         <input
           onChange={handleStatusChange}
           type="text"
           name='statusNote'
           placeholder="Enter note..."
           className="py-3 px-0 w-full text-xs text-white border-b border-0 border-zinc-700 tokenModalInput outline-0 shadow-none bg-transparent"
         />
       </div>

       <div className='flex items-center gap-x-5 mt-6'>
       <button className='text-gray-200 text-xs font-semibold py-2 px-4 rounded-full projectBtn dangerBtn'>
         Reject project
       { loading && 
       (
         <Loader />
       )}
       </button>
      
       </div>
     </form>
    
     </div>
   </div>
   </BasicModal>

   <BasicModal setShowModal={setShowStakingModal} showModal={showStakingModal}>
      <div className="tokenModalMain  w-full h-full overflow-hidden rounded-2xl mb-10 ">
     <div className="tokenModalHeader flex items-end justify-between pt-5 px-5 sm:px-8 pb-4">
       <div>
         <p className="text-xs text-gray-200 font-semibold uppercase">
           {navHeadData.title}
         </p>
         <h1 className="text-gray-200 w-1/2 sm:w-auto sm:text-lg font-bold mt-2">
            Stake
         </h1>
       </div>
       <button
         onClick={() => {
          setShowStakingModal(false)
           setLoading(false)
           setStakedTokens([]);
         }}
         className="text-gray-200 text-xs sm:text-sm font-bold"
       >
         Cancel
       </button>
     </div>
     <div className="tokenModalContent h-full overflow-auto px-5 sm:px-8 py-8 flex flex-col gap-y-10">
     <div>     
     <p className='text-gray-200 text-xs mb-2' style={{fontSize: '12px'}}>
         Select the tokens you would like to stake in <b>{projectTitle}.</b>
       </p>
       <div className='text-gray-200 text-xs leading-0'>Your tokens will be locked in the staking contract for the duration of your project’s development. They can only  <br/> be unstaked  once the project is marked as completed or defunct.</div>
       <p className='text-gray-200 font-bold text-sm mt-2 mb-4'>
          <small className='capitalize'>Required: {requiredStake} {requireToken}</small>
       </p>
       <h1 className='text-gray-200 text-xs font-bold capitalize'>{requireToken}</h1>
       <p><small className='text-gray-200 text-xs font-bold text' style={{fontSize: '10px'}}>Selected: {stakedTokens.length} <span className='uppercase'>{requireToken}</span></small></p>
       <div className="">  
          <div className="grid grid-cols-12 gap-y-5 xl:gap-y-0 sm:gap-x-5 mt-8">
             
           {tokens.map((token, index) => (
              <Token id={index} key={index} token={token} setStakedTokens={setStakedTokens} />            
           ))}
         </div>
      </div>
      <div className='flex items-center gap-x-5 mt-6'>
       {stakedTokens.length > 0 && (
 <button onClick={handleSubmitStake} className='text-gray-200 font-semibold py-1 px-8 rounded-full addTokenModalBtn'>
 Stake
{ loading && 
(
 <Loader />
)}
</button>
       )}
      
       
       </div>
     </div>
     </div>
   </div>
   </BasicModal>


   <BasicModal setShowModal={setShowLicenseIntroModal} showModal={showLicenseIntroModal}>
      <div className="tokenModalMain h-full overflow-hidden rounded-2xl mb-10" style={{maxWidth: '650px'}}>
     <div className="tokenModalHeader flex items-end justify-between pt-5 px-5 sm:px-8 pb-4">
       <div>
         <p className="text-xs text-gray-200 font-semibold uppercase">
           {navHeadData.title}
         </p>
         <h1 className="text-white gray-200ite w-1/2 sm:w-auto sm:text-lg font-bold mt-2">
            Sign License project
         </h1>
       </div>
       <button
         onClick={() => {
          setShowLicenseIntroModal(false)
           setLoading(false)
         }}
         className="text-gray-200 text-xs sm:text-sm font-bold"
       >
         Cancel
       </button>
     </div>
     <div className="tokenModalContent h-full overflow-auto px-5 sm:px-8 py-8 flex flex-col gap-y-10">
        
       <div className='text-gray-200 text-xs'>
       <p className="text-gray-200 font-bold text-sm mb-4">
             Greenlit Boilerplate License
         </p>
       <p className='text-gray-200 mb-3 text-xs'>By staking tokens and agreeing to the license to follow, you are entering into a legal agreement with Eleusinian Production, LLC: the holding company of the Hidden Lakes Cinematic Universe IP.</p>
      <p className='mb-3 text-xs'>You must read the entire license, but here are the key takeaways:</p>
      <ul className='license-intro text-xs'>
         <li>Eleusinian Productions, LLC is not affiliated with your project or company unless explicitly stated.</li>
         <li>You retain all of the rights to your project’s tangible artifacts.</li>
         <li>You must use the supplied resources to the Hidden Lakes Cinematic Universe brand & associated Brand Guidelines when applicable.</li>
         <li>Other stakers may use any new intellectual property you add to the universe via creating & releasing this project.</li>
         <li>Eleusinian Productions, LLC receives a 7.5% total royalty on all of your project’s revenue in perpetuity, payable after the project is in distribution according to the revenue policy.</li>
         <li>There are no penalties under any circumstances for failing to realize a project.</li>
         <li>Eleusinian Productions, LLC is not responsible for any lost funds, legal liabilities, or other perils that result from this project. The safety & legality of the project is the sole responsibility of the licensee & their team.</li>
         <li>This license applies only to the stated project you wish to create. For other projects, you must stake & create a new, distinct license which pertains to that project.</li>
         <li>You must have explicit legal permission to use any existing IP from outside the Hidden Lakes Cinematic Universe IP in your project, and such IP will not roll into the HLCU.</li>
         <li>Your project is forbidden from containing explicit hate speech or pornography of any kind, and Eleusinian Productions, LLC retains the right to enforce this measure in court of law.</li>
      </ul>
       </div>
       <div className='flex items-center gap-x-5 -mt-5'>
       <button onClick={()=>handleShowLicenseModal()} className='text-gray-200 text-xs font-semibold py-1 px-4 rounded-full projectBtn'>
           Continue to the licensing agreement
       { loading && 
       (
         <Loader />
       )}
       </button>
      
       </div>
     </div>
     </div>
   </BasicModal>

   <BasicModal setShowModal={setShowLicenseModal} showModal={showLicenseModal}>
      <div className="tokenModalMain  w-full h-full overflow-hidden rounded-2xl mb-10 ">
     <div className="tokenModalHeader flex items-end justify-between pt-5 px-5 sm:px-8 pb-4">
       <div>
         <p className="text-xs text-gray-200 font-semibold uppercase">
           {navHeadData.title}
         </p>
         <h1 className="text-gray-200 w-1/2 sm:w-auto sm:text-lg font-bold mt-2">
            Sign license
         </h1>
       </div>
       <button
         onClick={() => {
          setShowLicenseModal(false)
           setLoading(false)
         }}
         className="text-gray-200 text-xs sm:text-sm font-bold"
       >
         Cancel
       </button>
     </div>
     <div className="tokenModalContent h-full overflow-auto px-5 sm:px-8 py-8 flex flex-col gap-y-10">
   
      {!itemLoaded? (<Loader />): (
        <div>
        <div style={{maxWidth: '650px', maxHeight: '400px', overflow: 'scroll', background: 'white'}}>
          <embed src={license.licenseFile} type="application/pdf" top-toolbar="0"   height="400px" width="620"></embed>
        </div>     
     <form onSubmit={(e) => handleSign(e)}>
     <p className="text-gray-200 mb-6 mt-6">
             By checking these boxes...
         </p>
       <div className="flex items-center gap-x-3 mb-3">
          <input
            id="1"
            type="checkbox"
            required
            onChange={handleCheck}
            className="w-4 h-4 p-2 border-2 bg-transparent rounded-md"
          />
          <label className="text-gray-200 text-xs">
               I certify that have read & understood the licensing agreement.
          </label>
        </div>
        <div className="flex items-center gap-x-3 mb-3">
          <input
            id="2"
            type="checkbox"
            required
            onChange={handleCheck}
            className="w-4 h-4 p-2 border-2 bg-transparent rounded-md"
          />
          <label className="text-gray-200 text-xs">
             I agree to the use of digital and cryptographic signatures as legally binding signatures.
          </label>
        </div>
        <div className="flex items-center gap-x-3 mb-3">
          <input
            id="3"
            type="checkbox"
            required
            onChange={handleCheck}
            className="w-4 h-4 p-2 border-2 bg-transparent rounded-md"
          />
          <label className="text-gray-200 text-xs">
          I certify that the information I enter on this form is true under the penalty of law.
          </label>
        </div>
        <div className="text-gray-200 mt-6">
            Enter your full legal name
            <div className='text-xs mt-1' style={{fontSize: '11px'}}>This information is kept confidential and not shared with anyone outside of Eleusinian Productions, LLC.</div>
         </div>
         <div className="flex flex-col gap-y-1">
            <input
              type="text"
              required
              placeholder="Enter name..."
              onChange={(e) => setSignee(e.target.value)}
              name='signee'
              className="typeInput text-white bg-transparent text-sm px-0 shadow-none outlin-none"
            />
          </div>
       <div className='flex items-center gap-x-5 mt-8'>
       <button disabled={enableLicenseButton} className='text-gray-200 text-xs font-semibold py-1 px-4 rounded-full projectBtn successBtn'>
           Sign the licensing agreement with your wallet
       { loading && 
       (
         <Loader />
       )}
       </button>
      
       </div>
     </form>
     </div>
      )}
   
     </div>
   </div>
   </BasicModal>

   </>
  )
}
