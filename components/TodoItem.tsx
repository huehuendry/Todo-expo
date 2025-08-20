import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Task } from "../types/Task";

type Props = {
  item: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function TodoItem({ item, onToggle, onDelete }: Props) {
  return (
    <View style={styles.taskRow}>
      <TouchableOpacity onPress={() => onToggle(item.id)}>
        <Text style={[styles.taskText, item.done && styles.taskDone]}>
          {item.text}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onDelete(item.id)}>
        <Text style={styles.delete}>❌</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  taskRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    marginBottom: 5,
    backgroundColor: "white",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  taskText: { fontSize: 16 },
  taskDone: { textDecorationLine: "line-through", color: "gray" },
  delete: { fontSize: 18, color: "red", marginLeft: 10 },
});
