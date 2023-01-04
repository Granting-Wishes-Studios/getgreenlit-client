import React,{useContext} from 'react'
import { SpaceSettingForm } from '../../../../../Components/Dashboard/ProjectsComponets/SpaceSettingComponents/SpaceSettingForm'
import "./SpaceSetting.css"
import { AppContext } from './../../../../../context/AppContext'

export const SpaceSettings = () => {

  const { navHeadData } =  useContext(AppContext);
  const bgImage = navHeadData.banner;

  return (
      <div>
        <div className="spaceSettingHeader h-60 p-10 flex items-end" style={{backgroundImage: `url(${bgImage})` }}>
          <h1 className="spaceSettingHeader_heading text-white font-bold">
            Space settings
          </h1>
        </div>
        <SpaceSettingForm></SpaceSettingForm>
      </div>
  )
}
