const tableTypes = require('../../types/tableTypes').tableTypes;
module.exports = (database) => {
  const dbtables = {
    [tableTypes.TABLE_ITEMS]: require('./tables/items')(database),
    [tableTypes.TABLE_ITEM_DOCUMENTS]: require('./tables/item_documents')(database)
  }
  dbtables[tableTypes.TABLE_ITEMS].hasMany(dbtables[tableTypes.TABLE_ITEM_DOCUMENTS], { foreignKey: 'item_id', targetKey: "item_id" });
  dbtables[tableTypes.TABLE_ITEM_DOCUMENTS].belongsTo(dbtables[tableTypes.TABLE_ITEMS], { foreignKey: 'item_id', targetKey: "item_id" });

  return dbtables
}