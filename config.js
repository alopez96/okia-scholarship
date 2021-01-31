// config.js
const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  db_user: process.env.DB_USER,
  db_password: process.env.DB_PASSWORD,
  db_name: process.env.DB_NAME,
  db_cluster: process.env.DB_CLUSTER
};