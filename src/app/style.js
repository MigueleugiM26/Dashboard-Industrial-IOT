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
    height: 40,
  },

  view_center: { 
    flex: 1, // Aqui vou pegar o conteudo que restou do space-between no centro
    width: '100%', 

    justifyContent: 'flex-start', 
    alignItems: 'center',
  },

  circle: { 
    width: 150, 
    height: 150, 
    // backgroundColor: '#303030', 
    borderRadius: 75,
    alignItems: 'center',
    justifyContent: 'center'
  },

  view_informations: { 
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
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

  temperatura: { 
    color: "#fff",
    fontSize: 38,
    marginTop: 10,
  }

  

})