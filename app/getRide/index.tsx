import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import DatePicker from "react-native-date-picker";
import { useFocusEffect, useNavigation } from "expo-router";
import CarImage from "@/assets/images/car.png";
import { getUserId } from "@/constants/Storage";
import SearchBar from "@/components/SearchBar";
import LastRide from "@/components/LastRide";
import { getAllRaces } from "@/app/api/race";

export default function GetRideScreen() {
  const navigation = useNavigation();
  const [userId, setUserId] = useState(null);
  const [date, setDate] = useState(new Date());
  const [openDateTime, setOpenDateTime] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [races, setRaces] = useState([]);

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
    setIsLoading(true);
    const storedUserId = await getUserId();
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      console.error("User ID not found in storage", storedUserId);
    }
    setIsLoading(false);
  }, []);

  const fetchRaces = useCallback(async () => {
    try {
      const racesData = await getAllRaces();
      console.log("racesData", JSON.stringify(racesData, null, 2));
      const transformedRaces = racesData.map((race, index) => ({
        id: race.id,
        street1: race.startAddress,
        street2: race.endAddress,
        driver: race.driver.name,
        userId: race.userId,
      }));
      setRaces(transformedRaces);
    } catch (error) {
      console.error("Failed to fetch races", error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
      fetchRaces();
    }, [fetchUserData, fetchRaces])
  );

  const sendData = async () => {
    const ride = {
      timeStart: date,
      userId: userId,
    };
    console.log("getRide", JSON.stringify(ride, null, 2));
    // await sendRide(ride);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6E2F" />
        </View>
      );
    }

    if (races.length > 0) {
      return (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Resultados</Text>
          <LastRide lastRide={races} />
        </View>
      );
    }

    return (
      <View style={styles.formContainer}>
        <View style={styles.searchSection}>
          <Text style={styles.sectionTitle}>Origem e destino</Text>
          <View style={styles.searchBarContainer}>
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

        <View style={styles.dateTimeSection}>
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
              setDate(selectedDate);
              setOpenDateTime(false);
            }}
            onCancel={() => setOpenDateTime(false)}
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={sendData}>
          <Text style={styles.submitButtonText}>Pronto</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.container}>
            <View style={styles.header}>
              <View style={{ alignItems: "center", flexDirection: "row" }}>
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={styles.backButton}
                >
                  <Ionicons
                    name="chevron-back-outline"
                    size={24}
                    color="black"
                  />
                </TouchableOpacity>
                <View style={styles.titleContainer}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image width={50} height={50} source={CarImage} />
                    <Text style={styles.title}>Pegar Carona</Text>
                  </View>
                  <View style={styles.titleUnderline} />
                </View>
              </View>
            </View>

            {renderContent()}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 41,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    width: "100%",
  },
  backButton: {
    width: 20,
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 20,
  },
  title: {
    fontFamily: "Jost",
    fontSize: 20,
    fontWeight: "700",
    color: "black",
    textAlign: "center",
  },
  titleUnderline: {
    height: 3,
    width: "55%",
    backgroundColor: "#FF6E2F",
  },
  formContainer: {
    width: "100%",
  },
  searchSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: "Jost",
    fontWeight: "700",
    fontSize: 15,
    marginBottom: 15,
  },
  searchBarContainer: {
    marginBottom: 16,
  },
  dateTimeSection: {
    marginBottom: 24,
  },
  dateTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#F5F5F5",
    borderRadius: 32,
  },
  icon: {
    marginRight: 10,
  },
  dateTimeText: {
    fontFamily: "Jost",
    fontSize: 15,
  },
  submitButton: {
    backgroundColor: "#FF6E2F",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontFamily: "Jost",
    fontSize: 16,
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  resultsContainer: {
    width: "100%",
    alignItems: "center",
  },
  resultsTitle: {
    alignSelf: "flex-start",
    fontFamily: "Jost",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
});
