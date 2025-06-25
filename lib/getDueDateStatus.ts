export const getDueDateStatus = (dueDateStr?: string | null) => {
  if(!dueDateStr) return "none";

  const today = new Date();
  const dueDate = new Date(dueDateStr);

  const todayStr = today.toISOString().split("T")[0];
  const dueStr = dueDate.toISOString().split("T")[0];

  if(dueStr === todayStr) return "today";
  if(dueStr < todayStr) return "overdue";
  return "future";
}