import { ReactElement, useEffect, useState } from "react";
import { mockSchedule } from "../data/mock";

interface CalendarPageProps {}

export default function CalendarPage({}: CalendarPageProps): ReactElement {
  const numRows = 12;
  const numCols = 5;
  const gridLineWidth = 1;
  const startHour = 8;
  const startDate = new Date("2025-01-20T08:00:00Z");
  const endDate = new Date("2025-01-24T20:00:00Z");

  const [oldDate, setOldDate] = useState<Date>(startDate);
  const [currentDate, setCurrentDate] = useState<Date>(startDate);
  const currentHour = (currentDate.getTime() / 1000 / 60 / 60) % 24;

  function getHours(date: Date): number {
    return (date.getTime() / 1000 / 60 / 60) % 24;
  }

  function dateToHeight(date: Date): number {
    return (
      ((((date.getTime() / 1000 / 60 / 60) % 24) - startHour) / numRows) * 100
    );
  }

  function durationToHeight(start: Date, end: Date): number {
    return ((end.getTime() - start.getTime()) / 1000 / 60 / 60 / numRows) * 100;
  }

  function dateToCol(date: Date): number {
    return Math.floor(
      (date.getTime() - startDate.getTime()) / 1000 / 60 / 60 / 24
    );
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate((prev) => new Date(prev.getTime() + 1000 * 60));
    }, 5);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentDate.getTime() > endDate.getTime()) {
      setCurrentDate(startDate);
    } else if (currentHour >= startHour + numRows) {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getUTCDate() + 1);
      newDate.setUTCHours(startHour);
      setCurrentDate(newDate);
    }

    if (oldDate.getTime() !== currentDate.getTime()) {
      const oldEvents = mockSchedule.events.filter((event) => {
        const startDate = new Date(event.startDate);
        const endDate = new Date(event.endDate);
        return (
          startDate.getTime() <= oldDate.getTime() &&
          endDate.getTime() >= oldDate.getTime()
        );
      });
      const currentEvents = mockSchedule.events.filter((event) => {
        const startDate = new Date(event.startDate);
        const endDate = new Date(event.endDate);
        return (
          startDate.getTime() <= currentDate.getTime() &&
          endDate.getTime() >= currentDate.getTime()
        );
      });
      const newEvents = currentEvents.filter(
        (event) => !oldEvents.includes(event)
      );
      if (newEvents.length > 0) {
        const newEvent = newEvents[0];
        fetch("/api/onScheduleEvent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newEvent),
        });
      }
      setOldDate(currentDate);
    }
  }, [currentDate, currentHour]);

  return (
    <div className="min-h-screen mono">
      <div>Timetable</div>
      <div className="flex bg-orange-300 py-5 w-max">
        {/* Y axis */}
        <div className="bg-rose-200 flex flex-col justify-between items-center">
          {Array.from({ length: numRows + 1 }, (_, i) => (
            <div className="bg-blue-800 h-0 relative">
              {/* <p className="opacity-0">Hello</p> */}
              <p className="top-0 relative text-blue-900 -translate-y-1/2 px-2">
                {(startHour + i).toString().padStart(2, "0")}:00
              </p>
            </div>
          ))}
        </div>
        {/* Timetable grid */}
        <div className="w-[40rem] h-[30rem] relative bg-green-200">
          {/* Vertical grid lines */}
          <div className="absolute top-0 left-0 w-full h-full flex justify-evenly">
            {Array.from({ length: numCols - 1 }, () => (
              <div className="w-0 relative">
                <div
                  className={`bg-red-500 w-[${gridLineWidth}px] h-full relative left-0 -translate-x-1/2`}
                />
              </div>
            ))}
          </div>
          {/* Horizontal grid lines */}
          <div className="absolute top-0 left-0 w-full h-full flex justify-evenly flex-col">
            {Array.from({ length: numRows - 1 }, () => (
              <div className="h-0 relative">
                <div
                  className={`bg-red-500 h-[${gridLineWidth}px] w-full relative top-0 -translate-y-1/2`}
                />
              </div>
            ))}
          </div>
          {/* Classes */}
          <div className="h-full w-full relative">
            {mockSchedule.events.map((event, i) => {
              return (
                <div
                  key={i}
                  className="absolute bg-blue-500 border border-black"
                  style={{
                    top: `${dateToHeight(new Date(event.startDate))}%`,
                    left: `${
                      (dateToCol(new Date(event.startDate)) / numCols) * 100
                    }%`,
                    height: `${durationToHeight(
                      new Date(event.startDate),
                      new Date(event.endDate)
                    )}%`,
                    width: `${(1 / numCols) * 100}%`,
                  }}
                >
                  {event.name}
                </div>
              );
            })}
          </div>

          {/* Cursor */}
          <div
            className="absolute left-0 w-1/5 h-1 bg-red-500"
            style={{
              top: `${dateToHeight(currentDate)}%`,
              left: `${(dateToCol(currentDate) / numCols) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
