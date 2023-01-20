import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, {useState } from 'react'
import { AddLicenseModal } from './AddLicenseModal'
import { AddTokenModal } from './AddTokenModal'
import './TokenAndLicensing.css'
import { addLicenseIntro, FormLicenseIntroRequest } from '../../../../../networking/license'
import { notify } from './../../../../Inc/Toastr';
import { Loader } from '../../../../SubComponents/Loader';


export const TokenAndLicensing = (props: any) => {
  const [showSummary, setshowSummary] = useState(false)
  const [showLicenseModal, setShowLicenseModal] = useState(false)
  const [request, setRequest] = useState('');
  const [activeSummary, setActiveSummary] = useState<any>([]);

  const [activeState, setActiveState] = useState<any>(false)
 
  const [loading, setLoading] = useState(false);
  const pathArray = window.location.pathname.split('/');
  const spaceId = pathArray[3];

  type FormValues = {
    licenseIntro: string,
  }

  const [values, setValues] = useState<FormValues>({
    licenseIntro: '',
  })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target
    const  value = target.value
    
    setValues({ ...values, [target.name]: value })
  }

  const handleActiveSummary = (val: any) => {
    let d = activeSummary && activeSummary.find((ele: any) => ele === val)
    let res = false
    if (d) {
      res = true
    }
    return res
  }

  const handleSwitch = (e:any ,val:any) => {
 
    let d = activeSummary && activeSummary.find((ele: any) => ele === val)
    if(d == val){     
      activeSummary.splice(0, activeSummary.length)
      setActiveSummary( (prev:any) => []);
      handleActiveSummary(0)
      setActiveState(true)
    }else{
      setActiveSummary( (prev:any) => [...prev, val]);
      setActiveState(false)
    }
  }




  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true);
    const request: FormLicenseIntroRequest = {
      licenseIntro: values.licenseIntro,
    }

    try{
       setLoading(true)
       await addLicenseIntro(request, spaceId).then((data:any )=> {
        if(data.data.status){
          notify("Licensing Intro saved!", "success", 6000);
          setLoading(false)
        }else{
          setLoading(false)
          notify('Something went wrong!', "error", 6000);
        }  
     })
    }catch(err:any){
      setLoading(false)
      notify(err.message, "error", 8000);
    }

  }

  const handleShowTokenModal = (data:any) => {
    props.setShowTokenModal(true)
    data.action = 'edit-token';
    setRequest(data); 
  }

  const handleShowLicenseModal = (data:any) => {
    setShowLicenseModal(true)
    data.action = 'edit-license';
    setRequest(data);
  }


  return (

    <div className="w-full md:w-5/6 px-5 py-10 sm:p-10 flex flex-col gap-y-10">
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-white text-2xl font-bold">Tokens</h1>
          <button
            onClick={() => {
              setRequest('');
              props.setShowTokenModal(true)
            }}
            className=" text-white text-xs font-semibold px-5 py-1 rounded-full addToken-btn"
           >
            Add a Token
          </button>
        </div>
        {props.showTokenModal && (
          <AddTokenModal
            setIsSaved={props.setIsSaved}
            setShowTokenModal={props.setShowTokenModal}
            showTokenModal={props.showTokenModal}
            req={request}
          ></AddTokenModal>
        )}
        <p className="text-gray-200 text-xs mt-2">
          Specify the assets that users can stake in exchange for a license to
          your IP.
        </p>
        {props.licenseTokenData.map((item:any, index:any) => (
             <div key={index} className="w-full token-card rounded-sm py-5 px-4 sm:px-8 mt-3 cursor-pointer" onClick={() => handleShowTokenModal(item)}>
             <h1 className="text-xl text-white font-semibold">
              {item.tokenName}
             </h1>
             <p className="text-gray-200 text-xs mt-1">
               {item.description}
             </p>
             <div className="flex items-start flex-wrap sm:flex-nowrap gap-y-5 sm:gap-y-0 gap-x-5 mt-3">
               <div className="flex flex-col gap-y-2">
                 <h1 className="text-sm text-white font-semibold">Network</h1>
                 <p className="text-xs text-gray-200">{item.network}</p>
               </div>
               <div className="flex flex-col gap-y-2">
                 <h1 className="text-sm text-white font-semibold">Type</h1>
                 <p className="text-xs text-gray-200">ERC-721</p>
               </div>
               <div className="flex flex-col gap-y-2">
                 <h1 className="text-sm text-white font-semibold">
                   Token Contract
                 </h1>
                 <p className="text-xs text-gray-200 break-all">
                 {item.contractAddress}
                 </p>
               </div>
             </div>
           </div>
        ))}
       

      </div>
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-white text-2xl font-bold">Licenses</h1>
          <button
            onClick={() => {
              setRequest('');
              setShowLicenseModal(true)
            }}
            className=" text-white text-xs font-semibold px-5 py-1 rounded-full addToken-btn"
          >
            Add a license
          </button>
        </div>
        {
          <AddLicenseModal
            setIsSaved={props.setIsSaved}
            showLicenseModal={showLicenseModal}
            setShowLicenseModal={setShowLicenseModal}
            req={request}
          ></AddLicenseModal>
        }
        <p className="text-gray-200 text-xs mt-2">
          Add a license that users can stake their tokens in order to acquire.
          These are configured by staking tiers.
        </p>

        
         {props.licenseData.map((item:any, index:number) => (
          <div onClick={() => handleShowLicenseModal(item)} key={index} className="w-full token-card rounded-sm py-5 px-4 sm:px-8 mt-3 cursor-pointer">
          <h1 className="text-xl text-white font-semibold">
            {item.licenseName}
          </h1>
            <div className="flex items-end justify-between flex-wrap sm:flex-nowrap gap-y-5 sm:gap-y-0 gap-x-5 w-full mt-3">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-sm text-white font-semibold">File</h1>
              <p className="text-xs text-gray-200 underline">
              <a target="_blank" href={item.licenseFile}>{item.licenseFileName}</a>
              </p>
            </div>
            <button
              onClick={(e) => {handleSwitch(e, index + 1)}}
              className="flex items-center gap-x-2 font-bold"
            >
              <span className="text-xs text-white">
              {handleActiveSummary(index + 1) && !activeState ? 'Hide summary' : 'Show summary'}
              </span>
              {handleActiveSummary(index + 1) && !activeState ? (
                <FontAwesomeIcon
                  icon={faChevronUp}
                  className="text-white text-xs"
                />
              ) : (
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className="text-white text-xs"
                />
              )}
            </button>
          </div>
          {handleActiveSummary(index + 1) && !activeState &&  (
            <div className="mt-4">
              <div className="border-b border-zinc-600" />
              <div className="mt-10">
                <h1 className="text-sm text-white font-semibold">Summary</h1>
                <p className="text-gray-200 text-xs mt-2">
                  By staking tokens and agreeing to the license to follow, you
                  are entering into a legal agreement with [IP Holder]: the
                  holding organization of [IP title].
                </p>

                <p className="text-gray-200 text-xs my-4">
                  You must read the entire license, but here are the key
                  takeaways:
                </p>
                <div className="list-disc pl-8 text-gray-200 text-xs">
                     {item.licenseSummary}
                 </div>
              </div>
            </div>
          )}
            </div>
         ))}
          
        
      </div>
      <div>
        <h1 className="text-white text-2xl font-bold">Licensing Intro</h1>
        <p className="text-gray-200 text-xs mt-2">
          This brief message will display each time a user creates a new
          project.
        </p>
        <form onSubmit={(e) => handleSubmit(e)}>
        <input
          defaultValue={props.licenseIntroData? props.licenseIntroData.intro: ''}
          type="text"
          onChange={handleChange}
          name='licenseIntro'
          placeholder="Enter licensing intro..."
          className="border border-gray-700 rounded-md bg-transparent w-full py-3 px-5 text-xs text-gray-200 mt-4"
        />
        <div className="mt-5 flex justify-end">
          <button className=" text-white text-xs font-semibold px-8 py-1 rounded-full addToken-btn">
            Save text
            { loading && (
                      <Loader />
                    )}
          </button>
        </div>
        </form>
      </div>
    </div>
  )
}
