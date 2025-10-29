import { DataProvider } from "./context/DataContext";
import { Stack } from "expo-router";

export default function RootLayout() { 
    return ( 
        <DataProvider>
            <Stack>
                <Stack.Screen name="index" options={{headerShown: false}}/>
                <Stack.Screen name="dados" options={{title: "Gráficos"}}/>
                <Stack.Screen name="settings/settings" options={{title: "Configurações"}}/>
            </Stack>
        </DataProvider>
    )
}