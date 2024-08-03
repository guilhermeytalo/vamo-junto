import CarImage from "@/assets/images/car.png";
import SearchBar from "@/components/SearchBar";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { z } from "zod";
import { registerCar } from "../api/car";

const carSchema = z.object({
  plate: z.string().min(1, "Placa é obrigatória"),
  brand: z.string().min(1, "Marca é obrigatória"),
  model: z.string().min(1, "Modelo é obrigatória"),
  type: z.string().min(1, "Tipo é obrigatório"),
  color: z.string().min(1, "Cor é obrigatória"),
  year: z.string().min(1, "Ano é obrigatório"),
});

type FormData = z.infer<typeof carSchema>;
type FormErrors = Partial<Record<keyof FormData, string[]>>;

export default function NewCarScreen() {
  const [carTypeValue, setCarTypeValue] = useState(null);
  const [color, setColor] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [isFocusColor, setIsFocusColor] = useState(false);

  const navigation = useNavigation();
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<FormData>({
    plate: "",
    brand: "",
    model: "",
    type: "",
    color: "",
    year: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    const updatedFormData = { ...formData, [field]: value };
    setFormData(updatedFormData);

    const result = carSchema.safeParse(updatedFormData);
    if (!result.success) {
      setFormErrors({
        ...formErrors,
        [field]: result.error.formErrors.fieldErrors[field],
      });
    } else {
      const updatedErrors = { ...formErrors };
      delete updatedErrors[field];
      setFormErrors(updatedErrors);
    }
  };

  const handleDropdownChange = (field: keyof FormData, value: string) => {
    const updatedFormData = { ...formData, [field]: value };
    setFormData(updatedFormData);

    const result = carSchema.safeParse(updatedFormData);
    if (!result.success) {
      setFormErrors({
        ...formErrors,
        [field]: result.error.formErrors.fieldErrors[field],
      });
    } else {
      const updatedErrors = { ...formErrors };
      delete updatedErrors[field];
      setFormErrors(updatedErrors);
    }
  };

  const isButtonDisabled =
    isSubmitting ||
    Object.values(formErrors).some(Boolean) ||
    Object.values(formData).some((value) => !value);

  const carTypeData = [
    { label: "Buggy", value: "Buggy" },
    { label: "Conversível", value: "Conversível" },
    { label: "Cupê", value: "Cupê" },
    { label: "Hatchback", value: "Hatchback" },
    { label: "Minivan", value: "Minivan" },
    { label: "Perua/SW", value: "Perua/SW" },
    { label: "Picape", value: "Picape" },
    { label: "Sedã", value: "Sedã" },
    { label: "Utilitário esportivo", value: "Utilitário esportivo" },
    { label: "Van/Utilitário", value: "Van/Utilitário" },
  ];

  const colors = [
    { label: "Amarelo", value: "Amarelo" },
    { label: "Azul", value: "Azul" },
    { label: "Bege", value: "Bege" },
    { label: "Branco", value: "Branco" },
    { label: "Bronze", value: "Bronze" },
    { label: "Cinza", value: "Cinza" },
    { label: "Dourado", value: "Dourado" },
    { label: "Indefinida", value: "Indefinida" },
    { label: "Laranja", value: "Laranja" },
    { label: "Marrom", value: "Marrom" },
    { label: "Prata", value: "Prata" },
    { label: "Preto", value: "Preto" },
    { label: "Rosa", value: "Rosa" },
    { label: "Roxo", value: "Roxo" },
    { label: "Verde", value: "Verde" },
    { label: "Vermelho", value: "Vermelho" },
    { label: "Vinho", value: "Vinho" },
  ];

  const createNewCar = async () => {
    const result = carSchema.safeParse(formData);
    if (!result.success) {
      setFormErrors(result.error.formErrors.fieldErrors as FormErrors);
      return;
    }

    const carData = {
      ...formData,
      plate: formData.plate.toLowerCase(),
      brand: formData.brand.toLowerCase(),
      model: formData.model.toLowerCase(),
      type: formData.type.toLowerCase(),
      color: formData.color.toLowerCase(),
      year: formData.year.toLowerCase(),
      userId: "4f4e62c4-f839-4b2d-ab62-2195a3ec4565",
    };

    try {
      setIsSubmitting(true);
      await registerCar(carData);
      navigation.goBack();
    } catch (error) {
      console.error("Failed to create car:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ flex: 1, alignItems: "center" }}>
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
                    style={styles.pageTitle}
                  >
                    <Image width={50} height={50} source={CarImage} />
                    Adicionar veículo
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

              {/* placa do veiculo ✓ */}
              <View>
                <Text style={styles.title}>Placa do veículo</Text>
                <View style={{ marginBottom: 16 }}>
                  <SearchBar
                    IconComponent={Feather}
                    iconName="search"
                    placeholder="Digite a placa do veículo"
                    value={formData.plate}
                    onChangeText={(text) => handleInputChange("plate", text)}
                    error={formErrors.plate ? formErrors.plate[0] : undefined}
                  />
                </View>
              </View>

              {/* marca do veículo ✓ */}
              <View>
                <Text style={styles.title}>Marca do veículo</Text>
                <View style={{ marginBottom: 16 }}>
                  <SearchBar
                    IconComponent={Feather}
                    iconName="search"
                    placeholder="Ex: Chevrolet, Ford, Honda"
                    value={formData.brand}
                    onChangeText={(text) => handleInputChange("brand", text)}
                    error={formErrors.brand ? formErrors.brand[0] : undefined}
                  />
                </View>
              </View>

              {/* modelo do veículo ✓ */}
              <View>
                <Text style={styles.title}>Modelo do veículo</Text>
                <View style={{ marginBottom: 16 }}>
                  <SearchBar
                    IconComponent={Feather}
                    iconName="search"
                    placeholder="Ex: Onix"
                    value={formData.model}
                    onChangeText={(text) => handleInputChange("model", text)}
                    error={formErrors.model ? formErrors.model[0] : undefined}
                  />
                </View>
              </View>

              {/* Tipo do veículo ✓ */}
              <View>
                <Text style={styles.title}>Tipo do veículo</Text>
                <View style={{ marginBottom: 16 }}>
                  <Dropdown
                    style={[
                      styles.dropdown,
                      isFocus && { borderColor: "blue" },
                    ]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={carTypeData}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={!isFocus ? "Ex. Hatchback" : "..."}
                    value={carTypeValue}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={(item) => {
                      setCarTypeValue(item.value);
                      handleDropdownChange("type", item.value);
                      setIsFocus(false);
                    }}
                    renderLeftIcon={() => (
                      <Feather
                        style={styles.icon}
                        color={isFocus ? "blue" : "black"}
                        name="search"
                        size={20}
                      />
                    )}
                  />
                </View>
              </View>

              {/* Cor do veículo ✓ */}
              <View>
                <Text style={styles.title}>Cor do veículo</Text>
                <View style={{ marginBottom: 16 }}>
                  <Dropdown
                    style={[
                      styles.dropdown,
                      isFocusColor && { borderColor: "blue" },
                    ]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={colors}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={!isFocusColor ? "Ex. Preto" : "..."}
                    value={color}
                    onFocus={() => setIsFocusColor(true)}
                    onBlur={() => setIsFocusColor(false)}
                    onChange={(item) => {
                      setColor(item.value);
                      handleDropdownChange("color", item.value);
                      setIsFocusColor(false);
                    }}
                    renderLeftIcon={() => (
                      <Feather
                        style={styles.icon}
                        color={isFocusColor ? "blue" : "black"}
                        name="search"
                        size={20}
                      />
                    )}
                  />
                </View>
              </View>

              {/* Ano do veículo ✓ */}
              <View>
                <Text style={styles.title}>Ano do veículo</Text>
                <View style={{ marginBottom: 16 }}>
                  <SearchBar
                    placeholder="Ex: 2023"
                    IconComponent={Feather}
                    iconName="search"
                    value={formData.year}
                    onChangeText={(text) => handleInputChange("year", text)}
                    error={formErrors.year ? formErrors.year[0] : undefined}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: isButtonDisabled ? "#ccc" : "#FF6E2F" },
                ]}
                onPress={createNewCar}
                disabled={isButtonDisabled}
              >
                <Text
                  style={styles.buttonText}
                >
                  Pronto
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pageTitle:{
      fontFamily: "Jost",
      fontSize: 20,
      fontWeight: "700",
      color: "black",
      textAlign: "center",
  },
  title: {
    fontFamily: "Jost",
    fontWeight: "700",
    fontSize: 15,
    marginBottom: 15,
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
  button: {
    width: 346,
    height: 40,
    justifyContent: "center",
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontFamily: "Jost",
    fontSize: 16,
    justifyContent: "center",
    fontWeight: "500",
  },
});
