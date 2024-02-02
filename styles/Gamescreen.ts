import { StyleSheet } from "react-native";
// TODO: rename this file to just be generic
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
  },
  board: {
    width: 300,
    height: 300,
    flexDirection: "row",
    flexWrap: "wrap",
    borderWidth: 1,
    borderColor: "#000",
  },
  cell: {
    width: "33.33%",
    height: "33.33%",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#000",
  },
  cellText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  input: {
    height: 45, // Optimal height for accessibility
    width: "80%", // Responsive width relative to screen size
    margin: 12, // Spacing around the input for better layout
    borderWidth: 1, // Subtle border
    borderColor: "#cccccc", // Soft grey border for a light touch
    borderRadius: 5, // Slightly rounded corners for a modern look
    padding: 10, // Internal padding for text comfort
    fontSize: 16, // Readable text size
    backgroundColor: "#ffffff", // White background for clarity
  },
});

export { styles };
