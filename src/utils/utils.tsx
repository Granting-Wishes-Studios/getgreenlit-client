import { setSessionCookie, getSessionCookie } from '../utils/session';
import axios from 'axios'
import { refreshToken } from '../networking/user';


const axiosJWTInterceptor = axios.create();

axiosJWTInterceptor.interceptors.request.use(async (config:any) => {
const {tokenDecoded, tokenNonDecoded} = getSessionCookie();   
 axios.defaults.headers.common['authorization'] = `Bearer ${tokenNonDecoded.accessToken}`;  
 let currentDate = new Date();
 if(tokenNonDecoded.accessToken){
     if(tokenDecoded.exp * 1000 < currentDate.getTime())  {
       const data = await refreshToken(tokenNonDecoded.refreshToken);
       if(data !== undefined){
         setSessionCookie(data);
       }
       config.headers['authorization'] = "Bearer "+ data.accessToken
     }else{
        config.headers['authorization'] = "Bearer "+ tokenNonDecoded.accessToken
     }
 }
 return config
 
}, (error) => {
   return Promise.reject(error);
})

const getDotETH = (address:string) => {
  return address !== null ? address.substring(0, 6)+'...'+address.substring((address.length - 4)) : ''
}

export  { axiosJWTInterceptor, getDotETH }