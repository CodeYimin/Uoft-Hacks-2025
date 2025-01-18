import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from "./Logout";

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    isAuthenticated && (
      <div className="flex items-center space-x-4 bg-black p-5 rounded-md">
        <img
          src={user.picture}
          alt={user.name}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <h2 className="text-lg font-semibold">{user.name}</h2>
          <p className="text-sm">{user.email}</p>
        </div>
        <LogoutButton />
      </div>
    )
  );
};

export default Profile;
