import { View, Text, TextInput } from "react-native-web";
import React, { useEffect, useState, useRef } from "react";
import { styles } from "./style";


export default function Settings() { 
    const [espIP, setEspIP] = useState("192.168.0.149");
    const intervalRef = useRef(null);
    const POLL_INTERVAL = 5000;
    const [data, setData] = useState({ temp: 30, hum: 0, light: 0, sound: 0 });
    const [error, setError] = useState(null);


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
        <View>
            <Text>Configurações</Text>
            <TextInput
            style={styles.input}
            placeholder="Digite o IP do ESP"
            placeholderTextColor="#888"
            value={espIP}
            onChangeText={(text) => setEspIP(text)}
            />
        </View>

        
    )
}