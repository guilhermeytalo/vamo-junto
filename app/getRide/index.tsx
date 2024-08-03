import CarImage from "@/assets/images/car.png";
import SearchBar from "@/components/SearchBar";
import { Text, View } from "@/components/Themed";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const keyboardOffset = Dimensions.get("screen").height / 8;
export default function GetRideScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View	
            style={{
              flex: 1,
              alignItems: "center",
			  
            }}
          >
            <View
              style={{
                paddingHorizontal: 41,
                flexDirection: "column",
                justifyContent: "center",
				paddingVertical: 41, 
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View>
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons
                      name="chevron-back-outline"
                      size={24}
                      color="black"
                    />
                  </TouchableOpacity>
                </View>

                <View style={{ marginLeft: 50 }}>
                  <Text
                    style={{
                      fontFamily: "Jost",
                      fontSize: 20,
                      fontWeight: "700",
                      color: "black",
                      textAlign: "center",
                    }}
                  >
                    <Image width={50} height={50} source={CarImage} />
                    Pegar Carona
                  </Text>
                  <View
                    style={{
                      height: 4,
                      width: "100%",
                      marginBottom: 15,
                      backgroundColor: "#FF6E2F",
                    }}
                  />
                </View>
              </View>

              {/*começa aqui*/}

              <View>
                <Text
                  style={{
                    fontFamily: "Jost",
                    fontWeight: "700",
                    fontSize: 15,
                    marginBottom: 15,
                  }}
                >
                  Origem e destino
                </Text>
                <View style={{ marginBottom: 16 }}>
                  <SearchBar
                    placeholder={"Para onde?"}
                    IconComponent={Feather}
                    iconName="search"
                  />
                </View>
                <SearchBar
                  placeholder={"De onde?"}
                  IconComponent={Feather}
                  iconName="search"
                />
              </View>

              <View style={{ marginTop: 24 }}>
                <Text
                  style={{
                    fontFamily: "Jost",
                    fontWeight: "700",
                    fontSize: 15,
                    marginBottom: 15,
                  }}
                >
                  Data e hora
                </Text>
                <SearchBar
                  placeholder={"12 de Fevereiro de 2024, 15:00"}
                  IconComponent={MaterialCommunityIcons}
                  iconName="clock-time-three"
                />
              </View>

              {/*termina aqui*/}
              <TouchableOpacity
                style={{
                  backgroundColor: "#FF6E2F",
                  width: 346,
                  height: 40,
                  justifyContent: "center",
                  marginTop: 24,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: "white",
                    fontFamily: "Jost",
                    fontSize: 16,
                    justifyContent: "center",
                    fontWeight: "500",
                  }}
                >
                  Pronto
                </Text>
              </TouchableOpacity>
            </View>

            {/*terminar aqui*/}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {},
  title: {},
  separator: {},
  checkbox: {
    margin: 8,
  },
});
