import React, { useEffect, useState, useRef } from "react";
import Settings from "./settings/settings";
import Dados from "./dados";
import Index from "./index";
import { View } from "react-native";


export default function AppProps() { 
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
    <View style={{flex:1}}>
            <Settings 
                espIP={espIP}
                setEspIP={setEspIP}
            />
            <Dados
                data={data}
                error={error}
            />
            <Index data={data} setData={setData} />


    </View>
  )
}
