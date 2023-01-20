import { CreateProjectHeader } from '../../../../Components/Dashboard/ProjectsComponets/AllProjectsPageComponents/CreateProjectHeader'
import { Token } from '../../../../Components/Dashboard/ProjectsComponets/LicensingComponents/TokenAndLicensing/Token'
import { useState,useEffect, useContext, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../../context/AppContext'

import useDropdownMenu from 'react-accessible-dropdown-menu-hook';

import './../../../../Components/Dashboard/ProjectsComponets/AllProjectsPageComponents/AllProjectsPage.css'

import { BasicModal } from '../../../../Components/SubComponents/Modal'
import discordIcon from './../../../../assets/discordIcon.png'
import twitterIcon from './../../../../assets/twittIcon.png'

import token1 from './../../../../assets/token4.png'
import token2 from './../../../../assets/token2.png'
import token3 from './../../../../assets/token3.png'
import token4 from './../../../../assets/token1.png'

import {FaAngleDown, FaArrowUp, FaCheck, FaCog, FaInfo, FaMinus } from 'react-icons/fa';
import { isSpaceAdmin } from '../../../../networking/spaces'
import {editProject, getProject, isProjectAdmin, setProjectStatus } from '../../../../networking/projects'
import {stakeTokens, unStakeTokens, signALincense, getLicense} from '../../../../networking/license'

import   { getDotETH }   from '../../../../utils/utils';

import { Loader } from '../../../../Components/SubComponents/Loader';
import { notify } from '../../../../Components/Inc/Toastr';


type FormValues = {
  projectTitle: string,
  projectDescription: string,
  projectEmail: string,
  projectCategory: string,
  projectAnticipatedRelease: string,
  projectRelease: string,
  projectAction: string,
  projectActionLink: string,
  twitter: string,
  discord: string,
  bannerImg: File | null,
  bannerUrl: String | null,
  featuredImg: File | null,
  featuredUrl: String | null,
}


export const Project = () => {
 
  const pathArray = window.location.pathname.split('/');
  const spaceId = pathArray[3];

  const path_array = window.location.pathname.split('/');
  const projectId = path_array[4];

  const {user, isAuthenticated, isCreated } = useContext(AppContext);
  let navigate = useNavigate()

  const { buttonProps, itemProps, isOpen } = useDropdownMenu(3);
  const { navHeadData } = useContext(AppContext);
  const [showApprovalModal, setShowApprovalModal] = useState<Boolean>(false);
  const [showRejectModal, setShowRejectModal] = useState<Boolean>(false);
  const [showStakingModal, setShowStakingModal] = useState<Boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<Boolean>(false);
  const [showLicenseIntroModal, setShowLicenseIntroModal] = useState<Boolean>(false);
  const [showLicenseModal, setShowLicenseModal] = useState<Boolean>(false);
  const [showModifyStatusModal, setShowModifyStatusModal] = useState<Boolean>(false);
  const [showEditProjectModal, setShowEditProjectModal] = useState<Boolean>(false);
  const [loading, setLoading] = useState<Boolean>(false);
  const [itemLoaded, setItemLoaded] = useState(false);
  const [spaceAdmin, setSpaceAdmin] = useState<Boolean>(false);
  const [projectAdmin, setProjectAdmin] = useState<Boolean>(false);
  const [project, setProject] = useState<any>({});
  const [tier, setTier] = useState<any>({});
  const [license, setLicense] = useState<any>({});
  const [statusNote, setStatusNote] = useState({statusNote: ''})
  const [status, setStatus]= useState(false)
  const [signee, setSignee]= useState('');
  const [checkBox, setCheckBox] = useState([{id: 1, cbox: false},{id: 2, cbox: false},{id: 3, cbox: false}])
  const [enableLicenseButton, setEnableLicenseButton] = useState(true);
  const [stakedTokens, setStakedTokens] = useState([]);
  const [staked, setStaked] = useState(false);
  const [signed, setSigned] = useState(false);
  const [modifyBtnState, setModifyBtnState] = useState(false);
  const [modifyStatus, setModifyStatus] = useState('');
  const [bannerImg, setBannerImg] = useState<null | any>(null)
  const [featuredImg, setFeaturedImg] = useState<null | any>(null)
  const[owner, setOwner] = useState('');
  const[authored, setAuthored] = useState('');
  const [values, setValues] = useState<FormValues>({
    projectTitle: '',
    projectDescription: '',
    projectEmail: '',
    projectCategory: '',
    projectAnticipatedRelease: '',
    projectRelease: '',
    projectAction: '',
    projectActionLink: '',
    twitter: '',
    discord: '',
    bannerImg: null,
    bannerUrl: '',
    featuredImg: null,
    featuredUrl: '',
  })

  const address = user.address;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement> & React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = event.target
    let value
  
    if (target.type === 'checkbox') {
      value = target.checked
    } else if (target.files instanceof FileList) {
      value = target.files[0]
    } else {
      value = target.value
    }
  
    setValues({ ...values, [target.name]: value })
  }
  


  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const target = event.target
    const  value = target.value
   setValues({ ...values, [target.name]: value })
  }

  const modifyStatusCustomBtn:any = {
    'in-progress': {
      text: 'Confirm this project is In Progress',
      btn: ''
    },
    'defunct': {
      text: 'Confirm this project is Defunct',
      btn: 'dangerBtn'
    },
    'released': {
      text: 'Confirm this project is Released',
      btn: 'successBtn'
    }
  }

  const showStatusAndMessage = (status:string, note:any, flag = false) => {
    let statusIcon;
    let statusHeading='';
    let statusMessage='';
    if(note == null){
      note='sorry bro do better'
    }
     switch(status){
      case 'approved':
        statusIcon = <FaInfo/> 
          break;
        case 'in-progress':
          statusIcon = <FaCog/>
          break;
        case 'released':
          statusIcon = <FaCheck/>
          break;
        case 'defunct':
          statusIcon = <FaMinus/>
          break;
          case 'rejected':           
            statusHeading = "Project proposal rejected";
            statusMessage =`${authored}: “${note}”`;       
          statusIcon = <FaMinus/>
          break;
        default:
          statusHeading = "This project has been sent to the administrators for approval";
          statusMessage = "Once approved, the project owner will be able to stake their tokens and sign their license.";       
          statusIcon = <FaInfo/> 
      }

      if(status == 'approved'){
        statusHeading = "Project pending & not yet authorized";
        statusMessage = "In order to activate this project, the project owner must 1). stake the required amount of tokens, and 2). sign the licensing agreement.";
         status = 'pending';// This is to ensure that the project status doesnot not display 'Approved'
      }
    return (
        <>
        {flag && (
           <>
              <span className={`pb ${status}`}>{statusIcon}</span>
              <span className='pl-1 pr-2 uppercase'>{status}</span>
           </>
        )}
         {(!flag && statusMessage != '') && (
           <div className={`mb-5 infoPanel ${status} flex items-center`}>
            <div className='iconPane'>
              <span className={`icon ${status}`}>{statusIcon}</span>
            </div>
            <div className='infoPane flex-1'>
                <h2 className='infoPaneTitle'>{statusHeading}</h2>
                <p className='infoPaneMessage'>{statusMessage}</p>
            </div>
            </div>
        )}
      </>     
    )
  }


