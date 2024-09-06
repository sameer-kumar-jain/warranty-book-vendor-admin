const tableTypes = require('../../types/tableTypes').tableTypes;
module.exports = (database) => {
  const dbtables = {
    [tableTypes.TABLE_BRANDS]: require('./tables/brands')(database),
    [tableTypes.TABLE_CATEGORIES]: require('./tables/categories')(database),
    [tableTypes.TABLE_INVOICES]: require('./tables/invoices')(database),
    [tableTypes.TABLE_CUSTOMERS]: require('./tables/customers')(database),
    [tableTypes.TABLE_INVOICE_PRODUCTS]: require('./tables/invoice_products')(database),
  }

  dbtables[tableTypes.TABLE_CATEGORIES].hasMany(dbtables[tableTypes.TABLE_BRANDS], { foreignKey: 'category_id', targetKey: "category_id" });
  dbtables[tableTypes.TABLE_BRANDS].belongsTo(dbtables[tableTypes.TABLE_CATEGORIES], { foreignKey: 'category_id', targetKey: "category_id" });

  dbtables[tableTypes.TABLE_INVOICES].belongsTo(dbtables[tableTypes.TABLE_CUSTOMERS], { foreignKey: 'customer_id', targetKey: "customer_id" });
  dbtables[tableTypes.TABLE_CUSTOMERS].hasMany(dbtables[tableTypes.TABLE_INVOICES], { foreignKey: 'customer_id', targetKey: "customer_id" });
  
  dbtables[tableTypes.TABLE_INVOICES].hasMany(dbtables[tableTypes.TABLE_INVOICE_PRODUCTS], { foreignKey: 'invoice_id', sourceKey: "invoice_id", targetKey: "invoice_id", as: "products" });
  
  dbtables[tableTypes.TABLE_INVOICE_PRODUCTS].belongsTo(dbtables[tableTypes.TABLE_CUSTOMERS], { foreignKey: 'customer_id', targetKey: "customer_id" });
  dbtables[tableTypes.TABLE_INVOICE_PRODUCTS].belongsTo(dbtables[tableTypes.TABLE_INVOICES], { foreignKey: 'invoice_id', targetKey: "invoice_id" });
  dbtables[tableTypes.TABLE_INVOICE_PRODUCTS].belongsTo(dbtables[tableTypes.TABLE_CATEGORIES], { foreignKey: 'category_id', targetKey: "category_id" });
  dbtables[tableTypes.TABLE_INVOICE_PRODUCTS].belongsTo(dbtables[tableTypes.TABLE_BRANDS], { foreignKey: 'brand_id', targetKey: "brand_id" });
  
  return dbtables
}