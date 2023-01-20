import { CreateProjectHeader } from '../../../../Components/Dashboard/ProjectsComponets/AllProjectsPageComponents/CreateProjectHeader'
import { AllProjectsCardsList } from '../../../../Components/Dashboard/ProjectsComponets/AllProjectsPageComponents/AllProjectsCardsList'
import { useState,useEffect, useContext } from 'react';
import { getProjects } from '../../../../networking/projects'
import { AppContext } from '../../../../context/AppContext'

type ProjectMetadata = {
  id: string
  projectTitle: string
  address: string
  projectCategory: string
  featuredImg: string
  status: string,
  authored: string,
  adminApproval: boolean
  staked: boolean
  signed: boolean
}

const ProjectsData: ProjectMetadata[] = []


export const AllProjects = () => {
 

  const pathArray = window.location.pathname.split('/');
const spaceId = pathArray[3];
  const [projectsCards, setProjectsCards] = useState(ProjectsData);
  const[status, setStatus] = useState<Boolean>(false)
  const { isAuthenticated,  user, loadSpace, isCreated } = useContext(AppContext);
  
  useEffect(() => {
    setProjectsCards([])
    getProjects(spaceId).then( res => {
      const projects: ProjectMetadata[] = []
      res.forEach(async (project, ind) => {
      const projectMeta: ProjectMetadata = {
        id: project.id,
        address: project.address,
        projectTitle: project.projectTitle,
        projectCategory: project.projectCategory,
        featuredImg: project.featuredImg,
        status: project.status,
        authored: project.authored, 
        adminApproval: project.adminApproval,
        staked: project.staked,
        signed: project.signed
      }
      projects.push(projectMeta)
      ProjectsData.push(projectMeta)
    })

    setProjectsCards(projects)

  }).catch((err) => {
            console.error('Error:', err);
        });
  }, [isAuthenticated, isCreated, status]);

  return (
    <div className="relative">
      <CreateProjectHeader projects={projectsCards}></CreateProjectHeader>
      {projectsCards.length <= 0 ? (
        <div className="mt-28 h-full w-full">
        <p className="text-sm  text-gray-600 text-center">
          This is a world of limitless potential.
          <br />
          Start a project to help realize it.
        </p>
      </div>
      ) : (<AllProjectsCardsList setStatus={setStatus} projects={projectsCards}></AllProjectsCardsList>)}
      
    </div>
  )
}
export type { ProjectMetadata }