const getProjectById = async (spaceId:string, projectId:string) => {
  await getProject(spaceId, projectId).then(res => {
    setProject(res) 
    setOwner(getDotETH(res.address))
    setAuthored(getDotETH(res.authored))
    setTier(res.tier);
    setLicense(res.license)
    setStaked(res.staked);
    setSigned(res.signed);
    setModifyStatus(res.status);

    setBannerImg(res.bannerImg);
    setFeaturedImg(res.featuredImg); 

    const prj = {
      projectTitle: res.projectTitle,
      projectDescription: res.projectDescription,
      projectEmail: res.projectEmail,
      projectCategory: res.projectCategory,
      projectAnticipatedRelease: res.projectAnticipatedRelease,
      projectRelease: res.projectRelease,
      projectAction: res.projectAction,
      projectActionLink: res.projectActionLink,
      twitter: res.twitter,
      discord: res.discord,
      bannerImg: null,
      bannerUrl: res.bannerImg,
      featuredImg: null,
      featuredUrl: res.featuredImg
    }
    
    setValues(prj);
  })
}


useEffect(() => {
  getProjectById(spaceId, projectId);    
}, [isAuthenticated,status,showApprovalModal,showRejectModal,showStakingModal,showDeleteModal,showLicenseIntroModal,showLicenseModal,showModifyStatusModal,showEditProjectModal]);

const ifIsSpaceAdmin = async (address:string, spaceId:string) => {
  await isSpaceAdmin(address, spaceId).then(res => {
     setSpaceAdmin(res);
  })
}
useEffect(() => {
  ifIsSpaceAdmin(address, spaceId);    
}, [isAuthenticated]);


const ifIsProjectAdmin = async (address:string, projectId:string) => {
  await isProjectAdmin(address, projectId).then(res => {
     setProjectAdmin(res);
  })
}
useEffect(() => {
  ifIsProjectAdmin(address, projectId);    
}, [isAuthenticated]);





const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const target = event.target
  const  value = target.value
  setStatusNote({ ...statusNote, [target.name]: value })
}

const handleShowApprovalModal = () => {
  setShowApprovalModal(true)
}

const handleProjectStatus = async (event: React.FormEvent<HTMLFormElement>, status: string) => {
    event.preventDefault()
    setStatus(false);
    setLoading(true)
     const projectRequest = {
      pid: projectId,
      sid: spaceId,
      status: status,
      authored: user.address,
      statusNote: statusNote.statusNote
     }
    try{
      await setProjectStatus(projectRequest).then(res => {
         if(res == true){
              setStatus(true);
              setLoading(false)
              if(status == 'rejected'){
                setShowRejectModal(false);
                notify("Project status updated!", "success", 6000) 
              }else{
                setShowApprovalModal(false); 
                // if present 
                setShowModifyStatusModal(false); 
                setModifyBtnState(false);
                notify("Project status updated!", "success", 6000)             
              }             
              if(status == 'delete'){
                notify("Project deletion successful.", "success", 6000)
                navigate(`/space/projects/${spaceId}`) 
                setStatus(false)
              }
           }
         
      })
    }catch(err){
      console.log(err)
    }
}


