import React, { useEffect, useState, useRef } from "react";
import { styles } from "./style";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image, 
  TouchableOpacity
} from "react-native";
import { router } from "expo-router"

export default function App() {
  const [data, setData] = useState({ temp: 0, hum: 0, light: 0, sound: 0 });
  const [error, setError] = useState(null);
  const [espIP, setEspIP] = useState("192.168.0.149");
  const intervalRef = useRef(null);

  // Criando aqui função para determinar a cor do circulo
  // const getTempColor = () => { 
  //   if (data.temp >= 21 && data.temp <= 30) return '#303030';
  //   if (data.temp >= 31) return '#ffdf9c';
  //   return '#a9eefb'
  // };


  function handleNext(){ 
    router.navigate("/settings")
  }

  // const corDeFundo = getTempColor()
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

          <TouchableOpacity onPress={handleNext}>
            <Image 
              style={styles.image}
              source={require('../../assets/Vector.png')}
            />
          </TouchableOpacity>
          
        </View>

        <View style={styles.view_center}>
          <View style={styles.circle}></View>
          <Text style={styles.textTemperatura}>{data.temp} °C</Text>

        </View>

        <View style={styles.view_informations}>
          <View style={styles.linhaDeDado}>
            <Image style={styles.icon} 
            source={require('../../assets/estacio-icon.png')}/>
            <Text style={styles.label}>Temperatura</Text>
            <Text style={styles.label}>{data.temp} °C</Text>
            </View> 
          <View style={styles.linhaDeDado}>
            <Image style={styles.icon} 
            source={require('../../assets/umidade.png')}/>
            <Text style={styles.label}>Umidade</Text>
            <Text style={styles.label}>{data.hum} %</Text>
          </View>

          <View style={styles.linhaDeDado}>
            <Image style={styles.icon}
            source={require('../../assets/luminosidade.png')}
            />
            <Text style={styles.label}>Luz</Text>
            <Text style={styles.label}>{data.light} %</Text>    
          </View>

          <View style={styles.linhaDeDado}>
            <Image style={styles.icon} 
            source={require('..//..//assets/sound.png')}
            />
            <Text style={styles.label}>Som </Text>
            <Text style={styles.label}>{data.sound} dB</Text>
          </View>
          
          
          
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


