import { useState } from "react";
import { SwipeListView } from "react-native-swipe-list-view";

import {
  Text,
  View,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
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

  const handleDelete = (index: number) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  }

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

      <SwipeListView
        data={tasks.map((item, index) => ({ key: index.toString(), value: item }))}
        renderItem={({ item }) => (
          <View style={styles.rowFront}>
            <Text>・{item.value}</Text>
          </View>
        )}
        renderHiddenItem={({ index }) => (
          <View style={styles.rowBack}>
            <TouchableOpacity onPress={() => handleDelete(index)} style={styles.deleteButton}>
              <Text style={styles.deleteText}>削除</Text>
            </TouchableOpacity>
          </View>
        )}
        rightOpenValue={-75}
      />
      {/* <FlatList
        data={tasks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text style={styles.taskItem}>・{item}</Text>}
      /> */}
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
    backgroundColor: '#f2f2f2',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
  },
  rowBack: {
    alignItems: 'flex-end',
    backgroundColor: 'red',
    flex: 1,
    justifyContent: 'center',
    paddingRight: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  deleteButton: {
    height: '100%',
    justifyContent: 'center',
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  }
  // taskItem: {
  //   fontSize: 18,
  //   marginVertical: 5,
  // },
});

export default TodoScreen;
