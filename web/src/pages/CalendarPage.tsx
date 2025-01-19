import { ReactElement, useEffect, useState } from "react";
import { Schedule } from "../types";

// let currSchedule: Schedule = mockSchedule;

interface CalendarPageProps {
  schedule: Schedule;
  sliderIndex: number;
}

export default function CalendarPage({
  sliderIndex,
  schedule: currSchedule,
}: CalendarPageProps): ReactElement {
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

  function typeToColour(type: String): string {
    switch (type) {
      case "Lecture":
        return "bg-blue-500";
      case "Tutorial":
        return "bg-green-500";
      case "Exam":
        return "bg-red-500";
      case "Quiz":
        return "bg-yellow-500";
      case "Assignment":
        return "bg-purple-500";
      case "Study":
        return "bg-orange-500";
      default:
        return "bg-blue-500";
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate((prev) => new Date(prev.getTime() + 1000 * 60));
    }, 20);
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
      const oldEvents = currSchedule.events.filter((event) => {
        const startDate = new Date(event.startDate);
        const endDate = new Date(event.endDate);
        return (
          startDate.getTime() <= oldDate.getTime() &&
          endDate.getTime() >= oldDate.getTime()
        );
      });
      const currentEvents = currSchedule.events.filter((event) => {
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
          body: JSON.stringify({
            event: newEvent,
            schedule: currSchedule,
            sliderIndex: sliderIndex,
          }),
        });
      }
      setOldDate(currentDate);
    }
  }, [currentDate, currentHour]);

  return (
    <div className="min-h-screen w-max mono flex flex-col items-center overflow-x-hidden bg-gray-900 text-gray-100 ">
      <h1 className="text-3xl font-bold mb-4">Timetable</h1>
      <div className="flex w-max bg-gray-800 rounded-md shadow-lg px-5 py-6">
        {/* Y axis */}
        <div className="flex flex-col justify-between items-center">
          {Array.from({ length: numRows + 1 }, (_, i) => (
            <div className="relative">
              <p
                className="relative text-sm text-gray-300 -translate-y-1/2 pr-2"
                hidden={i === 0}
              >
                {(startHour + i).toString().padStart(2, "0")}:00
              </p>
            </div>
          ))}
        </div>
        {/* Timetable grid */}
        <div className="w-[40rem] h-[30rem] relative overflow-hidden">
          {/* X axis */}
          <div className="absolute top-0 flex justify-around items-center w-full">
            {["MON", "TUE", "WED", "THU", "FRI"].map((day, i) => (
              <div className="relative" key={i}>
                <p className="text-sm text-gray-300">{day}</p>
              </div>
            ))}
          </div>
          {/* Vertical grid lines */}
          <div className="absolute top-0 left-0 w-full h-full flex justify-evenly">
            {Array.from({ length: numCols - 1 }, () => (
              <div className="w-0 relative">
                <div
                  className={`bg-gray-600 h-full relative left-0 -translate-x-1/2`}
                  style={{ width: `${gridLineWidth}px` }}
                />
              </div>
            ))}
          </div>
          {/* Horizontal grid lines */}
          <div className="absolute top-0 left-0 w-full h-full flex justify-evenly flex-col">
            {Array.from({ length: numRows - 1 }, () => (
              <div className="h-0 relative">
                <div
                  className={`bg-gray-600 w-full relative top-0 -translate-y-1/2`}
                  style={{ height: `${gridLineWidth}px` }}
                />
              </div>
            ))}
          </div>
          {/* Classes */}
          <div className="h-full w-full relative">
            {currSchedule.events.map((event, i) => {
              return (
                <div
                  key={i}
                  className={`absolute border border-black text-center text-xs p-1 rounded-md shadow-lg transition-all duration-300 hover:scale-105 ${typeToColour(
                    event.type
                  )} hover:${typeToColour(event.type).replace("500", "400")}`}
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
            className="absolute left-0 w-1/5 h-[0.2rem] bg-red-500 rounded-full shadow-md"
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
