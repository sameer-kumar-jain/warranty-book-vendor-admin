const Sequelize = require('sequelize')
module.exports = (database) => {
  return database.define('items', {
    id: { type: Sequelize.INTEGER, field: 'id', primaryKey: true },
    user_id: { type: Sequelize.STRING },
    item_id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4 },
    category_id: { type: Sequelize.UUID },
    brand_id: { type: Sequelize.UUID },
    label: { type: Sequelize.STRING },
    comments: { type: Sequelize.STRING },
    seller_name: { type: Sequelize.STRING },
    seller_contact: { type: Sequelize.STRING },
    model_no: { type: Sequelize.STRING },
    purchase_date: { type: Sequelize.DATE},
    warrantee_expiration_date: { type: Sequelize.DATE},
    createdAt: { type: Sequelize.DATE, field: 'created_at' },
    updatedAt: { type: Sequelize.INTEGER, field: 'updated_at' },
  }, { freezeTableName: false, tableName: 'items' })
}