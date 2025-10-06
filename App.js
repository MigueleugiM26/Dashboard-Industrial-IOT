import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

export default function App() {
  const [data, setData] = useState({ temp: 0, hum: 0, light: 0, sound: 0 });
  const [error, setError] = useState(null);
  const [espIP, setEspIP] = useState("192.168.0.149");
  const intervalRef = useRef(null);

  const POLL_INTERVAL = 5000;

  const fetchData = async () => {
    if (!espIP) return;
    const ESP_URL = `http://${espIP}/`;
    try {
      const response = await fetch(ESP_URL);
      if (!response.ok)
        throw new Error(`HTTP ${response.status} - ${response.statusText}`);
      const json = await response.json();
      setData(json);
      setError(null);
    } catch (err) {
      console.error("Erro ao buscar dados TCP:", err);
      setError(`${err.name}: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchData();
    intervalRef.current = setInterval(fetchData, POLL_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [espIP]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TextInput
        style={styles.input}
        placeholder="Digite o IP do ESP"
        placeholderTextColor="#888"
        value={espIP}
        onChangeText={(text) => setEspIP(text)}
      />

      <Text style={styles.label}>Temperatura: {data.temp} °C</Text>
      <Text style={styles.label}>Umidade: {data.hum} %</Text>
      <Text style={styles.label}>Luz: {data.light} %</Text>
      <Text style={styles.label}>Som: {data.sound} dB</Text>

      {error && (
        <View style={{ marginTop: 20, alignItems: "center" }}>
          <Text style={styles.error}>⚠️ Falha ao obter dados do sensor</Text>
          <Text style={styles.errorDetails}>{error}</Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "#0ff",
    borderWidth: 1,
    borderRadius: 5,
    color: "#0ff",
    paddingHorizontal: 10,
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    color: "#fff",
    fontSize: 18,
    marginVertical: 6,
  },
  error: {
    color: "#f00",
    fontSize: 16,
    textAlign: "center",
  },
  errorDetails: {
    color: "#f88",
    fontSize: 14,
    textAlign: "center",
    marginTop: 5,
  },
});