const handleShowRejectModal = () => {
  setShowRejectModal(true)
}
const handleShowStakingModal = () => {
  setShowStakingModal(true)
  setStakedTokens([]);
}
const handleShowDeleteModal = () => {
  setShowDeleteModal(true)
}
const handleShowLicenseIntroModal = () => {
   setShowLicenseIntroModal(true)
}

const handleShowLicenseModal = async () => {
  setItemLoaded(false);
  setShowLicenseIntroModal(false)
  setShowLicenseModal(true)
  
  await getLicense(tier.licenseId).then(res => {
    if(res.licenseFile){
       setLicense(res)
       setItemLoaded(true);
    }   
  })

}

const handleShowModifyStatusModal = () => {
  setShowModifyStatusModal(true)
}

const handleShowEditProjectModal = () => {
  setShowEditProjectModal(true)
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

const handleSign = async (event: React.FormEvent<HTMLFormElement>) => {
   event.preventDefault();
    setLoading(true)
    setStatus(false);
     const signRequest = {
      pid: projectId,
      address: address,
      signee: signee,
      sign: true,
      licenseFile: license.licenseFile
     }
    try{
      await signALincense(signRequest).then(res => {
         if(res == true){
              setSigned(true)
              setStatus(true);
              setLoading(false)
              setShowLicenseModal(false);
              notify("License now active", "success", 6000)                        
           }else{
            setSigned(false)
            setStatus(false);
            notify("Error occured!", "error", 6000) 
          }
         
      })
    }catch(err){
      console.log(err)
    }
}

const handleSubmitStake = async ()  => {
  setStatus(false);
  setLoading(true)
  const stakeRequest = {
   pid: projectId,
   address: address,
   tokens: stakedTokens,
  }
 try{
   await stakeTokens(stakeRequest).then(res => {
      if(res == true){
           setStatus(true);
           setLoading(false)
           setShowStakingModal(false);
           setStakedTokens([]);
           notify("Tokens sucessfully staked", "success", 6000)                        
        }else{
          setStatus(false);
         setLoading(false)
         notify("Error occured!", "error", 6000) 
       }
      
   })
 }catch(err){
   console.log(err)
 }
}

const handleRadioCheck = (e:ChangeEvent<HTMLInputElement>) => {
      setModifyStatus(e.target.value);  
}

const handleChangeStatus = () => {
     setModifyBtnState(true)
}

const handleUnStake = async () => {
  setStatus(false)
  setLoading(true)
  const stakeRequest = {
   pid: projectId
  }
 try{
   await unStakeTokens(stakeRequest).then(res => {
      if(res == true){
           setLoading(false)
           setStatus(true)
           setShowStakingModal(false);
           notify("Tokens sucessfully unstaked", "success", 6000)                        
        }else{
          setStatus(false);
         setLoading(false)
         notify("Error occured!", "error", 6000) 
       }
      
   })
 }catch(err){
   console.log(err)
 }
}


const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>, imgType:string) => {  
  const target = event.target;
  let value
  if(target.files instanceof FileList){
    value = target.files[0]  
   if(imgType == "banner"){
    setBannerImg(URL.createObjectURL(value))
   }
   if(imgType == "featureImg"){
    setFeaturedImg(URL.createObjectURL(value))
   }
  }
  setValues({ ...values, [target.name]: value })
}


