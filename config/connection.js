const Sequelize = require('sequelize');

require('dotenv').config();
console.log(process.env.JAWSDB_URL);
// create connection to our db
const sequelize = process.env.JAWSDB_URL
  ? new Sequelize(process.env.JAWSDB_URL)
  : new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
      host: 'localhost',
      dialect: 'mysql',
      port: process.env.PORT || 3306
    });

module.exports = sequelize;
