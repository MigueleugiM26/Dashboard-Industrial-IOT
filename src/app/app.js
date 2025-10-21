import React, { useEffect, useState, useRef } from "react";
import { styles } from "./style";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image
} from "react-native";

export default function App() {
  const [data, setData] = useState({ temp: 0, hum: 0, light: 0, sound: 0 });
  const [error, setError] = useState(null);
  const [espIP, setEspIP] = useState("192.168.0.149");
  const intervalRef = useRef(null);

  // Criando aqui função para determinar a cor do circulo
  const getTempColor = () => { 
    if (data.temp >= 21 && data.temp <= 30) return '#303030';
    if (data.temp >= 31) return '#ffdf9c';
    return '#a9eefb'
  };

  const corDeFundo = getTempColor()
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
        <View style={styles.view_icon}>
          <Image style={styles.image}
            source={require('../../assets/estacio-icon.png')} // Caminho relativo para o ícone
          />

          <Image style={styles.image}
            source={require('../../assets/Vector.png')}
          />
        </View>

        <View style={styles.view_center}>
          <View style={[styles.circle, {backgroundColor: corDeFundo}]}></View>
          <Text style={styles.temperatura}>{data.temp} °C</Text>

        </View>

        <View style={styles.view_informations}>
          <Text style={styles.label}>Temperatura: {data.temp} °C</Text>
          <Text style={styles.label}>Umidade: {data.hum} %</Text>
          <Text style={styles.label}>Luz: {data.light} %</Text>
          <Text style={styles.label}>Som: {data.sound} dB</Text>
        </View>

{/*       
      <TextInput
        style={styles.input}
        placeholder="Digite o IP do ESP"
        placeholderTextColor="#888"
        value={espIP}
        onChangeText={(text) => setEspIP(text)}
      /> */}

     

      {/* {error && (
        <View style={{ marginTop: 20, alignItems: "center" }}>
          <Text style={styles.error}>⚠️ Falha ao obter dados do sensor</Text>
          <Text style={styles.errorDetails}>{error}</Text>
        </View>
      )} */}
    </KeyboardAvoidingView>
  );
}


