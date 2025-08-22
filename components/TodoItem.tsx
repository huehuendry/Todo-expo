import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
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
    if (text.trim()) {
      onEdit(task.id, text.trim());
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
          <TouchableOpacity onPress={save}><Text>✅</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => setIsEditing(false)}><Text>✖️</Text></TouchableOpacity>
        </>
      ) : (
        <>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => onToggle(task.id)}>
            <Text style={[styles.text, task.done && styles.done]}>{task.text}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsEditing(true)}><Text>✏️</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(task.id)}><Text>🗑️</Text></TouchableOpacity>
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
    borderRadius: 8
  },
  text: { fontSize: 16 },
  done: { textDecorationLine: "line-through", color: "gray" },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 6,
    marginRight: 8
  }
});
