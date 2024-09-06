const db = require('../../config/warrantee-vendors');
const warrantee_db = require('../../config/warrantee');
const tableTypes = require('../../types/tableTypes').tableTypes;
const invoicesRouter = require("express").Router();
const { InvokeCommand, LambdaClient, LogType } = require("@aws-sdk/client-lambda");
const { S3Client, CopyObjectCommand } = require("@aws-sdk/client-s3");
/**
 * 
 */
const get = (req, res) => {
  const { user_id } = req;
  return db.getTable(tableTypes.TABLE_INVOICES)
    .findAll({
      attributes: [["invoice_id", "id"], "issue_date"],
      include: [{
        model: db.getTable(tableTypes.TABLE_CUSTOMERS),
        as: "customer",
        attributes: [
          "customer_name",
          "customer_email",
          "customer_phone",
          ["customer_id", "id"]
        ],
        order: [["label", "ASC"],],
      }],
      where: { user_id: user_id },
      order: [["issue_date", 'DESC']]
    })
    .then((data) => res.send({ status: 200, data }))
    .catch((err) => { console.log(err); res.status(400).send(err) })
}
/**
 * 
 */
const post = async (req, res) => {
  const { user_id } = req;
  const {
    name: customer_name,
    email: customer_email,
    contact: customer_phone,
    purchase_date: issue_date,
    invoice: invoice_file,
    products
  } = req.body;
  const seller = await getUserAttributes(user_id);
  const seller_name = seller.find(entry => entry.Name === "name").Value
  const seller_contact = seller.find(entry => entry.Name === "phone_number").Value
  /**
   * check if customer exist in vendors list
   */
  let customer = await db.getTable(tableTypes.TABLE_CUSTOMERS).findOne({ where: { user_id, customer_phone } })
  if (!customer) {
    /**
     * create new customer if it doesnt exist
     */
    customer = await db.getTable(tableTypes.TABLE_CUSTOMERS).create({ user_id, customer_name, customer_phone, customer_email })
  }
  const { customer_id } = customer;
  /**
   * create invoice entry for the customer
   */
  return db.getTable(tableTypes.TABLE_INVOICES)
    .create({
      user_id, customer_id, invoice_file, issue_date, products: products.map(product => ({ user_id, customer_id, ...product })),
    }, {
      include: [{ model: db.getTable(tableTypes.TABLE_INVOICE_PRODUCTS), as: 'products' }]
    })
    .then(createInvoiceResponse => createAppUserWithWarranty({ seller_name, seller_contact, customer_name, customer_phone, customer_email, products, invoice_file, purchase_date: issue_date }))
    .then(createUserResponse => sendMessageToCustomer(customer_name, customer_phone, invoice_file))
    .then(sendMessageResponse => res.send({ status: 200, message: 'Invoice has been successfully created and customer informed.' }))
    .catch(error => res.status(400).send("Error while saving data, please try again later."))
}
/**
 * 
 */
const getOne = (req, res) => {
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

const createAppUserWithWarranty = async ({
  customer_name, customer_phone, customer_email, products, invoice_file, purchase_date, seller_name, seller_contact
}) => {
  /**
   * get or create warranty app user
   */
  const { sub, error } = await getOrCreateCustomerAccount(customer_name, customer_phone, customer_email);
  if (!error && products.length > 0) {
    /**
     * prepare items
     */
    const items = products.map(product => {
      const { category_id, brand_id, warrantee_expiration_date, model_number } = product;
      return ({ user_id: sub, category_id, brand_id, warrantee_expiration_date, model_no: model_number, purchase_date, seller_name, seller_contact, })
    });
    /**
     * move invoice to s3 of user
     */
    //invoice_file
    const s3client = new S3Client({});
    const media = `through_admin/${invoice_file.split("/").pop()}`
    const command = new CopyObjectCommand({
      CopySource: encodeURIComponent(`warrantyvendorpanele6a0b6c06f1f438e931c68542370e3b26-staging/${invoice_file}`),
      Bucket: "warantees383eafa4163b47119e77d438177901733fb1d-staging",
      Key: media,
    });
    await s3client.send(command);
    /**
     * create cards for user
     */
    return warrantee_db.getTable(tableTypes.TABLE_ITEMS)
      .bulkCreate(items)
      .then(items => warrantee_db.getTable(tableTypes.TABLE_ITEM_DOCUMENTS).bulkCreate(items.map(({ item_id }) => ({ user_id: sub, item_id, doc_url: media }))))
  }
}

const getUserAttributes = async (user_id) => {
  const command = new InvokeCommand({ FunctionName: "warrantyadminpublic-staging", Payload: JSON.stringify({ action: "get-user-attributes", data: { user_id } }) });
  const client = new LambdaClient({});
  const { Payload } = await client.send(command);
  const response = JSON.parse(Buffer.from(Payload).toString());
  return response
}

const getOrCreateCustomerAccount = async (customer_name, customer_phone, customer_email) => {
  const command = new InvokeCommand({ FunctionName: "warrantyadminpublic-staging", Payload: JSON.stringify({ action: "get-create-customer-account", data: { customer_phone, customer_name, customer_email } }) });
  const client = new LambdaClient({});
  const { Payload } = await client.send(command);
  const response = JSON.parse(Buffer.from(Payload).toString());
  return response
}

const sendMessageToCustomer = async (customer_name, customer_phone, invoice_file) => {
  console.log("sendMessageToCustomer", customer_name, customer_phone)
  const command = new InvokeCommand({ FunctionName: "warrantyadminpublic-staging", Payload: JSON.stringify({ action: "send-invoice-to-whatsapp", data: { customer_phone, customer_name } }) });
  const client = new LambdaClient({});
  const { Payload } = await client.send(command);
  const response = JSON.parse(Buffer.from(Payload).toString());
  console.log("sendMessageToCustomer", response)
  return response
}


invoicesRouter.route("/")
  .get(get)
  .post(post);

invoicesRouter.route("/:invoice_id").get(getOne)

module.exports = invoicesRouter