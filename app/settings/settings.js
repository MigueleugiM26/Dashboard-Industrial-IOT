import { View, Text, TextInput, Button } from "react-native-web";
import { styles } from "./style";
import { useData } from "../context/DataContext";
import { useRouter } from "expo-router";
import React from "react";
export default function Settings() { 
    const { espIP, setEspIP } = useData();
    const { input, setInput } = React.useState(espIP);
    const router = useRouter();
    return ( 
        <View style={{flex: 1}}>
            <TextInput
            style={styles.input}
            placeholder="Digite o IP do ESP"
            placeholderTextColor="#888"
            value={input}
            onChangeText={(text) => setEspIP(text)}
            />
            <Button title="Salvar" onPress={() => {setEspIP(input); router.back();}}></Button>
        </View>
        
    )
}