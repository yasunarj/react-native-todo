import { useState } from "react";
import {
  Text,
  View,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
} from "react-native";

const TodoScreen = () => {
  const [task, setTask] = useState<string>("");
  const [tasks, setTasks] = useState<string[]>([]);

  const addTask = () => {
    if (task.trim() !== "") {
      setTasks([...tasks, task]);
      setTask("");
    }
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

      <FlatList
        data={tasks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text style={styles.taskItem}>・{item}</Text>}
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
  taskItem: {
    fontSize: 18,
    marginVertical: 5,
  },
});

export default TodoScreen;
