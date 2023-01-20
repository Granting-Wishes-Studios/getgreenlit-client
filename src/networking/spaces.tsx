import axios from 'axios'
import   { axiosJWTInterceptor }   from '../utils/utils';

// TODO: use an environment variable to swap url out

const config = require('../config/config')[process.env.NODE_ENV || 'development'];
const BASE_URL = config.base_url;

const axiosJWT = axiosJWTInterceptor;

type Space = {
    id: string,
    userId: string,
    title: string,
    legalCustodian: string,
    ipDescription: string,
    officialWebsite: string,
    twitter: string,
    discord: string,
    logoImgUrl: string,
    bannerImgUrl: string,
    featuredImgUrl: string,
    isMember: boolean,
    joining: boolean
}

type Member = {
    img: string,
    linkTo: string,
    linkTitle: string,
}

type CreateSpaceRequest = {
    title: string,
    legalCustodian: string,
    ipDescription: string,
    officialWebsite: string,
    twitter: string,
    discord: string,
    hideFromHomepage: boolean,
    resources: string,
    logoImg: File,
    bannerImg: File,
    featuredImg: File
}

type CreateSpaceRequest_ = {
    id: string,
    title: string,
    legalCustodian: string,
    ipDescription: string,
    officialWebsite: string,
    twitter: string,
    discord: string,
    hideFromHomepage: boolean,
    resources: string,
    logoImg: File,
    logoUrl: string,
    bannerImg: File,
    bannerUrl: string,
    featuredImg: File
    featuredUrl: string
}


async function createSpace (space: CreateSpaceRequest, user: any) {
    const formData = new FormData()
    formData.append('title', space.title)
    formData.append('legalCustodian', space.legalCustodian)
    formData.append('ipDescription', space.ipDescription)
    formData.append('officialWebsite', space.officialWebsite)
    formData.append('twitter', space.twitter)
    formData.append('discord', space.discord)
    formData.append('hideFromHomepage', '' + space.hideFromHomepage)
    formData.append('logoImg', space.logoImg, space.logoImg.name)
    formData.append('bannerImg', space.bannerImg, space.bannerImg.name)
    formData.append('featuredImg', space.featuredImg, space.featuredImg.name);
    formData.append('userId', user.userId!);
    formData.append('address', user.address!);

    // Display the values

    return new Promise((resolve) => {
        axiosJWT.post(`${BASE_URL}/api/spaces/create`, formData, {headers: {"Content-Type": "multipart/form-data"}})
    .then(res => {
        // TODO: what should I respond with? If anything...
        resolve(res)
    }).catch(err => {
        console.log(err)
        //throw Error("Failed to create space")
    })

   })
}

async function getSpaces(user: any): Promise<Array<Space>> {
    return new Promise((resolve) => {
        axios.get(`${BASE_URL}/api/spaces/`, { params: {userId: user.userId} }).then(res => {
            const spaces: Space[] = []
    
            res.data.forEach((spaceResponse: any) => {
                const space: Space = {
                    id: spaceResponse.id,
                    userId:spaceResponse.userId,
                    title: spaceResponse.title,
                    legalCustodian: spaceResponse.legalCustodian,
                    ipDescription: spaceResponse.ipDescription,
                    officialWebsite: spaceResponse.officialWebsite,
                    twitter: spaceResponse.twitter,
                    discord: spaceResponse.discord,
                    logoImgUrl: spaceResponse.logoImg,
                    bannerImgUrl: spaceResponse.bannerImg,
                    featuredImgUrl: spaceResponse.featuredImg,
                    isMember: (!spaceResponse.isMember) ? false : spaceResponse.isMember,
                    joining: false
                }
                spaces.push(space)
            })
    
            resolve(spaces)
        }).catch(err => {
            console.log(err)
            //throw Error("Failed to get space")
            return Promise.reject(err);
        })
    })
}
async function getSpace(spaceId: any): Promise<any> {
    return new Promise((resolve) => {
        axios.get(`${BASE_URL}/api/spaces/space`, { params: {spaceId: spaceId} }).then(res => {
            const space = 
                  {
                    id: res.data.id,
                    title: res.data.title,
                    legalCustodian: res.data.legalCustodian,
                    ipDescription: res.data.ipDescription,
                    officialWebsite: res.data.officialWebsite,
                    hideFromHomepage: res.data.hideFromHomepage,
                    twitter: res.data.twitter,
                    discord: res.data.discord,
                    logoImgUrl: res.data.logoImg,
                    bannerImgUrl: res.data.bannerImg,
                    featuredImgUrl: res.data.featuredImg,
                    resources: res.data.resources,
                    admins: res.data.roles,
                    tiers: res.data.tiers,
                    licenseIntro:res.data.licenseIntro 
                }
               resolve(space)
         }).catch(err => {
            console.log(err)
            //throw Error("Failed to get space")
            return Promise.reject(err);
        })
    })
}

