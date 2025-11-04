import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 50,
  },

  title: {
    color: "#fff",
    fontSize: 20,
    marginBottom: 25,
  },

  label: {
    color: "#000",
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 3,
    alignSelf: "center",
  },

  input: {
    width: "80%",
    height: 40,
    borderColor: "#0ff",
    borderWidth: 1,
    borderRadius: 5,
    color: "#000",
    paddingHorizontal: 10,
    marginBottom: 15,
    textAlign: "center",
  },

  box: {
    width: "80%",
    borderColor: "#0ff",
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: "center",
    marginBottom: 15,
  },

  boxText: {
    color: "#000",
    fontSize: 16,
  },

  themeContainer: {
    width: "80%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  themeButton: {
    width: "47%",
    borderColor: "#0ff",
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: "center",
    marginVertical: 5,
  },

  themeText: {
    color: "#000",
    fontSize: 16,
  },

  selectedTheme: {
    backgroundColor: "#0ff2",
  },

  footer: {
    position: "absolute",
    bottom: 15,
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
  },

  footerTitle: {
    color: "#888",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 2,
  },

  footerNames: {
    color: "#888",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 18,
  },
});
