require('dotenv').config()

module.exports = {
  development: {
    base_url: process.env.REACT_APP_BASE_URL_DEV,
  },
  test: {
    base_url: process.env.REACT_APP_BASE_URL_DEV,
  },
  production: {
    base_url: process.env.REACT_APP_BASE_URL,
  },
}