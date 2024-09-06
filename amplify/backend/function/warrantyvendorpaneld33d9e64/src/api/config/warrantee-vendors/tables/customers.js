const Sequelize = require('sequelize')
module.exports = (database) => {
  return database.define('customers', {
    id: { type: Sequelize.INTEGER, field: 'id', primaryKey: true },
    user_id: { type: Sequelize.STRING },
    customer_id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4 },
    customer_name: { type: Sequelize.STRING },
    customer_phone: { type: Sequelize.STRING },
    customer_email: { type: Sequelize.STRING },
    createdAt: { type: Sequelize.DATE, field: 'created_at' },
    updatedAt: { type: Sequelize.INTEGER, field: 'updated_at' },
  }, { freezeTableName: false, tableName: 'customers' })
}