import React, { useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Platform,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import {
  Thermometer,
  Droplet,
  Lightbulb,
  AudioLines,
  Settings,
} from "lucide-react-native";
import { LineChart } from "react-native-chart-kit";
import { useData } from "./context/DataContext";
import imgChuva from "../assets/iconesClima/chuva.png";
import imgLua from "../assets/iconesClima/lua.png";
import imgNevoa from "../assets/iconesClima/nevoa.png";
import imgNublado from "../assets/iconesClima/nublado.png";
import imgSol from "../assets/iconesClima/sol.png";
import imgTempestade from "../assets/iconesClima/tempestade.png";
import imgVentoso from "../assets/iconesClima/ventoso.png";
import imgCinzas from "../assets/iconesClima/cinzas.png";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");
const COLLAPSED_HEIGHT = 280;
const EXPANDED_HEIGHT = SCREEN_HEIGHT * 0.85;

export default function App() {
  const { data, unit, history } = useData();
  const router = useRouter();
  const translateY = useSharedValue(SCREEN_HEIGHT - COLLAPSED_HEIGHT);
  const [isExpanded, setIsExpanded] = useState(false);

  const ImagensClima = {
    chuva: imgChuva,
    lua: imgLua,
    nevoa: imgNevoa,
    nublado: imgNublado,
    sol: imgSol,
    tempestade: imgTempestade,
    ventoso: imgVentoso,
    ensolarado: imgSol,
    cinzas: imgCinzas,
  };

  const convertCelsiusToFahrenheit = (temp) => temp * 1.8 + 32;
  const convertCelsiusToKelvin = (temp) => temp + 273.15;

  const temperaturaExibida = useMemo(() => {
    const { temp } = data;
    if (unit === "Fahrenheit") {
      return {
        valor: convertCelsiusToFahrenheit(temp).toFixed(1),
        simbolo: "°F",
      };
    } else if (unit === "Kelvin") {
      return {
        valor: convertCelsiusToKelvin(temp).toFixed(1),
        simbolo: "K",
      };
    }
    return { valor: temp, simbolo: "°C" };
  }, [data.temp, unit]);

  const temaClima = useMemo(() => {
    const { temp, hum, light, sound } = data;

    if (temp == 0 && light == 0) {
      return {
        status: "Aguardando dados...",
        backgroundColor: "#000",
        textColor: "#f8fcf7",
        backgroundCircle: "#303030",
        backgroundPainelDados: "#121212",
        colorTextDayWeek: "#BFBFBF",
        painelDiaDaSemana: "#303030",
        imageKey: null,
      };
    }

    let status,
      backgroundColor,
      textColor,
      backgroundCircle,
      backgroundPainelDados;
    let colorTextDayWeek, painelDiaDaSemana, imageKey;

    // Tema Cinzas
    if (temp > 35 && sound > 80) {
      status = "Cinzas";
      backgroundColor = "#212121";
      textColor = "#BFBFBF";
      backgroundCircle = "#303030";
      backgroundPainelDados = "#121212";
      colorTextDayWeek = "#BFBFBF";
      painelDiaDaSemana = "#303030";
      imageKey = "cinzas";
    }
    // Tema Tempestade
    else if (hum > 85 && light < 20 && sound > 70) {
      status = "Tempestade";
      backgroundColor = "#4d2b88";
      backgroundCircle = "#0d0826";
      backgroundPainelDados = "#301179";
      painelDiaDaSemana = "#0d0727";
      colorTextDayWeek = "#c2c0ca";
      textColor = "#fcfafc";
      imageKey = "tempestade";
    }
    // Tema Chuva
    else if (hum > 75 && light < 40) {
      status = "Chuva";
      backgroundColor = "#c0d3fe";
      textColor = "#fcfefe";
      backgroundCircle = "#fefdfe";
      backgroundPainelDados = "#94b3ff";
      colorTextDayWeek = "#98aeec";
      imageKey = "chuva";
      painelDiaDaSemana = "#fefdfe";
    }
    // Tema Névoa
    else if (hum > 90 && temp < 15) {
      status = "Névoa";
      backgroundColor = "#2045d4";
      backgroundCircle = "#0d0826";
      backgroundPainelDados = "#1021ca";
      painelDiaDaSemana = "#0d0826";
      colorTextDayWeek = "#fffffd";
      textColor = "#fdfdff";
      imageKey = "nevoa";
    }
    // Tema Ensolarado
    else if (light > 80 && hum < 50) {
      status = "Ensolarado";
      backgroundColor = "#ffa733";
      backgroundCircle = "#fdfefd";
      backgroundPainelDados = "#ff8937";
      colorTextDayWeek = "#e5a85d";
      painelDiaDaSemana = "#fdfefd";
      textColor = "#f0eee9";
      imageKey = "ensolarado";
    }
    // Tema Nublado
    else if (light >= 40 && light <= 80) {
      status = "Nublado";
      backgroundColor = "#FAFFF5";
      backgroundCircle = "#fefdfe";
      backgroundPainelDados = "#E7ECFF";
      colorTextDayWeek = "#637AE8";
      imageKey = "nublado";
      painelDiaDaSemana = "#FAFFF5";
      textColor = "#637AE8";
    }
    // Tema Ventoso
    else if (sound > 50 && light > 50) {
      status = "Ventoso";
      backgroundColor = "#65fbda";
      backgroundCircle = "#ffffff";
      backgroundPainelDados = "#4cc4d5";
      painelDiaDaSemana = "#ffffff";
      colorTextDayWeek = "#69aeb7";
      textColor = "#f0edee";
      imageKey = "ventoso";
    }
    // Tema Noite (based on light level, not time)
    else if (light < 10) {
      status = "Noite";
      backgroundColor = "#7d72ff";
      backgroundCircle = "#0d0826";
      backgroundPainelDados = "#4c3afd";
      painelDiaDaSemana = "#0d0826";
      colorTextDayWeek = "#fdfdfd";
      textColor = "#f8fcf7";
      imageKey = "lua";
    }
    // Default fallback
    else {
      status = "Nublado";
      backgroundColor = "#FAFFF5";
      backgroundCircle = "#fefdfe";
      backgroundPainelDados = "#E7ECFF";
      colorTextDayWeek = "#637AE8";
      imageKey = "nublado";
      painelDiaDaSemana = "#FAFFF5";
      textColor = "#637AE8";
    }

    return {
      status,
      textColor,
      backgroundColor,
      backgroundCircle,
      backgroundPainelDados,
      colorTextDayWeek,
      painelDiaDaSemana,
      imageKey,
    };
  }, [data]);

  const imagemCircleClima = ImagensClima[temaClima.imageKey];

  // Get day of the week in Portuguese
  const getDayOfWeek = () => {
    const days = [
      "Domingo",
      "Segunda",
      "Terça",
      "Quarta",
      "Quinta",
      "Sexta",
      "Sábado",
    ];
    const dataAtual = new Date();
    return days[dataAtual.getDay()];
  };

  // Gesture using GestureDetector
  const panGesture = Gesture.Pan()
    .onStart(() => {
      // No context needed
    })
    .onUpdate((e) => {
      const newY = SCREEN_HEIGHT - COLLAPSED_HEIGHT + e.translationY;
      translateY.value = Math.max(
        SCREEN_HEIGHT - EXPANDED_HEIGHT,
        Math.min(SCREEN_HEIGHT - COLLAPSED_HEIGHT, newY)
      );
    })
    .onEnd((e) => {
      const threshold = (EXPANDED_HEIGHT - COLLAPSED_HEIGHT) / 2;
      const currentOffset = SCREEN_HEIGHT - translateY.value;

      if (e.velocityY > 500) {
        translateY.value = withSpring(SCREEN_HEIGHT - COLLAPSED_HEIGHT);
        setIsExpanded(false);
      } else if (e.velocityY < -500) {
        translateY.value = withSpring(SCREEN_HEIGHT - EXPANDED_HEIGHT);
        setIsExpanded(true);
      } else if (currentOffset > threshold + COLLAPSED_HEIGHT) {
        translateY.value = withSpring(SCREEN_HEIGHT - EXPANDED_HEIGHT);
        setIsExpanded(true);
      } else {
        translateY.value = withSpring(SCREEN_HEIGHT - COLLAPSED_HEIGHT);
        setIsExpanded(false);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  // Chart data
  const labels = history
    .slice(-8)
    .map((h) => h.time.split(":").slice(0, 2).join(":"));

  // Convert temperature data based on selected unit
  const tempData = history.slice(-8).map((h) => {
    if (unit === "Fahrenheit") {
      return convertCelsiusToFahrenheit(h.temp);
    } else if (unit === "Kelvin") {
      return convertCelsiusToKelvin(h.temp);
    }
    return h.temp;
  });

  const humData = history.slice(-8).map((h) => h.hum);
  const lightData = history.slice(-8).map((h) => h.light);
  const soundData = history.slice(-8).map((h) => h.sound);

  const chartConfig = (colorHex) => ({
    backgroundColor: "#fff",
    backgroundGradientFrom: temaClima.backgroundPainelDados,
    backgroundGradientTo: temaClima.backgroundPainelDados,
    decimalPlaces: 1,
    color: (opacity = 1) => colorHex,
    labelColor: (opacity = 1) => temaClima.textColor,
    style: { borderRadius: 16 },
    propsForDots: { r: "3", strokeWidth: "2", stroke: colorHex },
  });

  return (
    <View
      style={[styles.container, { backgroundColor: temaClima.backgroundColor }]}
    >
      {/* Top section */}
      <View style={styles.topSection}>
        <View style={styles.header}>
          <Image
            style={styles.logo}
            source={require("../assets/estacio-icon.png")}
          />
          <TouchableOpacity
            onPress={() => router.navigate("/settings/settings")}
          >
            <Settings size={40} color={temaClima.textColor} />
          </TouchableOpacity>
        </View>

        <View style={styles.centerContent}>
          <View
            style={[
              styles.circleClima,
              { backgroundColor: temaClima.backgroundCircle },
            ]}
          >
            {imagemCircleClima && (
              <Image style={styles.iconCircle} source={imagemCircleClima} />
            )}
          </View>
          <Text
            style={[styles.textTemperatura, { color: temaClima.textColor }]}
          >
            {temperaturaExibida.valor} {temperaturaExibida.simbolo}
          </Text>
          <Text style={[styles.clima, { color: temaClima.textColor }]}>
            {temaClima.status}
          </Text>
        </View>
      </View>

      {/* Collapsible bottom sheet */}
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            styles.bottomSheet,
            { backgroundColor: temaClima.backgroundPainelDados },
            animatedStyle,
          ]}
        >
          <View
            style={[
              styles.dateBadge,
              { backgroundColor: temaClima.painelDiaDaSemana },
            ]}
          >
            <Text
              style={[styles.dateText, { color: temaClima.colorTextDayWeek }]}
            >
              {getDayOfWeek()}
            </Text>
          </View>

          <View style={styles.dragHandle} />

          <ScrollView
            style={styles.sheetContent}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 200 }}
            scrollEnabled={true}
          >
            {/* Collapsed Info - Vertical Stack */}
            <View style={styles.collapsedInfo}>
              <View style={styles.infoItemHorizontal}>
                <Thermometer
                  size={36}
                  color={temaClima.textColor}
                  strokeWidth={2}
                />
                <Text
                  style={[styles.infoLabel, { color: temaClima.textColor }]}
                >
                  Temperatura
                </Text>
                <Text
                  style={[styles.infoValue, { color: temaClima.textColor }]}
                >
                  {temperaturaExibida.valor}
                  {temperaturaExibida.simbolo}
                </Text>
              </View>

              <View style={styles.infoItemHorizontal}>
                <Droplet size={36} color={temaClima.textColor} />
                <Text
                  style={[styles.infoLabel, { color: temaClima.textColor }]}
                >
                  Umidade
                </Text>
                <Text
                  style={[styles.infoValue, { color: temaClima.textColor }]}
                >
                  {data.hum}%
                </Text>
              </View>

              <View style={styles.infoItemHorizontal}>
                <Lightbulb size={36} color={temaClima.textColor} />
                <Text
                  style={[styles.infoLabel, { color: temaClima.textColor }]}
                >
                  Luminosidade
                </Text>
                <Text
                  style={[styles.infoValue, { color: temaClima.textColor }]}
                >
                  {data.light}%
                </Text>
              </View>
            </View>

            {/* Expanded Content - Only visible when expanded */}
            {isExpanded && (
              <>
                <View style={styles.infoItemHorizontal}>
                  <AudioLines size={36} color={temaClima.textColor} />
                  <Text
                    style={[styles.infoLabel, { color: temaClima.textColor }]}
                  >
                    Som
                  </Text>
                  <Text
                    style={[styles.infoValue, { color: temaClima.textColor }]}
                  >
                    {data.sound} dB
                  </Text>
                </View>

                {history.length > 0 && (
                  <View style={styles.graphsContainer}>
                    <Text
                      style={[
                        styles.graphTitle,
                        { color: temaClima.textColor },
                      ]}
                    >
                      Temperatura
                    </Text>
                    <LineChart
                      data={{
                        labels,
                        datasets: [{ data: tempData.length ? tempData : [0] }],
                      }}
                      width={SCREEN_WIDTH - 40}
                      height={180}
                      chartConfig={chartConfig("#FF3B30")}
                      bezier
                      style={styles.chart}
                    />

                    <Text
                      style={[
                        styles.graphTitle,
                        { color: temaClima.textColor },
                      ]}
                    >
                      Umidade
                    </Text>
                    <LineChart
                      data={{
                        labels,
                        datasets: [{ data: humData.length ? humData : [0] }],
                      }}
                      width={SCREEN_WIDTH - 40}
                      height={180}
                      chartConfig={chartConfig("#37e2dc")}
                      bezier
                      style={styles.chart}
                    />

                    <Text
                      style={[
                        styles.graphTitle,
                        { color: temaClima.textColor },
                      ]}
                    >
                      Luminosidade
                    </Text>
                    <LineChart
                      data={{
                        labels,
                        datasets: [
                          { data: lightData.length ? lightData : [0] },
                        ],
                      }}
                      width={SCREEN_WIDTH - 40}
                      height={180}
                      chartConfig={chartConfig("#FFCC00")}
                      bezier
                      style={styles.chart}
                    />

                    <Text
                      style={[
                        styles.graphTitle,
                        { color: temaClima.textColor },
                      ]}
                    >
                      Som
                    </Text>
                    <LineChart
                      data={{
                        labels,
                        datasets: [
                          { data: soundData.length ? soundData : [0] },
                        ],
                      }}
                      width={SCREEN_WIDTH - 40}
                      height={180}
                      chartConfig={chartConfig("#AF52DE")}
                      bezier
                      style={styles.chart}
                    />
                  </View>
                )}
              </>
            )}
          </ScrollView>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topSection: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: COLLAPSED_HEIGHT,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logo: { width: 50, height: 50 },
  centerContent: { flex: 1, justifyContent: "center", alignItems: "center" },
  circleClima: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  iconCircle: { width: 120, height: 120, resizeMode: "contain" },
  textTemperatura: { fontSize: 64, fontWeight: "700", marginBottom: 10 },
  clima: { fontSize: 24, fontWeight: "500" },
  bottomSheet: {
    position: "absolute",
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  dateBadge: {
    position: "absolute",
    top: -20,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  dateText: { fontSize: 14, fontWeight: "600" },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 3,
    alignSelf: "center",
    marginTop: 15,
    marginBottom: 20,
  },
  sheetContent: { flex: 1, paddingHorizontal: 20 },
  collapsedInfo: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: 15,
    marginBottom: 20,
  },
  infoItemHorizontal: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
    textAlign: "center",
    marginLeft: 15,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: "700",
    minWidth: 80,
    textAlign: "right",
  },
  graphsContainer: { marginTop: 30 },
  graphTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    marginTop: 15,
  },
  chart: { borderRadius: 16, marginBottom: 10 },
});
