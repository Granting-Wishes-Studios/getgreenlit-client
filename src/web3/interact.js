import { Web3Auth } from "@web3auth/web3auth";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import Web3 from "web3";
import {createAndLoginUser} from '../networking/user'

const config = require('../config/config')[process.env.NODE_ENV || 'development'];

let web3auth;
const clientId = config.clientId;
 const init = async () => {
          try {   
             web3auth = new Web3Auth({
                // type uiConfig
               uiConfig: {
               appLogo: config.appLogo,
               theme: "dark",
               loginMethodsOrder: ["google", "facebook"],
               defaultLanguage: "en",
             },
               clientId,
               chainConfig: { // this is ethereum chain config, change if other chain(Solana, Polygon)
                   chainNamespace: CHAIN_NAMESPACES.EIP155,
                   chainId: config.chainId,
                   rpcTarget: config.rpcTarget,
               }
             });
    
            await web3auth.initModal();
            if (web3auth.provider) {
            };
          } catch (error) {
            console.error(error);
          }
        };
  init();

   export const connectWallet = async () => {
        if (!web3auth) {
            console.log("web3auth not initialized yet");
            return;
        }
        const provider = await web3auth.connect();
        // if provider is not null then user logged in successfully
        if(provider != null){
            console.log('User logged in successfully.');
         }
          const web3 = new Web3(provider);
          const userAccounts = await web3.eth.getAccounts();
          const user = await web3auth.getUserInfo();
          const address = userAccounts[0];
          user.address=address;
          return await createAndLoginUser(user).then(res => {           
            return res;
          })           
  }

  export const disconnnectWallet = async () => {   
    if (!web3auth) {
        console.log("web3auth not initialized yet");
        return;
      }
      try{
        await web3auth.logout();
      }catch(error){

      }
  }
