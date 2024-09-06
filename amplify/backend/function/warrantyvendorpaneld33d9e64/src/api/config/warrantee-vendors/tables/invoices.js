const Sequelize = require('sequelize')
module.exports = (database) => {
  return database.define('invoices', {
    id: { type: Sequelize.INTEGER, field: 'id', primaryKey: true },
    user_id: { type: Sequelize.STRING },
    customer_id: { type: Sequelize.UUID },
    invoice_id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4 },
    invoice_file: { type: Sequelize.STRING },
    issue_date: { type: Sequelize.DATE },
    createdAt: { type: Sequelize.DATE, field: 'created_at' },
    updatedAt: { type: Sequelize.INTEGER, field: 'updated_at' },
  }, { freezeTableName: false, tableName: 'invoices' })
}