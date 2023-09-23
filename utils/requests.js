import fetch from 'node-fetch';
import {subdomain} from '../config.js'

const patch = async (access_token, endpoint, body,) => {
    try {
      const url = `https://${subdomain}.amocrm.ru/api/v4/${endpoint}`
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/hal+json',
          'Authorization': `Bearer ${access_token}`
        },
        body: JSON.stringify(body),
      });
      if (response.status == 200) {
  
        return await response.json()
      }
      else {
        const json = await response.json()
        console.log(json)
        throw new Error(`Неудачное выполнение запроса post ${endpoint}`);
      }
  
    }
    catch (error) {
      const json = await response.json()
      console.log(json)
      console.error('Ошибка:', error.message);
      throw new Error(`Ошибка запроса post ${endpoint}`);
    }
  }

  const post = async (access_token, endpoint, body) => {
    try {
      let url = `https://${subdomain}.amocrm.ru/`
      let headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/hal+json',
      }
      if (access_token) {
        headers.Authorization = `Bearer ${access_token}`
        url = url + `api/v4/${endpoint}`
      }
      else {
        url = url + `oauth2/access_token`
      }    
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });
      if (response.status == 200) {
        return await response.json()
      }
      else {
        const json = await response.json()
        console.log(json)
        throw new Error(`Неудачное выполнение запроса post ${endpoint}`);
      }
  
    }
    catch (error) {
      const json = await response.json()
      console.log(json)
      console.error('Ошибка:', error.message);
      throw new Error(`Ошибка запроса post ${endpoint}`);
    }
  }

  const get = async (access_token, endpoint) => {
    try {
      const url = `https://${subdomain}.amocrm.ru/api/v4/${endpoint}`
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/hal+json',
          'Authorization': `Bearer ${access_token}`
        }
      });
      if (response.status == 204) {
        return null
      }
      if (response.status == 200) {
        const json = await response.json()
        return json
      }
      else {
        const json = await response.json()
        throw new Error('Ошибка запроса', json);
      }
  
    }
    catch (error) {  
      console.error('Ошибка:', error.message);
      throw new Error('Ошибка запроса');
    }
  }

  export {
    post,patch,get
  }