import React, { Dispatch, SetStateAction } from 'react'
import { Outlet } from 'react-router-dom'
import './SpacesLayout.css'
import SpacesSidebar from './SpacesSidebar/SpacesSidebar'
interface Props {
  showSpacesSidebar: any
  setShowSpacesSidebar: Dispatch<SetStateAction<Boolean>>
}
export const SpacesLayout: React.FC<Props> = (props) => {
  return (
    <div className="h-full w-full flex flex-row">
      <div>
        <SpacesSidebar showSpacesSidebar={props.showSpacesSidebar} setShowSpacesSidebar={props.setShowSpacesSidebar} />
      </div>
      <div className="h-full w-full children overflow-y-auto">
        <Outlet />
      </div>
    </div>
  )
}
