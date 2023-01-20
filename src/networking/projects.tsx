import axios from 'axios'
import   { axiosJWTInterceptor }   from '../utils/utils';

// TODO: use an environment variable to swap url out

const axiosJWT = axiosJWTInterceptor;

const config = require('../config/config')[process.env.NODE_ENV || 'development'];
const BASE_URL = config.base_url;

type Project = {
    id: string,
    address: string
    projectTitle: string,
    projectDescription: string,
    projectEmail: string,
    projectCategory: string,
    projectAnticipatedRelease: string,
    twitter: string,
    discord: string,
    bannerImg: string,
    featuredImg: string
    status: string,
    authored: string,
    statusNote: string,
    adminApproval: boolean,
    staked: boolean,
    signed: boolean,
    tier: string
}

const ProjectData = {
    id: "",
    address: "",
    projectTitle: "",
    projectDescription: "",
    projectEmail: "",
    projectCategory: "",
    projectAnticipatedRelease: "",
    twitter: "",
    discord: "",
    bannerImg: "",
    featuredImg: "",
    status: "",
    statusNote: "",
    adminApproval: false,
    staked: false,
    signed: false
}

type CreateProjectRequest = {
    projectTitle: string,
    projectDescription: string,
    projectEmail: string,
    projectCategory: string,
    projectAnticipatedRelease: string,
    twitter: string,
    discord: string,
    bannerImg: File,
    featuredImg: File
}


async function createProject (project: any, user: any, spaceId: string) {

    const formData = new FormData()
    formData.append('tid', project.tid);
    formData.append('projectTitle', project.projectTitle)
    formData.append('projectDescription', project.projectDescription)
    formData.append('projectEmail', project.projectEmail)
    formData.append('projectCategory', project.projectCategory)
    formData.append('projectAnticipatedRelease', project.projectAnticipatedRelease)
    formData.append('twitter', project.twitter)
    formData.append('discord', project.discord)
    formData.append('bannerImg', project.bannerImg, project.bannerImg.name)
    formData.append('featuredImg', project.featuredImg, project.featuredImg.name);
    formData.append('userId', user.userId);
    formData.append('address', user.address);
    formData.append('spaceId', spaceId);
    formData.append('adminApproval', project.adminApproval);
    


    // Display the values

    return new Promise((resolve) => {
        axiosJWT.post(`${BASE_URL}/api/projects/create`, formData, {headers: {"Content-Type": "multipart/form-data"}})
    .then(res => {
        resolve(res)
    }).catch(err => {
        console.log(err)
    })

   })
}

async function editProject (project: any) {

    const formData = new FormData()
    formData.append('pid', project.pid)
    formData.append('status', project.status)
    formData.append('projectTitle', project.projectTitle)
    formData.append('projectDescription', project.projectDescription)
    formData.append('projectEmail', project.projectEmail)
    if(project.status == 'released'){
        formData.append('projectRelease', project.projectRelease)
        formData.append('projectAction', project.projectAction)
        formData.append('projectActionLink', project.projectActionLink)
    }else{
        formData.append('projectCategory', project.projectCategory)
        formData.append('projectAnticipatedRelease', project.projectAnticipatedRelease)  
    }
    
    formData.append('twitter', project.twitter)
    formData.append('discord', project.discord)

    if(project.bannerImg){
        formData.append('bannerImg', project.bannerImg, project.bannerImg.name)
    }
    if(project.featuredImg){
        formData.append('featuredImg', project.featuredImg, project.featuredImg.name);
    } 
    
    formData.append('bannerUrl', project.bannerUrl);
    formData.append('featuredUrl', project.featuredUrl);
    
    // Display the values

    return new Promise((resolve) => {
        axiosJWT.post(`${BASE_URL}/api/projects/edit`, formData, {headers: {"Content-Type": "multipart/form-data"}})
    .then(res => {
        resolve(res)
    }).catch(err => {
        console.log(err)
    })

   })
}

async function getProjects(spaceId:string): Promise<Array<Project>> {
    return new Promise((resolve) => {
        axios.get(`${BASE_URL}/api/projects/`, { params: {spaceId: spaceId} }).then(res => {
            const projects: Project[] = []
    
            res.data.forEach((projectResponse: any) => {
                const project: Project = {
                    id: projectResponse.id,
                    address: projectResponse.address,
                    projectTitle: projectResponse.projectTitle,
                    projectDescription: projectResponse.projectDescription,
                    projectEmail: projectResponse.projectEmail,
                    projectCategory: projectResponse.projectCategory,
                    projectAnticipatedRelease: projectResponse.projectAnticipatedRelease,
                    twitter: projectResponse.twitter,
                    discord: projectResponse.discord,
                    bannerImg: projectResponse.bannerImg,
                    featuredImg: projectResponse.featuredImg,
                    status: projectResponse.status,
                    authored:  projectResponse.authored,
                    statusNote: projectResponse.statusNote,
                    adminApproval: projectResponse.adminApproval,
                    staked: projectResponse.staked,
                    signed: projectResponse.signed,
                    tier: projectResponse.tier,
                }
                projects.push(project)
            })
    
            resolve(projects)
        }).catch(err => {
            console.log(err)
            //throw Error("Failed to get space")
            return Promise.reject(err);
        })
    })
}

async function getProject(spaceId:string, projectId:string): Promise<any> {
    return new Promise((resolve) => {
        axios.get(`${BASE_URL}/api/projects/project`, { params: {spaceId: spaceId, projectId: projectId} }).then(res => {
            resolve(res.data)
        }).catch(err => {
            console.log(err)
            return Promise.reject(err);
        })
    })
}

async function isProjectAdmin(address: string, projectId: string): Promise<Boolean> {
    return new Promise((resolve) => {
        axios.get(`${BASE_URL}/api/projects/is-admin`, {params: {projectId: projectId, address: address}})
        .then((res) => {
            resolve(res.data.status) 
        })
        .catch((err) => {
            console.error('Error:', err);
        });
    })
}

async function setProjectStatus (project: any) {
    const formData = {
        'pid': project.pid, 
        'sid': project.sid,
        'status': project.status,
        'authored': project.authored,
        'statusNote': project.statusNote
    }
    return new Promise((resolve) => {
        axiosJWT.post(`${BASE_URL}/api/projects/set-project-status`, formData)
    .then((res) => {
        resolve(res.data.status)
    }).catch(err => {
        console.log(err)
    })
   })
}

export { createProject, editProject, getProjects, getProject, isProjectAdmin, setProjectStatus, ProjectData}
export type { CreateProjectRequest, Project }
