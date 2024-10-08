import CarImage from "@/assets/images/car.png";
import BANNERBACKGROUND from "@/assets/images/planningBG.png";
import ButtonComponent from "@/components/Button";
import LastRide from "@/components/LastRide";
import SearchBar from "@/components/SearchBar";
import { Text, View } from "@/components/Themed";
import { Feather } from "@expo/vector-icons";
import Badge from "@react-navigation/bottom-tabs/src/views/Badge";
import { Link, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Image, StyleSheet } from "react-native";
import { getAllRaces } from "../api/race";
import { getUser } from "../api/user";

export default function HomeScreen() {
  const [races, setRaces] = useState([]);
  const fetchRaces = useCallback(async () => {
    try {
      const racesData = await getAllRaces();
      console.log("racesData", JSON.stringify(racesData, null, 2));
      const transformedRaces = racesData
        .sort((a: any, b:any) => new Date(b.createdAt) - new Date(a.createdAt))
        .map((race: Race, index) => ({
          id: race.id,
          street1: race.startAddress,
          street2: race.endAddress,
          driver: race.driver.name,
          userId: race.userId,
        }))
        .slice(0, 2);
      setRaces(transformedRaces);
    } catch (error) {
      console.error("Failed to fetch races", error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchRaces();
    }, [fetchRaces])
  );

  useEffect(() => {
    getUser("3a22c5f8-3479-4fef-a7ab-6f65d7ff6027");
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerContent}>
        <Image width={50} height={50} source={CarImage} />
        <Text style={styles.title}>Vamos Juntos</Text>
      </View>
      <View style={styles.separator} />

      <SearchBar
        placeholder={"Para onde?"}
        IconComponent={Feather}
        iconName="search"
      />
      <View style={{ alignSelf: "flex-start" }}>
        <LastRide lastRide={races} />
      </View>

      <View style={styles.suggestionsContainer}>
        <Text style={styles.suggestions}>Sugestões</Text>
        <View
          style={{
            marginTop: 20,
            justifyContent: "space-evenly",
            flexDirection: "row",
          }}
        >
          <Link href="/ride/" asChild>
            <ButtonComponent
              title={"Oferecer uma Carona"}
              onPress={() => console.log("bateu ride")}
              width={144}
              height={59}
              backgroundColor={"#F5F5F5"}
            />
          </Link>
          <Link href="/getRide/" asChild>
            <ButtonComponent
              title={"Pegar uma Carona"}
              onPress={() => console.log("bateu getRide")}
              width={144}
              height={59}
              marginLeft={12}
              backgroundColor={"#F5F5F5"}
            />
          </Link>
        </View>
      </View>

      <View style={styles.planingWithUsContainer}>
        <Text style={styles.planingWithUs}>Se Planeje com a gente</Text>
        <View style={styles.planingWithUsBannerContainer}>
          <Image style={{ borderRadius: 9 }} source={BANNERBACKGROUND} />
          <View style={styles.infoContent}>
            <Text style={styles.planingWithUsSubTitle}>
              Saiba como pegar e oferecer uma carona
            </Text>
            <Badge style={styles.badge} visible={true}>
              5 min
            </Badge>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 41,
    alignItems: "center",
    justifyContent: "center",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontFamily: "Jost",
    fontSize: 20,
    fontWeight: "700",
  },
  separator: {
    marginBottom: 38,
    height: 3,
    width: "55%",
    backgroundColor: "#FF6E2F",
  },
  suggestionsContainer: {
    marginTop: 22,
    alignSelf: "flex-start",
  },
  suggestions: {
    fontSize: 20,
    fontWeight: "700",
  },
  planingWithUsContainer: {
    marginTop: 22,
    flexDirection: "column",
  },
  planingWithUsBannerContainer: {
    marginTop: 20,
  },
  planingWithUs: {
    fontSize: 20,
    fontWeight: "700",
  },
  planingWithUsSubTitle: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: "600",
  },
  infoContent: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignContent: "center",
  },
  badge: { backgroundColor: "rgba(255, 110, 47, 0.1)", color: "#FFAB87" },
});
