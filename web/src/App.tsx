import { Auth0Provider } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import CalendarPage from "./pages/CalendarPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import { Schedule } from "./types";

function App() {
  const [count, setCount] = useState(0);
  const [schedule, setSchedule] = useState<Schedule>({ events: [] });
  const [page, setPage] = useState<"home" | "login">("home");
  const [sliderIndex, setSliderIndex] = useState(1);

  useEffect(() => {
    const path = window.location.pathname;
    if (path === "/login") {
      setPage("login");
    }
  }, []);

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
      {page === "login" ? (
        <LoginPage />
      ) : (
        <div className="flex w-screen flex-col bg-gray-900">
          <header className="text-center mb-12 mt-12">
            <h1 className="text-4xl text-gray-200 font-bold mb-2 text-center">
              MomTellMeTo.study
            </h1>
            <p className="text-gray-300">
              Mom-Level Motivation, Machine-Level Precision
            </p>
          </header>
          <div className="flex w-full justify-center gap-12">
            <LandingPage
              onSliderChange={setSliderIndex}
              sliderIndex={sliderIndex}
              onSchedule={(schedule) => {
                // setPage("calendar")
                setSchedule(schedule);
              }}
            />

            <CalendarPage schedule={schedule} sliderIndex={sliderIndex} />
          </div>
        </div>
      )}
      {/* </Routes>
      </Router> */}
    </Auth0Provider>
  );
}

export default App;
