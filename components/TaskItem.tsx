import { Pressable, StyleSheet, Text } from "react-native";
import { getDueDateStatus } from "@/lib/getDueDateStatus";

type Props = {
  item: {
    id: number;
    list: string;
    isCompleted: boolean;
    dueDate?: string | null;
  };
  onToggle: (id: number) => void;
};

const TaskItem = ({ item, onToggle }: Props) => {
  const status = getDueDateStatus(item.dueDate);
  return (
    <Pressable
      onPress={() => onToggle(item.id)}
      style={({ pressed }) => [styles.taskItem, { opacity: 1 }]}
    >
      <Text style={[styles.taskText, item.isCompleted && styles.completedText]}>
        {item.list}
      </Text>
      <Text
        style={[
          styles.dueText,
          status === "today" && styles.dueToday,
          status === "overdue" && styles.dueOverdue,
        ]}
      >
        期限: {item.dueDate ?? "未設定"}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
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

export default TaskItem;
