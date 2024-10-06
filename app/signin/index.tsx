import React, { useReducer } from "react";
import { Text, View } from "@/components/Themed";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { z } from "zod";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, useNavigation } from "expo-router";
import SearchBar from "@/components/SearchBar";
import CarImage from "@/assets/images/car.png";

const signinSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

type FormData = z.infer<typeof signinSchema>;
type FormErrors = Partial<Record<keyof FormData, string[]>>;

const initialState = {
  formData: {
    email: "",
    password: "",
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

export default function SignInScreen() {
  const navigation = useNavigation();
  const [state, dispatch] = useReducer(formReducer, initialState);

  const handleInputChange = (field: keyof FormData, value: string) => {
    dispatch({ type: "UPDATE_FIELD", field, value });

    const result = signinSchema.safeParse({
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

  const handleSignIn = async () => {
    const result = signinSchema.safeParse(state.formData);
    if (!result.success) {
      dispatch({
        type: "SET_ERRORS",
        errors: result.error.formErrors.fieldErrors as FormErrors,
      });
      return;
    }

    dispatch({ type: "SET_SUBMITTING", isSubmitting: true });
    try {
      // Call your signin API here
      // await signInUser(result.data);
      navigation.navigate("home" as never);
    } catch (error) {
      console.error("Failed to sign in", error);
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
              <View style={styles.titleContainer}>
                <Image width={50} height={50} source={CarImage} />
                <Text style={styles.title}>Vamos Juntos</Text>
              </View>
              <View style={styles.titleUnderline} />
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.sectionTitle}>Email</Text>
                <SearchBar
                  placeholder="Email"
                  IconComponent={MaterialCommunityIcons}
                  iconName="email"
                  onChangeText={(text) => handleInputChange("email", text)}
                />
                {state.formErrors.email && (
                  <Text style={styles.errorText}>
                    {state.formErrors.email[0]}
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
              </View>

              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: isButtonDisabled ? "#ccc" : "#FF6E2F" },
                ]}
                onPress={handleSignIn}
                disabled={isButtonDisabled}
              >
                <Text style={styles.buttonText}>Entrar</Text>
              </TouchableOpacity>

              <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Não tem uma conta? </Text>
                <Link href="/signup" asChild>
                  <TouchableOpacity>
                    <Text style={styles.signupLink}>Criar conta</Text>
                  </TouchableOpacity>
                </Link>
              </View>

              {/* <TouchableOpacity style={styles.forgotPasswordContainer}>
                <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
              </TouchableOpacity> */}
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
    justifyContent: "center",
    paddingHorizontal: 41,
    paddingVertical: 16,
  },
  header: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: {
    // marginLeft: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
    width: "58%",
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
  button: {
    backgroundColor: "#FF6E2F",
    width: "100%",
    height: 40,
    justifyContent: "center",
    marginTop: 24,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontFamily: "Jost",
    fontSize: 16,
    fontWeight: "500",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  signupText: {
    fontFamily: "Jost",
    fontSize: 14,
    color: "#666",
  },
  signupLink: {
    fontFamily: "Jost",
    fontSize: 14,
    color: "#FF6E2F",
    fontWeight: "700",
  },
  forgotPasswordContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  forgotPasswordText: {
    fontFamily: "Jost",
    fontSize: 14,
    color: "#666",
    textDecorationLine: "underline",
  },
});