async function updateSpace (space: CreateSpaceRequest_, admins: any, user: any) {
    const formData = new FormData()
    formData.append('spaceId', space.id);
    formData.append('title', space.title)
    formData.append('legalCustodian', space.legalCustodian)
    formData.append('ipDescription', space.ipDescription)
    formData.append('officialWebsite', space.officialWebsite)
    formData.append('twitter', space.twitter)
    formData.append('discord', space.discord)
    formData.append('admins', JSON.stringify(admins))
    formData.append('hideFromHomepage', '' + space.hideFromHomepage)
    if(space.logoImg){
        formData.append('logoImg', space.logoImg, space.logoImg.name)
    }
    if(space.bannerImg){
        formData.append('bannerImg', space.bannerImg, space.bannerImg.name)
    }
    if(space.featuredImg){
        formData.append('featuredImg', space.featuredImg, space.featuredImg.name);
    } 
    
    formData.append('logoUrl', space.logoUrl);
    formData.append('bannerUrl', space.bannerUrl);
    formData.append('featuredUrl', space.featuredUrl);
    formData.append('resources', space.resources);

    // Display the values

    return new Promise((resolve) => {
        axiosJWT.post(`${BASE_URL}/api/spaces/update`, formData, {headers: {"Content-Type": "multipart/form-data"}})
    .then(res => {
        // TODO: what should I respond with? If anything...
        resolve(res)
    }).catch(err => {
        console.log(err)
        //throw Error("Failed to create space")
    })

   })
}
 
async function joinOrLeaveSpace(spaceId:string,user:any, label:string): Promise<any>{
    return new Promise((resolve) => {
        if(label === 'join'){
            axiosJWT.get(`${BASE_URL}/api/spaces/${label}`, {params: {spaceId: spaceId, userId: user.userId}}).then(res => {         
                resolve(res.data);
          })     
        }else{
            axiosJWT.get(`${BASE_URL}/api/spaces/${label}`, {params: {spaceId: spaceId, userId: user.userId}}).then(res => {         
                resolve(res.data);
          })  
        }
     
    })    
}

async function getMembers(userid: any): Promise<Array<Member>> {
    return new Promise((resolve) => {
        axiosJWT.get(`${BASE_URL}/api/spaces/get-members`, {params: {userId: userid}}).then(res => {
            const members: Member[] = [] 
            res.data.forEach((item: any) => {
                const member: Member = {
                    img: item.img,
                    linkTo: item.linkTo,
                    linkTitle: item.linkTitle
                    
                }
                members.push(member)
            })
    
            resolve(members)
        }).catch(err => {
            console.log(err)
            //throw Error("Failed to get space")
            return Promise.reject(err);
        })
    })
}

async function isSpaceMember(userid: string, spaceId: string): Promise<Boolean> {
    return new Promise((resolve) => {
        axios.get(`${BASE_URL}/api/spaces/is-member`, {params: {spaceId: spaceId, userId: userid}})
        .then((res) => {
            resolve(res.data.status) 
        })
        .catch((err) => {
            console.error('Error:', err);
        });
    })
}

async function getRoles(spaceId: string, address: string) {
    return new Promise((resolve) => {
        axios.get(`${BASE_URL}/api/spaces/role`, {params: {'spaceId': spaceId, address: address}}).then(res => {
            return resolve(res)
        })
       
    })
}

async function isSpaceAdmin(address: string, spaceId: string): Promise<Boolean> {
    return new Promise((resolve) => {
        axios.get(`${BASE_URL}/api/spaces/is-admin`, {params: {spaceId: spaceId, address: address}})
        .then((res) => {
            resolve(res.data.status) 
        })
        .catch((err) => {
            console.error('Error:', err);
        });
    })
}

const removeAdminRole = async (roleId:string) => {
    return new Promise((resolve) => {
        axiosJWT.get(`${BASE_URL}/api/spaces/remove-role`, {params: {roleId: roleId}}).then(res => { 
            resolve(res.data.status)
       }).catch(err => {
           console.log(err)
           //throw Error("Failed to get space")
           return Promise.reject(err);
       })
   })
}

const getSpaceIntro = async (spaceId:string) => {
    return new Promise((resolve) => {
        axiosJWT.get(`${BASE_URL}/api/spaces/get-intro`, {params: {spaceId: spaceId}}).then(res => { 
            resolve(res.data.ipDescription)
       }).catch(err => {
           console.log(err)
           //throw Error("Failed to get space")
           return Promise.reject(err);
       })
   })
}

export { createSpace, getSpaces, getSpace, joinOrLeaveSpace, getMembers, isSpaceMember, isSpaceAdmin, updateSpace, removeAdminRole, getSpaceIntro, getRoles }
export type { CreateSpaceRequest, CreateSpaceRequest_, Space }
