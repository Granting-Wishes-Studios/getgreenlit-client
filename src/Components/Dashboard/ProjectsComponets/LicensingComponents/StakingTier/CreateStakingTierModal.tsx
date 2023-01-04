import { faClose, faMinus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Stack, TextField, Typography } from '@mui/material'
import { addStakingTier, FormStakingTierRequest } from '../../../../../networking/license'
import { Box } from '@mui/system'
import React, { useState, useRef, useContext } from 'react'
import { notify } from './../../../../Inc/Toastr';
import { Loader } from '../../../../SubComponents/Loader';
import { BasicModal } from '../../../../SubComponents/Modal'
import { AppContext } from './../../../../../context/AppContext'
import './CreateStakingTierModal.css'
const Tags = (props: any) => {
  return (
    <Box
      sx={{
        background: '#283240',
        height: '100%',
        display: 'flex',
        padding: '0.4rem',
        margin: '0 0.5rem 0 0',
        justifyContent: 'center',
        alignContent: 'center',
        color: '#ffffff',
      }}
    >
      <Stack direction="row" gap={2} className="flex items-center">
        <Typography>{props.data}</Typography>
        <FontAwesomeIcon
          icon={faClose}
          className="cursor-pointer"
          onClick={() => {
            props.handleDelete(props.data)
          }}
        />
      </Stack>
    </Box>
  )
}

