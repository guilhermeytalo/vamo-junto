import React, { useCallback, useEffect, useState } from "react";
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
  Button,
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
// import DateTimePicker from "@react-native-community/datetimepicker";
import DatePicker from 'react-native-date-picker'
export default function RideScreen() {
  const navigation = useNavigation();
  const [isAnalyzeChecked, setAnalyzeChecked] = useState(false);
  const [isMeetingPointChecked, setMeetingPointChecked] = useState(false);
  const [value, setValue] = useState<[]>([]);
  const [isFocus, setIsFocus] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [data, setData] = useState<[]>([]);
  const [openCalendar, setOpenCalendar] = useState(false);

  const [datePicker, setDatePicker] = useState(new Date())
  const [openDatePicker, setOpenDatePicker] = useState(false)

  const fetchUserData = useCallback(async () => {
    const storedUserId = await getUserId();
    if (storedUserId) {
      setUserId(storedUserId);
      const cars = await getUserCars(storedUserId);
      if (cars) {
        setData(
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

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [fetchUserData])
  );

  const setDate = (event: any, date: any) => {
    const {
      type,
      nativeEvent: { timestamp, utcOffset },
    } = event;

    console.log("data?", type, timestamp, utcOffset);
    console.log("data 2?", date);
  };


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
                <Button title="Open" onPress={() => setOpenDatePicker(true)} />
                <DatePicker
                  modal
                  locale="pt"
                  mode="datetime"
                  confirmText="Confirmar"
                  cancelText="Cancelar"
                  title={"Data e hora"}
                  open={openDatePicker}
                  date={datePicker}
                  onConfirm={(date) => {
                    console.log('datee ----->', date);
                    setOpenDatePicker(false);
                    setDatePicker(date);
                  }}
                  onCancel={() => {
                    setOpenDatePicker(false);
                  }}
                />
                {/* <DateTimePicker
                  value={new Date()}
                  mode="time"
                  onChange={setDate}
                /> */}
                {/* <SearchBar
                  placeholder={"12 de Fevereiro de 2024, 15:00"}
                  IconComponent={MaterialCommunityIcons}
                  iconName="clock-time-three"
                /> */}
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
                  Veículo
                </Text>
                <Dropdown
                  style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={data}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={!isFocus ? "Selecione um veículo" : "..."}
                  value={value}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  onChange={(item) => {
                    console.log("item?", item);
                    setValue(item.value);
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
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#F5F5F5",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 5,
                        height: 40,
                      }}
                    >
                      <AntDesign name="plus" size={18} color="black" />
                      <Text
                        style={{
                          marginLeft: 16,
                          fontFamily: "Jost",
                          fontWeight: "700",
                          fontSize: 15,
                          color: "#000",
                        }}
                      >
                        Cadastrar novo veículo
                      </Text>
                    </TouchableOpacity>
                  </Link>
                </View>
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
                  Opções
                </Text>
                <SearchBar
                  placeholder={"Quantidade de lugares disponíveis"}
                  IconComponent={FontAwesome6}
                  iconName="person-walking"
                />
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    marginTop: 16,
                  }}
                >
                  <Checkbox
                    style={styles.checkbox}
                    value={isAnalyzeChecked}
                    onValueChange={setAnalyzeChecked}
                    color={isAnalyzeChecked ? "#FF6E2F" : undefined}
                  />
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "500",
                      fontFamily: "Jost",
                      paddingHorizontal: 10,
                    }}
                  >
                    Quero analisar o perfil do passageiro antes de confirmar a
                    carona
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  <Checkbox
                    style={styles.checkbox}
                    value={isMeetingPointChecked}
                    onValueChange={setMeetingPointChecked}
                    color={isMeetingPointChecked ? "#FF6E2F" : undefined}
                  />
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "500",
                      fontFamily: "Jost",
                      paddingHorizontal: 10,
                    }}
                  >
                    Aceito definir um ponto de encontro com o passageiro
                  </Text>
                </View>
              </View>

              {/*termina aqui*/}
              <TouchableOpacity
                style={{
                  backgroundColor: "#FF6E2F",
                  width: 346,
                  height: 40,
                  justifyContent: "center",
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
  dropdown: {
    height: 50,
    backgroundColor: "#F5F5F5",
    borderRadius: 32,
    paddingHorizontal: 12,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
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
});
