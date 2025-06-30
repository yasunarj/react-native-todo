import { Pressable, StyleSheet, Text, View } from "react-native";
import { getDueDateStatus } from "@/lib/getDueDateStatus";
import { TAG_COLORS } from "@/lib/constans";

type Props = {
  item: {
    id: number;
    list: string;
    isCompleted: boolean;
    dueDate?: string | null;
    tag: string;
  };
  onToggle: (id: number) => void;
  onEdit: (item: Props["item"]) => void;
};

const TaskItem = ({ item, onToggle, onEdit }: Props) => {
  const status = getDueDateStatus(item.dueDate);

  return (
    <Pressable
      onPress={() => onToggle(item.id)}
      style={({ pressed }) => [styles.taskItem, { opacity: 1 }]}
    >
      <View style={{ flexDirection: "row" }}>
        <View style={{ width: 160 }}>
          <Text
            style={{
              backgroundColor: TAG_COLORS[item.tag ?? "未分類"] ?? "#7f8c8d",
              paddingHorizontal: 2,
              paddingVertical: 1,
              color: "#fff",
              alignSelf: "flex-start"
            }}
          >
            [{item.tag}]
          </Text>
        </View>
        <Text
          style={[styles.taskText, item.isCompleted && styles.completedText]}
        >
          {item.list}
        </Text>
      </View>
      <Text
        style={[
          styles.dueText,
          status === "today" && styles.dueToday,
          status === "overdue" && styles.dueOverdue,
        ]}
      >
        期限: {item.dueDate ?? "未設定"}
      </Text>

      <Pressable
        onPress={(e) => {
          e.stopPropagation();
          onEdit(item);
        }}
        style={styles.editButton}
      >
        <Text style={styles.editText}>編集</Text>
      </Pressable>
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
  editButton: {
    position: "absolute",
    right: 10,
    bottom: 5,
    padding: 5,
  },
  editText: {
    color: "#3498db",
    fontSize: 12,
  },
});

export default TaskItem;
