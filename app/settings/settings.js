import { View, Text, TextInput, TouchableOpacity, Button } from "react-native";
import { styles } from "./style";
import { useData } from "../context/DataContext";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Picker } from "react-native-web";

export default function Settings() {
  const { espIP, setEspIP, unit, setUnit } = useData(); // Pega do contexto
  const [input, setInput] = useState(espIP);
  const router = useRouter();


  const handleUnitChange = (newUnit) => { 
    setUnit(newUnit);
  }

 
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
      <Picker
        selectedValue={unit} 
        onValueChange={(itemValue) => handleUnitChange(itemValue)}
      >
        <Picker.Item label="Celsius (°C)" value="Celsius" />
        <Picker.Item label="Fahrenheit (°F)" value="Fahrenheit" />

      </Picker>
        <Text style={styles.boxText}>{unit}</Text>
      
       
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
