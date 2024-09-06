import { PhoneNumberField } from "@aws-amplify/ui-react"
import { Button } from "@mui/material";
import { signIn } from "aws-amplify/auth";
import { useState } from "react"

const LoginScene = ({ onSuccess }) => {
  const [busy, setBusy] = useState(false);
  const [phone_number, setPhoneNumber] = useState()
  const [dialCode, setDialCode] = useState("+91")
  /**
   * 
   */
  const onDialCodeChange = code => setDialCode(code)
  /**
   * 
   */
  const onChange = event => setPhoneNumber(event.target.value)

  const handleLogin = () => {
    setBusy(true);
    signIn({ username: dialCode + phone_number, options: { authFlowType: "CUSTOM_WITHOUT_SRP" } })
      .then(async signInResponse => {
        const { isSignedIn, nextStep: { signInStep } } = signInResponse;
        if (!isSignedIn) {
          switch (signInStep) {
            case "CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE":
            case "CONFIRM_SIGN_UP":
              onSuccess()
              break;
          }
        }
      })
      .catch(async error => {
        switch (error.name) {
          case "UserNotFoundException":
            alert("You are not a registered user. Please contact warranty book support.")
            break;
        }
      })
      .finally(() => setBusy(false));
  }


  return (
    <div data-amplify-authenticator data-variation="modal">
      <div data-amplify-container>
        <div data-amplify-router>
          <div
            data-amplify-router-content=""
            role="tabpanel"
            id="amplify-id-:r1:-panel-signIn"
            aria-labelledby="amplify-id-:r1:-tab-signIn"
            class="amplify-tabs__panel amplify-tabs__panel--active">
            <div>
              <div data-amplify-form data-amplify-authenticator-signin>
                <div class="amplify-flex" style={{ flexDirection: "column" }}>
                  <div>Login</div>
                  <fieldset class="amplify-flex" style={{ flexDirection: "column" }}>
                    <PhoneNumberField defaultDialCode="+91" onDialCodeChange={onDialCodeChange} onChange={onChange} />
                  </fieldset>
                  <Button onClick={handleLogin} disabled={busy} variant="contained" color="secondary">
                    Sign in
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


export default LoginScene