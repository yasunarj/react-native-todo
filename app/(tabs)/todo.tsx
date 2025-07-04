import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import { groupTasksByDueDate } from "@/lib/groupTasksByDueDate";
import { ScrollView } from "react-native-gesture-handler";
import EditTaskModal from "../../components/EditTaskModal";
import TaskListSection from "@/components/TaskListSection";
import AdvancedOptionsPanel from "@/components/AdvancedOptionsPanel";
import { useTodo } from "@/hooks/useTodo";
import SearchOptionPanel from "@/components/SearchOptionPanel";
import TagSummary from "@/components/TagSummary";
import { useEffect } from "react";
import { useNotification } from "@/hooks/useNotification";

const TodoScreen = () => {
  const {
    task,
    setTask,
    setTasks,
    dueDate,
    setDueDate,
    showDatePicker,
    setShowDatePicker,
    hideCompleted,
    setHideCompleted,
    showTagSelect,
    setShowTagSelect,
    isEditModalVisible,
    setIsEditModalVisible,
    showAdvancedOptions,
    setShowAdvancedOptions,
    selectedTag,
    setSelectedTag,
    addTask,
    handleDelete,
    handleEdit,
    toggleTaskCompletion,
    editedState,
    setEditedState,
    editingTask,
    setEditingTask,
    handleClearCompleted,
    filterText,
    setFilterText,
    filteredTasks,
    showSearchOptions,
    setShowSearchOptions,
    selectedFilterTag,
    setSelectedFilterTag,
    tagCounts,
  } = useTodo();

  const { registerForPushNotificationsAsync, scheduleNotification } =
    useNotification();

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const grouped = groupTasksByDueDate(
    hideCompleted ? filteredTasks.filter((t) => !t.isCompleted) : filteredTasks
  );

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, [registerForPushNotificationsAsync]);

  const handleAddTask = () => {
    addTask();
    scheduleNotification("タスクを追加", "新しいタスクが追加されました");
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
        <Button title="追加" onPress={handleAddTask} />
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
        <AdvancedOptionsPanel
          showTagSelect={showTagSelect}
          setShowTagSelect={setShowTagSelect}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
          showDatePicker={showDatePicker}
          setShowDatePicker={setShowDatePicker}
          dueDate={dueDate}
          setDueDate={setDueDate}
          hideCompleted={hideCompleted}
          setHideCompleted={setHideCompleted}
          handleClearCompleted={handleClearCompleted}
        />
      )}

      <TagSummary tagCounts={tagCounts} isDarkMode={isDarkMode} />

      <View style={{ alignSelf: "flex-end", marginTop: 12 }}>
        <Button
          title={showSearchOptions ? "▲ 検索設定を閉じる" : "▼ 検索設定を開く"}
          onPress={() => setShowSearchOptions((prev) => !prev)}
        />
      </View>

      {showSearchOptions && (
        <SearchOptionPanel
          isDarkMode={isDarkMode}
          filterText={filterText}
          setFilterText={setFilterText}
          selectedFilterTag={selectedFilterTag}
          setSelectedFilterTag={setSelectedFilterTag}
        />
      )}

      <ScrollView style={{ marginTop: 40, marginBottom: 40 }}>
        <TaskListSection
          grouped={grouped}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
          toggleTaskCompletion={toggleTaskCompletion}
        />
      </ScrollView>
      <EditTaskModal
        isEditModalVisible={isEditModalVisible}
        editedState={editedState}
        setEditedState={setEditedState}
        editingTask={editingTask}
        setTasks={setTasks}
        setShowTagSelect={setShowTagSelect}
        setIsEditModalVisible={setIsEditModalVisible}
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
