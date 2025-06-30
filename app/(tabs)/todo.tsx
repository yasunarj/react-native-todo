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
import { groupTasksByDueDate } from "@/lib/groupTasksByDueDate";
import { ScrollView } from "react-native-gesture-handler";
import { Picker } from "@react-native-picker/picker";
import { TAG_OPTIONS } from "@/lib/constans";
import EditTaskModal from "../../components/EditTaskModal";

const TodoScreen = () => {
  const [task, setTask] = useState<string>("");
  const [tasks, setTasks] = useState<TaskState[]>([]);
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [hideCompleted, setHideCompleted] = useState<boolean>(false);
  const [selectedTag, setSelectedTag] = useState<string>("未分類");
  const [showAdvancedOptions, setShowAdvancedOptions] =
    useState<boolean>(false);
  const [showTagSelect, setShowTagSelect] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<TaskState | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [editedText, setEditedText] = useState<string>("");
  const [editedDate, setEditedDate] = useState<Date>(new Date());
  const [editedTag, setEditedTag] = useState<string>("未分類");
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const grouped = groupTasksByDueDate(
    hideCompleted ? tasks.filter((t) => !t.isCompleted) : tasks
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
    };
    changedTasks();
  }, [tasks]);

  const addTask = async () => {
    if (task.trim() !== "") {
      const newTask = {
        id: Date.now(),
        list: task,
        isCompleted: false,
        dueDate: showDatePicker ? dueDate.toISOString().split("T")[0] : null,
        tag: selectedTag,
      };

      setTasks((prev) => [...prev, newTask]);
      setTask("");
      setDueDate(new Date());
      setShowDatePicker(false);
      setSelectedTag("未分類");
      setShowAdvancedOptions(false);
    }
  };

  const handleDelete = async (id: number) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const handleEdit = (task: TaskState) => {
    setEditingTask(task);
    setEditedText(task.list);
    setEditedTag(task.tag ? task.tag : "未分類");
    setEditedDate(task.dueDate ? new Date(task.dueDate) : new Date());
    setIsEditModalVisible(true);
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

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <View style={{ gap: 8 }}>
          <Text style={{ color: isDarkMode ? "#fff" : "#000" }}>
            タグ: {selectedTag}
          </Text>
          <Text style={{ color: isDarkMode ? "#fff" : "#000" }}>
            期限: {dueDate.toISOString().split("T")[0]}
          </Text>
        </View>
        <View style={{ alignSelf: "flex-end", marginTop: 12 }}>
          <Button
            title={
              showAdvancedOptions ? "▲ 詳細設定を閉じる" : "▼ 詳細設定を開く"
            }
            onPress={() => setShowAdvancedOptions((prev) => !prev)}
          />
        </View>
      </View>

      {showAdvancedOptions && (
        <View>
          <View style={{ alignItems: "flex-end" }}>
            <Button
              title="タグを選択"
              onPress={() => setShowTagSelect((prev) => !prev)}
            />
          </View>
          {showTagSelect && (
            <View>
              <Picker
                selectedValue={selectedTag}
                onValueChange={(itemValue) => {
                  setSelectedTag(itemValue);
                  setShowTagSelect(false);
                }}
              >
                {TAG_OPTIONS.map((tag) => (
                  <Picker.Item key={tag} value={tag} label={tag} />
                ))}
              </Picker>
            </View>
          )}

          <View style={styles.dateContainer}>
            <Button
              title="日付を選択"
              onPress={() => setShowDatePicker((prev) => !prev)}
            ></Button>
          </View>
          {showDatePicker && (
            <View style={{ alignItems: "flex-end" }}>
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
            </View>
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
        </View>
      )}

      <ScrollView style={{ marginTop: 40, marginBottom: 40 }}>
        {Object.entries(grouped).map(([label, group]) => {
          if (group.length === 0) return;
          const sortedGroup = [...group].sort((a, b) =>
            (a.dueDate || "9999-12-31").localeCompare(b.dueDate || "9999-12-31")
          );
          return (
            <View key={label} style={{ marginBottom: 20 }}>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 16,
                  marginBottom: 5,
                  color: "white",
                }}
              >
                {label}
              </Text>
              <SwipeListView
                data={sortedGroup.map((task: TaskState) => ({
                  key: String(task.id),
                  ...task,
                }))}
                renderItem={({ item }) => (
                  <TaskItem
                    item={item}
                    onToggle={toggleTaskCompletion}
                    onEdit={handleEdit}
                  />
                )}
                renderHiddenItem={({ item }) => (
                  <View style={styles.rowBack}>
                    <TouchableOpacity onPress={() => handleDelete(item.id)}>
                      <Text style={styles.deleteText}>削除</Text>
                    </TouchableOpacity>
                  </View>
                )}
                rightOpenValue={-75}
                disableRightSwipe
                scrollEnabled={false}
              />
            </View>
          );
        })}
      </ScrollView>
      <EditTaskModal
        isEditModalVisible={isEditModalVisible}
        editingTask={editingTask}
        editedText={editedText}
        editedDate={editedDate}
        editedTag={editedTag}
        setTasks={setTasks}
        setEditedText={setEditedText}
        setEditedTag={setEditedTag}
        setShowTagSelect={setShowTagSelect}
        setIsEditModalVisible={setIsEditModalVisible}
        setEditedDate={setEditedDate}
        setEditingTask={setEditingTask}
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
    alignItems: "flex-end",
  },
  clearContainer: {
    marginBottom: 10,
    alignItems: "flex-end",
  },
  dateContainer: {
    alignItems: "flex-end",
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
  dueText: {
    fontSize: 12,
    color: "#888",
  },
  dueToday: {
    color: "#f39c12",
    fontWeight: "bold",
  },
  dueOverdue: {
    color: "#e74c3c",
    fontWeight: "bold",
  },
});

export default TodoScreen;
