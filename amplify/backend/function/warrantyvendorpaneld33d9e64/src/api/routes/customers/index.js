const db = require('../../config/warrantee-vendors');
const tableTypes = require('../../types/tableTypes').tableTypes;
const customersRouter = require("express").Router();
/**
 * 
 */
const get = (req, res) => {
  const { user_id } = req;
  return db.getTable(tableTypes.TABLE_CUSTOMERS)
    .findAll({
      attributes: ["customer_name", "customer_email", "customer_phone", ["customer_id", "id"]],
      where: { user_id: user_id },
      order: [["created_at", 'DESC']]
    })
    .then((data) => res.send({ status: 200, data }))
    .catch((err) => { console.log(err); res.status(400).send(err) })
}

customersRouter.route("/")
  .get(get)


module.exports = customersRouter