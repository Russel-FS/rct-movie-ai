import { View, Text, StyleSheet } from "react-native";
import { ReactNode } from "react";

type ScreenContentProps = {
  title: string;
  path: string;
  children?: ReactNode;
};

export function ScreenContent({ title, path, children }: ScreenContentProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.path}>{path}</Text>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#1C1C1E",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  path: {
    fontSize: 14,
    color: "#aaa",
    marginBottom: 20,
  },
  content: {
    flex: 1,
  },
});
