import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Invoices from "./scenes/invoices";
import Customers from "./scenes/customers";
import { Card, CardContent, CircularProgress, CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { useAuthenticator, PhoneNumberField, Input, Authenticator, Loader } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { fetchAuthSession, signIn, confirmSignIn } from "aws-amplify/auth";
import Chance from 'chance'
import LoginScene from "./scenes/auth/login";
import VerifyScene from "./scenes/auth/verify";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
              {/*<Route path="/" element={<Dashboard />} />
              <Route path="/team" element={<Team />} />*/}
              <Route path="/customers/*" element={<Customers />} />
              <Route path="/invoices/*" element={<Invoices />} />
              {/*<Route path="/form" element={<Form />} />
              <Route path="/bar" element={<Bar />} />
              <Route path="/pie" element={<Pie />} />
              <Route path="/line" element={<Line />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/geography" element={<Geography />} />*/}
              <Route index element={<Navigate to={`/invoices`} replace />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

const AmplifyAuth = ({ onSuccess }) => {

  const [authState, setAuthState] = useState("signin")
  /**
   * 
   */
  const handleLoginSuccess = () => setAuthState("verify")
  const handleVerifySuccess = () => onSuccess()

  return authState === "signin" ?
    <LoginScene onSuccess={handleLoginSuccess} />
    :
    (authState === "verify" ? <VerifyScene onSuccess={handleVerifySuccess} /> : null)
}

const AmplifyApp = () => {
  const [busy, setBusy] = useState(true);
  const [user, setUser] = useState();
  useEffect(() => {
    handleLogin()
  }, [])
  const handleLogin = () => {
    fetchAuthSession().then(setUser).catch(error => {/** */ }).finally(() => setBusy(false))
  }
  if (busy) return <CircularProgress />
  return user ? <App /> : <AmplifyAuth onSuccess={handleLogin} />
}

const customAuthenticator = () => <Authenticator.Provider><AmplifyApp /></Authenticator.Provider>

export default customAuthenticator