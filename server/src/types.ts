export interface Schedule {
  events: ScheduleEvent[];
}

export interface ScheduleEvent {
  name: string;
  description: string;
  type: "Lecture" | "Tutorial" | "Assignment" | "Quiz" | "Exam" | "Study";
  startDate: string;
  endDate: string;
}
