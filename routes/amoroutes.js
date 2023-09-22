import express from 'express';
import { post} from '../utils/requests.js';
import bodyParser from 'body-parser';

const amoRouter = express.Router();
amoRouter.use(bodyParser.urlencoded({ extended: true }));
amoRouter.use(bodyParser.json());
amoRouter.post('/setsecretdata', async (req, res) => {
    try {
      const { client_id, client_secret, grant_type, code, redirect_uri, username } = req.body;
  
      // Проверяем наличие обязательных полей
      if (!client_id || !client_secret || !grant_type || !redirect_uri || !username) {
        return res.status(400).json({ error: 'Отсутствуют обязательные поля' });
      }
      // Добавляем запись в таблицу data, оставляя поле code пустым
      const newData = await db.insertData(client_id, client_secret, grant_type, '', redirect_uri, username);
  
      res.status(200).json(newData);
    } catch (error) {
      console.error('Ошибка:', error.message);
      res.status(500).json({ error: 'Ошибка сохранения данных' });
    }
  });
  
  
  
  amoRouter.get('/setauthkey', async (req, res) => {
    try {
      const { code, state, client_id } = req.query;
      if (!code) {
        throw new Error('Не полные данные');
      }
      console.log('Получен код авторизации:', code);
     
        await db.updateCode(client_id, code)
       const { token_type, expires_in, access_token, refresh_token, username } = await getToken(client_id)
       const expire= parseInt(expires_in) + Math.floor(Date.now() / 1000)
       const data=await db.getDataByClientId(client_id)
       await db.insertAuth(token_type, expire, access_token, refresh_token, data.username) 
       
  
       const filePath = './public/contacts.html'
       const html = fs.readFileSync(filePath, 'utf-8');
  
      res.redirect('/') //send(html)
    } catch (error) {
  
      console.error('Ошибка:', error.message);
      res.status(400).json({ error: error.message });
    }
  });

  amoRouter.getToken = async (client_id) => {
    try {
      const data = await db.getDataByClientId(client_id)
      const body = {
        "client_id": data.client_id,
        "client_secret": data.client_secret,
        "grant_type": "authorization_code",
        "code": data.code,
        "redirect_uri": data.redirect_uri
      }
  console.log(body)
      const auth = await post('', '', body)
      console.log(auth)
        return auth    
      }
     catch (error) {
      console.error('Ошибка:', error.message);
      throw new Error('Ошибка запроса');
    }
  }
  export default amoRouter;