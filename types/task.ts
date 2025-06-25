export type TaskState = {
  id: number;
  list: string;
  isCompleted: boolean;
  dueDate?: string | null;
}