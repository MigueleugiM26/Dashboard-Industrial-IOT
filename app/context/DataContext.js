// Importando para criar um armário global. Onde todos os componentes podem pegar ou colocar dados.
import React, {createContext, useContext, useState, useEffect, useRef } from "react";

// Criando um contexto/armário vázio. 
const DataContext = createContext();

// children é tudo que tá dentro do <DataProvider>
export function DataProvider({children}) { 
    const [espIP, setEspIP] = useState("192.168.0.149");
    const [data, setData] = useState({ temp: 30, hum: 0, light: 95, sound: 0 });
    const [error, setError] = useState(null);
    const intervalRef = useRef(null);
    const POLL_INTERVAL = 5000;

    const fetchData = async () => {
    if (!espIP) return;
    const ESP_URL = `http://${espIP}/`;
    try {
      const response = await fetch(ESP_URL);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = await response.json();
      setData(json);
      setError(null);
    } catch (err) {
      console.error("Erro:", err);
      setError(`${err.name}: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchData();
    intervalRef.current = setInterval(fetchData, POLL_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [espIP]);

  {/* Colocando todos dados dentro do armario. Qualquer tela que etiver dentro do <DataProvider> pode acessar isso.*/}
  return ( 
    <DataContext.Provider value={{data, error, espIP, setEspIP, setData}}>
        {children}
    </DataContext.Provider>
  )
}


// Qualquer componente pode fazer const {data} = useData() e pegar os dados.
export const useData = () => useContext(DataContext);
