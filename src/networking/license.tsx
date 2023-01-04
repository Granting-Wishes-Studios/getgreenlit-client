import axios from 'axios'

// TODO: use an environment variable to swap url out

const config = require('../config/config')[process.env.NODE_ENV || 'development'];
const BASE_URL = config.base_url;

type Token = {
    id: string,
    spaceId: string,
    tokenName: string,
    network: string,
    contractAddress: string,
    description: string,
}

type TokenData = {
    id: string,
    spaceId: string,
    network: string,
    contractAddress: string,
    description: string,
}


type StakingTier = {
    id:string,
    tierName: string,
    tierSummary: string,
    requiredToken: string,
    requiredStake: string,
    tokenId: string,
    licenseToBeGranted: string,
    projectCategory: string,
    projectBudgetRange: string,
    royalty: string,
    status:boolean,
    adminApproval: string
}



type License = {
    id: string,
    spaceId: string,
    licenseName: string,
    licenseSummary: string,
    licenseFile: string,
    licenseFileName: string,
}

type FormTokenRequest = {
    tokenName: string,
    network: string,
    contractAddress: string,
    description: string,
}

type FormLicenseRequest = {
    licenseName: string,
    licenseSummary: string,
    licenseFile: File,
    licenseFileName: String | null,
}

type FormLicenseIntroRequest = {
    licenseIntro: string,
}

type FormStakingTierRequest = {
    tierName: string,
    tierSummary: string,
    requiredToken: string,
    requiredStake: string,
    tokenId: string,
    licenseToBeGranted: string,
    projectCategory: string,
    projectBudgetRange: string,
    royalty: string,
    status:boolean;
    adminApproval: string
}



async function addToken (token: FormTokenRequest, spaceId:string) {
    const formData = new FormData()
    formData.append('spaceId', spaceId);
    formData.append('tokenName', token.tokenName);
    formData.append('network', token.network)
    formData.append('contractAddress', token.contractAddress)
    formData.append('description', token.description)

    // Display the values

    return new Promise((resolve) => {
      axios.post(`${BASE_URL}/api/license/add-token`, formData)
    .then(res => {
        // TODO: what should I respond with? If anything...
        resolve(res)
    }).catch(err => {
        console.log(err)
        //throw Error("Failed to create space")
    })

   })
}

async function getTokensAndLicenses(spaceId: string): Promise<Array<any>> {
    let licenseAndTokenData:any = [];
    return new Promise((resolve) => {
        axios.get(`${BASE_URL}/api/license/get-tokens-licenses`, { params: {spaceId: spaceId} }).then(res => {
            const tokens: Token[] = []
            const licenses: License[] = []
            res.data.tokens.forEach((tokenResonse: any) => {
                const token: Token = {
                    id: tokenResonse.id,
                    spaceId: tokenResonse.spaceId,
                    tokenName: tokenResonse.tokenName,
                    network:tokenResonse.network,
                    contractAddress: tokenResonse.tokenContractAddress,
                    description: tokenResonse.tokenDescription
                  
                }
                tokens.push(token)
            })
            res.data.licenses.forEach((licenseResonse: any) => {
                const license: License = {
                    id: licenseResonse.id,
                    spaceId: licenseResonse.spaceId,
                    licenseName:licenseResonse.licenseName,
                    licenseSummary: licenseResonse.licenseSummary,
                    licenseFile: licenseResonse.licenseFile,
                    licenseFileName: licenseResonse.licenseFileName
                  
                }
                licenses.push(license)
            })  

            const licenseIntro = res.data.licenseIntro         
           
            licenseAndTokenData.push(tokens)
            licenseAndTokenData.push(licenses)
            licenseAndTokenData.push(licenseIntro)
            
    
            resolve(licenseAndTokenData)
        }).catch(err => {
            console.log(err)
            //throw Error("Failed to get space")
            return Promise.reject(err);
        })
    })
}

async function addLicense (license: FormLicenseRequest, spaceId:string) {
    const formData = new FormData()
    formData.append('spaceId', spaceId);
    formData.append('licenseName', license.licenseName)
    formData.append('licenseSummary', license.licenseSummary)
    formData.append('licenseFile', license.licenseFile, license.licenseFile.name)
    formData.append('licenseFileName', license.licenseFile.name)

    // Display the values

    return new Promise((resolve) => {
      axios.post(`${BASE_URL}/api/license/add-license`, formData, {headers: {"Content-Type": "multipart/form-data"}})
    .then(res => {
        // TODO: what should I respond with? If anything...
        resolve(res)
    }).catch(err => {
        console.log(err)
        //throw Error("Failed to create space")
    })

   })
}

async function addLicenseIntro (licenseIntro: FormLicenseIntroRequest, spaceId:string) {
    const formData = new FormData()
    formData.append('spaceId', spaceId);
    formData.append('licenseIntro', licenseIntro.licenseIntro)

    // Display the values

    return new Promise((resolve) => {
      axios.post(`${BASE_URL}/api/license/add-license-info`, formData)
    .then(res => {
        // TODO: what should I respond with? If anything...
        resolve(res)
    }).catch(err => {
        console.log(err)
        //throw Error("Failed to create space")
    })

   })
}


