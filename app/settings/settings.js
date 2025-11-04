import { View, Text, TextInput, TouchableOpacity, Button } from "react-native";
import { styles } from "./style";
import { useData } from "../context/DataContext";
import { useRouter } from "expo-router";
import React, { useState } from "react";

export default function Settings() {
  const { espIP, setEspIP } = useData();
  const [input, setInput] = useState(espIP);
  const [medida, setMedida] = useState("Celsius");
  const [tema, setTema] = useState("Escuro");
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurações</Text>

      <Text style={styles.label}>IP Arduino</Text>
      <TextInput
        style={styles.input}
        placeholder="192.168.0.1"
        placeholderTextColor="#888"
        value={input}
        onChangeText={(text) => setInput(text)}
      />

      <Text style={styles.label}>Unidade de medida</Text>
      <TouchableOpacity
        style={styles.box}
        onPress={() =>
          setMedida(medida === "Celsius" ? "Fahrenheit" : "Celsius")
        }
      >
        <Text style={styles.boxText}>{medida}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Tema do aplicativo</Text>
      <View style={styles.themeContainer}>
        {["Claro", "Escuro"].map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.themeButton, tema === t && styles.selectedTheme]}
            onPress={() => setTema(t)}
          >
            <Text style={styles.themeText}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button
        title="Salvar"
        onPress={() => {
          setEspIP(input);
          router.back();
        }}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>Integrantes:</Text>
        <Text style={styles.footerText}>
          Adriano Alencar, Heitor Inácio, João Victor, Kauã Lima e Miguel
          Gabriel.
        </Text>
      </View>
    </View>
  );
}
