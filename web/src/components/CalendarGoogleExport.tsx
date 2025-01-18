import { useAuth0 } from "@auth0/auth0-react";
import { google } from "googleapis";
import { useEffect } from "react";

const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];

async function listEvents(auth: any): Promise<void> {
  const calendar = google.calendar({ version: "v3", auth });
  const res = await calendar.events.list({
    calendarId: "primary",
    timeMin: new Date().toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: "startTime",
  });
  const events = res.data.items;
  if (!events || events.length === 0) {
    console.log("No upcoming events found.");
    return;
  }
  console.log("Upcoming 10 events:");
  events.map((event, i) => {
    if (event.start) {
      const start = event.start.dateTime || event.start.date;
      console.log(`${start} - ${event.summary}`);
    }
  });
}

export async function uploadCalendar() {
  const { isAuthenticated, loginWithRedirect, getAccessTokenSilently } =
    useAuth0();

  if (isAuthenticated) {
    const token = await getAccessTokenSilently();
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: token });
    await listEvents(auth);
  } else {
    await loginWithRedirect();
  }
}

export default function CalendarGoogleExport() {
  useEffect(() => {
    uploadCalendar().catch(console.error);
  }, []);

  return <div>Check the console for upcoming events.</div>;
}
