
/*
import Web3Modal from "web3modal";
import { ethers, utils } from "ethers";
import WalletConnect from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";

*/
/*
const providerOptions = {
    coinbasewallet: {
        package: CoinbaseWalletSDK,
        options: {
            appName: "Web 3 Modal Demo",
            infuraId: "ea4e9dbe0feb463da320e8bd8056f82f"
        }
    },
    walletconnect: {
        package: WalletConnect,
        options: {
            infuraId: "ea4e9dbe0feb463da320e8bd8056f82f"
        }
    }
}

const web3Modal = new Web3Modal({
    network: "rinkeby",
    cacheProvider: false, // optional
    providerOptions
})
*/

/*
export const connectWallet = async () => {
    const provider = await web3Modal.connect();
    await switchNetwork(provider)
    const library = new ethers.providers.Web3Provider(provider);
    const accounts = await library.listAccounts();
    if (accounts) {
        return {
            address: accounts[0],
            status: true
        }
    } else {
        return {
            address: "",
            status: false
        }
    }
}

*/
/*
export const disconnnectWallet = async () => {
    web3Modal.clearCachedProvider();
}

const switchNetwork = async (inst) => {
    try {
        
        await inst.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: utils.hexValue(4) }],
        });
    } catch (switchError) {
        console.log(switchError)
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
            try {
                await inst.request({
                    method: "wallet_addEthereumChain",
                    params: [
                        {
                            chainId: utils.hexValue(4),
                            chainName: "Rinkeby Test Network",
                            rpcUrls: ["https://rinkeby.infura.io/v3/"],
                            blockExplorerUrls: ["https://rinkeby.etherscan.io"],
                            nativeCurrency: {
                                name: "ETH",
                                Symbol: "ETH",
                                decimals: 18
                            }
                        },
                    ],
                });
            } catch (addError) {
                console.log(addError)
            }
        }
    }
};

*/
import { Web3Auth } from "@web3auth/web3auth";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import Web3 from "web3";
import axios from 'axios';
import { setSessionCookie } from '../utils/session';

const config = require('../config/config')[process.env.NODE_ENV || 'development'];

const BASE_URL = config.base_url;

let web3auth;
const clientId = "BD1suR9-6AQR3hP94uyf5_lx5TfGhqJkJ8yWmzA-V3Mq889yk1WJu5P42yJPUFmBlTK35DIR6WSwiRv3wks3kfY";
 const init = async () => {
          try {   
             web3auth = new Web3Auth({
                // type uiConfig
             uiConfig: {
               appLogo: "https://gateway.pinata.cloud/ipfs/QmeSvMxM4yxg1eRSXdoVsZkwZiV8JpubHGBZMQR7uY42Vc",
               theme: "dark",
               loginMethodsOrder: ["google", "facebook"],
               defaultLanguage: "en",
             },
               clientId,
               chainConfig: { // this is ethereum chain config, change if other chain(Solana, Polygon)
                   chainNamespace: CHAIN_NAMESPACES.EIP155,
                   chainId: "0x1",
                   rpcTarget: "https://mainnet.infura.io/v3/f70263df28824a0792342c248d494fbb",
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
  


  const createUser = async (address, email, name, profileImage) => {
    const formData = new FormData();
    formData.append('address', address);
    formData.append('email', email);
    formData.append('name', name);
    formData.append('profileImage', profileImage);
  return await axios.post(`${BASE_URL}/api/users/create`, formData);
}

  const getUser = async (address) => {
    return await axios.get(`${BASE_URL}/api/users/get-user`, { params: { address: address }} );
  }


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
          let user = {};
          let createdUser = {};
          user = await web3auth.getUserInfo();
          const address = userAccounts[0];
          if(userAccounts[0]){
            if(Object.keys(user).length === 0){ // connecting with web1 or web2
                user = {
                    email:'',
                    profileImage:'',
                    name:''
                }  
            }

               const rst = await getUser(address);
                if(!rst.data.status)  {
                    // create a user profile with details from social login. Note that user wont be present for web3 login via wallect
                  await  createUser(address, user.email, user.name, user.profileImage).then(rs => {
                        createdUser = {
                             userId: rs.data.userId,
                             status: rs.data.status,
                             address: rs.data.address,
                             sessionToken: rs.data.userToken,
                             profileImage: rs.data.profileImage
                        }
                     setSessionCookie(createdUser);
                     createdUser = {...createdUser, email: rs.data.email, name: rs.data.name, profileImage: rs.data.profileImage}
                   })
                } else{ 
                    createdUser = {
                    userId: rst.data.id,
                    sessionToken: rst.data.userToken,
                    status: true,
                    address: rst.data.address,
                    profileImage: rst.data.profileImage
               }
                setSessionCookie(createdUser);
                createdUser = {...createdUser, email: rst.data.email, name: rst.data.name, profileImage: rst.data.profileImage}
                    
              } 
               
          } 
          return createdUser   
         
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
