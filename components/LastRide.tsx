import {Image, StyleSheet, Text, View} from "react-native";
import Map from '@/assets/images/map.png';
import {Ionicons} from '@expo/vector-icons';

type ride = {
    id: number,
    street1: string,
    street2: string,
    driver?: string,
}

type LastRideProps = {
    lastRide: ride[]
}

export default function LastRide({lastRide}: LastRideProps) {
    return (
        <>
            {lastRide.slice(0, 2).map(({id, driver, street1, street2}, index) => (
                <View key={id} style={styles.container}>
                    <View style={styles.map}>
                        <Image source={Map}/>
                    </View>
                    <View style={styles.content}>
                        <View style={styles.header}>
                            <Text style={styles.title}>{street1}</Text>
                            <Ionicons name="arrow-forward" size={24} color="black"/>
                            <Text style={styles.title}>{street2}</Text>
                        </View>
                        <Text style={styles.subText}>{driver ? `Motorista ${driver}` : 'Você foi o motorista'}</Text>
                        {index === 0 && <View style={styles.separator}/>}
                    </View>
                </View>
            ))}
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 23,

    },
    map: {
        width: 37,
        height: 37,
        backgroundColor: 'rgba(255, 110, 47, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
    },
    content: {
        flexDirection: 'column',
        marginLeft: 12,
        width: '100%'
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
    },
    title: {
        fontWeight: "700",
        fontSize: 16,
        fontFamily: 'Inter'
    },
    subText: {
        fontFamily: 'Inter',
        fontWeight: "500",
        fontSize: 10,
    },
    separator: {
        height: 1,
        width: 280,
        marginTop: 18,
        backgroundColor: '#F5F5F5'
    },
})