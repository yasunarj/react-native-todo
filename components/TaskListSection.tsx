import { GroupedTasks } from "@/lib/groupTasksByDueDate";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import TaskItem from "../components/TaskItem";
import { TaskState } from "../types/task";

type Props = {
  grouped: GroupedTasks;
  handleDelete: (id: number) => void;
  handleEdit: (task: TaskState) => void;
  toggleTaskCompletion: (id: number) => Promise<void>;
};

const TaskListSection = ({
  grouped,
  handleDelete,
  handleEdit,
  toggleTaskCompletion,
}: Props) => {
  return (
    <View>
      {Object.entries(grouped).map(([label, group]) => {
        if (group.length === 0) return null;
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
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default TaskListSection;
