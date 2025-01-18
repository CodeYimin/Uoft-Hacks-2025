// Exams, assignments, quizzes, etc.
export interface Assessment {
  name: string;
  type: "Assignment" | "Quiz" | "Exam";
  date: string;
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