async function addStakingTier (stakingTier: FormStakingTierRequest, spaceId:string) {
    const formData = new FormData()
    formData.append('spaceId', spaceId);
    formData.append('tierName', stakingTier.tierName)
    formData.append('tierSummary', stakingTier.tierSummary)
    formData.append('requiredToken', stakingTier.requiredToken)
    formData.append('requiredStake', stakingTier.requiredStake)
    formData.append('tokenId', stakingTier.tokenId)
    formData.append('licenseToBeGranted', stakingTier.licenseToBeGranted)
    formData.append('projectCategory', stakingTier.projectCategory)
    formData.append('projectBudgetRange', stakingTier.projectBudgetRange)
    formData.append('royalty', stakingTier.royalty)
    formData.append('adminApproval', stakingTier.adminApproval)
    
    // Display the values

    return new Promise((resolve) => {
      axios.post(`${BASE_URL}/api/license/add-staking-tier`, formData)
    .then(res => {
        // TODO: what should I respond with? If anything...
        resolve(res)
    }).catch(err => {
        console.log(err)
        //throw Error("Failed to create space")
    })

   })
}
async function getStakingTier(spaceId: string): Promise<Array<StakingTier>> {
    return new Promise((resolve) => {
        axios.get(`${BASE_URL}/api/license/get-staking-tier`, { params: {spaceId: spaceId} }).then(res => {
            const stakingTiers: StakingTier[] = []
            res.data.forEach((stakingTierResponse: any) => {
                const stakingTier: StakingTier = {
                    id: stakingTierResponse.id,
                    tierName: stakingTierResponse.tierName,
                    tierSummary: stakingTierResponse.tierSummary,
                    requiredToken: stakingTierResponse.requiredToken,
                    requiredStake: stakingTierResponse.requiredStake,
                    tokenId: stakingTierResponse.tokenId,
                    licenseToBeGranted: stakingTierResponse.licenseToBeGranted,
                    projectCategory: stakingTierResponse.projectCategory,
                    projectBudgetRange: stakingTierResponse.projectBudgetRange,
                    royalty: stakingTierResponse.royalty,
                    status: stakingTierResponse.status,
                    adminApproval: stakingTierResponse.adminApproval
                }
                stakingTiers.push(stakingTier)
            })   
            resolve(stakingTiers)
        }).catch(err => {
            console.log(err)
            //throw Error("Failed to get space")
            return Promise.reject(err);
        })
    })
}

async function setStakingTierStatus (id: string, spaceId: string, status: boolean) {
  return new Promise((resolve) => {
      axios.put(`${BASE_URL}/api/license/set-staking-tier-status`, { params: {id: id, spaceId: spaceId, status: status} })
    .then(res => {
        resolve(res)
    }).catch(err => {
        console.log(err)
        //throw Error("Failed to create space")
    })

   })
}

async function hasProjectApproval(sid: string): Promise<Boolean> {
    return new Promise((resolve) => {
        axios.get(`${BASE_URL}/api/license/has-project-approval`, {params: {id: sid}})
        .then((res) => {
            resolve(res.data.status) 
        })
        .catch((err) => {
            console.error('Error:', err);
        });
    })
}

async function signALincense (license: any) {
    const formData = {
        'pid': license.pid, 
        'address': license.address,
        'signee': license.signee,
        'sign': license.sign,
        'licenseFile': license.licenseFile
    }
    return new Promise((resolve) => {
      axios.post(`${BASE_URL}/api/license/sign-license`, formData)
    .then((res) => {
        resolve(res.data.status)
    }).catch(err => {
        console.log(err)
    })
   })
}


async function stakeTokens (token: any) {
    const formData = {
        'pid': token.pid, 
        'address': token.address,
        'tokens': JSON.stringify(token.tokens),
    }
    return new Promise((resolve) => {
      axios.post(`${BASE_URL}/api/license/stake-tokens`, formData)
    .then((res) => {
        resolve(res.data.status)
    }).catch(err => {
        console.log(err)
    })
   })
}


async function unStakeTokens (token: any) {
    const formData = {
        'pid': token.pid, 
    }
    return new Promise((resolve) => {
      axios.post(`${BASE_URL}/api/license/unstake-tokens`, formData)
    .then((res) => {
        resolve(res.data.status)
    }).catch(err => {
        console.log(err)
    })
   })
}



export { addToken, getTokensAndLicenses, addLicense, addLicenseIntro, addStakingTier, getStakingTier, hasProjectApproval, setStakingTierStatus, stakeTokens, unStakeTokens, signALincense }
export type { FormTokenRequest, FormLicenseRequest, FormLicenseIntroRequest, FormStakingTierRequest, Token, TokenData }
