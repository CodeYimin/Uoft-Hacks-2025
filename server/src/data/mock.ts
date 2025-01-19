import { Schedule } from "../types";

export const mockSchedule: Schedule = {
  events: [
    {
      name: "PSYC 149/BBB 249 Lecture",
      description: "Lecture on Development/Plasticity [15]",
      type: "Lecture",
      startDate: "2025-01-20T09:00:00Z",
      endDate: "2025-01-20T11:00:00Z",
    },
    {
      name: "PSYC 149/BBB 249 Tutorial",
      description: "Tutorial on Case Study: Cognitive Plasticity",
      type: "Tutorial",
      startDate: "2025-01-20T12:00:00Z",
      endDate: "2025-01-20T13:30:00Z",
    },
    {
      name: "PSYC 149/BBB 249 Quiz",
      description: "Working Memory Quiz",
      type: "Quiz",
      startDate: "2025-01-21T15:00:00Z",
      endDate: "2025-01-21T16:00:00Z",
    },
    {
      name: "PSYC 149/BBB 249 Lecture",
      description: "Lecture on Development/Plasticity [15]",
      type: "Lecture",
      startDate: "2025-01-22T09:00:00Z",
      endDate: "2025-01-22T11:00:00Z",
    },
    {
      name: "PSYC 149/BBB 249 Tutorial",
      description: "Tutorial on Integration of Neural Development Concepts",
      type: "Tutorial",
      startDate: "2025-01-23T12:00:00Z",
      endDate: "2025-01-23T13:30:00Z",
    },

    {
      name: "PSYC 149/BBB 249 Paper Due",
      description: "Executive Control Paper due",
      type: "Assignment",
      startDate: "2025-01-24T09:00:00Z",
      endDate: "2025-01-24T10:00:00Z",
    },
    {
      name: "PSYC 149/BBB 249 Exam",
      description: "Exam on Covering Chapters 9, 12, and 15",
      type: "Exam",
      startDate: "2025-01-24T17:00:00Z",
      endDate: "2025-01-24T19:00:00Z",
    },
  ],
};

export const mockSchedule2: Schedule = {
  events: [
    {
      name: "CS 69 Software Design Assignment",
      description: "An assignment covering SOLID Principles.",
      type: "Assignment",
      startDate: "2025-01-21T10:00:00Z",
      endDate: "2025-01-21T11:00:00Z",
    },
    {
      name: "CS 69 Software Design Quiz",
      description: "A quiz covering Clean Architecture.",
      type: "Quiz",
      startDate: "2025-01-21T11:00:00Z",
      endDate: "2025-01-21T12:00:00Z",
    },
    {
      name: "CS 69 Software Design Exam",
      description: "An exam on SOLID Principles.",
      type: "Exam",
      startDate: "2025-01-24T14:00:00Z",
      endDate: "2025-01-24T15:00:00Z",
    },
  ],
};
