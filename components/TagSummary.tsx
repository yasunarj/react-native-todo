import { TAG_OPTIONS } from "@/lib/constans";
import { View, Text } from "react-native";

type Props = {
  isDarkMode: boolean;
  tagCounts: Record<string, number>
};

const TagSummary = ({ isDarkMode, tagCounts }: Props) => {
  return (
    <View style={{ marginTop: 20 }}>
      {TAG_OPTIONS.map((tag) => (
        <Text key={tag} style={{ color: isDarkMode ? "#fff" : "#000" }}>
          🏷 {tag} ({tagCounts[tag]})
        </Text>
      ))}
    </View>
  );
};

export default TagSummary;
