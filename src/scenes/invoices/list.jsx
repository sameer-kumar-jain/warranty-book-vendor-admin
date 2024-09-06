import { Box, Button,  useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { Add } from '@mui/icons-material';
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { get } from "../../data/api";
const InvoicesList = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [invoices, setInvoice] = useState([]);
  useEffect(() => { loadInvoices(); }, []);
  /**
   * 
   */
  const loadInvoices = async () => {
    let data = await get("/invoices");
    setInvoice(data.map(entry => ({ ...entry, ...entry.customer })))
  }
  const columns = [
    {
      field: "customer_name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "customer_phone",
      headerName: "Phone Number",
      flex: 1,
    },
    {
      field: "customer_email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "issue_date",
      headerName: "Date",
      flex: 1,
    },
  ];

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between">
        <Header title="INVOICES" subtitle="List of Invoice" />
        <Box>
          <Button component={Link} to={'/invoices/create'} color="secondary" variant="contained">
            <Add /> Create New Invoice
          </Button>
        </Box>
      </Box>
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid checkboxSelection rows={invoices} columns={columns} />
      </Box>
    </Box>
  );
};

export default InvoicesList;
