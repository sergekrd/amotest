import { get } from './requests.js';

const getAccount = async (access_token) => {
    try {
      const endpoint = `account`
      const account = await get(access_token, endpoint)
      return account
    }
    catch (error) {
      console.error('Ошибка:', error.message);
      throw new Error('Ошибка запроса');
    }
  }

  const getFields = async (access_token) => {
    try {
      const endpoint = `contacts/custom_fields`
      const fields = await get(access_token, endpoint)
      let result = {}
      fields._embedded.custom_fields.forEach(element => {
  
        result[element.code] = {
          id: element.id ?? null,
          type: element.type ?? null,
          name: element.name ?? null,
          code: element.code ?? null,
          sort: element.sort ?? null
        }
        if (element.enums) {
          element.enums.forEach(enuEl => {
            if (enuEl.value == "WORK") {
              result[element.code].enum = enuEl
            }
          })
        }
  
      });
      return result
    }
    catch (error) {
      console.error('Ошибка:', error.message);
      throw new Error('Ошибка запроса');
    }
  }

  const getLeads = async (access_token) => {
    try {
      const endpoint = `leads`
      const fields = await get(access_token, endpoint)
      return fields._embedded.leads[0]
    }
    catch (error) {
      console.error('Ошибка:', error.message);
      throw new Error('Ошибка запроса');
    }
  }
  export {getLeads,getFields,getAccount}