export const CreateStakingTierModal = (props: any) => {
  const [tags, SetTags] = useState([])
  const tagRef = useRef(null)
  const [projectTags] = useState([]);
  const { navHeadData} = useContext(AppContext);

  const [loading, setLoading] = useState(false);
  const pathArray = window.location.pathname.split('/');
  const spaceId = pathArray[3];

  type FormValues = {
    tierName: string,
    tierSummary: string,
    requiredToken: string,
    requiredStake: string,
    tokenId: string,
    licenseToBeGranted: string,
    projectCategory: string,
    projectBudjectMaximum: string,
    projectBudjectMinimum: string,
    projectCurrencyType: string,
    royalty: string,
    adminApproval: string
  }

  const [values, setValues] = useState<FormValues>({
    tierName: '',
    tierSummary: '',
    requiredToken: 'Hidden Ones (HIDDENONES)',
    requiredStake: '1',
    tokenId: '',
    licenseToBeGranted: 'Greenlit-Boilerplate-License.pdf',
    projectCategory: '',
    projectBudjectMaximum: '',
    projectBudjectMinimum: '',
    projectCurrencyType: 'USD',
    royalty: '',
    adminApproval: ''

  })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target
    let  value
    if (target.type === 'checkbox') {
        value = target.checked
    }else{
      value = target.value
    }
         
    
    setValues({ ...values, [target.name]: value })
  }

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
     const target = event.target
     const  value = target.value
     setValues({ ...values, [target.name]: value })
  }

  

  const handleDelete = (value: any) => {
    const newtags = tags.filter((val) => val !== value)
    SetTags(newtags)
  }

  const [check1, setCheck1] = useState<any>(false)
  const [check2, setCheck2] = useState<any>(false)

  const handleCheckbox1 = (event: any) => {
    if (event.target.checked) {
      setCheck1(true)
    } else {
      setCheck1(false)
    }
    const target = event.target
     const  value = target.value
    setValues({ ...values, [target.name]: value })
  }
  const handleCheckbox2 = (event: any) => {
    if (event.target.checked) {
      setCheck2(true)
    } else {
      setCheck2(false)
    }
    const target = event.target
     const  value = target.value
    setValues({ ...values, [target.name]: value })
  }

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // @ts-ignore
      SetTags([...tags, tagRef.current.value])
      // @ts-ignore
      projectTags.push(tagRef.current.value)
    // @ts-ignore
      tagRef.current.value = ''
  }
  
  const handleSubmitForm = async (e:any) => {
    e.preventDefault();
    let projectTagString = '';
    projectTags.map((item, index) => {
      projectTagString = projectTagString+item
      if(index !=  projectTags.length-1){
        projectTagString = projectTagString+', '
      }
    })
    
    const request: FormStakingTierRequest = {
      tierName: values.tierName,
      tierSummary: values.tierSummary,
      requiredToken: values.requiredToken,
      requiredStake: values.requiredStake,
      tokenId: values.tokenId,
      licenseToBeGranted: values.licenseToBeGranted,
      projectCategory: projectTagString,
      projectBudgetRange: values.projectBudjectMinimum+'-'+values.projectBudjectMaximum+'-'+values.projectCurrencyType,
      royalty: values.royalty,
      status: false,
      adminApproval: values.adminApproval
    }
    
    try{
       setLoading(true)
       await addStakingTier(request, spaceId).then((data:any )=> {
        if(data.data.status){
          props.setShowStakingModal(false);
          props.setIsSaved(true);
          notify("Staking tier added!", "success", 6000);
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


  return (
    <BasicModal
      setShowModal={props.setShowStakingModal}
      showModal={props.showStakingModal}
    >
      <div className="stakingModalMain w-full h-full overflow-hidden rounded-2xl mb-10 ">
        <div className="stakingModalHeader flex items-end justify-between pt-5 px-5 sm:px-8 pb-4">
          <div>
            <p className="text-sm text-white font-semibold">
              {navHeadData.title}
            </p>
            <h1 className="text-white w-1/2 sm:w-auto sm:text-lg font-bold mt-2">
              New staking tier
            </h1>
          </div>
          <button
            onClick={() => {
              props.setShowStakingModal(false)
            }}
            className="text-white text-xs sm:text-sm font-bold"
          >
            Cancel
          </button>
        </div>
        <div className="stakingModalContent h-full overflow-auto px-5 sm:px-8 py-8 flex flex-col gap-y-10">
          <div>
            <h1 className="text-white text-md font-semibold">Tier name</h1>
            <input
              onChange={handleChange}
              name='tierName'
              type="text"
              placeholder="Paste contract address..."
              className=" mt-2 py-3 px-0 w-full text-xs text-white border-b border-0 border-zinc-700 stakingModalInput outline-0 shadow-none bg-transparent"
            />
          </div>
          <div>
            <h1 className="text-white text-md font-semibold">Tier summary</h1>
            <input
              onChange={handleChange}
              name='tierSummary'
              type="text"
              placeholder="Enter description..."
              className=" mt-2 py-3 px-0 w-full text-xs text-white border-b border-0 border-zinc-700 stakingModalInput outline-0 shadow-none bg-transparent"
            />
            <p className="text-zinc-500 text-xs text-right mt-1 font-semibold">
              0/180
            </p>
          </div>
          <div>
            <h1 className="text-white text-md font-semibold mb-2">Admin Approval</h1>
            <input
                  type="checkbox"
                  onChange={handleChange}
                  name='adminApproval'
                  className="w-4 h-4 p-2 border-2 bg-transparent rounded-md"
                />
                <label className="text-white text-sm ml-2">
                    Require projects in this tier to be approved by a space admin
                </label>
            
          </div>


          <div className="w-full flex flex-col sm:flex-row items-start gap-y-5 sm:gap-y-0 sm:gap-x-4">
            <div className="w-full sm:w-1/2">
              <h1 className="text-white text-md font-semibold">
                Required token
              </h1>
              <select onChange={handleSelect}
                name='requiredToken'
                className=" mt-2 py-3 px-4 w-full text-xs text-white border border-zinc-700 stakingModalInput outline-0 shadow-none select rounded-md">
                 {props.tokensData.map((token:any, index:number) => (
                  <option key={index} defaultValue={token.description} className="option">{token.description}</option>
                 ))}
              </select>
            </div>
            <div className="w-full sm:w-1/2 flex items-center gap-x-4">
              <div className="w-1/2 xl:w-2/5 2xl:w-1/3">
                <h1 className="text-white text-md font-semibold">
                  Required stake
                </h1>
                <input
                   onChange={handleChange}
                   name='requiredStake'
                  type="number"
                  placeholder="1"
                  className=" mt-2 py-3 px-4 w-full text-xs text-white border border-zinc-700 stakingModalInput outline-0 shadow-none bg-transparent rounded-md"
                />
              </div>
              <div className="w-1/2 xl:w-2/5 2xl:w-1/3">
                <h1 className="text-white text-md font-semibold">Token ID</h1>
                <input
                  onChange={handleChange}
                  name='tokenId'
                  type="text"
                  placeholder="N/A"
                  className=" mt-2 py-3 px-4 w-full text-xs text-white border border-zinc-700 stakingModalInput outline-0 shadow-none bg-transparent rounded-md"
                />
              </div>
            </div>
          </div>
          <div className="w-full sm:w-1/2">
            <h1 className="text-white text-md font-semibold">
              License to be granted
            </h1>
            <select onChange={handleSelect}
             
              name='licenseToBeGranted'
              className=" mt-2 py-3 px-4 w-full text-xs text-white border border-zinc-700 stakingModalInput outline-0 shadow-none select rounded-md">
              {props.licensesData.map((license:any, index:number) => (
                  <option key={index} defaultValue={license.licenseName} className="option">{license.licenseName}</option>
                 ))}
            </select>
          </div>
          <div className="w-full">
            <h1 className="text-white text-md font-semibold">
              Pre-requisites (optional)
            </h1>
            <p className="text-white text-xs">
              Select the project qualities that fall under this staking tier.
            </p>
            <div className="flex items-center gap-x-5 mt-5">
              <input
                 onChange={handleCheckbox1}
                 name='projectCategory'
                className="bg-transparent rounded-sm"
                type="checkbox"
                value={check1}
              />
              <label className="text-white text-xs font-semibold">
                Project category
              </label>
            </div>
            {check1 && (
              <Box sx={{ flexGrow: 1 }}>
                <form onSubmit={handleOnSubmit}>
                  <TextField
                    inputRef={tagRef}
                    fullWidth
                    variant="standard"
                    size="small"
                    sx={{
                      margin: '1rem 0',
                      borderRadius: '6px',
                      border: '1px solid #525252',
                      outline: 'none !important',
                      boxShadow: 'none !important',
                      input: {
                        outline: 'none !important',
                        boxShadow: 'none !important',
                        padding: '10px 8px',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '300',
                      },
                    }}
                    margin="none"
                    placeholder={tags.length < 1000 ? 'Enter category' : ''}
                    InputProps={{
                      startAdornment: (
                        <Box sx={{ margin: '0 0.2rem 0 0', display: 'flex' }}>
                          {tags.map((data, index) => {
                            return (
                              <Tags
                                data={data}
                                handleDelete={handleDelete}
                                key={index}
                              />
                            )
                          })}
                        </Box>
                      ),
                    }}
                  />
                </form>
              </Box>
            )}
            <div className="flex items-center gap-x-5 mt-5">
              <input
                onChange={handleCheckbox2}
                name='projectBudgetRange'
                className="bg-transparent rounded-sm"
                type="checkbox"
                value={check2}
              />
              <label className="text-white text-xs font-semibold">
                Project budget range
              </label>
            </div>
            {check2 && (
              <div className="flex items-end w-full gap-x-2 sm:gap-x-5 mt-5">
                <div className="flex flex-col gap-y-1">
                  <label className="text-white text-xs font-semibold">
                    Minimum
                  </label>
                  <input
                    onChange={handleChange}
                    name='projectBudjectMinimum'
                    type="number"
                    placeholder="0"
                    className=" mt-2 py-3 px-2 w-full sm:w-24 text-xs text-white border border-zinc-700 stakingModalInput outline-0 shadow-none bg-transparent rounded-md"
                  />
                </div>
                <div className="h-8">
                  <FontAwesomeIcon
                    icon={faMinus}
                    className="text-white text-xl -pt-5"
                  />
                </div>
                <div className="flex flex-col gap-y-1">
                  <label className="text-white text-xs font-semibold">
                    Maximum
                  </label>
                  <input
                    onChange={handleChange}
                    name='projectBudjectMaximum'
                    type="number"
                    placeholder="50,000"
                    className=" mt-2 py-3 px-2 w-full sm:w-24 text-xs text-white border border-zinc-700 stakingModalInput outline-0 shadow-none bg-transparent rounded-md"
                  />
                </div>
                <div>
                  <select onChange={handleSelect}
                    name='projectCurrencyType'
                    className=" mt-2 py-3 px-2 w-16 sm:w-20 text-xs text-white border border-zinc-700 stakingModalInput outline-0 shadow-none select rounded-md">
                    <option className="option">USD</option>
                    <option className="option">USD</option>
                    <option className="option">USD</option>
                    <option className="option">USD</option>
                    <option className="option">USD</option>
                  </select>
                </div>
              </div>
            )}
          </div>
          <div className="w-full">
            <h1 className="text-white text-md font-semibold">
              Royalty (optional)
            </h1>
            <p className="text-white text-xs">
              Configure the amount of revenue to be collected from projects in
              this tier.
            </p>
            <div className="flex items-center gap-x-2 mt-2">
              <input
                onChange={handleChange}
                name='royalty'
                type="number"
                placeholder="0"
                className=" mt-2 py-2 px-2 w-12 text-xs text-white border border-zinc-700 stakingModalInput outline-0 shadow-none bg-transparent rounded-md"
              />
              <span className="text-white text-sm">%</span>
            </div>
          </div>
          <div>
            <p className="text-gray-200 text-xs">
              Once this tier is created, token holders will be able to freely
              stake the tokens to acquire the <br className="hidden sm:block" />
              configured license.
            </p>
            <div className="flex items-center gap-x-5 mt-5">
              <button onClick={handleSubmitForm} type='button'
                className="text-white text-xs font-semibold py-2 px-4 rounded-full addStakingModalBtn"
              >
                Create staking tier
                { loading && (
                      <Loader />
                    )}
              </button>
              <button 
               onClick={() => {
                props.setShowStakingModal(false)
              }}
                 className="text-white text-xs font-semibold">
                Cancel
              </button>
            </div>
          </div>
        
        </div>
      </div>
    </BasicModal>
  )
}
