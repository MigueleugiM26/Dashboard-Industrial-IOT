// Importando para criar um armário global. Onde todos os componentes podem pegar ou colocar dados.
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";

// ===== THINGSPEAK CONFIGURATION =====
const THINGSPEAK_CHANNEL = "3179416"; // Get from ThingSpeak
const THINGSPEAK_READ_KEY = "4ZPL92UWZYYFMRN3"; // Get from ThingSpeak API Keys tab

// Criando um contexto/armário vazio
const DataContext = createContext();

// children é tudo que tá dentro do <DataProvider>
export function DataProvider({ children }) {
  const [data, setData] = useState({ temp: 35, hum: 0, light: 95, sound: 55 });
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState("Celsius");
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Histórico de dados
  const [history, setHistory] = useState([]);

  const intervalRef = useRef(null);
  const POLL_INTERVAL = 5000; // Poll every 5 seconds

  const fetchFromThingSpeak = async () => {
    // ThingSpeak REST API - get last entry
    const url = `https://api.thingspeak.com/channels/${THINGSPEAK_CHANNEL}/feeds/last.json?api_key=${THINGSPEAK_READ_KEY}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} - ${response.statusText}`);
      }

      const json = await response.json();
      console.log("📡 Dados recebidos do ThingSpeak:", json);

      if (json && json.field1) {
        // Mapear campos do ThingSpeak para formato do app
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

        // Adicionar ao histórico
        setHistory((prev) => {
          const newEntry = {
            time: new Date().toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
            ...formattedData,
          };
          // Mantendo apenas os últimos 12 valores
          return [...prev.slice(-11), newEntry];
        });

        console.log("✅ Dados atualizados:", formattedData);
      } else {
        console.warn("⚠️ Nenhum dado disponível no ThingSpeak ainda");
        setIsConnected(false);
      }
    } catch (err) {
      console.error("❌ Erro do ThingSpeak:", err);
      setError(`ThingSpeak: ${err.message}`);
      setIsConnected(false);
    }
  };

  useEffect(() => {
    console.log("🌐 Iniciando conexão ThingSpeak...");

    // Fetch immediately
    fetchFromThingSpeak();

    // Then poll every 5 seconds
    intervalRef.current = setInterval(fetchFromThingSpeak, POLL_INTERVAL);

    // Cleanup: remover intervalo quando componente desmontar
    return () => {
      console.log("🧹 Limpando intervalo do ThingSpeak");
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []); // Array vazio = executa apenas uma vez ao montar

  /* Colocando todos dados dentro do armário. Qualquer tela que estiver dentro do <DataProvider> pode acessar isso. */
  return (
    <DataContext.Provider
      value={{
        data,
        error,
        history,
        setData,
        unit,
        setUnit,
        isConnected,
        lastUpdate,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

// Qualquer componente pode fazer const {data} = useData() e pegar os dados.
export const useData = () => useContext(DataContext);
