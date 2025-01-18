import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import dotenv from "dotenv";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Profile from "../components/Profile";

dotenv.config();

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

  return (
    <div className="min-h-screen w-screen bg-gray-100">
      <div className="flex justify-end p-4">
        {isAuthenticated && <Profile />}
      </div>
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-5xl font-bold text-black">
          Welcome to the Landing Page
        </h1>
      </div>
    </div>
  );
};

export default LandingPage;

async function createCalendarEvent() {
  console.log("debughere, creating calendar event");

  const clientId = process.env.CLIENT_ID || "";
  const clientSecret = process.env.CLIENT_SECRET || "";
  const audience = process.env.AUDIENCE || "";

  const tokenOptions = {
    method: "POST",
    url: "https://dev-0lhvkegz23fmv54q.us.auth0.com/oauth/token",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    data: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
      audience: audience,
    }),
  };

  try {
    const tokenResponse = await axios.request(tokenOptions);
    const accessToken = tokenResponse.data.access_token;

    const event = {
      summary: "eventName",
      description: "eventDescription",
      start: {
        dateTime: "2025-01-21T09:00:00-07:00",
        timeZone: "America/Los_Angeles",
      },
    };

    await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      }
    );
  } catch (error) {
    console.error(error);
  }
}
