import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
    justifyContent: "space-between",
  },
  view_icon: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: "100%",
    
  },

  image: { 
    width: 40,
    height: 44,
  },


  view_center: { 
    flex: 1, // Aqui vou pegar o conteudo que restou do space-between no centro
    width: '100%', 
    justifyContent: 'flex-start', 
    alignItems: 'center',
    marginTop: 50,
  },

  circleClima: { 
    width: 150, 
    height: 150, 
    backgroundColor: "#303030",
    borderRadius: 75,
    alignItems: 'center',
    justifyContent: 'center'
  },

  iconCircle: { 
    width: 100,
    height: 100,
  },

  view_informations: { 
    flexDirection: 'column',
    
  },

  linhaDeDado: { 
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: 6,
  },

  input: {
    width: "80%",
    height: 40,
    borderColor: "#0ff",
    borderWidth: 1,
    borderRadius: 5,
    color: "#0ff",
    paddingHorizontal: 10,
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    color: "#fff",
    fontSize: 18,
    marginVertical: 6,
  },

  textTemperatura: { 
    color: "#fff",
    fontSize: 50,
    marginTop: 20,
  },
  error: {
    color: "#f00",
    fontSize: 16,
    textAlign: "center",
  },
  errorDetails: {
    color: "#f88",
    fontSize: 14,
    textAlign: "center",
    marginTop: 5,
  },

})