import { View, Button, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { TAG_OPTIONS } from "@/lib/constans";
import DateTimePicker from "@react-native-community/datetimepicker";

type Props = {
  showTagSelect: boolean;
  setShowTagSelect: React.Dispatch<React.SetStateAction<boolean>>;
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
  showDatePicker: boolean;
  setShowDatePicker: React.Dispatch<React.SetStateAction<boolean>>;
  dueDate: Date;
  setDueDate: (date: Date) => void;
  hideCompleted: boolean;
  setHideCompleted: React.Dispatch<React.SetStateAction<boolean>>;
  handleClearCompleted: () => void;
};

const AdvancedOptionsPanel = ({
  dueDate,
  showTagSelect,
  setShowTagSelect,
  selectedTag,
  setSelectedTag,
  showDatePicker,
  setShowDatePicker,
  setDueDate,
  hideCompleted,
  setHideCompleted,
  handleClearCompleted,
}: Props) => {
  return (
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
  );
};

const styles = StyleSheet.create({
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
});

export default AdvancedOptionsPanel;
