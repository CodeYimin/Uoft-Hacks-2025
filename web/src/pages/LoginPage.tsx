import { useAuth0 } from "@auth0/auth0-react";
import { ReactElement } from "react";

const LoginButton = ({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) => {
  const { loginWithRedirect } = useAuth0();

  return (
    <button
      className={`w-1/3 p-2 rounded hover:bg-opacity-80 flex items-center justify-center space-x-2 ${className}`}
      onClick={() => loginWithRedirect()}
    >
      {children}
    </button>
  );
};

export default function LoginPage(): ReactElement {
  return (
    <div className="flex items-center justify-center min-h-screen w-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-124">
        <div className="text-center text-5xl font-semibold mb-4 text-black">
          MomTellMeTo.study
        </div>
        <h2 className="text-2xl font-bold mb-0 text-center text-black mt-10">
          Welcome!
        </h2>
        <h3 className="text-lg text-center text-black mb-6">
          Please sign in to continue.
        </h3>
        <div className="flex flex-col space-y-4 items-center">
          <LoginButton className="bg-theme-orange text-white">
            <span>Login</span>
          </LoginButton>
        </div>
      </div>
    </div>
  );
}
