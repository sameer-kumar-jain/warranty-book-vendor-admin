import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import { ErrorMessage, Field, FieldArray, Formik, getIn } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import { get, post, uploadMedia } from "../../data/api";
import { tokens } from "../../theme";
import { Add, Remove } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Chance from 'chance'
import moment from 'moment';

const chance = new Chance()

const CreateInvoice = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false)
  const handleFormSubmit = (values) => {
    setSubmitting(true)
    let { customer_invoice } = values;
    const filename = chance.guid();
    const extention = customer_invoice.name.split('.').pop()
    const path = `${filename}.${extention}`;
    uploadMedia(customer_invoice, path, customer_invoice.type)
      .then(uploadResult => {
        values.products = values.products.map(product => ({
          ...product,
          warrantee_expiration_date: moment(values.purchase_date).add(product.warrantee_expiration_date, "months").format("YYYY-MM-DD")
        }))
        let data = { ...values, invoice: uploadResult.path }
        return post("/invoices", data)
      })
      .then(response => navigate(-1))
      .catch(error => console.log(error))
      .finally(() => setSubmitting(false))

  };

  return (
    <Box m="20px">
      <Header title="CREATE INVOICE" subtitle="Create a New Customer Invoice" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
                name="name"
                error={!!touched.name && !!errors.name}
                helperText={touched.name && errors.name}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Contact Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.contact}
                name="contact"
                error={!!touched.contact && !!errors.contact}
                helperText={touched.contact && errors.contact}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="date"
                label="Purchase Date"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.purchase_date}
                name="purchase_date"
                error={!!touched.purchase_date && !!errors.purchase_date}
                helperText={touched.purchase_date && errors.purchase_date}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="file"
                label="Invoice"
                onBlur={handleBlur}
                onChange={(event) => {
                  setFieldValue("customer_invoice", event.currentTarget.files[0]);
                }}
                name="customer_invoice"
                error={!!touched.invoice && !!errors.invoice}
                helperText={touched.invoice && errors.invoice}
                sx={{ gridColumn: "span 2" }}
              />

            </Box>
            <FieldArray
              name="products"
              render={arrayHelpers => (
                <Box paddingY={3}>
                  <Box display="flex" gap={8} paddingBottom={3} alignItems={"center"}>
                    <Typography variant="h5" color={colors.greenAccent[500]}>Products</Typography>
                    <Button color="secondary" variant="contained" onClick={() => arrayHelpers.push({ category_id: "", brand_id: "", warrantee_expiration_date: "" })}>
                      <Add /> Add Product
                    </Button>
                  </Box>
                  <table width={"100%"}>
                    <thead style={{ background: colors.primary[900], height: 45 }}>
                      <tr>
                        <th style={{ width: 200 }} align='center'>Product Type</th>
                        <th style={{ width: 200 }} align='center'>Brand</th>
                        <th style={{ width: 200 }} align='center'>Model Number</th>
                        <th style={{ width: 150 }} align='center'>Warranty Period</th>
                        <th style={{ width: 150 }} align='center'>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {values.products && values.products.length > 0 ? (
                        values.products.map((friend, index) => (<ProductEntry
                          onBlur={handleBlur}
                          onChange={handleChange}
                          key={index}
                          index={index}
                          arrayHelpers={arrayHelpers}
                          background={index % 2 === 1 ? "#F3F3F3" : "#FFFFFF"}
                        />
                        ))
                      ) : null}
                    </tbody>
                  </table>
                </Box>
              )}
            />
            <Box display="flex" justifyContent="end" mt="20px">
              <Button disabled={submitting} type="submit" color="secondary" variant="contained">
                Save Invoice
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
}

