import React, { useEffect, useState } from "react";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";

const CALENDAR_ID = "your_calendar_id";
const API_KEY = "your_api_key";

const LandingPage = () => {
  const [events, setEvents] = useState<any[]>([]);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const accessToken = tokenResponse.access_token;

      // Fetch Google Calendar events
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=${API_KEY}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();
      setEvents(data.items || []);
    },
    onError: (error) => {
      console.error("Login Failed:", error);
    },
  });

  return (
    <div>
      <h1>Landing Page</h1>
      <button onClick={() => login()}>Login with Google</button>
      {events.length > 0 && (
        <ul>
          {events.map((event, index) => (
            <li key={index}>
              {event.summary} - {event.start.dateTime || event.start.date}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const App = () => (
  <GoogleOAuthProvider clientId="your_google_client_id">
    <LandingPage />
  </GoogleOAuthProvider>
);

export default App;
