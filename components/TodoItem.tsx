import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Task } from "../types/Task";

type Props = {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
};

export default function TodoItem({ task, onToggle, onDelete, onEdit }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(task.text);

  const save = () => {
    const trimmed = text.trim();
    if (trimmed) {
      onEdit(task.id, trimmed);
    }
    setIsEditing(false);
  };

  return (
    <View style={styles.row}>
      {isEditing ? (
        <>
          <TextInput
            style={[styles.input]}
            value={text}
            onChangeText={setText}
            autoFocus
            onSubmitEditing={save}
          />
          <TouchableOpacity accessibilityLabel="Save" onPress={save} style={styles.actionBtn}>
            <Ionicons name="checkmark" size={20} color="#1e90ff" />
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityLabel="Cancel"
            onPress={() => setIsEditing(false)}
            style={styles.actionBtn}
          >
            <Ionicons name="close" size={20} color="#ff3b30" />
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => onToggle(task.id)}>
            <Text style={[styles.text, task.done && styles.done]}>{task.text}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityLabel="Edit"
            onPress={() => setIsEditing(true)}
            style={styles.actionBtn}
          >
            <Ionicons name="create-outline" size={20} color="#1e90ff" />
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityLabel="Delete"
            onPress={() => onDelete(task.id)}
            style={styles.actionBtn}
          >
            <Ionicons name="trash-outline" size={20} color="#ff3b30" />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginBottom: 6,
    backgroundColor: "white",
    borderRadius: 8,
  },
  text: { fontSize: 16 },
  done: { textDecorationLine: "line-through", color: "gray" },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  actionBtn: { marginLeft: 8 },
});

