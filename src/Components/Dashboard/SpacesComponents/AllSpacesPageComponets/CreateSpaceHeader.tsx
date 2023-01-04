import React, { useContext, useState } from 'react'
import './AllSpacesPage.css'
import { CreateSpaceModal } from './CreateSpaceModal'
import { AppContext } from './../../../../context/AppContext'

export const CreateSpaceHeader = (props:any) => {
  const [showModal, setShowModal] = useState<Boolean>(false);
  const { isAuthenticated } =  useContext(AppContext);
  
  return (
    <div className="CreateSpaceHeader h-52 p-10 flex items-end">
      <div className='flex flex-col sm:flex-row gap-y-8 sm:gap-y-0 justify-between items-center w-full'>
        <h1 className="CreateSpaceHeader_heading text-white">
          Supercharge your IP with Greenlit.
        </h1>
        <button disabled={!isAuthenticated}  onClick={() => {setShowModal(true)}} className="px-5 py-2 xl:mr-20 text-white text-xs sm:text-sm createSpace_btn rounded-full">
         Create a new space
        </button>
      </div>
      {showModal && <CreateSpaceModal setShowAlert={props.setShowAlert} showModal={showModal} setShowModal={setShowModal}></CreateSpaceModal>}
    </div>
  )
}
