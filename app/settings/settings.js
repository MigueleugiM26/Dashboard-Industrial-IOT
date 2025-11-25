import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useData } from "../context/DataContext";
import { ChevronLeft, ChevronDown } from "lucide-react-native";
import { useRouter } from "expo-router";

export default function Settings() {
  const { data, unit, setUnit, isConnected, lastUpdate } = useData();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);

  const units = [
    { label: "Celsius", value: "Celsius" },
    { label: "Fahrenheit", value: "Fahrenheit" },
    { label: "Kelvin", value: "Kelvin" },
  ];

  const handleUnitChange = (newUnit) => {
    setUnit(newUnit);
    setShowDropdown(false);
  };

  const formatLastConnection = () => {
    if (!lastUpdate) return "Nunca";
    return lastUpdate.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
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

  // Theme based on data (same logic as main page)
  const temaClima = useMemo(() => {
    const { temp, hum, light, sound } = data;

    if (temp == 0 && light == 0) {
      return {
        backgroundColor: "#000",
        textColor: "#f8fcf7",
      };
    }

    let backgroundColor, textColor;

    // Tema Cinzas
    if (temp > 35 && sound > 80) {
      backgroundColor = "#212121";
      textColor = "#BFBFBF";
    }
    // Tema Tempestade
    else if (hum > 85 && light < 20 && sound > 70) {
      backgroundColor = "#4d2b88";
      textColor = "#fcfafc";
    }
    // Tema Chuva
    else if (hum > 75 && light < 40) {
      backgroundColor = "#c0d3fe";
      textColor = "#fcfefe";
    }
    // Tema Névoa
    else if (hum > 90 && temp < 15) {
      backgroundColor = "#2045d4";
      textColor = "#fdfdff";
    }
    // Tema Ensolarado
    else if (light > 80 && hum < 50) {
      backgroundColor = "#ffa733";
      textColor = "#f0eee9";
    }
    // Tema Nublado
    else if (light >= 40 && light <= 80) {
      backgroundColor = "#FAFFF5";
      textColor = "#637AE8";
    }
    // Tema Ventoso
    else if (sound > 50 && light > 50) {
      backgroundColor = "#65fbda";
      textColor = "#f0edee";
    }
    // Tema Noite
    else if (light < 10) {
      backgroundColor = "#7d72ff";
      textColor = "#f8fcf7";
    }
    // Default
    else {
      backgroundColor = "#FAFFF5";
      textColor = "#637AE8";
    }

    return { backgroundColor, textColor };
  }, [data]);

  return (
    <View
      style={[styles.container, { backgroundColor: temaClima.backgroundColor }]}
    >
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push("/")}
          style={styles.backButton}
        >
          <ChevronLeft size={32} color={temaClima.textColor} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: temaClima.textColor }]}>
          Configurações
        </Text>
      </View>

      {/* Connection Status */}
      <View style={styles.section}>
        <View style={styles.statusRow}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: isConnected ? "#4CAF50" : "#F44336" },
            ]}
          />
          <Text style={[styles.statusText, { color: temaClima.textColor }]}>
            {isConnected ? "Conectado" : "Desconectado"}
          </Text>
        </View>
        <Text
          style={[
            styles.lastConnectionLabel,
            { color: temaClima.textColor, opacity: 0.7 },
          ]}
        >
          Última Conexão
        </Text>
        <Text
          style={[styles.lastConnectionTime, { color: temaClima.textColor }]}
        >
          {formatLastConnection()}
        </Text>
      </View>

      {/* Temperature Unit Picker */}
      <View style={styles.section}>
        <Text
          style={[
            styles.sectionLabel,
            { color: temaClima.textColor, opacity: 0.7 },
          ]}
        >
          Medidas
        </Text>
        <TouchableOpacity
          style={[
            styles.pickerContainer,
            {
              backgroundColor: temaClima.textColor + "20",
              borderColor: temaClima.textColor + "40",
            },
          ]}
          onPress={() => setShowDropdown(!showDropdown)}
        >
          <Text style={[styles.pickerText, { color: temaClima.textColor }]}>
            {unit}
          </Text>
          <ChevronDown size={20} color={temaClima.textColor} />
        </TouchableOpacity>

        {showDropdown && (
          <View
            style={[
              styles.dropdownContainer,
              {
                backgroundColor: temaClima.textColor + "20",
                borderColor: temaClima.textColor + "40",
              },
            ]}
          >
            {units.map((item) => (
              <TouchableOpacity
                key={item.value}
                style={[
                  styles.dropdownItem,
                  { borderBottomColor: temaClima.textColor + "30" },
                  unit === item.value && {
                    backgroundColor: temaClima.textColor + "30",
                  },
                ]}
                onPress={() => handleUnitChange(item.value)}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    { color: temaClima.textColor },
                    unit === item.value && styles.dropdownItemTextSelected,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Footer */}
      <View
        style={[styles.footer, { backgroundColor: temaClima.backgroundColor }]}
      >
        <Text
          style={[
            styles.footerTitle,
            { color: temaClima.textColor, opacity: 0.6 },
          ]}
        >
          Nome dos Integrantes
        </Text>
        <Text style={[styles.footerText, { color: temaClima.textColor }]}>
          Adriano Alencar, Heitor Inácio, João Victor, Kauã Lima e Miguel
          Gabriel.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 30,
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
  },
  section: {
    paddingHorizontal: 30,
    marginBottom: 30,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "500",
  },
  lastConnectionLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  lastConnectionTime: {
    fontSize: 18,
    fontWeight: "500",
  },
  currentTemp: {
    fontSize: 32,
    fontWeight: "700",
  },
  sectionLabel: {
    fontSize: 16,
    marginBottom: 15,
  },
  pickerContainer: {
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  pickerText: {
    fontSize: 16,
  },
  dropdownContainer: {
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 10,
    overflow: "hidden",
  },
  dropdownItem: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
  },
  dropdownItemText: {
    fontSize: 16,
  },
  dropdownItemTextSelected: {
    fontWeight: "600",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 20,
    paddingHorizontal: 30,
    alignItems: "center",
  },
  footerTitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  footerText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
