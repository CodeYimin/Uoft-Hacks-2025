import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Profile from "../components/Profile";

// dotenv.config();

const LandingPage = () => {
  const { isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // return (
  //   <div className="min-h-screen w-screen bg-gray-100">
  //     <div className="flex justify-end p-4">
  //       {isAuthenticated && <Profile />}
  //     </div>
  //     <div className="flex items-center justify-center min-h-screen">
  //       <h1 className="text-5xl font-bold text-black">
  //         Welcome to the Landing Page
  //       </h1>
  //     </div>
  //   </div>
  // );
  return (
    <div className="min-h-screen w-screen bg-gray-100">
      <div>
        {/* Header */}
        <header className="text-center mb-12 pt-36">
          <h1 className="text-4xl text-black font-bold mb-2">
            MomTellMeTo.study
          </h1>
          <p className="text-gray-600">BECAUSE NOBODY WHO ELSE WOULD</p>
        </header>
        {/* Event Description */}
        <div className="flex justify-center w-full">
          <div className="w-full max-w-md bg-gray-100 p-6">
            <h2 className="flex justify-center text-lg text-black font-bold mb-1">
              What is YOUR perspective?
            </h2>
            {/* Perspective Slider */}
            <div className="w-full p-4">
              <div className="flex justify-between text-black">
                <span>Kind</span>
                <span>Neutral</span>
                <span>Fierce</span>
              </div>
              <input
                type="range"
                min="1"
                max="7"
                defaultValue="4"
                className="w-full mt-2 appearance-none h-2 bg-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 slider-thumb"
                step="1"
              />
              <div className="flex justify-between mt-1 text-sm text-black">
                {[...Array(7)].map((_, index) => (
                  <span key={index} className="w-4 text-center">
                    |
                  </span>
                ))}
              </div>
            </div>
            {/* Date and Time */}
            <div className="flex justify-center w-full">
              <button className="w-100px ">Upload the syllabus</button>
            </div>
          </div>
        </div>

        {/* Sign In */}
        <div className="absolute top-2 right-4">
          {isAuthenticated && <Profile />}
        </div>
      </div>
      <div id="particles-js"></div>
      <script src="js/particles.js"></script>
    </div>
  );
};

export default LandingPage;
