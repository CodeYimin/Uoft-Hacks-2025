import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <button
      className="bg-gradient-to-r from-red-500 to-red-700 text-white text-xs p-2 rounded-lg shadow-lg hover:from-red-600 hover:to-red-800 transform hover:scale-105 transition-transform duration-300"
      onClick={() =>
        logout({ logoutParams: { returnTo: window.location.origin } })
      }
    >
      Log Out
    </button>
  );
};

export default LogoutButton;
