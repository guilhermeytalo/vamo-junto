import React, { useCallback, useReducer, useState } from "react";
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
import { z } from "zod";

type CarOption = {
  label: string;
  value: string | undefined;
};

const rideSchema = z.object({
  startAddress: z.string(),
  endAddress: z.string(),
  timeStart: z.date(),
  userId: z.string(),
  carId: z.string().min(1, "Veículo é obrigatório"),
  seats: z.number().min(1, "Número de assentos é obrigatório"),
  passengerProfile: z.boolean(),
  acceptPoint: z.boolean(),
});

type FormData = z.infer<typeof rideSchema>;
type FormErrors = Partial<Record<keyof FormData, string[]>>;

const initialState = {
  formData: {
    startAddress: "",
    endAddress: "",
    timeStart: new Date(),
    userId: "",
    carId: "",
    seats: 0,
    passengerProfile: false,
    acceptPoint: false,
  },
  formErrors: {} as FormErrors,
  isSubmitting: false,
};

type Action =
  | { type: "UPDATE_FIELD"; field: keyof FormData; value: any }
  | { type: "SET_ERRORS"; errors: FormErrors }
  | { type: "SET_SUBMITTING"; isSubmitting: boolean }
  | { type: "SET_USER_ID"; userId: string };

function formReducer(
  state: typeof initialState,
  action: Action
): typeof initialState {
  switch (action.type) {
    case "UPDATE_FIELD":
      return {
        ...state,
        formData: { ...state.formData, [action.field]: action.value },
      };
    case "SET_ERRORS":
      return { ...state, formErrors: action.errors };
    case "SET_SUBMITTING":
      return { ...state, isSubmitting: action.isSubmitting };
    case "SET_USER_ID":
      return {
        ...state,
        formData: { ...state.formData, userId: action.userId },
      };
    default:
      return state;
  }
}

export default function RideScreen() {
  const navigation = useNavigation();
  const [state, dispatch] = useReducer(formReducer, initialState);
  const [carsData, setCarsData] = useState<CarOption[]>([]);
  const [isFocus, setIsFocus] = useState(false);
  const [openDateTime, setOpenDateTime] = useState(false);

  const handleInputChange = (field: keyof FormData, value: any) => {
    dispatch({ type: "UPDATE_FIELD", field, value });

    const result = rideSchema.safeParse({
      ...state.formData,
      [field]: value,
    });

    if (!result.success) {
      dispatch({
        type: "SET_ERRORS",
        errors: result.error.formErrors.fieldErrors as FormErrors,
      });
    } else {
      const updatedErrors = { ...state.formErrors };
      delete updatedErrors[field];
      dispatch({ type: "SET_ERRORS", errors: updatedErrors });
    }
  };

  const fetchUserData = useCallback(async () => {
    const storedUserId = await getUserId();
    if (storedUserId) {
      dispatch({ type: "SET_USER_ID", userId: storedUserId });
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
    const result = rideSchema.safeParse(state.formData);
    if (!result.success) {
      dispatch({
        type: "SET_ERRORS",
        errors: result.error.formErrors.fieldErrors as FormErrors,
      });
      return;
    }

    const { data } = result;

    dispatch({ type: "SET_SUBMITTING", isSubmitting: true });
    try {
      await registerRace(data);
      navigation.goBack();
    } catch (error) {
      console.error("Failed to register ride", error);
    } finally {
      dispatch({ type: "SET_SUBMITTING", isSubmitting: false });
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [fetchUserData])
  );

  const formattedDate = state.formData.timeStart.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const formattedTime = state.formData.timeStart.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const isButtonDisabled =
    state.isSubmitting ||
    Object.values(state.formErrors).some(Boolean) ||
    !state.formData.carId ||
    state.formData.seats === 0;

  return (
    <SafeAreaView
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, backgroundColor: "white" }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
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
                    onChangeText={(text) =>
                      handleInputChange("startAddress", text)
                    }
                  />
                </View>
                <SearchBar
                  placeholder={"De onde?"}
                  IconComponent={Feather}
                  iconName="search"
                  onChangeText={(text) => handleInputChange("endAddress", text)}
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
                  date={state.formData.timeStart}
                  onConfirm={(selectedDate) => {
                    handleInputChange("timeStart", selectedDate);
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
                  value={state.formData.carId}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  onChange={(item) => {
                    handleInputChange("carId", item.value);
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
                {state.formErrors.carId && (
                  <Text style={styles.errorText}>
                    {state.formErrors.carId[0]}
                  </Text>
                )}

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
                  onChangeText={(text) =>
                    handleInputChange("seats", Number(text))
                  }
                />
                {state.formErrors.seats && (
                  <Text style={styles.errorText}>
                    {state.formErrors.seats[0]}
                  </Text>
                )}
                <View style={styles.optionRow}>
                  <Checkbox
                    style={styles.checkbox}
                    value={state.formData.passengerProfile}
                    onValueChange={(value) =>
                      handleInputChange("passengerProfile", value)
                    }
                    color={
                      state.formData.passengerProfile ? "#FF6E2F" : undefined
                    }
                  />
                  <Text style={styles.optionText}>
                    Quero analisar o perfil do passageiro antes de confirmar a
                    carona
                  </Text>
                </View>

                <View style={styles.optionRow}>
                  <Checkbox
                    style={styles.checkbox}
                    value={state.formData.acceptPoint}
                    onValueChange={(value) =>
                      handleInputChange("acceptPoint", value)
                    }
                    color={state.formData.acceptPoint ? "#FF6E2F" : undefined}
                  />
                  <Text style={styles.optionText}>
                    Aceito definir um ponto de encontro com o passageiro
                  </Text>
                </View>
              </View>

              {/* Finalizar */}
              <TouchableOpacity
                style={[
                  styles.finishButton,
                  { backgroundColor: isButtonDisabled ? "#ccc" : "#FF6E2F" },
                ]}
                onPress={sendData}
                disabled={isButtonDisabled}
              >
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
  errorText: {
    color: "#FF3B30",
    fontFamily: "Jost",
    fontSize: 12,
    marginTop: 5,
    marginLeft: 10,
  },
});
