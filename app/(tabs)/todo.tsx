import { useState, useEffect } from "react";
import { SwipeListView } from "react-native-swipe-list-view";
import {
  Text,
  View,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type TaskState = {
  id: number;
  list: string;
  isCompleted: boolean;
};

const TodoScreen = () => {
  const [task, setTask] = useState<string>("");
  const [tasks, setTasks] = useState<TaskState[]>([]);
  const [hideCompleted, setHideCompleted] = useState<boolean>(false);

  useEffect(() => {
    const loadTasksFromStorage = async () => {
      try {
        const json = await AsyncStorage.getItem("TASKS");
        if (json) {
          const savedTasks: TaskState[] = JSON.parse(json);
          setTasks(savedTasks);
        }
      } catch (e) {
        console.error("データの取得に失敗しました", e);
      }
    };
    loadTasksFromStorage();
  }, []);

  const saveTasksToStorage = async (tasks: TaskState[]) => {
    try {
      const json = JSON.stringify(tasks);
      await AsyncStorage.setItem("TASKS", json);
    } catch (e) {
      console.error("保存できませんでした", e);
    }
  };

  useEffect(() => {
    const changedTasks = async () => {
      await saveTasksToStorage(tasks);
    };
    changedTasks();
  }, [tasks]);

  const addTask = async () => {
    if (task.trim() !== "") {
      const newTask = {
        id: Date.now(),
        list: task,
        isCompleted: false,
      };

      setTasks((prev) => [...prev, newTask]);
      setTask("");
    }
  };

  const handleDelete = async (id: number) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const toggleTaskCompletion = async (id: number) => {
    setTasks((prevTasks) => {
      return prevTasks.map((task) =>
        task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
      );
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>📝 ToDoアプリ</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="タスクを入力してください"
          value={task}
          onChangeText={setTask}
        />
        <Button title="追加" onPress={addTask} />
      </View>

      <View style={styles.toggleContainer}>
        <Button
          title={hideCompleted ? "完了タスクを表示" : "完了タスクを非表示"}
          onPress={() => setHideCompleted((prev) => !prev)}
        />
      </View>

      <SwipeListView
        data={
          hideCompleted
            ? tasks
                .filter((t) => !t.isCompleted)
                .map((item) => ({
                  key: String(item.id),
                  id: item.id,
                  isCompleted: item.isCompleted,
                  list: item.list,
                }))
            : tasks.map((item) => ({
                key: String(item.id),
                id: item.id,
                isCompleted: item.isCompleted,
                list: item.list,
              }))
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => toggleTaskCompletion(item.id)}
            style={({ pressed }) => [styles.taskItem, { opacity: 1 }]}
          >
            <Text
              style={[
                styles.taskText,
                item.isCompleted && styles.completedText,
              ]}
            >
              {item.list}
            </Text>
          </Pressable>
        )}
        renderHiddenItem={({ item }) => (
          <View style={styles.rowBack}>
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <Text style={styles.deleteText}>削除</Text>
            </TouchableOpacity>
          </View>
        )}
        rightOpenValue={-75}
      />
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
  },
  rowFront: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
  },
  rowBack: {
    height: "100%",
    alignItems: "flex-end",
    backgroundColor: "red",
    flex: 1,
    justifyContent: "center",
    paddingRight: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  deleteText: {
    color: "#fff",
    fontWeight: "bold",
  },
  taskItem: {
    padding: 15,
    backgroundColor: "#eee",
    borderRadius: 5,
    marginBottom: 10,
  },
  taskText: {
    fontSize: 16,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#9f9595",
  },
  toggleContainer: {
    marginBottom: 10,
    alignItems: "flex-end",
  }
});

export default TodoScreen;
