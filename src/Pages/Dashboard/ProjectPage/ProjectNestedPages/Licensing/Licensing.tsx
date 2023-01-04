import React, { useEffect, useState, useContext } from 'react'
import { StakingTier } from '../../../../../Components/Dashboard/ProjectsComponets/LicensingComponents/StakingTier/StakingTier'
import { AddTokenModal } from '../../../../../Components/Dashboard/ProjectsComponets/LicensingComponents/TokenAndLicensing/AddTokenModal'
import { TokenAndLicensing } from '../../../../../Components/Dashboard/ProjectsComponets/LicensingComponents/TokenAndLicensing/TokenAndLicensing'
import { getTokensAndLicenses } from '../../../../../networking/license'
import { Loader } from '../../../../../Components/SubComponents/Loader';
import { AppContext } from './../../../../../context/AppContext'
import './Licensing.css'

export const Licensing = () => {

  const { navHeadData} = useContext(AppContext);
  const [tokensTab, setTokensTab] = useState<any>('default')
  const [showTokenModal, setShowTokenModal] = useState<any>(false)
  const [isSaved, setIsSaved] = useState<any>(false)

  const pathArray = window.location.pathname.split('/');
  const spaceId = pathArray[3];

  const bgImage = navHeadData.banner;

  const [licenseTokenData, setLicenseTokenData] = useState([{
    id: '',
    spaceId: '',
    network: '',
    contractAddress: '',
    description: ''
  }]);

  const [licenseData, setLicenseData] = useState([{
    id: '',
    spaceId: '',
    licenseName: '',
    licenseSummary: '',
    licenseFile: ''
  }]);

  const [licenseIntroData, setLicenseIntroData] = useState([{
    id: '',
    spaceId: '',
    intro: '',
  }]);

  const getAllTokens = async (spaceId:string) => {
     await getTokensAndLicenses(spaceId).then(res => {
      setLicenseTokenData(res[0]);
      setLicenseData(res[1]);
      setLicenseIntroData(res[2]);
      if(res[0].length > 0){
        setTokensTab('Tokens & Licenses')      
      }else{
        setTokensTab(null)
      }
      
     })
  }

  useEffect(() => {
     getAllTokens(spaceId);
  }, [isSaved])
  
  return (
    <div>
      <div className="licensingHeader h-60 px-5 sm:px-10 pt-10 flex items-end" style={{backgroundImage: `url(${bgImage})` }}>
        <div className="flex flex-col">
          <h1 className="licensingHeader_heading text-white font-bold">
            Proof-of-stake Licensing
          </h1>
          <p className="text-sm text-white my-3">
            Allow token holders to license this space’s IP by staking their
            assets. Learn more.
          </p>
          {tokensTab  && (
            <div className="flex items-center gap-x-8 mt-8">
               {tokensTab !== 'default' && (
                  <button
                  onClick={() => {
                    setTokensTab('Tokens & Licenses')
                  }}
                  className={`text-white text-sm font-semibold py-2 border-b-2 border-white ${
                    tokensTab === 'Tokens & Licenses'
                      ? 'border-opacity-100'
                      : 'border-opacity-0'
                  }`}
                >
                  Tokens & Licenses
                </button>
               )}
            
            {tokensTab !== 'default' && (
              <button 
              onClick={() => {
                setTokensTab('Staking Tiers')
              }}
              className={`text-white text-sm font-semibold py-2 border-b-2 border-white ${
                tokensTab === 'Staking Tiers'
                  ? 'border-opacity-100'
                  : 'border-opacity-0'
              }`}
            >
              Staking Tiers
            </button>
             )}
            </div>
          )}
        </div>
      </div>
      {tokensTab === 'Tokens & Licenses' && (
        <TokenAndLicensing
          setIsSaved={setIsSaved}
          licenseTokenData={licenseTokenData}
          licenseData={licenseData}
          licenseIntroData={licenseIntroData}
          showTokenModal={showTokenModal}
          setShowTokenModal={setShowTokenModal}
        ></TokenAndLicensing>
      )}
      {tokensTab === 'Staking Tiers' && <StakingTier></StakingTier>}
      {tokensTab === 'default' && (
         <Loader/>
      )}
      {!tokensTab && (
        <div className="flex flex-col items-center px-4 py-20">
          <h1 className="text-white text-xl sm:text-2xl font-semibold text-center">
            Add a token to enable decentralized licensing for this space.
          </h1>
          <p className="text-center text-white text-sm sm:text-md mt-5">
            Users will need this token in order to create projects,
            <br className="hidden sm:block" /> stake, and acquire licenses.
            Space owners will be able
            <br className="hidden sm:block" /> to set pre-requisites for
            staking.
          </p>
          <button
            onClick={() => {
              setShowTokenModal(true)
            }}
            className=" text-white text-sm font-semibold px-8 py-2 mt-8 rounded-full addToken-btn"
          >
            Add a Token
          </button>
        </div>
      )}
      {!tokensTab && (
      <AddTokenModal
        setIsSaved={setIsSaved}
        setShowTokenModal={setShowTokenModal}
        showTokenModal={showTokenModal}
        setTokensTab={setTokensTab}
      ></AddTokenModal>
      )}
    </div>
  )
}
