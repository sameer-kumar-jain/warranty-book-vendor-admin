const db = require('../../config/warrantee-vendors');
const tableTypes = require('../../types/tableTypes').tableTypes;
const categoriesRouter = require("express").Router();
/**
 * 
 */
const get = (req, res) => {
  try {
    db.getTable(tableTypes.TABLE_CATEGORIES)
      .findAll({ attributes: ["label", ["category_id", "id"]], order: [["label", "ASC"],] })
      .then((data) => res.send({ status: 200, data }))
      .catch((err) => res.status(400).send(err))
  }
  catch (ex) {
    return res.status(400).send(ex);
  }
}
/**
 * 
 */
const post = (req, res) => {
  const { label } = req.body;
  try {
    db.getTable(tableTypes.TABLE_CATEGORIES)
      .create({ label })
      .then((data) => res.send({ status: 200, message: 'Category has been successfully added.' }))
      .catch((err) => res.status(400).send(err))
  }
  catch (ex) {
    return res.status(400).send(ex);
  }
}
/**
 * 
 */
const getCategoryBrands = (req, res) => {
  const { category_id } = req.params;
  try {
    db.getTable(tableTypes.TABLE_BRANDS)
      .findAll({ attributes: ["label", "category_id", ["brand_id", "id"]], where: { category_id } })
      .then((data) => res.send({ status: 200, data }))
      .catch((err) => res.status(400).send(err))
  }
  catch (ex) {
    return res.status(400).send(ex);
  }
}


categoriesRouter.route("/").all((req, res, next) => { next(); })
  .get(get)
  .post(post)
categoriesRouter.route("/:category_id/brands").get(getCategoryBrands)

module.exports = categoriesRouter