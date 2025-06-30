import { useState } from "react";
import { Modal, View, Text, TextInput, Button, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { TAG_OPTIONS } from "@/lib/constans";
import { TaskState } from "../types/task";
import DateTimePicker from "@react-native-community/datetimepicker";

type Props = {
  isEditModalVisible: boolean;
  editingTask: TaskState | null;
  editedText: string;
  editedDate: Date;
  editedTag: string;
  setTasks: React.Dispatch<React.SetStateAction<TaskState[]>>;
  setEditedText: (text: string) => void;
  setEditedTag: (value: string) => void;
  setShowTagSelect: (value: boolean) => void;
  setIsEditModalVisible: (value: boolean) => void;
  setEditedDate: (value: Date) => void;
  setEditingTask: (value: TaskState | null) => void;
};

const EditTaskModal = ({
  isEditModalVisible,
  editingTask,
  editedText,
  editedDate,
  editedTag,
  setTasks,
  setEditedText,
  setEditedTag,
  setShowTagSelect,
  setIsEditModalVisible,
  setEditedDate,
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
            value={editedText}
            onChangeText={setEditedText}
            placeholder="編集内容"
          />
          <Button
            title={`タグを変更: ${editedTag ?? "未分類"}`}
            onPress={() => setShowModalTagSelect((prev) => !prev)}
          />
          {showModalTagSelect && (
            <View>
              <Picker
                selectedValue={editedTag}
                onValueChange={(itemValue) => {
                  setEditedTag(itemValue);
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
            title={`期限を変更: ${editedDate.toISOString().split("T")[0]}`}
            onPress={() => setShowModalDatePicker((prev) => !prev)}
          />

          {showModalDatePicker && (
            <DateTimePicker
              value={editedDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowModalDatePicker(false);
                if (selectedDate) {
                  setEditedDate(selectedDate);
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
                  list: editedText,
                  dueDate: editedDate.toISOString().split("T")[0],
                  tag: editedTag,
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
