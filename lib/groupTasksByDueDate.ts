import { TaskState } from "../types/task";

export type GroupedTasks = {
  [key: string]: TaskState[];
};

export const groupTasksByDueDate = (tasks: TaskState[]): GroupedTasks => {
  const groups: GroupedTasks = {
    "期限なし": [],
    "期限切れ": [],
    "今日": [],
    "明日": [],
    "今週": [],
    "来週以降": [],
  };

  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];

  const tomorrow = new Date();
  tomorrow.setDate(now.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  const weekEnd = new Date();
  weekEnd.setDate(now.getDate() + (7 - now.getDay()));
  const weekEndStr = weekEnd.toISOString().split("T")[0];

  for (const task of tasks) {
    if (!task.dueDate) {
      groups["期限なし"].push(task);
      continue;
    }

    if (task.dueDate < todayStr) {
      groups["期限切れ"].push(task);
    } else if (task.dueDate === todayStr) {
      groups["今日"].push(task);
    } else if (task.dueDate === tomorrowStr) {
      groups["明日"].push(task);
    } else if (task.dueDate <= weekEndStr) {
      groups["今週"].push(task);
    } else {
      groups["来週以降"].push(task);
    }
  }

  return groups;
};
