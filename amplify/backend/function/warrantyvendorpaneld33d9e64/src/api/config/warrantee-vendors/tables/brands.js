const Sequelize = require('sequelize')
module.exports = (database) => {
  return database.define('brands', {
    id: { type: Sequelize.INTEGER,primaryKey: true },
    brand_id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4 },
    category_id: { type: Sequelize.UUID},
    label: { type: Sequelize.STRING },
    call_center_number: { type: Sequelize.STRING },
    whatsapp_number: { type: Sequelize.STRING },
    contact_link: { type: Sequelize.STRING },
    country_code: { type: Sequelize.STRING },
    is_disabled: { type: Sequelize.INTEGER },
  }, { freezeTableName: false, tableName: 'brands', timestamps: false })
}