const ProductEntry = ({ index, arrayHelpers, background, onBlur, onChange }) => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  useEffect(() => { loadCategories(); }, []);
  /**
   * 
   */
  const loadCategories = async () => {
    let data = await get("/categories");
    setCategories(data)
    loadBrands(data[0].id)
  }
  /**
   * 
   */
  const loadBrands = async (id) => {

    if (id == "") return setBrands([])
    let data = await get(`/categories/${id}/brands`);
    setBrands(data)
  }
  /**
   * 
   */
  const onSelectCategory = event => {
    loadBrands(event.target.value);
    onChange(event)
  }
  /**
   * 
   */
  const onSelectPurchaseDate = event => console.log(event);
  /**
   * 
   */
  const onSelectWarrantyPeriod = event => console.log(event);
  /**
   * 
   */
  return (
    <tr style={{ background, height: 40 }}>
      <td align='center'>
        <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
          <Field
            as="select"
            name={`products[${index}].category_id`}
            onChange={onSelectCategory}
            style={{ width: 190, height: 32 }}
            onBlur={onBlur}
          >
            <option value="">--Select--</option>
            {categories.map(category => <option value={category.id}>{category.label}</option>)}
          </Field>
          <ErrorMessage style={{ color: "#F00" }} component="div" name={`products[${index}].category_id`} />
        </Box>

      </td>
      <td align='center'>
        <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
          <Field as="select" name={`products.${index}.brand_id`} style={{ width: 190, height: 32 }} onBlur={onBlur} onChange={onChange}>
            <option value="">--Select--</option>
            {brands.map(brand => <option value={brand.id}>{brand.label}</option>)}
          </Field>
          <ErrorMessage style={{ color: "#F00" }} component="div" name={`products[${index}].brand_id`} />
        </Box>
      </td>
      <td align='center'>
        <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
          <Field name={`products.${index}.model_number`} style={{ width: 190, height: 32 }} onBlur={onBlur} onChange={onChange}>
          </Field>
          <ErrorMessage style={{ color: "#F00" }} component="div" name={`products[${index}].model_number`} />
        </Box>
      </td>
      <td align='center'>
        <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
          <Field as="select" name={`products.${index}.warrantee_expiration_date`} style={{ width: 190, height: 32 }} onBlur={onBlur} onChange={onChange}>
            <option value="">--Select--</option>
            <option value="1">1 Month</option>
            <option value="2">2 Month</option>
            <option value="3">3 Month</option>
            <option value="6">6 Month</option>
            <option value="12">1 Year</option>
            <option value="18">1.5 Year</option>
            <option value="24">2 Years</option>
            <option value="36">3 Years</option>
            <option value="48">4 Years</option>
            <option value="60">5 Years</option>
            <option value="72">6 Years</option>
            <option value="84">7 Years</option>
            <option value="96">8 Years</option>
            <option value="108">9 Years</option>
            <option value="120">10 Years</option>
          </Field>
          <ErrorMessage style={{ color: "#F00" }} component="div" name={`products[${index}].warrantee_expiration_date`} />
        </Box>
      </td>
      <td align='center'>
        <Button onClick={() => arrayHelpers.remove(index)} variant="contained" color="secondary">
          <Remove /> Remove
        </Button>
      </td>
    </tr>
  )
}
/*
const ErrorMessage = ({ name }) => (
  <Field
    name={name}
    color={"#FF0"}
    render={({ form }) => {
      const error = getIn(form.errors, name);
      const touch = getIn(form.touched, name);
      return touch && error ? error : null;
    }}
  />
);
*/
const phoneRegExp = /^((\+[1-9]{1, 4}[ -]?)|(\([0-9]{2, 3}\)[ -]?)|([0-9]{2, 4})[ -]?)*?[0-9]{3, 4}[ -]?[0-9]{3, 4}$/;

const checkoutSchema = yup.object().shape({
  name: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  //contact: yup.string().matches(phoneRegExp, "Phone number is not valid").required("required"),
  purchase_date: yup.string().required("required"),
  customer_invoice: yup.string().required("required"),
  products: yup.array().of(
    yup.object().shape({
      category_id: yup.string().required("Product type is required"),
      brand_id: yup.string().required("Brand is required"),
      warrantee_expiration_date: yup.string().required("Warranty Period is required"),
    })).required('Must have products'),
});
const initialValues = {
  name: "",
  email: "",
  contact: "",
  purchase_date: "",
  customer_invoice: "",
  invoice_file: "",
  products: []
};


export default CreateInvoice