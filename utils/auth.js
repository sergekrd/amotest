import db from './db.js';
import { subdomain } from '../config.js';

const checkAuthTokenValidity = async () => {
    try {
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const authData = await db.getAuth(subdomain)
      if (!authData) {
        return null
      }   
      if (authData.expires_in && authData.expires_in < currentTimestamp) {
        const data = await db.getDataByClientUsernamesubdomain
        const newAuthData = await refreshToken(authData.refresh_token, data);
        return newAuthData.access_token;
      }
      else {
        return authData.access_token;
      }
    } catch (error) {
  
      console.error('Ошибка обновления токена:', error);
      throw error;
    }
  }
  
  const refreshToken = async (refreshToken, data) => {
    try {
      const body = {
        client_id: data.client_id,
        client_secret: data.client_secret,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        redirect_uri: data.redirect_uri
      }    
      const newAuth = await post('', '', body)
      console.log(newAuth)
      const expires_in = parseInt(newAuth.expires_in) + Math.floor(Date.now() / 1000)
      await db.updateAuth('serge2012', newAuth.access_token, newAuth.refresh_token, expires_in)
      return newAuth
    }
    catch (error) {
      console.log('Ошибка в refreshToken')
      throw error;
    }
  }

  export default checkAuthTokenValidity