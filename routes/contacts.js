import express from 'express';
import { post, patch, get } from '../utils/requests.js';
import checkAuthTokenValidity from '../utils/auth.js'
import { getAccount, getFields } from '../utils/helpers.js'
import bodyParser from 'body-parser';

const contactsRouter = express.Router();
contactsRouter.use(bodyParser.urlencoded({ extended: true }));
contactsRouter.use(bodyParser.json());
contactsRouter.post('/update', async (req, res) => {
    try {
        const { name, lastName, phone, email } = req.body
        const contact = await getContact(phone, email)
        if (contact) {
            const update = await updateContact(phone, email, name, lastName, contact.id)
            if (update) {
                res.json({ message: 'Контакт был в базе, обновили', data: update });
            }
            else {
                res.status(400).send({ message: 'Контакт был в базе, не удалось обновить' });
            }
        }
        else {
            const add = await addContact(phone, email, name, lastName)
            if (add) {
                res.json({ message: 'Контакта не было в базе, добавили', data: add });
            }
            else {
                res.status(400).send({ message: 'Контакта не было в базе, не удалось добавить' });
            }
        }
    }
    catch (error) {
        console.log('Ошибка с обновлением/добавлением контакта', error)
        res.status(400).send({ message: 'Ошибка с обновлением/добавлением контакта' });
    }
});

contactsRouter.post('/addcontact', async (req, res) => {
    try {
        const { name, lastName, phone, email } = req.body
        const add = await addContact(phone, email, name, lastName)
        if (add === null) {
            res.status(400).send({ message: 'Контакт не добавлен' });
        }
        else {
            res.json({ message: 'Контакт добавлен', data: add });
        }

    }
    catch (error) {
        console.log('Ошибка с добавлением контакта', error)
        res.status(400).send({ message: 'Ошибка добавлением контакта' });
    }
});

contactsRouter.get('/getcontacts', async (req, res) => {
    try {
        const { phone, email } = req.query
        const contact = await getContact(phone, email)
        if (contact === null) {
            res.status(204).send({ message: "Нет пользователей" });
        }
        else {
            res.json(contact);
        }
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const getContact = async (phone, email) => {
    try {
        const access_token = await checkAuthTokenValidity()
        const fields = await getFields(access_token)

        let searchParam = []
        /* let filterId = '' */
        if (phone) {
            const fieldId = fields.PHONE.id
            searchParam.push({ value: phone.trim(), fieldId: fieldId })
            /*   filterId = fields.PHONE.id */
        }
        if (email) {
            const fieldId = fields.EMAIL.id
            searchParam.push({ value: email, fieldId: fieldId })
            /*  filterId = fields.EMAIL.id */
        }
        const contact = await getContactQuery(access_token, searchParam)
       
        if (contact === null) {
            return null
        }
        else {
            return contact
        }
    } catch (error) {
        throw new Error('Ошибка получения контакта');
    }

}

const getContactQuery = async (access_token, array) => {    
    try {
if (typeof array=='string'){
    const value=array
    array=[]
    array.push({value:value})
}
        const endpoint = `contacts?query=${array[0].value}`
        const contactEmb = await get(access_token, endpoint)
        if (!contactEmb) {
            return null
        }
        else {
            const contact = contactEmb._embedded.contacts[0]
//для проверки полного совпадения и phone и email, два запроса и сравнение результатов
            if (array.length > 1) {
                const endpoint2 = `contacts?query=${array[1].value}`
                const contactEmb2 = await get(access_token, endpoint2)
                if(!contactEmb2){return null}
                if (contact.id == contactEmb2._embedded.contacts[0].id) {
                     return contact 
                    }
                else { 
                    console.error('Пользователь с таким логином/телефоном уже есть:');
                    throw new Error('Пользователь с таким логином/телефоном уже есть');
                 }
            }
            else {
                return contact
            }
        }
    }
    catch (error) {
        console.error('Ошибка:', error.message);
        throw new Error('Ошибка запроса');
    }

}

const updateContact = async (phone, email, name, lastName, id) => {
    try {
        const access_token = await checkAuthTokenValidity()
        const fields = await getFields(access_token)
        const body =
            [
                {
                    "name": `${name} ${lastName}`,
                    "first_name": name,
                    "last_name": lastName,
                    "custom_fields_values": [
                        {
                            "field_id": fields.PHONE.id,
                            "values": [
                                {
                                    "value": phone,
                                    "enum_id": fields.PHONE.enum.id,
                                }
                            ]
                        },
                        {
                            "field_id": fields.EMAIL.id,
                            "values": [
                                {
                                    "value": email,
                                    "enum_id": fields.EMAIL.enum.id,
                                }
                            ]
                        }
                    ],
                }
            ]
        const endpoint = `contacts/${id}`
        const update = await patch(access_token, endpoint, body)
        if (update === null) {
            return null
        }
        else {
            return update;
        }
    } catch (error) {
        throw new Error('Ошибка изменения контакта');
    }

}

const addContact = async (phone, email, name, lastName) => {
    try {
        const access_token = await checkAuthTokenValidity()
        const [user, fields] = await Promise.all([
            await getAccount(access_token),
            await getFields(access_token)
        ])
        const body =
            [
                {
                    "name": `${name} ${lastName}`,
                    "created_by": user.current_user_id,
                    "first_name": name,
                    "last_name": lastName,
                    "custom_fields_values": [
                        {
                            "field_id": fields.PHONE.id,
                            "values": [
                                {
                                    "value": phone,
                                    "enum_id": fields.PHONE.enum.id,
                                }
                            ]
                        },
                        {
                            "field_id": fields.EMAIL.id,
                            "values": [
                                {
                                    "value": email,
                                    "enum_id": fields.EMAIL.enum.id,
                                }
                            ]
                        }
                    ],
                }

            ]
        const endpoint = `contacts`
        const add = await post(access_token, endpoint, body)
        if (add === null) {
            return null
        }
        else {

            return add._embedded.contacts[0];
        }

    } catch (error) {
        throw new Error('Ошибка добавления контакта');
    }

}

/* Ловлю ошибку Invalid filter for current account */
const getContactFilter = async (access_token, value, filterId) => {
    try {
        /* Ловлю ошибку Invalid filter for current account */
        const endpoint = `contacts?filter[custom_fields_values][${filterId}][]=${value}`
        const contact = await get(access_token, endpoint)
        console.log(contact)
    }
    catch (error) {
        console.error('Ошибка:', error.message);
        throw new Error('Ошибка запроса');
    }
}

export {contactsRouter,getContactQuery}