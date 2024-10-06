import { Image, StyleSheet, Text, View } from "react-native";
import Map from "@/assets/images/map.png";
import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";

type ride = {
  id: number;
  street1: string;
  street2: string;
  driver?: string;
  userId?: number;
};

type LastRideProps = {
  lastRide: ride[];
};

export default function LastRide({ lastRide }: LastRideProps) {
  // se o driver for igual o id do usuário logado, exibir "Você foi o motorista"

  useEffect(() => {
    console.log("ultima corrida?", JSON.stringify(lastRide, null, 2));
  }, [lastRide]);
  return (
    <>
      {lastRide.map(({ id, driver, street1, street2 }, index) => (
        <View key={id} style={styles.rideContainer}>
          <View style={styles.rideMap}>
            <Image source={Map} style={styles.mapImage} />
          </View>
          <View style={styles.rideContent}>
            <View style={styles.rideHeader}>
              <Text style={styles.rideStreet}>{street1}</Text>
              <Ionicons
                name="arrow-forward"
                size={24}
                color="black"
                style={styles.rideArrow}
              />
              <Text style={styles.rideStreet}>{street2}</Text>
            </View>
            <Text style={styles.rideDriver}>
              {driver ? `Motorista ${driver}` : "Você foi o motorista"}
            </Text>
            {index === 0 && <View style={styles.rideSeparator} />}
          </View>
        </View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  rideContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    width: "100%",
  },
  rideMap: {
    width: 37,
    height: 37,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    marginRight: 12,
  },
  mapImage: {
    width: "70%",
    height: "70%",
  },
  rideContent: {
    flex: 1,
  },
  rideHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  rideStreet: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: 16,
  },
  rideArrow: {
    marginHorizontal: 8,
  },
  rideDriver: {
    fontFamily: "Inter",
    fontWeight: "500",
    fontSize: 10,
  },
  rideSeparator: {
    height: 1,
    backgroundColor: "#F5F5F5",
    marginTop: 16,
  },
});
