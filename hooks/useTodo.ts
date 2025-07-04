import { useState, useEffect } from "react";
import { EditTaskState, TaskState } from "../types/task";
import { loadTasks, saveTasks } from "@/lib/storage";
import { Alert } from "react-native";
import { TAG_OPTIONS } from "@/lib/constans";

export const useTodo = () => {
  const [task, setTask] = useState<string>("");
  const [tasks, setTasks] = useState<TaskState[]>([]);
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [hideCompleted, setHideCompleted] = useState<boolean>(false);
  const [showTagSelect, setShowTagSelect] = useState<boolean>(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [showAdvancedOptions, setShowAdvancedOptions] =
    useState<boolean>(false);
  const [selectedTag, setSelectedTag] = useState<string>("未分類");
  const [editingTask, setEditingTask] = useState<TaskState | null>(null);
  const [editedState, setEditedState] = useState<EditTaskState>({
    text: "",
    tag: "未分類",
    date: new Date(),
  });
  const [filterText, setFilterText] = useState<string>("");
  const [showSearchOptions, setShowSearchOptions] = useState<boolean>(false);
  const [selectedFilterTag, setSelectedFilterTag] = useState<string>("すべて");

  const filteredText = tasks.filter((task) =>
    task.list.toLowerCase().includes(filterText.toLowerCase())
  );

  const filteredTasks = filteredText.filter((task) =>
    selectedFilterTag === "すべて" ? true : task.tag === selectedFilterTag
  );

  const tagCounts = TAG_OPTIONS.reduce((acc, tag) => {
    acc[tag] = tasks.filter((t) => t.tag === tag).length;
    return acc;
  }, {} as Record<string, number>);

  useEffect(() => {
    const loadTasksFromStorage = async () => {
      const result = await loadTasks();
      setTasks(result);
    };
    loadTasksFromStorage();
  }, []);

  useEffect(() => {
    const changedTasks = async () => {
      await saveTasks(tasks);
    };
    changedTasks();
  }, [tasks]);

  const addTask = async () => {
    if (task.trim() !== "") {
      const newTask = {
        id: Date.now(),
        list: task,
        isCompleted: false,
        dueDate: showDatePicker ? dueDate.toISOString().split("T")[0] : null,
        tag: selectedTag,
      };

      setTasks((prev) => [...prev, newTask]);
      setTask("");
      setDueDate(new Date());
      setShowDatePicker(false);
      setSelectedTag("未分類");
      setShowAdvancedOptions(false);
    }
  };

  const handleDelete = async (id: number) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const handleEdit = (task: TaskState) => {
    setEditingTask(task);
    setEditedState({
      text: task.list,
      date: task.dueDate ? new Date(task.dueDate) : new Date(),
      tag: task.tag,
    });
    setIsEditModalVisible(true);
  };

  const toggleTaskCompletion = async (id: number) => {
    setTasks((prevTasks) => {
      return prevTasks.map((task) =>
        task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
      );
    });
  };

  const handleClearCompleted = () => {
    const deleteLists = tasks.filter((task) => task.isCompleted);

    if (deleteLists.length === 0) {
      Alert.alert("情報", "削除するタスクがありません");
      return;
    }

    Alert.alert(
      "確認",
      "削除を実行してよろしいですか？",
      [
        {
          text: "キャンセル",
          style: "cancel",
        },
        {
          text: "削除する",
          style: "destructive",
          onPress: () => {
            setTasks((prevTasks) =>
              prevTasks.filter((task) => !task.isCompleted)
            );
            Alert.alert("削除完了", "完了したタスクを削除しました");
          },
        },
      ],
      { cancelable: true }
    );
  };

  return {
    task,
    setTask,
    tasks,
    setTasks,
    dueDate,
    setDueDate,
    showDatePicker,
    setShowDatePicker,
    hideCompleted,
    setHideCompleted,
    showTagSelect,
    setShowTagSelect,
    isEditModalVisible,
    setIsEditModalVisible,
    showAdvancedOptions,
    setShowAdvancedOptions,
    selectedTag,
    setSelectedTag,
    addTask,
    handleDelete,
    handleEdit,
    editedState,
    setEditedState,
    editingTask,
    setEditingTask,
    toggleTaskCompletion,
    handleClearCompleted,
    filterText,
    setFilterText,
    filteredText,
    showSearchOptions,
    setShowSearchOptions,
    filteredTasks,
    selectedFilterTag,
    setSelectedFilterTag,
    tagCounts,
  };
};
