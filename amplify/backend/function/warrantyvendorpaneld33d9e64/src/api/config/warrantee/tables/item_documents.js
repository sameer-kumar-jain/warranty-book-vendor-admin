const Sequelize = require('sequelize')
module.exports = (database) => {
  return database.define('item_documents', {
    id: { type: Sequelize.INTEGER, field: 'id', primaryKey: true, autoIncrement: true },
    user_id: { type: Sequelize.STRING },
    item_id: { type: Sequelize.UUID },
    doc_id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4 },
    doc_url: { type: Sequelize.STRING },
    createdAt: { type: Sequelize.DATE, field: 'created_at' },
    updatedAt: { type: Sequelize.DATE, field: 'updated_at' },
  }, {
    timestamps: false, freezeTableName: true, tableName: 'item_documents'
  })
}