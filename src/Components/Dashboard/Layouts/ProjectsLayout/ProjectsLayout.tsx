import React, { Dispatch, SetStateAction } from 'react'
import { Outlet } from 'react-router-dom'
import './ProjectsLayout.css'
import ProjectsSidebar from './ProjectsSidebar/ProjectsSidebar'
interface Props {
  showProjectsSidebar: any
  setShowProjectsSidebar: Dispatch<SetStateAction<Boolean>>
}
export const ProjectsLayout: React.FC<Props> = (props) => {
  return (
    <div className="h-full w-full flex flex-row">
      <div>
        <ProjectsSidebar
          showProjectsSidebar={props.showProjectsSidebar}
          setShowProjectsSidebar={props.setShowProjectsSidebar}
        />
      </div>
      <div className="h-full w-full children overflow-y-auto">
        <Outlet />
      </div>
    </div>
  )
}
