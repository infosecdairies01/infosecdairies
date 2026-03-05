import { LessonContent } from "../lessonContent";
import { module1 } from "./log/module1";
import { module3 } from "./log/module3";
import { module4 } from "./log/module4";
import { module5 } from "./log/module5";
import { module6 } from "./log/module6";
import { quiz1 } from "./log/quiz1";
import { quiz2 } from "./log/quiz2";
import { quiz3 } from "./log/quiz3";
import { quiz4 } from "./log/quiz4";
import { quiz5 } from "./log/quiz5";

// Log Analysis for Beginners course lessons.
// Organized by modules for easier editing and management.
export const lessonContents: LessonContent[] = [
  ...module1,
  ...quiz1,
  ...module3,
  ...quiz2,
  ...module4,
  ...quiz3,
  ...module5,
  ...quiz4,
  ...module6,
  ...quiz5,
];
