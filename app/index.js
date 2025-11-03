import React, { useEffect, useState, useRef, useMemo } from "react";
import { styles } from "./style";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image, 
  TouchableOpacity, 
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
import imgCinzas from '../assets/iconesClima/cinzas.png'
import { useData } from "./context/DataContext";


export default function App() {

 const {data} = useData();
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
    'cinzas': imgCinzas,
  }


    const getHours = (hours) => { 
    const dia = 6; 
    const noite = 19;

    if (hours >= dia && hours < noite) { 
      return 'Dia';
    } else { 
      return 'Noite';
    }
  } 

  const temaClima = useMemo(() => { 
    const {temp, hum, light, sound} = data;
    const IS_NIGHT = light < 10;

    let status;
    let imageName;
    let color;
    let backgroundColor;
    let backgroundCircle;
    let backgroundPainelDados;
    let painelDiaDaSemana;
    let colorTextDayWeek;
    let textColor;
    let imageKey;
    let colorIconConfig;
    if (temp == 0 && light == 0) { 
      return { 
        status: "Aguardando dados...",
        imageName: '',
        backgroundColor: '#000', // 
        textColor: '#f8fcf7', 
        backgroundCircle: '#303030',
        backgroundPainelDados: '#121212',
        colorTextDayWeek: '#BFBFBF',
        painelDiaDaSemana: '#303030',
        
      }
    }
    // Tema base: Noite
    if (IS_NIGHT === 'Noite') { 
        status = 'Estável (Noite)';
        // Cor de fundo
        backgroundColor = '#7d72ff'; 
        // Area do icone clima
        backgroundCircle = '#303030';
        // Cor do painel de dados
        backgroundPainelDados = '#4c3afd';
        
        // Painel dia da semana
        painelDiaDaSemana = '#0d0826';
        // Cor do dia da semana
        colorTextDayWeek = '#fdfdfd';
        // Cor dos textos
        textColor = '#FAFFF5';  
        imageKey = 'lua';  
        
    } 
   

    if (temp > 35 && sound > 80) { 
      status = 'Cinzas'
      backgroundColor = '#212121';
      textColor = '#BFBFBF';
      backgroundCircle = '#303030';
      backgroundPainelDados = '#121212';
      colorTextDayWeek = '#BFBFBF';
      painelDiaDaSemana = '#303030';
      imageKey = 'cinzas';
    }

    else if (hum > 85 && light < 20 && sound > 70) { 
      status = 'Tempestade'
      backgroundColor = '#4d2b88';
      backgroundCircle = '#0d0826';
      backgroundPainelDados = '#301179'; 
      painelDiaDaSemana = '#0d0727';
      colorTextDayWeek = '#c2c0ca';
      textColor = '#fcfafc';
      imageKey = 'tempestade';
    }

    else if (hum > 75 && light < 40) { 
      status = 'Chuva'
      backgroundColor = '#98aeec'
      textColor = '#fcfefe'
      backgroundCircle = '#fefdfe';
      backgroundPainelDados = '#94b3ff';
      colorTextDayWeek = '#98aeec';
      imageKey = 'chuva';
      painelDiaDaSemana = '#fefdfe';
    }

    else if (hum > 90 && temp < 15 ){ 
      status = 'Nevoa'
      backgroundColor = ' #2045d4';
      backgroundCircle = '#0d0826';
      backgroundPainelDados = '#1021ca';
      painelDiaDaSemana = '#0d0826';
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
      painelDiaDaSemana = '#fdfefd';
      textColor = '#f0eee9';
      imageKey = 'ensolarado';
      
    }

    else if (light >= 40 && light <= 80) { 
      status = 'Nublado';
      backgroundColor = '#FAFFF5';
      backgroundCircle = '#fefdfe';
      backgroundPainelDados = '#E7ECFF';
      colorTextDayWeek = '#637AE8';
      imageKey = 'nublado';
      painelDiaDaSemana = '#FAFFF5';
      textColor = '#637AE8';
      colorIconConfig = 'black';
    }

    else if (sound > 50 && light > 50){ 
      status = 'Ventoso';
      backgroundColor: "#65fbda";
      backgroundCircle: "#ffffff";
      backgroundPainelDados: "#4cc4d5";
      painelDiaDaSemana: '#ffffff';
      colorTextDayWeek: '#69aeb7';
      textColor: '#f0edee';
    }
    
    

    

    return { 
      status: status, 
      imageName: imageName, 
      primaryColor: color, 
      textColor: textColor,
      backgroundColor: backgroundColor,
      backgroundCircle: backgroundCircle, 
      backgroundPainelDados: backgroundPainelDados,
      colorTextDayWeek: colorTextDayWeek,
      painelDiaDaSemana: painelDiaDaSemana,
      imageKey: imageKey,
      colorIconConfig: colorIconConfig,
    }
  }, [data]);



  const imagemCircleClima = ImagensClima[temaClima.imageKey]
  const dataAtual = new Date();
  const horaAtual = dataAtual.getHours();
  const IS_NIGHT = getHours(horaAtual);
  const isDay = getHours(horaAtual);
  const clima = temaClima.status;



  function handleNextConfig(){ 
    router.navigate("/settings/settings");
  }

  function handleNextDados() { 
    router.navigate("/dados");
  }

  // const corDeFundo = getTempColor()
  
  return (
    <KeyboardAvoidingView
      style={[styles.container, {backgroundColor: temaClima.backgroundColor}]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    > 
        <View style={styles.view_icon}>
          <Image style={styles.image}
            source={require('../assets/estacio-icon.png')} // Caminho relativo para o ícone
          />

          <TouchableOpacity onPress={handleNextConfig} style={{cursor:'pointer'}}>
            <Settings size={44}
            style={styles.iconCircle}
            />
          </TouchableOpacity>
          
        </View>

        <View style={styles.view_center}>
          
          <View>
            <View style={[styles.circleClima, {backgroundColor: temaClima.backgroundCircle}]}>
              {imagemCircleClima && ( 
                <Image style={styles.iconCircle}
                  source={imagemCircleClima}
                />
              )}
            </View>
          </View>
          <Text style={[styles.textTemperatura, {color: temaClima.textColor}]}>{data.temp} °C</Text>
          <Text style={[styles.clima, {color: temaClima.textColor}]}>{clima}</Text>
          <View style={[styles.viewDayWeek, {backgroundColor: temaClima.painelDiaDaSemana}]}>
            <Text style={[styles.textDayWeek, {color: temaClima.colorTextDayWeek}]}>{isDay}</Text>
          </View>

        </View>

        
        <TouchableOpacity onPress={handleNextDados} style={{cursor:'pointer'}}>
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
        </TouchableOpacity>

{/*       
       */}

     

      {/* {error && (
        <View style={{ marginTop: 20, alignItems: "center" }}>
          <Text style={styles.error}>⚠️ Falha ao obter dados do sensor</Text>
          <Text style={styles.errorDetails}>{error}</Text>
        </View>
      )} */}
    </KeyboardAvoidingView>
  );
}


