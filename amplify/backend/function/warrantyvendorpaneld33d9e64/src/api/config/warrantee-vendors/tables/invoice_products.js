const Sequelize = require('sequelize')
module.exports = (database) => {
  return database.define('invoice_products', {
    id: { type: Sequelize.INTEGER, field: 'id', primaryKey: true, autoIncrement: true },
    user_id: { type: Sequelize.STRING },
    customer_id: { type: Sequelize.STRING },
    invoice_id: { type: Sequelize.UUID },
    category_id: { type: Sequelize.UUID },
    brand_id: { type: Sequelize.UUID },
    model_number: { type: Sequelize.STRING },
    warrantee_expiration_date: { type: Sequelize.DATE },
    createdAt: { type: Sequelize.DATE, field: 'created_at' },
    updatedAt: { type: Sequelize.DATE, field: 'updated_at' },
  }, { freezeTableName: true, tableName: 'invoice_products' })
}