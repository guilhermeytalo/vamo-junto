import React, { useCallback, useState } from "react";
import CarImage from "@/assets/images/car.png";
import SearchBar from "@/components/SearchBar";
import { Text, View } from "@/components/Themed";
import { getUserId } from "@/constants/Storage";
import { toUpper, toUpperFirst } from "@/utils/formaters";
import {
  AntDesign,
  Feather,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Checkbox } from "expo-checkbox";
import { Link, useNavigation } from "expo-router";
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
import { Dropdown } from "react-native-element-dropdown";
import { getUserCars } from "../api/car";
import DatePicker from "react-native-date-picker";
import { registerRace } from "../api/race";

type CarOption = {
  label: string;
  value: string | undefined;
};

export default function RideScreen() {
  const navigation = useNavigation();
  const [isAnalyzeChecked, setAnalyzeChecked] = useState(false);
  const [isMeetingPointChecked, setMeetingPointChecked] = useState(false);
  const [carValue, setCarValue] = useState<string | undefined>(undefined); // Corrected type
  const [isFocus, setIsFocus] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [carsData, setCarsData] = useState<CarOption[]>([]);
  const [date, setDate] = useState(new Date());
  const [openDateTime, setOpenDateTime] = useState(false);
  const [seats, setSeats] = useState<number>(0);

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
      const cars = await getUserCars(storedUserId);
      if (cars) {
        setCarsData(
          cars.map((car) => ({
            label: `${toUpper(car.brand)}, ${toUpperFirst(car.model)}, ${
              car.year
            }, ${toUpperFirst(car.color)}, ${toUpper(car.plate)}`,
            value: car.id,
          }))
        );
      }
    } else {
      console.error("User ID not found in storage", storedUserId);
    }
  }, []);

  const sendData = async () => {
    const ride: Race = {
      timeStart: date,
      userId: userId,
      carId: carValue,
      seats: Number(seats),
      passengerProfile: isAnalyzeChecked,
		  acceptPoint: isMeetingPointChecked,
    };

    console.log("ride", JSON.stringify(ride, null, 2));
    try {
      await registerRace(ride);
    } catch (error) {
      console.error("Failed to register ride", error);
    }
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
        keyboardVerticalOffset={Dimensions.get("screen").height / 2}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 41 }}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 16,
            }}
          >
            <View
              style={{
                paddingHorizontal: 41,
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Ionicons
                    name="chevron-back-outline"
                    size={24}
                    color="black"
                  />
                </TouchableOpacity>
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
                    Oferecer Carona
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

              {/* Origem e destino */}
              <View>
                <Text style={styles.sectionTitle}>Origem e destino</Text>
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

              {/* Veículo */}
              <View style={{ marginTop: 24 }}>
                <Text style={styles.sectionTitle}>Veículo</Text>
                <Dropdown
                  style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={carsData}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={!isFocus ? "Selecione um veículo" : "..."}
                  value={carValue}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  onChange={(item) => {
                    console.log("item", item);
                    setCarValue(item.value); // Corrected value type
                    setIsFocus(false);
                  }}
                  renderLeftIcon={() => (
                    <MaterialCommunityIcons
                      style={styles.icon}
                      color={isFocus ? "blue" : "black"}
                      name="steering"
                      size={20}
                    />
                  )}
                />

                <View style={{ marginTop: 16 }}>
                  <Link href="/newCar/" asChild>
                    <TouchableOpacity style={styles.newCarButton}>
                      <AntDesign name="plus" size={18} color="black" />
                      <Text style={styles.newCarText}>
                        Cadastrar novo veículo
                      </Text>
                    </TouchableOpacity>
                  </Link>
                </View>
              </View>

              {/* Opções */}
              <View style={{ marginTop: 24 }}>
                <Text style={styles.sectionTitle}>Opções</Text>
                <SearchBar
                  placeholder={"Quantidade de lugares disponíveis"}
                  IconComponent={FontAwesome6}
                  iconName="person-walking"
                  onChangeText={setSeats}
                />
                <View style={styles.optionRow}>
                  <Checkbox
                    style={styles.checkbox}
                    value={isAnalyzeChecked}
                    onValueChange={setAnalyzeChecked}
                    color={isAnalyzeChecked ? "#FF6E2F" : undefined}
                  />
                  <Text style={styles.optionText}>
                    Quero analisar o perfil do passageiro antes de confirmar a
                    carona
                  </Text>
                </View>

                <View style={styles.optionRow}>
                  <Checkbox
                    style={styles.checkbox}
                    value={isMeetingPointChecked}
                    onValueChange={setMeetingPointChecked}
                    color={isMeetingPointChecked ? "#FF6E2F" : undefined}
                  />
                  <Text style={styles.optionText}>
                    Aceito definir um ponto de encontro com o passageiro
                  </Text>
                </View>
              </View>

              {/* Finalizar */}
              <TouchableOpacity style={styles.finishButton} onPress={sendData}>
                <Text style={styles.finishButtonText}>Pronto</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  dropdown: {
    height: 50,
    backgroundColor: "#F5F5F5",
    borderRadius: 32,
    paddingHorizontal: 12,
  },
  placeholderStyle: {
    fontFamily: "Jost",
    fontWeight: "700",
    fontSize: 15,
    color: "#888888",
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  newCarButton: {
    backgroundColor: "#F5F5F5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    height: 40,
  },
  newCarText: {
    marginLeft: 16,
    fontFamily: "Jost",
    fontWeight: "700",
    fontSize: 15,
    color: "#000",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 16,
  },
  checkbox: {
    margin: 8,
  },
  optionText: {
    fontSize: 15,
    fontWeight: "500",
    fontFamily: "Jost",
    paddingHorizontal: 10,
  },
  finishButton: {
    backgroundColor: "#FF6E2F",
    width: 346,
    height: 40,
    justifyContent: "center",
    marginTop: 24,
  },
  finishButtonText: {
    textAlign: "center",
    color: "white",
    fontFamily: "Jost",
    fontSize: 16,
    fontWeight: "500",
  },
});
