import fs from 'fs';

export const subdomain='serge2012'
export const httpsOptions = {
    key: fs.readFileSync('/etc/letsencrypt/live/appoint-point.ru/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/appoint-point.ru/fullchain.pem')
}