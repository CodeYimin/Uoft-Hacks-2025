import fs from "fs";
import path from "path";
import { Schedule, ScheduleEvent } from "./types";

export function exportToICS(schedule: Schedule): void {
  const formatDate = (date: string): string => {
    return date.replace(/[-:]/g, "").replace("T", "").split(".")[0] + "Z";
  };

  const generateUID = (event: ScheduleEvent): string => {
    return `${event.name}-${Date.now()}@generated`;
  };

  let icsContent =
    "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Your Organization//Schedule Export//EN\n";

  schedule.events.forEach((event) => {
    icsContent += `BEGIN:VEVENT\n`;
    icsContent += `SUMMARY:${event.name}\n`;
    icsContent += `DESCRIPTION:${event.description}\n`;
    icsContent += `DTSTART:${formatDate(event.startDate)}\n`;
    icsContent += `DTEND:${formatDate(event.endDate)}\n`;
    icsContent += `UID:${generateUID(event)}\n`;
    icsContent += `END:VEVENT\n`;
  });

  icsContent += "END:VCALENDAR\n";

  const filePath = path.join(
    process.env.HOME || process.env.USERPROFILE || ".",
    "Downloads",
    "schedule.ics"
  );
  fs.writeFileSync(filePath, icsContent);

  console.log(`ICS file saved to: ${filePath}`);
}
