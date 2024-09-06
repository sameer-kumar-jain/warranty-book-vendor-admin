const Sequelize = require('sequelize')
module.exports = (database) => {
  return database.define('categories', {
    id: { type: Sequelize.INTEGER, field: 'id', primaryKey: true },
    category_id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, field: 'category_id' },
    label: { type: Sequelize.STRING },
  }, { freezeTableName: false, tableName: 'categories', timestamps: false })
}