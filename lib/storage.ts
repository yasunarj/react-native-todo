import AsyncStorage from "@react-native-async-storage/async-storage";
import { TaskState } from "../types/task";

const loadTasks = async (): Promise<TaskState[]> => {
  try {
    const json = await AsyncStorage.getItem("TASKS");
    return json ? JSON.parse(json) : [];
  } catch(e) {
    console.error("データを取得できませんでした", e);
    return [];
  }
}

const saveTasks = async (tasks: TaskState[]) => {
  try {
    const json = JSON.stringify(tasks);
    await AsyncStorage.setItem("TASKS", json)
  } catch(e) {
    console.error("データを保存できませんでした", e);
  }
}

export { loadTasks, saveTasks };


