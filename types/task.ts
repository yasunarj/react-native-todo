export type TaskState = {
  id: number;
  list: string;
  isCompleted: boolean;
  dueDate?: string | null;
  tag: string;
}

export type EditTaskState = {
  text: string;
  date: Date;
  tag: string;
}