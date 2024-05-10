import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../utils/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../utils/FirbaseConfig";
import { toast } from "react-toastify";
import { Spinner } from "@material-tailwind/react";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function SignUp() {
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser !== null) {
      navigate("/");
    }
  }, [currentUser]);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    alert("Sign Up");
    setLoading(true);

    await sleep(2000);
    setLoading(false);
    return;

    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        emailRef.current,
        passwordRef.current
      );
    } catch (error) {
      if (error == null) {
        return;
      }
      const errorCode: string =
        (error as any).code ?? "auth/Internal Server Error";
      const code = errorCode.split("auth/")[1];
      const message: string = AUTH_ERRORS[code];

      console.error(error, message, errorCode);

      toast.error(message);
    }
    setLoading(false);
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
    } catch (error) {
      if (error == null) {
        return;
      }
      const errorCode: string =
        (error as any).code ?? "auth/Internal Server Error";
      const code = errorCode.split("auth/")[1];
      const message: string = AUTH_ERRORS[code];

      console.error(error, message, errorCode);

      toast(message);
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-full">
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            className="mx-auto h-10 w-auto"
            src="https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/86.png"
            alt="Your Company"
          />
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign Up
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <form className="space-y-6" onSubmit={signIn}>
              <fieldset disabled={loading}>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      onChange={(e) => {
                        emailRef.current = e.target.value;
                      }}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Password
                  </label>
                  <div className="mt-2">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      onChange={(e) => {
                        passwordRef.current = e.target.value;
                      }}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                {loading && (
                  <Spinner
                    className="size-10 mt-3 flex justify-center items-center w-full"
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  />
                )}

                <div>
                  <button
                    type="submit"
                    className=" mt-3 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    // onClick={signIn}
                  >
                    Sign Up
                  </button>
                </div>
              </fieldset>
            </form>

            <div>
              <div className="relative mt-10">
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm font-medium leading-6">
                  <span className="bg-white px-6 text-gray-900">
                    Or continue with
                  </span>
                </div>
              </div>

              <button
                onClick={signInWithGoogle}
                disabled={loading}
                className="flex w-full mt-3 items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent"
              >
                <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                  <path
                    d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                    fill="#EA4335"
                  />
                  <path
                    d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                    fill="#34A853"
                  />
                </svg>
                <span className="text-sm font-semibold leading-6">Google</span>
              </button>
            </div>
          </div>

          <p className="mt-10 text-center text-sm text-gray-500">
            Already a member?{" "}
            <a
              href="/signin"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

const AUTH_ERRORS: { [key: string]: string } = {
  "admin-restricted-operation":
    "This operation is restricted to administrators only.",
  "argument-error": "",
  "app-not-authorized":
    "This app, identified by the domain where it's hosted, is not authorized to use Firebase Authentication with the provided API key. Review your key configuration in the Google API console.",
  "app-not-installed":
    "The requested mobile application corresponding to the identifier (Android package name or iOS bundle ID) provided is not installed on this device.",
  "captcha-check-failed":
    "The reCAPTCHA response token provided is either invalid, expired, already used or the domain associated with it does not match the list of whitelisted domains.",
  "code-expired":
    "The SMS code has expired. Please re-send the verification code to try again.",
  "cordova-not-ready": "Cordova framework is not ready.",
  "cors-unsupported": "This browser is not supported.",
  "credential-already-in-use":
    "This credential is already associated with a different user account.",
  "custom-token-mismatch":
    "The custom token corresponds to a different audience.",
  "requires-recent-login":
    "This operation is sensitive and requires recent authentication. Log in again before retrying this request.",
  "dynamic-link-not-activated":
    "Please activate Dynamic Links in the Firebase Console and agree to the terms and conditions.",
  "email-change-needs-verification":
    "Multi-factor users must always have a verified email.",
  "email-already-in-use":
    "The email address is already in use by another account.",
  "expired-action-code": "The action code has expired. ",
  "cancelled-popup-request":
    "This operation has been cancelled due to another conflicting popup being opened.",
  "internal-error": "An internal error has occurred.",
  "invalid-app-credential":
    "The phone verification request contains an invalid application verifier. The reCAPTCHA token response is either invalid or expired.",
  "invalid-app-id":
    "The mobile app identifier is not registed for the current project.",
  "invalid-user-token":
    "This user's credential isn't valid for this project. This can happen if the user's token has been tampered with, or if the user isn't for the project associated with this API key.",
  "invalid-auth-event": "An internal error has occurred.",
  "invalid-verification-code":
    "The SMS verification code used to create the phone auth credential is invalid. Please resend the verification code sms and be sure use the verification code provided by the user.",
  "invalid-continue-uri":
    "The continue URL provided in the request is invalid.",
  "invalid-cordova-configuration":
    "The following Cordova plugins must be installed to enable OAuth sign-in: cordova-plugin-buildinfo, cordova-universal-links-plugin, cordova-plugin-browsertab, cordova-plugin-inappbrowser and cordova-plugin-customurlscheme.",
  "invalid-custom-token":
    "The custom token format is incorrect. Please check the documentation.",
  "invalid-dynamic-link-domain":
    "The provided dynamic link domain is not configured or authorized for the current project.",
  "invalid-email": "The email address is badly formatted.",
  "invalid-api-key":
    "Your API key is invalid, please check you have copied it correctly.",
  "invalid-cert-hash": "The SHA-1 certificate hash provided is invalid.",
  "invalid-credential":
    "The supplied auth credential is malformed or has expired.",
  "invalid-message-payload":
    "The email template corresponding to this action contains invalid characters in its message. Please fix by going to the Auth email templates section in the Firebase Console.",
  "invalid-multi-factor-session":
    "The request does not contain a valid proof of first factor successful sign-in.",
  "invalid-oauth-provider":
    "EmailAuthProvider is not supported for this operation. This operation only supports OAuth providers.",
  "invalid-oauth-client-id":
    "The OAuth client ID provided is either invalid or does not match the specified API key.",
  "unauthorized-domain":
    "This domain is not authorized for OAuth operations for your Firebase project. Edit the list of authorized domains from the Firebase console.",
  "invalid-action-code":
    "The action code is invalid. This can happen if the code is malformed, expired, or has already been used.",
  "wrong-password":
    "The password is invalid or the user does not have a password.",
  "invalid-persistence-type":
    "The specified persistence type is invalid. It can only be local, session or none.",
  "invalid-phone-number":
    "The format of the phone number provided is incorrect. Please enter the phone number in a format that can be parsed into E.164 format. E.164 phone numbers are written in the format [+][country code][subscriber number including area code].",
  "invalid-provider-id": "The specified provider ID is invalid.",
  "invalid-recipient-email":
    "The email corresponding to this action failed to send as the provided recipient email address is invalid.",
  "invalid-sender":
    "The email template corresponding to this action contains an invalid sender email or name. Please fix by going to the Auth email templates section in the Firebase Console.",
  "invalid-verification-id":
    "The verification ID used to create the phone auth credential is invalid.",
  "invalid-tenant-id": "The Auth instance's tenant ID is invalid.",
  "multi-factor-info-not-found":
    "The user does not have a second factor matching the identifier provided.",
  "multi-factor-auth-required":
    "Proof of ownership of a second factor is required to complete sign-in.",
  "missing-android-pkg-name":
    "An Android Package Name must be provided if the Android App is required to be installed.",
  "auth-domain-config-required":
    "Be sure to include authDomain when calling firebase.initializeApp(), by following the instructions in the Firebase console.",
  "missing-app-credential":
    "The phone verification request is missing an application verifier assertion. A reCAPTCHA response token needs to be provided.",
  "missing-verification-code":
    "The phone auth credential was created with an empty SMS verification code.",
  "missing-continue-uri": "A continue URL must be provided in the request.",
  "missing-iframe-start": "An internal error has occurred.",
  "missing-ios-bundle-id":
    "An iOS Bundle ID must be provided if an App Store ID is provided.",
  "missing-multi-factor-info": "No second factor identifier is provided.",
  "missing-multi-factor-session":
    "The request is missing proof of first factor successful sign-in.",
  "missing-or-invalid-nonce":
    "The request does not contain a valid nonce. This can occur if the SHA-256 hash of the provided raw nonce does not match the hashed nonce in the ID token payload.",
  "missing-phone-number":
    "To send verification codes, provide a phone number for the recipient.",
  "missing-verification-id":
    "The phone auth credential was created with an empty verification ID.",
  "app-deleted": "This instance of FirebaseApp has been deleted.",
  "account-exists-with-different-credential":
    "An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address.",
  "network-request-failed":
    "A network error (such as timeout, interrupted connection or unreachable host) has occurred.",
  "no-auth-event": "An internal error has occurred.",
  "no-such-provider":
    "User was not linked to an account with the given provider.",
  "null-user":
    "A null user object was provided as the argument for an operation which requires a non-null user object.",
  "operation-not-allowed":
    "The given sign-in provider is disabled for this Firebase project. Enable it in the Firebase console, under the sign-in method tab of the Auth section.",
  "operation-not-supported-in-this-environment":
    'This operation is not supported in the environment this application is running on. "location.protocol" must be http, https or chrome-extension and web storage must be enabled.',
  "popup-blocked":
    "Unable to establish a connection with the popup. It may have been blocked by the browser.",
  "popup-closed-by-user":
    "The popup has been closed by the user before finalizing the operation.",
  "provider-already-linked":
    "User can only be linked to one identity for the given provider.",
  "quota-exceeded": "The project's quota for this operation has been exceeded.",
  "redirect-cancelled-by-user":
    "The redirect operation has been cancelled by the user before finalizing.",
  "redirect-operation-pending":
    "A redirect sign-in operation is already pending.",
  "rejected-credential":
    "The request contains malformed or mismatching credentials.",
  "second-factor-already-in-use":
    "The second factor is already enrolled on this account.",
  "maximum-second-factor-count-exceeded":
    "The maximum allowed number of second factors on a user has been exceeded.",
  "tenant-id-mismatch":
    "The provided tenant ID does not match the Auth instance's tenant ID",
  timeout: "The operation has timed out.",
  "user-token-expired":
    "The user's credential is no longer valid. The user must sign in again.",
  "too-many-requests":
    "We have blocked all requests from this device due to unusual activity. Try again later.",
  "unauthorized-continue-uri":
    "The domain of the continue URL is not whitelisted.  Please whitelist the domain in the Firebase console.",
  "unsupported-first-factor":
    "Enrolling a second factor or signing in with a multi-factor account requires sign-in with a supported first factor.",
  "unsupported-persistence-type":
    "The current environment does not support the specified persistence type.",
  "unsupported-tenant-operation":
    "This operation is not supported in a multi-tenant context.",
  "unverified-email": "The operation requires a verified email.",
  "user-cancelled":
    "The user did not grant your application the permissions it requested.",
  "user-not-found":
    "There is no user record corresponding to this identifier. The user may have been deleted.",
  "user-disabled": "The user account has been disabled by an administrator.",
  "user-mismatch":
    "The supplied credentials do not correspond to the previously signed in user.",
  "user-signed-out": "",
  "weak-password": "The password must be 6 characters long or more.",
  "web-storage-unsupported":
    "This browser is not supported or 3rd party cookies and data may be disabled.",
};

export default SignUp;
