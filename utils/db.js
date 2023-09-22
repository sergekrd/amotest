import pgp from 'pg-promise';

const initOptions = {};

const pgpInstance = pgp(initOptions);


const db = pgpInstance({
  user: 'test',
  password: 'testamoamo',
  //host: 'localhost',
  host: '194.87.68.120',
  port: 5432,
  database: 'amocrm'
});

// Определение таблицы data


const createDataTable = async () => {
    try {
        await db.none(`
            CREATE TABLE IF NOT EXISTS data (
                id SERIAL PRIMARY KEY,
                client_id VARCHAR(255),
                client_secret VARCHAR(255),
                grant_type VARCHAR(255),
                code TEXT,
                redirect_uri VARCHAR(255),
                username VARCHAR(255) UNIQUE
            );
        `);
        console.log('Таблица data создана или уже существует.');
    } catch (error) {
        console.error('Ошибка при создании таблицы data:', error.message);
        throw error;
    }
};

const createAuthTable = async () => {
    try {
        await db.none(`        
            CREATE TABLE IF NOT EXISTS auth (
                id SERIAL PRIMARY KEY,
                token_type VARCHAR(255),
                expires_in INT,
                access_token TEXT,
                refresh_token TEXT,
                username VARCHAR(255) REFERENCES data(username) ON DELETE CASCADE
            );
        `);
        console.log('Таблица auth создана или уже существует.');
    } catch (error) {
        console.error('Ошибка при создании таблицы data:', error.message);
        throw error;
    }
};

async function createTables() {
    try {
        await createDataTable();
        await createAuthTable();
        console.log('Таблицы успешно созданы.');
    } catch (error) {
        console.error('Ошибка при создании таблиц:', error.message);
    }
}

// Вызываем функцию для создания таблиц


// Функция для вставки данных
const insertData = async (client_id, client_secret, grant_type, code, redirect_uri,usernmae) => {
    try {
        const newData = await db.one(`
            INSERT INTO data (client_id, client_secret, grant_type, code, redirect_uri,username)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `, [client_id, client_secret, grant_type, code, redirect_uri,usernmae]);
        return newData;
    } catch (error) {
        console.error('Ошибка при вставке данных:', error.message);
        throw error;
    }
};


const updateCode = async (client_id, code) => {
    try {
      await db.none(`
        UPDATE data
        SET code = $1
        WHERE client_id = $2;
      `, [code, client_id]);
  
      // Если операция прошла успешно, возвращаем сообщение об успехе.
      return { success: true, message: 'Код успешно добавлен в таблицу data.' };
    } catch (error) {
      console.error('Ошибка при добавлении кода:', error);
      // Если произошла ошибка, возвращаем сообщение об ошибке.
      throw error;
  };
}

  const updateAuth = async (username, access_token,refresh_token,expires_in) => {
    try {
      await db.none(`
        UPDATE auth
        SET access_token = $2, refresh_token = $3,expires_in = $4
        WHERE username = $1;
      `, [username, access_token,refresh_token,expires_in]);
  
      // Если операция прошла успешно, возвращаем сообщение об успехе.
      return { success: true, message: 'refresh_token успешно обновлен в таблице auth.' };
    } catch (error) {
      console.error('Ошибка при обновлении:', error);
      // Если произошла ошибка, возвращаем сообщение об ошибке.
      throw error;
    }
  };

  const getDataByClientId = async (client_id) => {
    try {
      const result = await db.oneOrNone(
        'SELECT * FROM data WHERE client_id = $1',
        client_id
      );
  
      if (result) {
        return result;
      } else {
        console.log(`Данные для пользователя ${client_id} не найдены.`);
        return null;
      }
    } catch (error) {
      console.error('Ошибка при получении данных:', error.message);
      throw error;
    }
  };

  
  const getDataByClientUsername = async (username) => {
    try {
      const result = await db.oneOrNone(
        'SELECT * FROM data WHERE username = $1',
        username
      );
  
      if (result) {
        return result;
      } else {
        console.log(`Данные для пользователя ${username} не найдены.`);
        return null;
      }
    } catch (error) {
      console.error('Ошибка при получении данных:', error.message);
      throw error;
    }
  };

  const getAuth = async (username) => {
    try {
      const result = await db.oneOrNone(
        'SELECT * FROM auth WHERE username = $1',
        username
      );
  
      if (result) {
        return result;
      } else {
        console.log(`Данные для пользователя ${username} не найдены.`);
        return null;
      }
    } catch (error) {
      console.error('Ошибка при получении данных:', error.message);
      throw error;
    }
  };


  const insertAuth = async (token_type, expires_in, access_token, refresh_token, username) => {
    try {
        const newData = await db.one(`
            INSERT INTO auth (token_type, expires_in, access_token, refresh_token, username)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `, [token_type, expires_in, access_token, refresh_token, username]);
        return newData;
    } catch (error) {
        console.error('Ошибка при вставке данных:', error.message);
        throw error;
    }
};


export default {
    createTables,   
    insertData,
    updateCode,
    getDataByClientId,
    insertAuth,
    getAuth,
    getDataByClientUsername,
    updateAuth

}; 