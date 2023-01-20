import React, { useState, useContext, useEffect } from 'react'
import { CreateSpaceRequest_, getSpace, updateSpace, removeAdminRole } from '../../../../networking/spaces'
import { useNavigate } from 'react-router-dom'
import './SpaceSettingForm.css'
import {  FaTrash } from 'react-icons/fa';
import { AppContext } from './../../../../context/AppContext'
import { notify } from './../../../Inc/Toastr';
import { Loader } from '../../../SubComponents/Loader';



export const SpaceSettingForm = () => {


  const [logo, setLogo] = useState<null | any>(null)
  const [bannerImg, setBannerImg] = useState<null | any>(null)
  const [featuredImg, setFeaturedImg] = useState<null | any>(null)

  const [spaceTitle] = useState<any>('')

  const { user, setisCreated, setNavHeadData, setWidget} = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  



  const [adminFormValues, setAdminFormValues] = useState([{address: '', creator: '', id: ''}]);
  
  let navigate = useNavigate()

  type FormValues = {
    id: string,
    title: string,
    legalCustodian: string,
    ipDescription: string,
    officialWebsite: string,
    twitter: string,
    discord: string,
    hideFromHomepage: boolean,
    resources: string,
    logoImg: File | null,
    logoUrl: string,
    bannerImg: File | null,
    bannerUrl: string,
    featuredImg: File | null,
    featuredUrl: string,
  }

  const [values, setValues] = useState<FormValues>(
    {
    id: '',
    title: '',
    legalCustodian: '',
    ipDescription: '',
    officialWebsite: '',
    twitter: '',
    discord: '',
    hideFromHomepage: false,
    resources: '',
    logoImg: null,
    logoUrl: '',
    bannerImg: null,
    bannerUrl: '',
    featuredImg: null,
    featuredUrl: ''
  })

  const getSpaceById = async (spaceId:string) => {
    await getSpace(spaceId).then(res => {
     const spaceObj = {
        id: res.id,
        title: res.title,
        legalCustodian: res.legalCustodian,
        ipDescription: res.ipDescription,
        officialWebsite: res.officialWebsite,
        hideFromHomepage: res.hideFromHomepage,
        twitter: res.twitter,
        discord: res.discord,
        logoImg: null,
        logoUrl: res.logoImgUrl,
        bannerImg: null,
        bannerUrl: res.bannerImgUrl,
        featuredImg: null,
        featuredUrl: res.featuredImgUrl,
        resources: res.resources,
      }
      setAdminFormValues(res.admins);
       setLogo(spaceObj.logoUrl);
       setBannerImg(spaceObj.bannerUrl);
       setFeaturedImg(spaceObj.featuredUrl);
       setValues(spaceObj);
       setNavHeadData({title: spaceObj.title, img:spaceObj.logoUrl, id:spaceObj.id, banner: spaceObj.bannerUrl, website:spaceObj.officialWebsite, twitter: spaceObj.twitter, discord: spaceObj.discord })
    })
}

const pathArray = window.location.pathname.split('/');
useEffect(() => { 
  getSpaceById(pathArray[3]);
}, [])


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


  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>, imgType:string) => {  
    const target = event.target;
    let value
    if(target.files instanceof FileList){
      value = target.files[0]  
     if(imgType == "logo"){
      setLogo(URL.createObjectURL(value))
     }
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
    const request: CreateSpaceRequest_ = {
      id:values.id,
      title: values.title,
      legalCustodian: values.legalCustodian,
      ipDescription: values.ipDescription,
      officialWebsite: values.officialWebsite,
      twitter: values.twitter,
      discord: values.discord,
      hideFromHomepage: values.hideFromHomepage,
      logoImg: values.logoImg!,
      logoUrl: values.logoUrl,
      bannerImg: values.bannerImg!,
      bannerUrl: values.bannerUrl,
      featuredImg: values.featuredImg!,
      featuredUrl: values.featuredUrl,
      resources: values.resources,
    }

    try{
      await updateSpace(request, adminFormValues, user).then((data:any) => {
        if(data.data.status){

          notify("Space updated!", "success", 6000);          
          setWidget((prev:any) => [...prev].map(obj => (obj.linkTo === data.data.id) ? Object.assign(obj, { linkTo:data.data.id, linkTitle: data.data.title, img: data.data.logoImg }) : obj))
          setNavHeadData({title: data.data.title, img: data.data.logoImg, id: data.data.id, banner: data.data.bannerImg, website: data.data.officialWebsite, twitter: data.data.twitter, discord: data.data.discord});
          navigate(`/space/projects/${data.data.id}`)
          setLoading(false)
          setisCreated(true);
        }   
     })
    }catch(err:any){
      setLoading(false)
      notify(err.message, "error", 6000);
      setisCreated(false);
    }
 
}

const handleAdminChange = (i:number, e: React.ChangeEvent<HTMLInputElement>) => {
   adminFormValues[i].address = e.target.value;
   setAdminFormValues(adminFormValues);
}

const handleAddInput = () => {
  setAdminFormValues((prev =>  [...prev, { address: "", creator: '', id: '' }]))
}



const removeFormFields = async (i:number, roleId:string|null) => {
  if(roleId){
    await removeAdminRole(roleId).then(res => {
      if(res){
        let adminFormVals = [...adminFormValues];
        adminFormVals.splice(i, 1);
        setAdminFormValues(adminFormVals)
      }
    })
  }else{
    let adminFormVals = [...adminFormValues];
        adminFormVals.splice(i, 1);
        setAdminFormValues(adminFormVals)
  }
}



  return (
    <div>
       <form onSubmit={(e) => handleSubmit(e)}>
      <div className="SpaceSettingFormMain w-full sm:w-3/4 h-full mb-10">
        <div className="SpaceSettingFormContent h-full overflow-auto px-5 sm:px-8 py-8 flex flex-col gap-y-20">
          <div className="flex flex-col gap-y-10">
            <h1 className="text-white text-2xl font-bold">IP details </h1>
            <div className="flex flex-col gap-y-1">
              <label className="text-white text-lg font-bold">Title</label>
              <input defaultValue={values.title}
                type="text"
                name='title'
                onChange={handleChange}
                placeholder="IP title..."
                className="spaceSettingFormTypeInput text-white bg-transparent text-sm px-0 shadow-none outlin-none"
              />
            </div>
            <div className="flex flex-col gap-y-1">
              <label className="text-white text-lg font-bold">
                Legal custodian of this IP
              </label>
              <input defaultValue={values.legalCustodian}
                type="text"
                name='legalCustodian'
                onChange={handleChange}
                placeholder="Enter name..."
                className="spaceSettingFormTypeInput text-white bg-transparent text-sm px-0 shadow-none outlin-none"
              />
            </div>
            <div className="flex flex-col gap-y-1">
              <label className="text-white text-lg font-bold">
                IP Description
              </label>
              <textarea
                name='ipDescription'
                onChange={handleChange}
                placeholder="Enter description..."
                rows={3}
                value={values.ipDescription}
                className="text-white bg-transparent text-sm px-2 shadow-none outlin-none"
              ></textarea>
            </div>
            <div className="flex flex-col gap-y-5">
              <label className="text-white text-lg font-bold">Links</label>
              <div className="flex flex-col sm:flex-row gap-y-4 sm:gap-y-0 sm:items-center sm:gap-x-5">
                <label className="text-white text-sm sm:w-32">
                  Official website
                </label>
                <input defaultValue={values.officialWebsite}
                  type="text"
                  name='officialWebsite'
                  onChange={handleChange}
                  placeholder="Website URL..."
                  className="spaceSettingFormTypeInput text-white w-full sm:w-3/5 bg-transparent text-sm px-0 shadow-none outlin-none"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-y-4 sm:gap-y-0 sm:items-center sm:gap-x-5">
                <label className="text-white text-sm sm:w-32">Twitter</label>
                <input defaultValue={values.twitter}
                  type="text"
                  name='twitter'
                  onChange={handleChange}
                  placeholder="Twitter URL..."
                  className="spaceSettingFormTypeInput text-white w-full sm:w-3/5 bg-transparent text-sm px-0 shadow-none outlin-none"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-y-4 sm:gap-y-0 sm:items-center sm:gap-x-5">
                <label className="text-white text-sm sm:w-32">Discord</label>
                <input defaultValue={values.discord}
                  type="text"
                  name='discord'
                  onChange={handleChange}
                  placeholder="Discord URL..."
                  className="spaceSettingFormTypeInput text-white w-full sm:w-3/5 bg-transparent text-sm px-0 shadow-none outlin-none"
                />
              </div>
            </div>
            <div className="flex items-center gap-x-3">
              <input
                type="checkbox" checked={values.hideFromHomepage?true:false}
                name='hideFromHomepage'
                onChange={handleChange}
                className="w-4 h-4 p-2 border-2 bg-transparent rounded-md"
              />
              <label className="text-white text-sm">
                Hide this space from the Greenlit homepage
              </label>
            </div>
          </div>
          <div className="flex flex-col gap-y-10">
            <h1 className="text-white text-2xl font-bold">Branding</h1>

            <div className="flex flex-col gap-y-1">
              <label className="text-white text-lg font-bold">Logo</label>
              <span className="text-xs text-white">
                This will display on Greenlit navigation. 800 x 800 recommended.
              </span>
              {logo ? (
                <div>
                  <img
                    src={logo}
                    alt="logo"
                    className="spaceSettingFormFileInput mt-4 w-14 sm:w-20 object-cover"
                  />
                  <div className="flex items-center gap-x-2 mt-2">
                    <span className="text-white text-sm underline">
                    {values?.logoImg?.name}
                    </span>
                    <div className="border-r-2 border-white h-3 mt-1"></div>
                    <button
                      onClick={() => {
                        setLogo(null)
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
                    onChange={(e) => handleImageChange(e, 'logo')} 
                    type="file"
                    name='logoImg'
                    className="hidden"
                  />
                  <span className="text-white text-md">
                    Drag & drop or <u>upload</u>
                  </span>
                </label>
              )}
            </div>

            <div className="flex flex-col gap-y-1">
              <label className="text-white text-lg font-bold">
                Banner Image
              </label>
              <span className="text-xs text-white">
                This will be the header image for your space. 1200 x 800
                recommended.
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

            <div className="flex flex-col gap-y-1">
              <label className="text-white text-lg font-bold">
                Featured Image
              </label>
              <span className="text-xs text-white">
                This will display on the Greenlit spaces directory and as the
                default image on user projects. 1920 x 1080 recommended.
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
          </div>
          <div className="flex flex-col gap-y-4">
            <h1 className="text-white text-2xl font-bold">Admins</h1>
            <span className="text-white text-sm">
              Set the Ethereum addresses that can administrate the content &
              projects under this space.
            </span>
            {adminFormValues.map((element, index:number) => (
            <div className="flex flex-row" key={index}>
              <input
              type="text"
              readOnly={element.creator == 'owner' ? true: false}
              defaultValue={element.address}
              onChange={e => handleAdminChange(index, e)}
              name={`admins${index}`}
              required={true}
              placeholder="Address e.g (0xEe7672722c2de2125E1b4D866c04B893AC8F7D22)"
              className="border border-gray-400 rounded-md text-white w-full bg-transparent text-sm px-4 py-3"
            />
             {
                element.creator !== 'owner' ? 
              <button onClick={() => removeFormFields(index, element.id)} type='button' className="font-bold text-sm text-white button p-2 cursor-pointer">
              <FaTrash />
              </button>
              : null
             }             
            </div>
            ))}
            <div className="flex justify-start">
              <button onClick={handleAddInput} type='button' className="font-bold text-sm text-white">
                + Add an admin
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-y-4">
            <h1 className="text-white text-2xl font-bold">Resources</h1>
            <span className="text-white text-sm">
              Use this open text box to add resources for users to learn more
              about your space’s IP.
            </span>
            <textarea
              onChange={handleChange}
              name='resources'
              placeholder="Enter text..."
              rows={3}
              value={values.resources?values.resources:''}
              className="border border-gray-400 rounded-md text-white w-full bg-transparent text-sm px-2 py-3"
            ></textarea>
          </div>
        </div>
        <div className="flex justify-start p-10">
          <button
            onClick={() =>
              spaceTitle ? navigate(`/all-projects/${spaceTitle}`) : null
            }
            className="text-white text-sm font-semibold rounded-full px-8 py-2 createSpaceFormBtn"
          >
            Save Space Setting
            { loading && (
                 <Loader />
              )}
          </button>
        </div>
      </div>
      </form>
    </div>
  )
}
