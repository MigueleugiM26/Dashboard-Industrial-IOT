import { View, Text, TextInput } from "react-native-web";
import { styles } from "./style";


export default function Settings({espIP, setEspIP}) { 
    

    return ( 
        <View style={{flex: 1}}>
            <Text>Configurações</Text>
            <TextInput
            style={styles.input}
            placeholder="Digite o IP do ESP"
            placeholderTextColor="#888"
            value={espIP}
            onChangeText={(text) => setEspIP(text)}
            />

        </View>
        
    )
}