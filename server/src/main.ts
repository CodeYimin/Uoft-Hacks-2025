import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import bodyParser from "body-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import fs from "fs";
import path from "path";
import sound from "sound-play";
import "./discord/bot";
import { Schedule, ScheduleEvent } from "./types";

const PORT = 4444;
let personality = "Asian";

async function notify(personality: string, id: number) {
  let random = 0;
  if (id === 1) {
    // go to class
    random = Math.floor(1 + Math.random() * 2);
  } else if (id === 2) {
    // assignment
    random = 3;
  } else if (id === 3) {
    // quiz
    random = 4;
  } else if (id === 4) {
    // exam
    random = Math.floor(5 + Math.random() * 2);
  } else {
    return;
  }
  const soundpath = "./data/" + personality + "mom_" + random + ".mp3";
  console.log("playing " + soundpath);
  sound.play(path.join(__dirname, soundpath));
}

async function runNotifys() {
  while (true) {
    for (let i = 1; i < 4; i++) {
      notify("mean", 1);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}

runNotifys();

async function run() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY as string);

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
  const prompt = `Read the syllabus and output this JSON schema. If there are multiple sections for lectures/tutorials that would result in a different set of times, select the section, ex LEC0101. Convert dates to javascript date strings. Time is in ms since midnight. Days are 0-indexed starting from Sunday. if there's multiple dates for example weekly stuff, infer the dates and put it in an array:
  
  export interface Assessment {
    name: string;
    type: "Assignment" | "Quiz" | "Exam";
    dates: string[];
    weighting: number;
  }

  export interface SectionTime {
    day: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    startTime: number;
    endTime: number;
  }

  export interface Section {
    type: "Lecture" | "Tutorial" | "Lab";
    times: SectionTime[];
  }

  Return: {assessments: Assessment[], sections: Section[]}`;

  // const prompt = "Return all the key dates from the file"

  const image = {
    inlineData: {
      data: Buffer.from(fs.readFileSync("./src/sta237.pdf")).toString("base64"),
      mimeType: "application/pdf",
    },
  };

  // const resultRaw = (
  //   await model.generateContent([prompt, image])
  // ).response.text();
  // const result = JSON.parse(resultRaw.match(/```json([\S\s]*)```/)?.[1] || "");
  // // const result = mockSchedule;
  // exportToICS(result);

  console.log("whatever");

  const app = express();

  app.use(cors());
  app.use(bodyParser.json());

  app.post("/api/onScheduleEvent", async (req, res) => {
    const event: ScheduleEvent = req.body;

    axios.get(`http://${process.env.ESP_IP}/run`);
    res.status(200).send();
    // if (event.type === "Exam") {
    //   notifyAssignment(event, "Asian", mockSchedule); //Change to personality when we set up the enviorment variables
    // }
    sound.play(path.join(__dirname, "./data/scream.mp3"));
    return;
  });

  app.post("/api/onPersonalityChange", async (req, res) => {});

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

run();

export function addStudySessions(
  schedule: Schedule,
  personality: String
): Schedule {
  const HOUR_IN_MS = 60 * 60 * 1000;
  const DAY_IN_MS = 24 * HOUR_IN_MS;
  const WEEK_IN_MS = 7 * DAY_IN_MS;

  function calculateStudySessionTimes(examDate: Date): Date[] {
    const twoWeeksBefore = new Date(examDate.getTime() - 2 * WEEK_IN_MS);
    const interval = (2 * WEEK_IN_MS) / 4;

    return Array.from({ length: 4 }, (_, i) => {
      return new Date(twoWeeksBefore.getTime() + i * interval);
    });
  }

  const additionalEvents: ScheduleEvent[] = [];
  let multiplier = 1;
  if (personality === "Asian") {
    multiplier = 2;
  } else if (personality === "American") {
    multiplier = 0.5;
  }

  schedule.events.forEach((event) => {
    if (event.type === "Exam") {
      const examDate = new Date(event.startDate);
      const studySessionTimes = calculateStudySessionTimes(examDate);

      studySessionTimes.forEach((sessionTime, index) => {
        additionalEvents.push({
          name: `Study Session ${index + 1} for ${event.name}`,
          description: `Study session to prepare for the ${event.name}.`,
          type: "Study",
          startDate: sessionTime.toISOString(),
          endDate: new Date(
            sessionTime.getTime() + HOUR_IN_MS * multiplier
          ).toISOString(),
        });
      });
    }
  });

  return {
    ...schedule,
    events: [...schedule.events, ...additionalEvents],
  };
}

export function changedPersonality(
  schedule: Schedule,
  personality: String
): Schedule {
  const filteredEvents = schedule.events.filter(
    (event) => event.type !== "Study"
  );
  const updatedSchedule: Schedule = { ...schedule, events: filteredEvents };
  return addStudySessions(updatedSchedule, personality);
}

// run();

// console.log(
//   JSON.stringify(addStudySessions(mockSchedule, personality), null, 2)
// );

// console.log("\n\nCHANGE PERSONALITY\n\n");
// personality = "American";
// console.log(
//   JSON.stringify(changedPersonality(mockSchedule, personality), null, 2)
// );

// console.log("\n\nEXPORT ICS\n\n");
// console.log(exportToICS(mockSchedule));

console.log("running notifys");
