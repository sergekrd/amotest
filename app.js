import https from 'https';
import fs from 'fs';
import express from 'express';
import db from './utils/db.js';
import {post,patch,get} from './utils/requests.js';
import bodyParser from 'body-parser';
import amoRoutes from './routes/amoroutes.js'; 
import {contactsRouter,getContactQuery} from './routes/contacts.js'
import checkAuthTokenValidity from './utils/auth.js'
import { getAccount,getLeads} from './utils/helpers.js'
import {httpsOptions} from './config.js'

const app = express();

app.use('/amocrm/api', amoRoutes);
app.use('/myapi/contacts', contactsRouter);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
db.createTables();



const server = https.createServer(httpsOptions, app); 

app.get('/', async (req, res) => {

  // const access_token = await checkAuthTokenValidity()
  const auth = await checkAuthTokenValidity()
  if (auth) {
    const filePath = './public/contacts.html'
    const contactsHtml = fs.readFileSync(filePath, 'utf-8');
    res.send(contactsHtml)
  }
  else {
    const filePath = './public/amobutton.html'
    const html = fs.readFileSync(filePath, 'utf-8')
    res.send(html);
  }
});



app.post('/myapi/createDeal', async (req, res) => {
  try {
    const { contactId } = req.body
    const access_token = await checkAuthTokenValidity()
    const contact = await getContactQuery(access_token, contactId)   
    const user = await getAccount(access_token)
    const leads = await getLeads(access_token)
    const dealData = [{
      "name": `${contact.name}`,
      "price": 1000,
      "created_by": user.current_user_id,
      "account_id": contact.id,
    }]
    const endpoint = `leads`
    const create = await post(access_token, endpoint, dealData)
    if (create === null) {
      res.status(400).send({message:"Сделка не создана"});
    }
    else {
      res.json({message:"Сделка создана", data:create._embedded.leads[0]});
    }

  }
  catch (error) {
    res.status(400).send({message:"Сделка не создана",error:error});
  }
});



server.listen(3322, () => { 
 
    console.log('Сервер запущен на порту 3322 (HTTPS)');
  });
