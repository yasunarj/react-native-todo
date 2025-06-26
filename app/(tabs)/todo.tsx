import DateTimePicker from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import TaskItem from "../../components/TaskItem";
import { loadTasks, saveTasks } from "@/lib/storage";
import { TaskState } from "../../types/task";

const TodoScreen = () => {
  const [task, setTask] = useState<string>("");
  const [tasks, setTasks] = useState<TaskState[]>([]);
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [hideCompleted, setHideCompleted] = useState<boolean>(false);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const sortedTasks = [...tasks].sort((a, b) =>
    (a.dueDate || "9999-12-31").localeCompare(b.dueDate || "9999-12-31")
  );

  useEffect(() => {
    const loadTasksFromStorage = async () => {
      const result = await loadTasks();
      setTasks(result);
    };
    loadTasksFromStorage();
  }, []);

  useEffect(() => {
    const changedTasks = async () => {
      await saveTasks(tasks);
    }
    changedTasks();
  }, [tasks]);

  const addTask = async () => {
    if (task.trim() !== "") {
      const newTask = {
        id: Date.now(),
        list: task,
        isCompleted: false,
        dueDate: showDatePicker ? dueDate.toISOString().split("T")[0] : null,
      };

      setTasks((prev) => [...prev, newTask]);
      setTask("");
      setDueDate(new Date());
      setShowDatePicker(false);
    }
  };

  const handleDelete = async (id: number) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const handleClearCompleted = () => {
    const deleteLists = tasks.filter((task) => task.isCompleted);

    if (deleteLists.length === 0) {
      Alert.alert("情報", "削除するタスクがありません");
      return;
    }

    Alert.alert(
      "確認",
      "削除を実行してよろしいですか？",
      [
        {
          text: "キャンセル",
          style: "cancel",
        },
        {
          text: "削除する",
          style: "destructive",
          onPress: () => {
            setTasks((prevTasks) =>
              prevTasks.filter((task) => !task.isCompleted)
            );
            Alert.alert("削除完了", "完了したタスクを削除しました");
          },
        },
      ],
      { cancelable: true }
    );
  };

  const toggleTaskCompletion = async (id: number) => {
    setTasks((prevTasks) => {
      return prevTasks.map((task) =>
        task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
      );
    });
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? "#000" : "#fff" },
      ]}
    >
      <Text style={[styles.heading, { color: isDarkMode ? "#fff" : "#000" }]}>
        📝 ToDoアプリ
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { color: isDarkMode ? "#fff" : "#000" }]}
          placeholder="タスクを入力してください"
          value={task}
          onChangeText={setTask}
        />
        <Button title="追加" onPress={addTask} />
      </View>

      <View style={styles.dateContainer}>
        <Text>期限: {dueDate.toISOString().split("T")[0]}</Text>
        <Button
          title="日付を選択"
          onPress={() => setShowDatePicker(true)}
        ></Button>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={dueDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            if (selectedDate) {
              setDueDate(selectedDate);
            }
          }}
        />
      )}

      <View style={styles.toggleContainer}>
        <Button
          title={hideCompleted ? "完了タスクを表示" : "完了タスクを非表示"}
          onPress={() => setHideCompleted((prev) => !prev)}
        />
      </View>

      <View style={styles.clearContainer}>
        <Button
          title="完了したタスクを全て削除"
          onPress={handleClearCompleted}
        />
      </View>

      <SwipeListView
        data={
          hideCompleted
            ? sortedTasks
                .filter((t) => !t.isCompleted)
                .map((item) => ({
                  key: String(item.id),
                  id: item.id,
                  isCompleted: item.isCompleted,
                  list: item.list,
                  dueDate: item.dueDate,
                }))
            : sortedTasks.map((item) => ({
                key: String(item.id),
                id: item.id,
                isCompleted: item.isCompleted,
                list: item.list,
                dueDate: item.dueDate,
              }))
        }
        renderItem={({ item }) => {
          return <TaskItem item={item} onToggle={toggleTaskCompletion} />;
        }}
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
  );
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
  toggleContainer: {
    marginBottom: 10,
    alignItems: "flex-end",
  },
  clearContainer: {
    marginBottom: 10,
    alignItems: "flex-end",
  },
  dateContainer: {
    marginBottom: 10,
  },
});

export default TodoScreen;
