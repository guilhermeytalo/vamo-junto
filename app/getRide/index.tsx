import CarImage from "@/assets/images/car.png";
import SearchBar from "@/components/SearchBar";
import { Text, View } from "@/components/Themed";
import { getUserId } from "@/constants/Storage";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "expo-router";
import { useCallback, useState } from "react";
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
import DatePicker from "react-native-date-picker";

const keyboardOffset = Dimensions.get("screen").height / 8;
export default function GetRideScreen() {
  const navigation = useNavigation();
  const [date, setDate] = useState(new Date());
  const [openDateTime, setOpenDateTime] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const formattedDate = date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const formattedTime = date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const fetchUserData = useCallback(async () => {
    const storedUserId = await getUserId();
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      console.error("User ID not found in storage", storedUserId);
    }
  }, []);

  const sendData = async () => {
    const ride: Race = {
      timeStart: date,
      userId: userId,
    };

    console.log("getRide", JSON.stringify(ride, null, 2));

    // await sendRide(ride);
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [fetchUserData])
  );

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

              {/* Data e hora */}
              <View style={{ marginTop: 24 }}>
                <Text style={styles.sectionTitle}>Data e hora</Text>
                <TouchableOpacity
                  style={styles.dateTimeContainer}
                  onPress={() => setOpenDateTime(true)}
                >
                  <MaterialCommunityIcons
                    name="clock"
                    size={24}
                    color="black"
                    style={styles.icon}
                  />
                  <Text style={styles.dateTimeText}>
                    {`${formattedDate}, ${formattedTime}`}
                  </Text>
                </TouchableOpacity>
                <DatePicker
                  modal
                  locale="pt"
                  mode="datetime"
                  confirmText="Confirmar"
                  cancelText="Cancelar"
                  title={"Data e hora"}
                  open={openDateTime}
                  date={date}
                  onConfirm={(selectedDate) => {
                    console.log("selectedDate", selectedDate);
                    setDate(selectedDate);
                    setOpenDateTime(false);
                  }}
                  onCancel={() => setOpenDateTime(false)}
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
                onPress={sendData}
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
  sectionTitle: {
    fontFamily: "Jost",
    fontWeight: "700",
    fontSize: 15,
    marginBottom: 15,
  },
  dateTimeContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#F5F5F5",
    borderRadius: 32,
  },
  dateTimeText: {
    marginLeft: 10,
    fontFamily: "Jost",
    fontSize: 15,
  },
  icon: {
    marginRight: 10,
  },
});
