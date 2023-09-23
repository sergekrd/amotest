import fs from 'fs';

export const subdomain='serge2012'
export const httpsOptions = {
    key: fs.readFileSync('/etc/letsencrypt/live/appoint-point.ru/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/appoint-point.ru/fullchain.pem')
}
export const dbConnectData = {
    user: 'test',
    password: 'testamoamo',
    host: '194.87.68.120',
    port: 5432,
    database: 'amocrm'
};