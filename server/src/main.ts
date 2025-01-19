import * as http from 'http';
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
import { notifyAssignment } from "./discord/bot"
import { mockSchedule } from "./data/mock"
import { Schedule, ScheduleEvent } from "./types";
import { error } from 'console';
import multer from 'multer';

const PORT = 4444;
let personality: "nice" | "mean" | "stern" = "nice";
let currSchedule: Schedule = {events: []}

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

// async function runNotifys() {
//   while (true) {
//     for (let i = 1; i < 4; i++) {
//       notify("mean", 1);
//       await new Promise((resolve) => setTimeout(resolve, 5000));
//     }
//   }
// }

// AI Extracts Syllabus Data

async function generateSchedule(filePath: string) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY as string);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
  const prompt = `You will be provided with a syllabus in the form of a PDF document. Your task is to extract and output a JSON schema representing the schedule described in the syllabus. Follow these instructions carefully:

    1. Parse the syllabus to identify events such as lectures, tutorials, assignments, quizzes, exams, and study sessions. 
      - Identify the name of the class, and the types of events that can be found in the file.
      - In the case that a year is not explicitly identified, assume the current year.
      - For events with multiple sections (e.g., LEC0101, TUT0202), choose a specific section (e.g., LEC0101) to generate the schedule.
      - If there are recurring events (e.g., weekly lectures), infer all relevant dates and include them in an array.

    2. Convert all dates into JavaScript date strings (ISO 8601 format). For times:
      - Represent time as milliseconds since midnight.
      - Days should be 0-indexed starting from Sunday (e.g., Sunday = 0, Monday = 1, etc.).

    3. Output the data using the following TypeScript interfaces:

      export interface Schedule {
        events: ScheduleEvent[];
      }

      export interface ScheduleEvent {
        name: string;              // The name of the event (e.g., "{ClassName} Lecture", "{ClassName} Exam #{n}")
        description: string;       // A brief description of the event. If unavailable, create one.
        type: "Lecture" | "Tutorial" | "Assignment" | "Quiz" | "Exam" | "Study"; 
                                    // The type of the event
        startDate: string;         // The start date and time (ISO 8601 string)
        endDate: string;           // The end date and time (ISO 8601 string)
      }

    4. Ensure your output is in the format:
      { events: ScheduleEvent[] }

    Please parse the PDF, adhere to the requirements, and generate the JSON output.`
  const image = {
    inlineData: {
      data: Buffer.from(fs.readFileSync(filePath)).toString("base64"),
      mimeType: "application/pdf",
    },
  };
  // const resultRaw = (
  //   await model.generateContent([prompt, image])
  // ).response.text();
  // const result = JSON.parse(resultRaw.match(/```json([\S\s]*)```/)?.[1] || "");
  return mockSchedule;

  
}

