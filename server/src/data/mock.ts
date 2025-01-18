import { Schedule } from "../types";

export const mockSchedule: Schedule = {
  events: [
    {
      name: "Math Lecture",
      description: "Introduction to calculus.",
      type: "Lecture",
      startDate: "2025-01-20T09:00:00",
      endDate: "2025-01-20T10:30:00",
    },
    {
      name: "Physics Lecture",
      description: "Kinematics basics.",
      type: "Lecture",
      startDate: "2025-01-20T11:00:00",
      endDate: "2025-01-20T12:30:00",
    },
    {
      name: "Final Exam",
      description: "Final Exam",
      type: "Exam",
      startDate: "2025-01-26T14:00:00",
      endDate: "2025-01-26T16:00:00",
    },
  ],
};
