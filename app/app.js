// App.js (replace your current file with this)
import "react-native-gesture-handler"; // ensure this is the first import related to gesture handling
import React, { useEffect, useState, useRef } from "react";
import Settings from "./settings/settings";
import Dados from "./dados";
import Index from "./index";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// ===== THINGSPEAK CONFIGURATION =====
const THINGSPEAK_CHANNEL = "3179416"; // Get from ThingSpeak
const THINGSPEAK_READ_KEY = "4ZPL92UWZYYFMRN3"; // Get from ThingSpeak API Keys tab

export default function AppProps() {
  const [data, setData] = useState({ temp: 30, hum: 0, light: 0, sound: 0 });
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const intervalRef = useRef(null);
  const POLL_INTERVAL = 5000; // Check every 5 seconds

  const fetchFromThingSpeak = async () => {
    // ThingSpeak REST API - get last entry
    const url = `https://api.thingspeak.com/channels/${THINGSPEAK_CHANNEL}/feeds/last.json?api_key=${THINGSPEAK_READ_KEY}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} - ${response.statusText}`);
      }

      const json = await response.json();
      console.log("ThingSpeak response:", json);

      if (json && json.field1) {
        // Map ThingSpeak fields to your app format
        const formattedData = {
          temp: parseFloat(json.field1) || 0, // Temperature
          hum: parseFloat(json.field2) || 0, // Humidity
          light: parseInt(json.field3) || 0, // Light
          sound: parseInt(json.field4) || 0, // Sound
        };

        setData(formattedData);
        setError(null);
        setIsConnected(true);

        // Parse timestamp
        if (json.created_at) {
          setLastUpdate(new Date(json.created_at));
        }

        console.log("✅ Data updated:", formattedData);
      } else {
        console.warn("⚠️ No data from ThingSpeak yet");
        setIsConnected(false);
      }
    } catch (err) {
      console.error("❌ ThingSpeak error:", err);
      setError(`ThingSpeak: ${err.message}`);
      setIsConnected(false);
    }
  };

  useEffect(() => {
    console.log("🌐 Starting ThingSpeak polling...");

    // Fetch immediately
    fetchFromThingSpeak();

    // Then poll every 5 seconds
    intervalRef.current = setInterval(fetchFromThingSpeak, POLL_INTERVAL);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Settings lastUpdate={lastUpdate} isConnected={isConnected} />
        <Dados data={data} error={error} />
        <Index data={data} setData={setData} />
      </View>
    </GestureHandlerRootView>
  );
}
