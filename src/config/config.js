require('dotenv').config()

module.exports = {
  development: {
    base_url: process.env.REACT_APP_BASE_URL_DEV,
    clientId: process.env.REACT_APP_CLIENT_ID,
    rpcTarget: process.env.REACT_APP_RPCTARGET,
    chainId: process.env.REACT_APP_CHAIN_ID,
    appLogo: process.env.REACT_APP_APPLOGO,
  },
  test: {
    base_url: process.env.REACT_APP_BASE_URL_DEV,
    clientId: process.env.REACT_APP_CLIENT_ID,
    rpcTarget: process.env.REACT_APP_RPCTARGET,
    chainId: process.env.REACT_APP_CHAIN_ID,
    appLogo: process.env.REACT_APP_APPLOGO,
  },
  production: {
    base_url: process.env.REACT_APP_BASE_URL,
    clientId: process.env.REACT_APP_CLIENT_ID,
    rpcTarget: process.env.REACT_APP_RPCTARGET,
    chainId: process.env.REACT_APP_CHAIN_ID,
    appLogo: process.env.REACT_APP_APPLOGO,
  },
}