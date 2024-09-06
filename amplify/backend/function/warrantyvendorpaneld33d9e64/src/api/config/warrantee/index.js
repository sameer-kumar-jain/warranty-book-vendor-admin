const Sequelize = require('sequelize');
const database = async() => {
  const db = new Sequelize(process.env.DB_WARRANTEE_DATABASE, process.env.DB_WARRANTEE_USER, process.env.DB_WARRANTEE_PASSWORD, { host: process.env.DB_HOST, dialect: 'mysql', port: 3306, logging: false})
  const dbtables = require('./tables')(db);
  this.getDatabase = () => this.db;
  this.getTables = () => this.dbtables
  this.getTable = (type) => dbtables[type]
  this.query = (query) => db.query(query);
}
exports.default = database();