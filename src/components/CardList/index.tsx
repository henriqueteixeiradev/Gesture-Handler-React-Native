import { Text, TouchableOpacity, StyleSheet } from "react-native";

interface CardListProps {
  title: string;
}

export function CardList({ title }: CardListProps) {
  return (
    <TouchableOpacity style={styles.button}>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
}

export const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: 100,
    backgroundColor: "#fff",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
});
