// app/dados.js
import React from "react";
import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useData } from "../context/DataContext";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

export default function Dados() {
  const { history, data, error } = useData();

  // === ESTADO 1: Carregando (primeira vez) ===
  if (history.length === 0 && !error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f8f9fa" }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 16, fontSize: 16, color: "#666" }}>Conectando ao sensor...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#f8f9fa" }}>
        <Text style={{ fontSize: 18, color: "red", textAlign: "center" }}>
          Falha na conexão
        </Text>
        <Text style={{ marginTop: 8, color: "#666", textAlign: "center" }}>
          {error}
        </Text>
      </View>
    );
  }

  // === ESTADO 3: Dados válidos (mas pode ser tudo zero) ===
  const hasValidData = history.some(h => h.temp > 0 || h.hum > 0 || h.light > 0 || h.sound > 0);

  if (!hasValidData) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#f8f9fa" }}>
        <Text style={{ fontSize: 18, color: "#888" }}>Aguardando dados do sensor...</Text>
        <Text style={{ marginTop: 8, color: "#aaa", fontSize: 14 }}>
          Os valores ainda estão em 0
        </Text>
      </View>
    );
  }

  const labels = history.map(h => h.time.split(':').slice(1).join(':')); // min:seg
  const tempData = history.map(h => h.temp);
  const humData = history.map(h => h.hum);
  const lightData = history.map(h => h.light);
  const soundData = history.map(h => h.sound);

  const chartConfig = {
    backgroundColor: "#fff",
    backgroundGradientFrom: "#f8f9fa",
    backgroundGradientTo: "#fff",
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: { borderRadius: 16 },
    propsForDots: { r: "4", strokeWidth: "2", stroke: "#007AFF" },
  };

  return (
    <ScrollView style={{ flex: 1, padding: 20, backgroundColor: "#f8f9fa" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" }}>
        Histórico em Tempo Real
      </Text>

      <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 10 }}>Temperatura (°C)</Text>
      <LineChart
        data={{ labels, datasets: [{ data: tempData, color: () => `#FF3B30` }] }}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={{ marginBottom: 30, borderRadius: 16 }}
      />

      <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 10 }}>Umidade (%)</Text>
      <LineChart
        data={{ labels, datasets: [{ data: humData, color: () => `#34C759` }] }}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={{ marginBottom: 30, borderRadius: 16 }}
      />

      <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 10 }}>Luz (%)</Text>
      <LineChart
        data={{ labels, datasets: [{ data: lightData, color: () => `#FFCC00` }] }}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={{ marginBottom: 30, borderRadius: 16 }}
      />

      <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 10 }}>Som (dB)</Text>
      <LineChart
        data={{ labels, datasets: [{ data: soundData, color: () => `#AF52DE` }] }}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={{ marginBottom: 50, borderRadius: 16 }}
      />
    </ScrollView>
  );
}