// import imgChuva from '../assets/iconesClima/chuva.png'
// import imgLua from '../assets/iconesClima/lua.png'
// import imgNevoa from '../assets/iconesClima/nevoa.png'
// import imgNublado from '../assets/iconesClima/nublado.png'
// import imgSol from '../assets/iconesClima/sol.png'
// import imgTempestade from '../assets/iconesClima/tempestade.png'
// import imgVentoso from '../assets/iconesClima/ventoso.png'
// import imgCinzas from '../assets/iconesClima/cinzas.png'
 
 
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

  const convertCelsiusToFahrenheit = (temp) => { 
    return (temp * 1.8) + 32;
  }
  const temperaturaExibida = useMemo(() => { 
    const {temp} = data;

    const unidadeAtual = unit;

    console.log("unidadeAtual:", unidadeAtual);

    let valorTemp;
    let simbolo;

    if (unidadeAtual === "Fahrenheit") { 
      valorTemp = convertCelsiusToFahrenheit(temp).toFixed(1);
      console.log(valorTemp);
      simbolo = "°F";
    } else { 
      valorTemp = temp;
      simbolo = "°C"
    }

    return {valor: valorTemp, simbolo: simbolo};

  }, [data.temp, unit])

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
