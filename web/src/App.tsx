import { Auth0Provider } from "@auth0/auth0-react";
import { useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import CalendarPage from "./pages/CalendarPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import { Schedule } from "./types";

function App() {
  const [count, setCount] = useState(0);
  const [schedule, setSchedule] = useState<Schedule>({events: []});
  const [page, setPage] = useState<string>("home");

  console.log(schedule)

  return (
    <Auth0Provider
      domain="dev-0lhvkegz23fmv54q.us.auth0.com"
      clientId="EdlonjAKtmxU4eufGFKyflSsrEH6QxJP"
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      {/* <Router>
        <Routes> */}
          {/* <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<LandingPage onSchedule={() => {
            navigate("/calendar");
            setSchedule(schedule);
          }}/>} />
          <Route path="/calendar" element={<CalendarPage schedule={schedule} />} /> */}
          
            <LandingPage onSchedule={(schedule) => {
              // setPage("calendar")
              setSchedule(schedule);
            }}/>
          
          <CalendarPage schedule={schedule} />
        {/* </Routes>
      </Router> */}
    </Auth0Provider>
  );
}

export default App;
