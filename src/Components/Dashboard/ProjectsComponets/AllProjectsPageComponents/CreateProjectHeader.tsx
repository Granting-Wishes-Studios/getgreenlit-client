import {useState, useContext, useEffect} from 'react'
import './AllProjectsPage.css'
import { CreateProjectModal } from './CreateProjectModal'
import projectsIcon from './../../../../assets/projectsIcon.png'
import { AppContext } from './../../../../context/AppContext'
import {FaAngleLeft} from 'react-icons/fa';
import { getSpace, joinOrLeaveSpace, isSpaceMember } from '../../../../networking/spaces'
import { Loader } from '../../../SubComponents/Loader';
import { notify } from '../../../Inc/Toastr';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';


export const CreateProjectHeader = (props: any) => {
  const {user, setWidget, navHeadData, isAuthenticated, authenticate} = useContext(AppContext);
  const [showIntroModal, setShowIntroModal] = useState<Boolean>(false);
  const [isMember, setIsMember] = useState<Boolean>(false);
  const [loading, setLoading] = useState<Boolean>(false);
  const [space, setSpace] = useState<any>({});
  
  const projectData = props.project
  const showStatus = props.showStatus;

  const bgImage = navHeadData.banner;

    const userid =   user.userId;
  

  const pathArray = window.location.pathname.split('/');
  const spaceId = pathArray[3];

  let navigate = useNavigate()

  const handGoBack = () => {
    navigate(`/space/projects/${spaceId}`)
  }
  const handleJoinSpace = async () => {
    setLoading(true)
    if(!isMember){     
      try{
        
          await authenticate().then(async (response:any) => {
            console.log('jdsjdfjkjkjkdf', response)  
          await joinOrLeaveSpace(spaceId, response, 'join').then(res => {
            if(res.status){
              setIsMember(true)
              notify('Space joined!', "success", 6000);
            // handle widget change
              setWidget((prev:any) => [...prev, {linkTo:res.space.id, linkTitle: res.space.title, img: res.space.logoImg}])
              setLoading(false)
            }
          })
        })
      }catch(error){
        console.log(error)
        setLoading(false)
      }
    } 
  }

  const ifIsSpaceMember = async (userId:string, spaceId:string) => {
    await isSpaceMember(userId, spaceId).then(status => {
      setIsMember(status)
    })
}
useEffect(() => {
  ifIsSpaceMember(userid, spaceId);    
}, [isAuthenticated]);

const getSpaceById = async (spaceId:string) => {
  await getSpace(spaceId).then(res => {
    setSpace(res)
  })
}


useEffect(() => {
  getSpaceById(spaceId);    
}, [isAuthenticated]);


const handleShowIntroModal = () => {
   setShowIntroModal(true)
}


  return ( 
    <>
    {!props.isDetailPage ?  (
      <div className="CreateProjectHeader h-60 p-10 flex items-end" style={{backgroundImage: `url(${bgImage})` }}>
      <div className="flex flex-wrap sm:flex-nowrap gap-y-8 sm:gap-y-0 justify-between items-end w-full">
        <div  className='flex flex-col gap-y-6'>
          <h1 className="CreateProjectHeader_heading text-white font-bold">
            Projects
          </h1>
          <div className='flex items-center gap-x-2'>
            <img src={projectsIcon} alt="projectsIcon" className="w-8" />
            <p className='text-white font-semibold text-xs'>
              Total <br /> {props.projects.length} Projects
            </p>
          </div>
        </div>
           { isMember? (
             <button onClick={handleShowIntroModal} className="px-5 py-2 xl:mr-20 text-white text-xs sm:text-sm createProject_btn rounded-full">
               Create a new project
             </button>
           ) : (
             <button  disabled={loading?true:false} onClick={() => {handleJoinSpace()}}  className="px-5 py-2 xl:mr-20 text-white text-xs sm:text-sm createProject_btn rounded-full">
               Join Space 
               { loading  && (<Loader />)} 
            </button>
           )
           }
         
      </div>
      {showIntroModal && <CreateProjectModal space={space} showIntroModal={showIntroModal} setShowIntroModal={setShowIntroModal}></CreateProjectModal>}
    </div>
    ) : (
      <div className="CreateProjectHeader h-40 p-10" style={{backgroundImage: `url(${projectData.bannerImg})` }}>          
         <div className="flex items-center gap-x-5 py-2 mt-8 relative">
             <div className='projectBadge'>
                <div className='flex'>
                   <span className='pb arrow'><FaAngleLeft/></span>
                   <span onClick={handGoBack} className='pr-2 cursor-pointer'>Back to projects</span>
                </div>
             </div>
         </div>
          <div>
            <span className='text-white font-bold'>{projectData.projectTitle}</span>
             <div className='projectBadge ml-3' style={{display: 'inline-block'}}>
                <div className='flex'>
                  {showStatus(projectData.status,'', true)}
                </div>
             </div>
         </div>
        
      </div>
    )}
    </>
  )

}
