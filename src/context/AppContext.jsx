import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { getSessionCookie, unsetSessionCookie } from '../utils/session';
import { connectWallet, disconnnectWallet } from '../web3/interact';

const config = require('../config/config')[process.env.NODE_ENV || 'development'];
const BASE_URL = config.base_url;

export const AppContext = React.createContext();

export const AppProvider = ({children}) => {

const getAuthStatus = () => {
 const userObj = getSessionCookie();
   if(userObj){
      return userObj.status;
   }
   return false;
}

const getCurrentUserAuth = () =>{
  const userObj = getSessionCookie();
   if(userObj){
      return {
        userId: userObj.userId,
        sessionToken: userObj.userToken,
        address: userObj.address
      }
   }
   return {userId: null, username: null, sessionToken: null, isAdmin: null, address:null};
}
const userObj = getSessionCookie();

  const userid = userObj.userId;

const [isAuthenticated, setIsAuthenticated] = useState(getAuthStatus);
const [user, setUser] = useState(getCurrentUserAuth);
const [widget, setWidget] = useState([])
const[loadSpace, setLoadSpace] = useState(false);
const [isCreated, setisCreated] = useState(false)
const [navHeadData, setNavHeadData] = useState({title: '', img: '', id: '', banner: ''})

useEffect(() => {
  axios
      .get(`${BASE_URL}/api/spaces/get-members`, {params: {'userId': userid}})
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
    let res = {};
    try{
      await connectWallet().then(response => { 
        res = response;
        if(response.status){
          setIsAuthenticated(true);
          setUser(prevState => ({ ...prevState, 'userId': response.userId, 'sessionToken': response.sessionToken, 'address': response.address })); 
          setLoadSpace(true)
        } else{
          console.log('Error occured!')
        }  
        return res;     
    }); 
    }catch(err){
      setLoadSpace(false)
    }
    finally{
      setLoadSpace(false)
    }
      

}

const logout = async ()  => {
    try{
      await disconnnectWallet();
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