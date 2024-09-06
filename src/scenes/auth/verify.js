import { Input, PhoneNumberField, useAuthenticator, } from "@aws-amplify/ui-react"
import { Button } from "@mui/material";
import { confirmSignIn, } from "aws-amplify/auth";
import { useState } from "react"

const VerifyScene = ({ onSuccess }) => {
  const [busy, setBusy] = useState(false);
  const [challengeResponse, setChallengeResponse] = useState()
  /**
   * 
   */
  const onChange = event => setChallengeResponse(event.target.value)
  /**
   * 
   */
  const handleLogin = () => {
    setBusy(true);
    confirmSignIn({ challengeResponse })
      .then(async confirmResponse => {
        const { isSignedIn, nextStep: { signInStep, additionalInfo } } = confirmResponse;
        if (!isSignedIn) {
          if (signInStep === "CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE") {
            alert(`Please provide a valid code. You have ${additionalInfo.attemptsLeft} attempts left.`)
          }
        } else {
          onSuccess()
        }
      })
      .catch(async error => { console.log(error) })
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
                  <div>Verify</div>
                  <fieldset class="amplify-flex" style={{ flexDirection: "column" }}>
                    <Input id="otp" name="otp" onChange={onChange} />
                  </fieldset>
                  <Button onClick={handleLogin} disabled={busy} variant="contained" color="secondary">
                    Submit
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


export default VerifyScene