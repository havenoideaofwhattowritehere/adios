require('dotenv').config();

const getConfig = () => ({
  dialect: 'mysql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

module.exports = {
  development: getConfig(),
  production: getConfig(),
};
