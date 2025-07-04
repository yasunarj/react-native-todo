import { useState } from "react";
import { Modal, View, Text, TextInput, Button, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { TAG_OPTIONS } from "@/lib/constans";
import { TaskState, EditTaskState  } from "../types/task";
import DateTimePicker from "@react-native-community/datetimepicker";

type Props = {
  isEditModalVisible: boolean;
  editingTask: TaskState | null;
  editedState: EditTaskState,
  setEditedState: React.Dispatch<React.SetStateAction<EditTaskState>>
  setTasks: React.Dispatch<React.SetStateAction<TaskState[]>>;
  setShowTagSelect: (value: boolean) => void;
  setIsEditModalVisible: (value: boolean) => void;
  setEditingTask: (value: TaskState | null) => void;
};

const EditTaskModal = ({
  isEditModalVisible,
  editingTask,
  editedState,
  setEditedState,
  setTasks,
  setShowTagSelect,
  setIsEditModalVisible,
  setEditingTask,
}: Props) => {
  const [showModalDatePicker, setShowModalDatePicker] =
    useState<boolean>(false);
  const [showModalTagSelect, setShowModalTagSelect] = useState<boolean>(false);
  return (
    <Modal
      visible={isEditModalVisible}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>タスクを編集</Text>
          <TextInput
            style={styles.modalInput}
            value={editedState.text}
            onChangeText={(text) => setEditedState((prev) => ({ ...prev, text }))}
            placeholder="編集内容"
          />
          <Button
            title={`タグを変更: ${editedState.tag ?? "未分類"}`}
            onPress={() => setShowModalTagSelect((prev) => !prev)}
          />
          {showModalTagSelect && (
            <View>
              <Picker
                selectedValue={editedState.tag}
                onValueChange={(tag) => {
                  setEditedState((prev) => ({...prev, tag}));
                  setShowTagSelect(false);
                  setShowModalTagSelect(false);
                }}
                mode="dropdown"
              >
                {TAG_OPTIONS.map((tag) => (
                  <Picker.Item key={tag} value={tag} label={tag} color="#000" />
                ))}
              </Picker>
            </View>
          )}

          <Button
            title={`期限を変更: ${editedState.date.toISOString().split("T")[0]}`}
            onPress={() => setShowModalDatePicker((prev) => !prev)}
          />

          {showModalDatePicker && (
            <DateTimePicker
              value={editedState.date}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowModalDatePicker(false);
                if (date) {
                  setEditedState((prev) => ({ ...prev, date }));
                }
              }}
            />
          )}

          <View style={styles.modalSelectButton}>
            <Button
              title="キャンセル"
              onPress={() => setIsEditModalVisible(false)}
            />
            <Button
              title="保存"
              onPress={() => {
                if (!editingTask) return;
                const updatedTask = {
                  ...editingTask,
                  list: editedState.text,
                  dueDate: editedState.date.toISOString().split("T")[0],
                  tag: editedState.tag,
                };

                setTasks((prev) =>
                  prev.map((task) =>
                    task.id === editingTask.id ? updatedTask : task
                  )
                );
                setIsEditModalVisible(false);
                setEditingTask(null);
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalSelectButton: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalText: {
    fontWeight: "bold",
    fontSize: 18,
  },
  modalInput: {
    color: "black",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
  },
});

export default EditTaskModal;
