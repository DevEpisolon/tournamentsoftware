import { FormEvent, useEffect, useRef, useState } from "react";
import { useAuth } from "../utils/AuthContext";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utils/FirbaseConfig";
import { Spinner } from "../components/Spinner.tsx";
import { useDialog } from "../utils/DialogProvider.tsx";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { toast } from "react-toastify";

function SignUp() {
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isGoogleLoading, setGoogleLoading] = useState(false);
  const { showDialog } = useDialog();

  useEffect(() => {
    if (currentUser !== null) {
      navigate("/");
    }
  }, [currentUser]);

  const signIn = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, emailRef.current, passwordRef.current);
      toast.success("Successfully signed up");
      navigate("/registerplayer");
    } catch (error) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setGoogleLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log(result);
    } catch (error) {
      handleAuthError(error);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleAuthError = (error: any) => {
    if (!error) return;
    const errorCode: string = (error as any).code ?? "auth/Internal Server Error";
    const code = errorCode.split("auth/")[1];
    const message: string = AUTH_ERRORS[code] || "An error occurred";
    console.error(error, message, errorCode);
    toast.error(message);
  };

  return (
    <div className="flex justify-center items-center w-full h-full">
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign Up</h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <form className="space-y-6" onSubmit={signIn}>
              <fieldset disabled={loading || isGoogleLoading}>
                <InputField
                  label="Email address"
                  type="email"
                  ref={emailRef}
                />
                <InputField
                  label="Password"
                  type="password"
                  ref={passwordRef}
                />
                <SubmitButton loading={loading} />
              </fieldset>
            </form>

            <GoogleSignInButton signInWithGoogle={signInWithGoogle} isGoogleLoading={isGoogleLoading} />
          </div>

          <p className="mt-10 text-center text-sm text-gray-500">
            Already a member?{" "}
            <a href="/signin" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

const InputField = React.forwardRef(({ label, type }, ref) => (
  <div>
    <label htmlFor={label.toLowerCase()} className="block text-sm font-medium leading-6 text-gray-900">
      {label}
    </label>
    <div className="mt-2">
      <input
        id={label.toLowerCase()}
        name={label.toLowerCase()}
        type={type}
        autoComplete={label.toLowerCase()}
        required
        ref={ref}
        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
      />
    </div>
  </div>
));

const SubmitButton = ({ loading }) => (
  <div>
    <button
      type="submit"
      className="mt-3 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >
      {loading ? <Spinner /> : "Sign Up"}
    </button>
  </div>
);

const GoogleSignInButton = ({ signInWithGoogle, isGoogleLoading }) => (
  <button
    onClick={signInWithGoogle}
    disabled={isGoogleLoading}
    className="flex w-full mt-3 items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent"
  >
    {isGoogleLoading ? <Spinner /> : <span>Google</span>}
  </button>
);

const AUTH_ERRORS: { [key: string]: string } = {
  "email-already-in-use": "The email address is already in use by another account.",
  "invalid-email": "The email address is badly formatted.",
  // Add more Firebase error codes here...
};

export default SignUp;

