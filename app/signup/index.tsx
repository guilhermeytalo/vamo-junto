import React, { useReducer } from "react";
import { Text, View } from "@/components/Themed";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { z } from "zod";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import SearchBar from "@/components/SearchBar";

const signupSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  confirmEmail: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  confirmPassword: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  phone: z.string().min(11, "Telefone inválido").max(11, "Telefone inválido"),
}).refine((data) => data.email === data.confirmEmail, {
  message: "Os emails não coincidem",
  path: ["confirmEmail"],
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof signupSchema>;
type FormErrors = Partial<Record<keyof FormData, string[]>>;

const initialState = {
  formData: {
    name: "",
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
    phone: "",
  },
  formErrors: {} as FormErrors,
  isSubmitting: false,
};

type Action =
  | { type: "UPDATE_FIELD"; field: keyof FormData; value: string }
  | { type: "SET_ERRORS"; errors: FormErrors }
  | { type: "SET_SUBMITTING"; isSubmitting: boolean };

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
    default:
      return state;
  }
}

export default function SignupScreen() {
  const navigation = useNavigation();
  const [state, dispatch] = useReducer(formReducer, initialState);

  const handleInputChange = (field: keyof FormData, value: string) => {
    dispatch({ type: "UPDATE_FIELD", field, value });

    const result = signupSchema.safeParse({
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

  const handleSignup = async () => {
    const result = signupSchema.safeParse(state.formData);
    if (!result.success) {
      dispatch({
        type: "SET_ERRORS",
        errors: result.error.formErrors.fieldErrors as FormErrors,
      });
      return;
    }

    dispatch({ type: "SET_SUBMITTING", isSubmitting: true });
    try {
      // Call your signup API here
      // await signupUser(result.data);
      navigation.goBack();
    } catch (error) {
      console.error("Failed to sign up", error);
    } finally {
      dispatch({ type: "SET_SUBMITTING", isSubmitting: false });
    }
  };

  const isButtonDisabled =
    state.isSubmitting || Object.keys(state.formErrors).length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, backgroundColor: "white" }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.content}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back-outline" size={24} color="black" />
              </TouchableOpacity>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Criar Conta</Text>
                <View style={styles.titleUnderline} />
              </View>
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.sectionTitle}>Informações Pessoais</Text>
                <SearchBar
                  placeholder="Nome completo"
                  IconComponent={MaterialCommunityIcons}
                  iconName="account"
                  onChangeText={(text) => handleInputChange("name", text)}
                />
                {state.formErrors.name && (
                  <Text style={styles.errorText}>{state.formErrors.name[0]}</Text>
                )}

                <SearchBar
                  placeholder="Telefone"
                  IconComponent={MaterialCommunityIcons}
                  iconName="phone"
                  onChangeText={(text) => handleInputChange("phone", text)}
                  style={{ marginTop: 16 }}
                />
                {state.formErrors.phone && (
                  <Text style={styles.errorText}>{state.formErrors.phone[0]}</Text>
                )}
              </View>

              <View style={[styles.inputGroup, { marginTop: 24 }]}>
                <Text style={styles.sectionTitle}>Email</Text>
                <SearchBar
                  placeholder="Email"
                  IconComponent={MaterialCommunityIcons}
                  iconName="email"
                  onChangeText={(text) => handleInputChange("email", text)}
                />
                {state.formErrors.email && (
                  <Text style={styles.errorText}>{state.formErrors.email[0]}</Text>
                )}

                <SearchBar
                  placeholder="Confirmar email"
                  IconComponent={MaterialCommunityIcons}
                  iconName="email-check"
                  onChangeText={(text) => handleInputChange("confirmEmail", text)}
                  style={{ marginTop: 16 }}
                />
                {state.formErrors.confirmEmail && (
                  <Text style={styles.errorText}>
                    {state.formErrors.confirmEmail[0]}
                  </Text>
                )}
              </View>

              <View style={[styles.inputGroup, { marginTop: 24 }]}>
                <Text style={styles.sectionTitle}>Senha</Text>
                <SearchBar
                  placeholder="Senha"
                  IconComponent={MaterialCommunityIcons}
                  iconName="lock"
                  onChangeText={(text) => handleInputChange("password", text)}
                  secureTextEntry
                />
                {state.formErrors.password && (
                  <Text style={styles.errorText}>
                    {state.formErrors.password[0]}
                  </Text>
                )}

                <SearchBar
                  placeholder="Confirmar senha"
                  IconComponent={MaterialCommunityIcons}
                  iconName="lock-check"
                  onChangeText={(text) => handleInputChange("confirmPassword", text)}
                  style={{ marginTop: 16 }}
                  secureTextEntry
                />
                {state.formErrors.confirmPassword && (
                  <Text style={styles.errorText}>
                    {state.formErrors.confirmPassword[0]}
                  </Text>
                )}
              </View>

              <TouchableOpacity
                style={[
                  styles.signupButton,
                  { backgroundColor: isButtonDisabled ? "#ccc" : "#FF6E2F" },
                ]}
                onPress={handleSignup}
                disabled={isButtonDisabled}
              >
                <Text style={styles.signupButtonText}>Criar Conta</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: 41,
    paddingVertical: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  titleContainer: {
    marginLeft: 50,
  },
  title: {
    fontFamily: "Jost",
    fontSize: 20,
    fontWeight: "700",
    color: "black",
    textAlign: "center",
  },
  titleUnderline: {
    height: 4,
    width: "100%",
    marginBottom: 15,
    backgroundColor: "#FF6E2F",
  },
  form: {
    marginTop: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: "Jost",
    fontWeight: "700",
    fontSize: 15,
    marginBottom: 15,
  },
  errorText: {
    color: "#FF3B30",
    fontFamily: "Jost",
    fontSize: 12,
    marginTop: 5,
    marginLeft: 10,
  },
  signupButton: {
    backgroundColor: "#FF6E2F",
    width: "100%",
    height: 40,
    justifyContent: "center",
    marginTop: 24,
  },
  signupButtonText: {
    textAlign: "center",
    color: "white",
    fontFamily: "Jost",
    fontSize: 16,
    fontWeight: "500",
  },
});