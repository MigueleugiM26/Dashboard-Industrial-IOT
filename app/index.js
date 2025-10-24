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
  const [data, setData] = useState({ temp: 0, hum: 44, light: 85, sound: 0 });
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
    'ensolarado': imgSol,
  }
  
  const getClimaStatus = () => { 
    const {temp, hum, light, sound} = data;
    const IS_NIGHT = light < 10; 

    let status;
    let imageName;
    let color;
    let backgroundColor;
    let backgroundCircle;
    let backgroundPainelDados;
    let colorTextDayWeek;
    let textColor;
    let imageKey;

    if (temp == 0 && light == 0) { 
      return { 
        status: "Aguardando dados...",
        imageName: '',
        backgroundColor: '#000', // 
        textColor: '#f8fcf7', 
        backgroundCircle: '#303030',
        backgroundPainelDados: '#121212',
        colorTextDayWeek: '#BFBFBF'
        
      }
    }
    // Tema base: Noite
    if (IS_NIGHT) { 
        status = 'Estável (Noite)';
        // Cor de fundo
        backgroundColor = '#7d72ff'; 
        // Area do icone clima
        backgroundCircle = '#303030';
        // Cor do painel de dados
        backgroundPainelDados = '#4c3afd';
        // Cor do dia da semana
        colorTextDayWeek = '#fdfdfd';
        // Cor dos textos
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
      backgroundColor = '#212121';
      textColor = '#BFBFBF';
      backgroundCircle = '#303030'
      backgroundPainelDados = '#121212'
      colorTextDayWeek = '#BFBFBF'
      imageKey = 'cinzas';
    }

    else if (hum > 85 && light < 20 && sound > 70) { 
      status = 'Tempestade'
      backgroundColor = ' #0d0727';
      backgroundCircle = '#0d0826';
      backgroundPainelDados = '#301179'
      colorTextDayWeek = '#c2c0ca'
      textColor = '#fcfafc';
      imageKey = 'tempestade';
    }

    else if (hum > 75 && light < 40) { 
      status = 'Chuva'
      backgroundColor = ' #c0d3fe'
      textColor = '#fcfefe'
      backgroundCircle = '#fefdfe';
      backgroundPainelDados = '#94b3ff';
      colorTextDayWeek = '#98aeec';
      textColor = '#fcfefe';
      imageKey = 'chuva';
    }

    else if (hum > 90 && temp < 15){ 
      status = 'Nevoa'
      backgroundColor = ' #2045d4';
      backgroundCircle = '#0d0826';
      backgroundPainelDados = '#1021ca'
      colorTextDayWeek = '#fffffd';
      textColor = '#fdfdff';
      imageKey = 'nevoa';
    }

    else if (light > 80 && hum < 50) { 
      status = 'Ensolarado'
      backgroundColor = '#ffa733';
      backgroundCircle = '#fdfefd';
      backgroundPainelDados = '#ff8937';
      colorTextDayWeek = '#e5a85d';
      textColor = '#f0eee9';
      imageKey = 'ensolarado';
    }

    else if (light >= 40 && light <= 80) { 
      status = 'Nublado';
      backgroundColor = '#FAFFF5';
      backgroundCircle = '#fefdfe';
      backgroundPainelDados = '#E7ECFF';
      colorTextDayWeek = '#637AE8';
      textColor = '#637AE8'
      imageKey = 'nublado'
    }

    // A ver como irei implementar o vento. Irei fazer depois

    return { 
      status: status, 
      imageName: imageName, 
      primaryColor: color, 
      textColor: textColor,
      backgroundColor: backgroundColor,
      backgroundCircle: backgroundCircle, 
      backgroundPainelDados: backgroundPainelDados,
      colorTextDayWeek: colorTextDayWeek,
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
          <View style={[styles.circleClima, {backgroundColor: temaClima.backgroundCircle}]}>
            {imagemCircleClima && ( 
              <Image style={styles.iconCircle}
                source={imagemCircleClima}
              />
            )}
          </View>
          <Text style={[styles.textTemperatura, {color: temaClima.textColor}]}>{data.temp} °C</Text>

        </View>

        <View style={[styles.viewInformationsWeather, {backgroundColor: temaClima.backgroundPainelDados}]}>
          <View style={styles.weatherInformation}>
        
            <Thermometer 
                size={44}           
                color="white"       
                strokeWidth={2} 
                style={{ marginRight: 10 }} 
            />
            <Text style={[styles.label, {color: temaClima.textColor}]}>Temperatura</Text>
            <Text style={[styles.label, {color: temaClima.textColor}]}>{data.temp} °C</Text>
            </View> 
          <View style={styles.weatherInformation}>
            <Droplet size={44} 
              color={"white"}
            />
            <Text style={[styles.label, {color: temaClima.textColor}]}>Umidade</Text>
            <Text style={[styles.label, {color: temaClima.textColor}]}>{data.hum} %</Text>
          </View>

          <View style={styles.weatherInformation}>
            <Lightbulb
              size={44}
              color={"white"}
            /> 
            <Text style={[styles.label, {color: temaClima.textColor}]}>Luz</Text>
            <Text style={[styles.label, {color: temaClima.textColor}]}>{data.light} %</Text>    
          </View>

          <View style={styles.weatherInformation}>
            <AudioLines 
            size={44}
            color={"white"}
            />
            <Text style={[styles.label, {color: temaClima.textColor}]}>Som </Text>
            <Text style={[styles.label, {color: temaClima.textColor}]}>{data.sound} dB</Text>
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