const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault()
  setLoading(true);
  let request;
  setStatus(false);
   if(project.status == 'released'){
    request = {
      pid: projectId,
      status: project.status,
      projectTitle: values.projectTitle,
      projectDescription: values.projectDescription,
      projectEmail: values.projectEmail,
      projectRelease: values.projectRelease,
      projectAction: values.projectAction,
      projectActionLink: values.projectActionLink,
      twitter: values.twitter,
      discord: values.discord,
      bannerImg: values.bannerImg!,
      bannerUrl: values.bannerUrl,
      featuredImg: values.featuredImg!,
      featuredUrl: values.featuredUrl
    }
   }else{
    request = {
      pid: projectId,
      status: project.status,
      projectTitle: values.projectTitle,
      projectDescription: values.projectDescription,
      projectEmail: values.projectEmail,
      projectAnticipatedRelease: values.projectAnticipatedRelease,
      projectCategory: values.projectCategory,
      twitter: values.twitter,
      discord: values.discord,
      bannerImg: values.bannerImg!,
      bannerUrl: values.bannerUrl,
      featuredImg: values.featuredImg!,
      featuredUrl: values.featuredUrl
    }
   }

  try{
    await editProject(request).then((data:any )=> {
      if(data.data.status){   
        setStatus(true);
        setShowEditProjectModal(false);  
        notify("Project updated!", "success", 6000);
        //navigate(`/space/project/${spaceId}/${projectId}`)
        setLoading(false)
      }else{
        setLoading(false)
        setStatus(false);
        notify('Something went wrong!', "error", 6000);
      }  
   })
  }catch(err:any){
    setLoading(false)
    setStatus(false);
    notify(err.message, "error", 8000);
  }

}

 const tokens = [
  {name: 'token1', token: token1},
  {name: 'token2', token: token2},
  {name: 'token3', token: token3},
  {name: 'token4', token: token4}
  
 ];
 

  return (
    <div className="reative overflow-hidden">
      <CreateProjectHeader isDetailPage={true} project={project} showStatus={showStatusAndMessage}></CreateProjectHeader>
      <div className="w-full m-4 sm:m-10 xl:pr-20">
      
      <div className="grid grid-cols-12 gap-y-5 xl:gap-y-0 sm:gap-x-10">
       <div className="col-span-12 sm:col-span-9 xl:col-span-9">
         {showStatusAndMessage(project.status, project.statusNote)}
       <div className='projectContent mb-20'>
           <div className='text-gray-200'>
             <h2 className='text-gray-200 font-bold mb-4'>Description</h2>
           </div>
           <div className='projectFeaturedImage'>
           <div className="h-48 p-10" style={{backgroundImage: `url(${project.featuredImg})` }}></div>
           </div>
           <div className='projectDescription mt-3 text-gray-200'>
                <p>{project.projectDescription}</p>
           </div>
           <div className='licensing text-gray-200'>
               <h2 className='font-bold py-4 pb-1'>Proof-of-stake licensing</h2>
               <p className='licensingInfo'>Once the license is in effect, the project must be marked as completed or defunct in order to unstake tokens.</p>
               <div className='licensingTable'>
                   <table className='w-full'>
                     <thead>
                         <tr style={{borderBottom: '0.5px solid #fff', outline: 'none'}}>
                           <td>CONTRIBUTOR</td><td>STAKE</td>
                           {(projectAdmin && project.signed || (project.status == 'released' || project.status == 'defunct')) && (
                             <td>UNSTAKED?</td>
                           )}
                           <td></td>
                         </tr>
                     </thead>
                    <tbody>
                     <tr className='tr' style={{borderTop: 'none', outline: 'none'}}>
                           <td>{owner}</td>
                           <td>{project.stakedtokens != null ? (JSON.parse(project.stakedtokens?.tokens)).length : 0} {project.token?.tokenName}</td>
                           {(projectAdmin && project.signed || (project.status == 'released' || project.status == 'defunct')) && (
                             <td>{project.staked ? 'Not yet' : 'Yes'}</td>
                           )}
                           <td className='text-right'>
                           {(projectAdmin && project.status == 'approved' && !staked) && (
                             <button onClick={handleShowStakingModal} type="button" className="text-gray-200 text-sm font-semibold rounded-full px-8 py-1 projectBtn">
                              Stake
                              
                              </button>
                           )}
                            {(projectAdmin && staked && (project.status == 'approved' || project.status == 'defunct' || project.status == 'released')) && (
                             <button onClick={handleUnStake} type="button" className="text-gray-200 text-sm font-semibold rounded-full px-8 py-1 projectBtn border border-gray-700" style={{background: 'transparent'}}>
                               Unstake
                               { loading && 
                                (
                                  <Loader />
                                )}
                              </button>
                           )}
                              
                            {
                            (projectAdmin && staked && !signed) && (
                               <button onClick={handleShowLicenseIntroModal} type="button" className="text-gray-200 text-sm font-semibold rounded-full px-8 py-1 projectBtn successBtn ml-3">Sign license</button>                           
                           )}

                           
                           </td>
                       </tr>
                    </tbody>
                   </table>
                   {project.stakedtokens != null && (
                   <div className='mt-8 mb-5'>
                       <h1 className='text-gray-200 w-1/2 sm:w-auto sm:text-sm font-bold'>
                        {user.userId === project.userId? 'Your tokens ': 'Tokens '} 
                         staked in this project:</h1>
                   </div>
                   )}
                   <div className='grid grid-cols-12 gap-y-5 xl:gap-y-0 sm:gap-x-5'>
                     {project.stakedtokens != null && (
                        JSON.parse(project.stakedtokens.tokens).map((item:any) => (
                       <div className="text-center col-span-4 sm:col-span-3 xl:col-span-3 relative">
                         <div className="">
                            <img
                                src={item.token}
                                alt="tokenImage"
                                className="rounded-lg"
                            />                      
                        </div>
                        <p className="text-gray-200 text-sm mt-2">{item.name}</p>
                      </div>
                     )))}
                   </div>
               </div>
           </div>
          
       </div>
        
       </div>
       <div className="col-span-12 sm:col-span-3 xl:col-span-3">
         <div className='text-gray-200'> 
         {isAuthenticated && (
          <div>
            {(projectAdmin && project.signed && (modifyStatus == 'in-progress' || project.status == 'released') ) && (     
            <div className="w-36 mb-4">
              <button {...buttonProps} type="button" className="text-gray-200 text-sm font-semibold rounded-full w-full py-1 projectBtn pt-1 pb-1">Actions <FaAngleDown style={{display: 'inline-block', marginLeft: '3px'}} /></button>
            <div className='relative'>
            <ul className={ `dropdownMenu w-full absolute top-0 left-0 ${ isOpen ? 'visible' : '' }`} role='menu'>
                {(projectAdmin && project.signed) && (
                  <li><a target="_blank" href={ license.licenseFile }><span {...itemProps[0]}>View license <FaArrowUp style={{display: 'inline-block', marginLeft: '2px',transform: 'rotate(45deg)'}}/></span></a></li>
                )}
                {(projectAdmin && project.status == 'released') && (
                  <li><span {...itemProps[1]} onClick={handleShowEditProjectModal}>Edit details</span></li>
                )}
                {projectAdmin && modifyStatus == 'in-progress' && (
                  <li><span {...itemProps[3]} onClick={handleShowModifyStatusModal}>Modify status</span></li>
                )}
            </ul>
          </div>
        </div>
         )}
        
        {(spaceAdmin && project.status == 'pending') && (
         <div className="actionBtns">
         <div><button type="button" onClick={handleShowApprovalModal} className="text-gray-200 text-sm font-semibold rounded-full w-36 py-1 projectBtn mb-4">Approve project</button></div>
          <div><button type="button" onClick={handleShowRejectModal} className="text-gray-200 text-sm font-semibold rounded-full w-36 py-1 projectBtn dangerBtn mb-4">Reject project</button></div>
       </div>
        )}
          
         {(projectAdmin && project.status == 'pending') && (
            <div className="actionBtns">
             <div><button onClick={handleShowEditProjectModal} type="button" className="text-gray-200 text-sm font-semibold rounded-full w-36 py-1 projectBtn mb-4">Edit details</button></div>
              <div><button onClick={handleShowDeleteModal} type="button" className="text-gray-200 text-sm font-semibold rounded-full w-36 py-1 projectBtn dangerBtn mb-4">Delete project</button></div>
           </div>
         )}
         </div>
         )}

          {(project.projectAction && project.projectActionLink) && (
           <div className="actionBtns">
            <div><a type='button' target="_blank" href={project.projectActionLink} className="text-gray-200 text-sm font-semibold rounded-full w-36 py-1 projectBtn defaultBtn mb-4 capitalize text-center">{project.projectAction}</a></div>
         </div> 
           )}
         
          <div className='projectNav text-gray-200 mt-2 ml-1'>
           <div className='mb-4'>
               <h2 className='projectNavHeading'>PROJECT OWNER</h2>
               <p className='projectNavDescription text-white'>{owner}</p>
           </div>
           <div className='mb-4'>
               <h2 className='projectNavHeading'>STAKING TIER</h2>
               <p className='projectNavDescription underline  text-white capitalize'>{tier?.tierName}</p>
           </div>       
           <div className='mb-4'>
               <h2 className='projectNavHeading'>CATEGORY</h2>
               <p className='projectNavDescription  text-white capitalize'>{project.projectCategory}</p>
           </div>
           <div className='mb-4'>
            {project.projectRelease ? (
              <>
                 <h2 className='projectNavHeading'>RELEASED DATE</h2>
                 <p className='projectNavDescription  text-white'>{project.projectRelease}</p>
              </>
            ):(
              <>
                <h2 className='projectNavHeading'>ESTIMATED RELEASE</h2>
                <p className='projectNavDescription  text-white'>{project.projectAnticipatedRelease}</p>
              </>      
            )}
               
           </div>
         </div>
         <hr className='w-36 mt-10'></hr>     
         <ul className='flex flex-row items-center socialLink'>

         
           {project.twitter !== null && (
            <li><a target="_blank" rel="noreferrer" href={project.twitter}>
             <img src={twitterIcon} />
               </a></li>
          )}
           {project.discord !== null && (
            <li><a target="_blank" rel="noreferrer" href={project.discord}>
             <img src={discordIcon} />
               </a></li>
          )}
         </ul>        
       </div>
       </div>
   </div>
 </div>
    {showApprovalModal && (
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
          Are you sure you want to approve the project <b>{project.projectTitle}?</b> The project owner will be able to <br/>license your space’s IP according to your staking tier’s specifications. This cannot be undone.
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
    )}
     {showRejectModal && (
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
          Are you sure you want to reject the project <b>{project.projectTitle}?</b> This cannot be undone.
       </p>

       <div className='mt-5 mb-5 '>
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
    )}   

{showDeleteModal && (
     <BasicModal setShowModal={setShowDeleteModal} showModal={showDeleteModal}>
      <div className="tokenModalMain  w-full h-full overflow-hidden rounded-2xl mb-10 ">
     <div className="tokenModalHeader flex items-end justify-between pt-5 px-5 sm:px-8 pb-4">
       <div>
         <p className="text-xs text-gray-200 font-semibold uppercase">
           {navHeadData.title}
         </p>
         <h1 className="text-gray-200 w-1/2 sm:w-auto sm:text-lg font-bold mt-2">
            Delete project
         </h1>
       </div>
       <button
         onClick={() => {
          setShowDeleteModal(false)
           setLoading(false)
         }}
         className="text-gray-200 text-xs sm:text-sm font-bold"
       >
         Cancel
       </button>
     </div>
     <div className="tokenModalContent h-full overflow-auto px-5 sm:px-8 py-8 flex flex-col gap-y-10">
     <div>     
     <form onSubmit={(e) => handleProjectStatus(e, 'delete')}>
     <p className='text-gray-200 text-xs'>
         Are you sure you want to delete the project <b>{project.projectTitle}?</b> This cannot be undone.
       </p>
       <div className='flex items-center gap-x-5 mt-5'>
       <button className='text-gray-200 text-xs font-semibold py-2 px-4 rounded-full projectBtn dangerBtn'>
         Delete project
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
    )}
     {showStakingModal && (
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
         Select the tokens you would like to stake in <b>{project.projectTitle}.</b>
       </p>
       <div className='text-gray-200 text-xs leading-0'>Your tokens will be locked in the staking contract for the duration of your project’s development. They can only  <br/> be unstaked  once the project is marked as completed or defunct.</div>
       <p className='text-gray-200 font-bold text-sm mt-2 mb-4'>
          <small className='capitalize'>Required: {project.tier.requiredStake} {project.token.tokenName}</small>
       </p>
       <h1 className='text-gray-200 text-xs font-bold capitalize'>{project.token.tokenName}</h1>
       <p><small className='text-gray-200 text-xs font-bold text' style={{fontSize: '10px'}}>Selected: {stakedTokens.length} <span className='uppercase'>{project.token.tokenName}</span></small></p>
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
    )}

{showLicenseIntroModal && (
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
       <button onClick={handleShowLicenseModal} className='text-gray-200 text-xs font-semibold py-1 px-4 rounded-full projectBtn'>
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
    )}

{showLicenseModal && (
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
    )}


{showModifyStatusModal && (
     <BasicModal setShowModal={setShowModifyStatusModal} showModal={showModifyStatusModal}>
      <div className="tokenModalMain  w-full h-full overflow-hidden rounded-2xl mb-10 ">
     <div className="tokenModalHeader flex items-end justify-between pt-5 px-5 sm:px-8 pb-4">
       <div>
         <p className="text-xs text-gray-200 font-semibold uppercase">
           {navHeadData.title}
         </p>
         <h1 className="text-gray-200 w-1/2 sm:w-auto sm:text-lg font-bold mt-2">
              Modify status
         </h1>
       </div>
       <button
         onClick={() => {
          setShowModifyStatusModal(false)
           setLoading(false)
         }}
         className="text-gray-200 text-xs sm:text-sm font-bold"
       >
         Cancel
       </button>
     </div>
     <div className="tokenModalContent h-full overflow-auto px-5 sm:px-8 py-8 flex flex-col gap-y-10">
     <div>
       <div>           
           <div className="infoPanel pending flex items-center">
              <div className='iconPane'>
                <span className="icon pending"><FaInfo /></span>
              </div>
              <div className='infoPane flex-1'>
                  <h2 className='infoPaneTitle'>
                       DANGER ZONE
                    </h2>
                    <p className='infoPaneMessage'>
                       <b>Modifying project status is irreversible</b>. Selecting <b>“Released”</b> means your project is <br/>finished, released, and your license will apply to the finished work. Selecting <br/><b>“Defunct”</b> means the project has not been realized, and your license for it will be voided.
                    </p>
              </div>
            </div>  
      </div>     
        
     <form onSubmit={(e) => handleProjectStatus(e, modifyStatus)}>
     <p className="text-gray-200 mb-6 mt-6">
            Project status for <b>{navHeadData.title}</b>
         </p>
       <div className="flex items-center gap-x-3 mb-3">
          <input
            id="1"
            type="radio"
            value="in-progress"
            checked={modifyStatus == 'in-progress' ? true : false }
            disabled={modifyStatus == 'in-progress' ? true : false }
            onChange={handleRadioCheck}
            className="w-4 h-4 p-2 border-2 bg-transparent rounded-full"          
          />
          <label className="text-gray-200 text-xs">
              In-progress
          </label>
        </div>
        <div className="flex items-center gap-x-3 mb-3">
          <input
            id="2"
            type="radio"
            checked={modifyStatus == 'defunct' ? true : false }
            disabled={modifyStatus == 'defunct' ? true : false }
            value="defunct"
            onChange={handleRadioCheck}
            className="w-4 h-4 p-2 border-2 bg-transparent rounded-full"
          />
          <label className="text-gray-200 text-xs">
             Defunct
          </label>
        </div>
        <div className="flex items-center gap-x-3 mb-3">
          <input
            id="3"
            type="radio"
            checked={modifyStatus == 'released' ? true : false }
            disabled={modifyStatus == 'released' ? true : false }
            value="released"
            onChange={handleRadioCheck}
            className="w-4 h-4 p-2 border-2 bg-transparent rounded-full"
          />
          <label className="text-gray-200 text-xs">
             Released
          </label>
        </div>
       <div className='flex items-center gap-x-5 mt-8'>
        { !modifyBtnState? (
          <span  onClick={handleChangeStatus} className='text-gray-200 text-xs font-semibold py-1 px-4 rounded-full projectBtn cursor-pointer'>
              Change project status
              { loading && 
       (
         <Loader />
       )}
          </span>
        ):(
          <button type='submit' className={`text-gray-200 text-xs font-semibold py-1 px-4 rounded-full projectBtn ${modifyStatusCustomBtn[modifyStatus].btn}`}>
           {modifyStatusCustomBtn[modifyStatus].text}
       { loading && 
       (
         <Loader />
       )}
          </button>
        )
        }
       </div>
     </form>
     </div>
     </div>
   </div>
   </BasicModal>
    )}

{showEditProjectModal && (
     <BasicModal setShowModal={setShowEditProjectModal} showModal={showEditProjectModal}>
      <div className="tokenModalMain  w-full h-full overflow-hidden rounded-2xl mb-10 ">
     <div className="tokenModalHeader flex items-end justify-between pt-5 px-5 sm:px-8 pb-4">
       <div>
         <p className="text-xs text-gray-200 font-semibold uppercase">
           {navHeadData.title}
         </p>
         <h1 className="text-gray-200 w-1/2 sm:w-auto sm:text-lg font-bold">
             Edit project details
         </h1>
       </div>
       <button
         onClick={() => {
          setShowEditProjectModal(false)
           setLoading(false)
         }}
         className="text-gray-200 text-xs sm:text-sm font-bold"
       >
         Cancel
       </button>
     </div>
     <div className="tokenModalContent h-full overflow-auto px-5 sm:px-8 py-8 flex flex-col gap-y-10">
           
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="modalContent h-full overflow-auto px-5 sm:px-8 py-8 flex flex-col gap-y-20">
            <div className="flex flex-col gap-y-10">
              <h1 className="text-white text-lg font-bold">Project details </h1>
              <div className="flex flex-col gap-y-1">
                <label className="text-white text-md font-bold">Title</label>
                <input
                  type="text"
                  defaultValue={values.projectTitle}
                  placeholder="Title..."
                  onChange={handleChange}
                  name='projectTitle'
                  className="typeInput text-white bg-transparent text-sm px-0 shadow-none outlin-none"
                />
              </div>
              <div className="flex flex-col gap-y-1">
                <label className="text-white text-md font-bold">
                  Description
                </label>
                <textarea
                  placeholder="Enter description..."
                  onChange={handleChange}
                  name='projectDescription'
                  value={values.projectDescription}
                  rows={3}
                  className="text-white bg-transparent text-sm px-2 shadow-none outlin-none"
                ></textarea>
              </div>
              <div className="flex flex-col gap-y-1">
                <label className="text-white text-md font-bold">
                  Email Address
                </label>
                <input
                  type="projectEmail"
                  defaultValue={values.projectEmail}
                  placeholder="Enter email address..."
                  onChange={handleChange}
                  name='projectEmail'
                  className="typeInput text-white bg-transparent text-sm px-0 shadow-none outlin-none"
                />
              </div>

        {project.status == 'released' ? ( 
          <>  
          <div className="w-full sm:w-1/2">
            <h1 className="text-white text-md font-semibold">
               Release Date
            </h1>            
                <input style={{}}
                    type="date"
                    defaultValue={values.projectRelease}
                    placeholder="MM / DD / YY"
                    onChange={handleChange}
                    name='projectRelease'
                    className="typeInput text-white w-full sm:w-3/5 bg-transparent text-sm px-0 shadow-none outlin-none"
                  />
          </div>
                  
           
                <div className="grid grid-cols-12 sm:gap-y-0 sm:items-center sm:gap-x-5">
                    <div className='col-span-12 text-white text-md font-semibold mb-3'>Action Button</div>
                   <div className='col-span-5'>
                       <select onChange={handleSelect}
                        name='projectAction'
                       className="py-2 px-4 w-full text-sm text-white border border-zinc-700 stakingModalInput outline-0 shadow-none select rounded-md"
                       >
                       <option></option>
                       <option selected={values.projectAction === 'Watch now' ? true : false}>Watch now</option>
                       <option selected={values.projectAction === 'Buy now' ? true : false}>Buy now</option>
                       </select>
                   </div>
                   <div className='col-span-7'>
                     <input
                     type="text"
                     defaultValue={values.projectActionLink}
                     placeholder="Enter link..."
                     onChange={handleChange}
                     name='projectActionLink'
                     className="typeInput text-white w-full bg-transparent text-sm px-0 shadow-none outlin-none"
                     />
                   </div>
                  </div>
                  </>   
                ):(
                  <>
            <div className="w-full sm:w-1/2">
            <h1 className="text-white text-md font-semibold">
              Category
            </h1>
              <select onChange={handleSelect}
                 name='projectCategory'
                  className=" mt-2 py-3 px-4 w-full text-xs text-white border border-zinc-700 stakingModalInput outline-0 shadow-none select rounded-md">
                  <option></option>
                  {tier.projectCategory != '' && (
                  tier.projectCategory.split(',').map((item : any) => (   
                <option selected={item.trim() == project.projectCategory ? true : false}>{item}</option>
               ))
             )}
            </select>
          </div>
          <div className="w-full sm:w-1/2">
            <h1 className="text-white text-md font-semibold">
              Anticipated Release
            </h1>
                 <select onChange={handleSelect}
                 name='projectAnticipatedRelease'
                  className=" mt-2 py-3 px-4 w-full text-xs text-white border border-zinc-700 stakingModalInput outline-0 shadow-none select rounded-md">
                  <option></option>
                  <option selected={values.projectAnticipatedRelease == 'Q1 2024' ? true : false}>Q1 2024</option>
                  <option selected={values.projectAnticipatedRelease == 'Q2 2024' ? true : false}>Q2 2024</option>
                  <option selected={values.projectAnticipatedRelease == 'Q3 2024' ? true : false}>Q3 2024</option>
                  <option selected={values.projectAnticipatedRelease == 'Q4 2024' ? true : false}>Q4 2024</option>
            </select>
          </div>
                  </>
                )
                }

                <div className="flex flex-col sm:flex-row gap-y-4 sm:gap-y-0 sm:items-center sm:gap-x-5">
                  <label className="text-white text-sm sm:w-32">Twitter</label>
                  <input
                    type="text"
                    defaultValue={values.twitter}
                    placeholder="Twitter URL..."
                    onChange={handleChange}
                    name='twitter'
                    className="typeInput text-white w-full sm:w-3/5 bg-transparent text-sm px-0 shadow-none outlin-none"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-y-4 sm:gap-y-0 sm:items-center sm:gap-x-5">
                  <label className="text-white text-sm sm:w-32">Discord</label>
                  <input
                    type="text"
                    defaultValue={values.discord}
                    placeholder="Discord URL..."
                    onChange={handleChange}
                    name='discord'
                    className="typeInput text-white w-full sm:w-3/5 bg-transparent text-sm px-0 shadow-none outlin-none"
                  />
                </div>

                <div className="flex flex-col gap-y-1">
                <label className="text-white text-md font-bold">
                  Upload a featured image
                </label>
                <span className="text-xs text-white">
                  1920 x 1080 recommended.
                </span>
                {featuredImg ? (
                <div>
                  <img
                    src={featuredImg}
                    alt="featuredImg"
                    className="spaceSettingFormFileInput mt-4 p-1 h-52 w-full sm:w-1/2 object-cover"
                  />
                  <div className="flex items-center gap-x-2 mt-2">
                    <span className="text-white text-sm underline">
                    {values?.featuredImg?.name}
                    </span>
                    <div className="border-r-2 border-white h-3 mt-1"></div>
                    <button
                      onClick={() => {
                        setFeaturedImg(null)
                      }}
                      className="text-white text-sm underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <label className="fileInput py-10 w-full mt-4 flex justify-center px-3">
                  <input
                    onChange={(e) => handleImageChange(e, 'featureImg')} 
                    type="file"
                    name='featuredImg'
                    className="hidden"
                  />
                  <span className="text-white text-md">
                    Drag & drop or <u>upload</u>
                  </span>
                </label>
              )}
              </div>

              <div className="flex flex-col gap-y-1">
                <label className="text-white text-md font-bold">
                  Upload a banner image
                </label>
                <span className="text-xs text-white">
                  1920 x 1080 recommended.
                </span>
                {bannerImg ? (
                <div>
                  <img
                    src={bannerImg}
                    alt="bannerImg"
                    className="spaceSettingFormFileInput mt-4 p-1 h-40 w-full sm:w-2/3 object-cover"
                  />
                  <div className="flex items-center gap-x-2 mt-2">
                    <span className="text-white text-sm underline">
                    {values?.bannerImg?.name}
                    </span>
                    <div className="border-r-2 border-white h-3 mt-1"></div>
                    <button
                      onClick={() => {
                        setBannerImg(null)
                      }}
                      className="text-white text-sm underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <label className="fileInput py-10 w-full mt-4 flex justify-center px-3">
                  <input
                      onChange={(e) => handleImageChange(e, 'banner')}                  
                    type="file"
                    name='bannerImg'
                    className="hidden"
                  />
                  <span className="text-white text-md">
                    Drag & drop or <u>upload</u>
                  </span>
                </label>
              )}
              </div>

           <div className='flex flex-row justify-between'>
            <div className="">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditProjectModal(false)
                     setLoading(false)
                   }}
                  className="text-white text-sm font-semibold rounded-full px-8 py-2 createProject_back_btn"
                >
                  Back 
                   
                </button>
              </div>

              <div className="">
                <button
                  type="submit"
                  className="text-white text-sm font-semibold rounded-full px-8 py-2 createSpaceModalBtn"
                >
                  Edit  details 
                  { loading && (
                      <Loader />
                    )} 
                </button>
              </div>
            </div>
            </div>
          </div>
        </form>
     </div>
   </div>
   </BasicModal>
    )}

    </div>
  )
}
