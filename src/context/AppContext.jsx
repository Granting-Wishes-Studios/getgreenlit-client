import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { setSessionCookie, getSessionCookie, unsetSessionCookie } from '../utils/session';
import   { getDotETH }   from '../utils/utils';
import { connectWallet, disconnnectWallet } from '../web3/interact';
import { deleteUserAccessToken } from '../networking/user';

import jwt_decode from 'jwt-decode';

const config = require('../config/config')[process.env.NODE_ENV || 'development'];
const BASE_URL = config.base_url;

export const AppContext = React.createContext();

export const AppProvider = ({children}) => {

const getAuthStatus = () => {
 const {tokenDecoded} = getSessionCookie();
   if(tokenDecoded){
      return tokenDecoded.status
   }
   return false;
}

const getCurrentUserAuth = () =>{
  const { tokenNonDecoded } = getSessionCookie();
   if(tokenNonDecoded){
      const decodedToken = jwt_decode(tokenNonDecoded.accessToken);
      return {
        userId: decodedToken.userId,
        name: decodedToken.name,
        address: decodedToken.address,
        email: decodedToken.email,
        profileImage: decodedToken.profileImage,
        accessToken: tokenNonDecoded.accessToken,
        refreshToken: tokenNonDecoded.refreshToken
      }
   }
   return {address: null, userId: null, name: null, email: null, profileImage: null};
}


const [isAuthenticated, setIsAuthenticated] = useState(getAuthStatus);
const [user, setUser] = useState(getCurrentUserAuth);
const [widget, setWidget] = useState([])
const[loadSpace, setLoadSpace] = useState(false);
const[res, setRes] = useState({});
const [isCreated, setisCreated] = useState(false)
const [navHeadData, setNavHeadData] = useState({title: '', img: '', id: '', banner: ''})

const {tokenNonDecoded} = getSessionCookie();
let userInfo = user;
if(!tokenNonDecoded){ 
   console.log('You are not logged in');
}else{
   userInfo  = jwt_decode(tokenNonDecoded.accessToken)
}

useEffect(() => {
  axios
      .get(`${BASE_URL}/api/spaces/get-members`, {params: {'userId': userInfo.userId}})
      .then((res) => {
          const members = []; 
          res.data.forEach(item => {
              const member = {
                  img: item.img,
                  linkTo: item.linkTo,
                  linkTitle: item.linkTitle                 
              }
              members.push(member)
          })
          setWidget(members);
      })
      .catch((err) => {
          console.error('Error:', err);
      });
}, [isAuthenticated]);


const authenticate = async () => { 
      await connectWallet().then(response => { 
        if(response.status){
          setRes(response.data)
          setIsAuthenticated(true);
          const decodedToken = jwt_decode(response.data.accessToken);
          setUser({
            userId: decodedToken.userId,
            name: decodedToken.name,
            address: decodedToken.address,
            email: decodedToken.email,
            profileImage: decodedToken.profileImage,
            dotETH: getDotETH(decodedToken.address),
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken
          }); 
          setLoadSpace(true)
          if(response.data !== undefined){
            setSessionCookie(response.data);
          }
        } else{
          console.log('Error occured!')
        }  
            return response.data;
    });   
    if(isAuthenticated){
      return user;  
    }
    
}
const logout = async ()  => {
    try{
      const {tokenNonDecoded} = getSessionCookie();
      await disconnnectWallet();
      await deleteUserAccessToken(tokenNonDecoded.refreshToken);
      setIsAuthenticated(false); 
      unsetSessionCookie();
      setLoadSpace(false)
      setUser({})
      setWidget([{}])
    }catch(err){
      setIsAuthenticated(false); 
      unsetSessionCookie();
    }
    
}

  return (
    <AppContext.Provider value={{user, authenticate, isAuthenticated, logout, widget, setWidget, loadSpace, isCreated, setisCreated, navHeadData, setNavHeadData}}>
        {children}
    </AppContext.Provider>
  )
}

