import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import InvoicesList from "./list";
import CreateInvoice from "./create";

const Invoices = () => {
  let { pathname: url } = useLocation();
  return (
    <Routes>
      <Route path={`list`} element={<InvoicesList />} />
      <Route path={`create`} element={<CreateInvoice />} />
      {/*<Route path={`${url}/:card_id/edit`} component={Create} />*/}
      <Route index element={<Navigate to={`${url}/list`} replace />} />
    </Routes>
  );
};

export default Invoices;
