import { TAG_OPTIONS } from "@/lib/constans";
import { Picker } from "@react-native-picker/picker";
import { View, Text, TextInput, StyleSheet } from "react-native";

type Props = {
  isDarkMode: boolean;
  filterText: string;
  setFilterText: React.Dispatch<React.SetStateAction<string>>;
  selectedFilterTag: string;
  setSelectedFilterTag: React.Dispatch<React.SetStateAction<string>>;
};

const SearchOptionPanel = ({
  isDarkMode,
  filterText,
  setFilterText,
  selectedFilterTag,
  setSelectedFilterTag,
}: Props) => {
  return (
    <View style={{ gap: 12, marginTop: 10, marginBottom: 120 }}>
      <View style={styles.searchContainer}>
        <Text style={{ color: isDarkMode ? "#fff" : "#000" }}>
          リストで検索
        </Text>
        <TextInput
          style={[styles.searchInput, { color: isDarkMode ? "#fff" : "#000" }]}
          value={filterText}
          placeholder="タスクを検索する"
          onChangeText={setFilterText}
        />
      </View>

      <View>
        <Text style={{ color: isDarkMode ? "#fff" : "#000" }}>
          タグで絞り込み
        </Text>
        <Picker
          selectedValue={selectedFilterTag}
          onValueChange={setSelectedFilterTag}
          style={{ height: 50 }}
        >
          <Picker.Item label="すべて" value="すべて" />
          {TAG_OPTIONS.map((tag) => 
            <Picker.Item key={tag} label={tag} value={tag} />
          )}
        </Picker>
      </View>
    </View>
  );
};

export default SearchOptionPanel;

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "column",
    gap: 4,
    marginBottom: 20,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});
