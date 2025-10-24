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
import { useRouter } from "expo-router"
import { Thermometer, Droplet, Lightbulb, AudioLines, Settings } from "lucide-react-native"
import imgChuva from '../assets/iconesClima/chuva.png'
import imgLua from '../assets/iconesClima/lua.png'
import imgNevoa from '../assets/iconesClima/nevoa.png'
import imgNublado from '../assets/iconesClima/nublado.png'
import imgSol from '../assets/iconesClima/sol.png'
import imgTempestade from '../assets/iconesClima/tempestade.png'
import imgVentoso from '../assets/iconesClima/ventoso.png'


export default function App() {
  const [data, setData] = useState({ temp: 0, hum: 0, light: 0, sound: 0 });
  const [error, setError] = useState(null);
  const [espIP, setEspIP] = useState("192.168.0.149");
  const intervalRef = useRef(null);

  const router = useRouter();


  const ImagensClima = { 
    'chuva': imgChuva, 
    'lua': imgLua, 
    'nevoa': imgNevoa,
    'nublado': imgNublado,
    'sol': imgSol, 
    'tempestade': imgTempestade,
    'ventoso': imgVentoso,
  
  }
  
  const getClimaStatus = () => { 
    const {temp, hum, light, sound} = data;
    const IS_NIGHT = light < 10; 

    let status;
    let imageName;
    let color;
    let backgroundColor;
    let backgroundClima;
    let textColor;
    let imageKey;

    if (temp == 0 && light == 0) { 
      return { 
        status: "Aguardando dados...",
        imageName: '',
        backgroundColor: '#000', // 
        textColor: '#f8fcf7', 
        backgroundClima: '#303030'
      }
    }
    // Tema base: Noite
    if (IS_NIGHT) { 
        status = 'Estável (Noite)';
        backgroundColor = '#1f2937'; 
        backgroundClima = '#303030';
        textColor = '#FAFFF5';  
        imageKey = 'lua';  
    } 
    else { 
        status = 'Estável (Dia)';
        backgroundColor = '#60a5fa'; 
        textColor = '#111';
        imageKey = 'sol';     
    } 


    if (temp > 35 && sound > 80) { 
      status = 'Cinzas'
      imageName = '';
      backgroundColor = '#212121'
      textColor = '#BFBFBF'
      imageKey = 'cinzas'
    }

    else if (hum > 85 && light < 20 && sound > 70) { 
      status = 'Tempestade'
      imageName = '';
      backgroundColor = ' #4d2b88'
      textColor = '#fcfafc'
      imageKey = 'tempestade'
    }

    else if (hum > 75 && light < 40) { 
      status = 'Chuva'
      backgroundColor = ' #c0d3fe'
      textColor = '#fcfefe'
      imageKey = 'chuva'
    }

    else if (hum > 90 && temp < 15){ 
      status = 'Nevoa'
      backgroundColor = ' #2045d4'
      textColor = '#fdfdff'
      imageKey = 'nevoa'
    }

    else if (light > 80 && hum < 50) { 
      status = 'Ensolarado'
      backgroundColor = '  #ffa733'
      textColor = '#f0eee9'
      imageKey = 'ensolarado'
    }

    else if (light >= 40 && light <= 80) { 
      status = 'Nublado'
      backgroundColor = '  #FAFFF5'
      textColor = '#637AE8'
      imageKey = 'nublado'
    }

    // A ver como irei implementar o vento. Irei fazer depois

    return { 
      status: status, 
      imageName: imageName, 
      primaryColor: color, 
      textColor: textColor,
      imageKey: imageKey,
    }
  }

  const temaClima = getClimaStatus();
  const imagemCircleClima = ImagensClima[temaClima.imageKey]

  function handleNext(){ 
    router.navigate("/settings/settings")
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
      style={[styles.container, {backgroundColor: temaClima.backgroundColor}]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    > 
        <View style={styles.view_icon}>
          <Image style={styles.image}
            source={require('../assets/estacio-icon.png')} // Caminho relativo para o ícone
          />

          <TouchableOpacity onPress={handleNext}>
            <Settings size={44}
            color={"white"}
            />
          </TouchableOpacity>
          
        </View>

        <View style={styles.view_center}>
          <View style={[styles.circleClima, {backgroundColor: temaClima.backgroundClima}]}>
            {imagemCircleClima && ( 
              <Image style={styles.iconCircle}
                source={imagemCircleClima}
              />
            )}
          </View>
          <Text style={styles.textTemperatura}>{data.temp} °C</Text>

        </View>

        <View style={styles.view_informations}>
          <View style={styles.linhaDeDado}>
        
            <Thermometer 
                size={44}           
                color="white"       
                strokeWidth={2} 
                style={{ marginRight: 10 }} 
            />
            <Text style={styles.label}>Temperatura</Text>
            <Text style={styles.label}>{data.temp} °C</Text>
            </View> 
          <View style={styles.linhaDeDado}>
            <Droplet size={44} 
              color={"white"}
            />
            <Text style={styles.label}>Umidade</Text>
            <Text style={styles.label}>{data.hum} %</Text>
          </View>

          <View style={styles.linhaDeDado}>
            <Lightbulb
              size={44}
              color={"white"}
            /> 
            <Text style={styles.label}>Luz</Text>
            <Text style={styles.label}>{data.light} %</Text>    
          </View>

          <View style={styles.linhaDeDado}>
            <AudioLines 
            size={44}
            color={"white"}
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