async function run() {


  const app = express();

  app.use(cors());
  app.use(bodyParser.json());
  

  function axiosrequest() {
    axios.get(`http://${process.env.ESP_IP}/run`, {
      httpAgent: new http.Agent({ keepAlive: true, timeout: 0 }),
      timeout: 0
    }).catch(error => {
      console.log('it crashed but the goat omid saved the day')
      axiosrequest();
    });
  }

  app.post("/api/onScheduleEvent", async (req, res) => {
    const event: ScheduleEvent = req.body;

    axiosrequest();

    res.status(200).send();
    let eventID = 0;
    if (event.type === "Exam") {
      notifyAssignment(event, personality, mockSchedule); //Change to personality when we set up the enviorment variables
    }
    if (event.type === "Lecture" || event.type === "Tutorial") {
      eventID = 1;
    } else if (event.type === "Assignment") {
      eventID = 2;
    } else if (event.type === "Quiz") {
      eventID = 3;
    } else if (event.type === "Exam") {
      eventID = 4;
    };
    console.log(event)
    // sound.play(path.join(__dirname, "./data/scream.mp3"));
    notify(personality, eventID);
    return;
  });

  app.post("/api/onPersonalityChange", async (req, res) => {});

  app.post("/api/updateSliderIndex", async (req, res) => {
    const { sliderIndex } = req.body;

    // axios.get(`http://${process.env.ESP_IP}/run`);
    console.log(`received slider index ${sliderIndex}`);
    if (sliderIndex === 1) {
      personality = "nice";
    } else if (sliderIndex === 4) {
      personality = "stern";
    } else if (sliderIndex === 7) {
      personality = "mean";
    };
    res.status(200).send({ message: "Slider index updated successfully" });
  });

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Save files to 'uploads' folder
    },
    filename: (req, file, cb) => {
      const originalExtension = path.extname(file.originalname); // Get the file extension
      const fileName = `${file.fieldname}-${Date.now()}${originalExtension}`; // Customize filename
      cb(null, fileName);
    },
  });

  const upload = multer({ storage }); 
  
  let recentFile = '';

  app.post("/api/uploadFile", upload.single('file'), async (req, res): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).send({ message: "No file uploaded" });
        return; // Ensure the function doesn't proceed further
      }
  
      console.log(`File uploaded successfully: ${req.file.filename}`);
      
      // Log file metadata (optional)
      console.log('Uploaded file details:', req.file);
  
      // Example processing (replace with your actual logic)
      const filePath = req.file.path;
      recentFile = filePath;
      console.log(`Processing file at ${filePath}...`);

      try {
        let schedule = await generateSchedule(filePath);
        schedule = addStudySessions(schedule, personality)
        console.log(JSON.stringify(schedule))
        res.status(200).send({ "schedule": schedule });
      } catch (error) {
        console.error("Error handling file upload:", error);
        res.status(500).send({ message: "File upload failed" });
      }
      // Send a success response
    } catch (error) {
      // console.error("Error handling file upload:", error.message);
      res.status(500).send({ message: "File upload failed" });
    }
  });
  

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

}

run();

export function addStudySessions(
  schedule: Schedule,
  personality: string
): Schedule {
  const HOUR_IN_MS = 60 * 60 * 1000;
  const DAY_IN_MS = 24 * HOUR_IN_MS;
  const START_HOUR = 9;
  const END_HOUR = 20;

  function calculateStudySessionTimes(examDate: Date): Date[] {
    const fourDaysBefore = new Date(examDate.getTime() - 4 * DAY_IN_MS);
    const interval = (4 * DAY_IN_MS) / 3; // Spread study sessions over 4 days

    return Array.from({ length: 3 }, (_, i) => {
      const sessionTime = new Date(fourDaysBefore.getTime() + i * interval);
      return adjustToAllowedTime(sessionTime);
    });
  }

  function adjustToAllowedTime(date: Date): Date {
    const adjustedDate = new Date(date);

    // If the session time is before 9:00, set it to 9:00
    if (adjustedDate.getHours() < START_HOUR) {
      adjustedDate.setHours(START_HOUR, 0, 0, 0);
    }

    // If the session time is after 20:00, move it to the next day at 9:00
    if (adjustedDate.getHours() >= END_HOUR) {
      adjustedDate.setDate(adjustedDate.getDate() + 1);
      adjustedDate.setHours(START_HOUR, 0, 0, 0);
    }

    return adjustedDate;
  }

  const additionalEvents: ScheduleEvent[] = [];
  let multiplier = 2;

  if (personality === "mean") {
    multiplier = 3;
  } else if (personality === "nice") {
    multiplier = 1;
  }

  schedule.events.forEach((event) => {
    if (event.type === "Exam") {
      const examDate = new Date(event.startDate);
      const studySessionTimes = calculateStudySessionTimes(examDate);

      studySessionTimes.forEach((sessionTime, index) => {
        const endTime = new Date(sessionTime.getTime() + HOUR_IN_MS * multiplier);
        additionalEvents.push({
          name: `Study Session ${index + 1} for ${event.name}`,
          description: `Study session to prepare for the ${event.name}.`,
          type: "Study",
          startDate: sessionTime.toISOString(),
          endDate: adjustToAllowedTime(endTime).toISOString(),
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
  personality: string
): Schedule {
  const filteredEvents = schedule.events.filter(
    (event) => event.type !== "Study"
  );
  const updatedSchedule: Schedule = { ...schedule, events: filteredEvents };
  return addStudySessions(updatedSchedule, personality);
}


console.log("running notifys");
