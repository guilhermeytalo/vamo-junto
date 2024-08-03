import {StyleSheet, Text, TouchableOpacity, View} from "react-native";

type ButtonProps = {
    width?: number;
    height?: number;
    marginLeft?: number;
    backgroundColor?: string;
    title: string;
    onPress: () => void;
}
export default function Button({
width,
height,
marginLeft,
backgroundColor,
title,
onPress,
}: ButtonProps) {
    return (
        <View>
            <TouchableOpacity
                style={{
                    ...styles.container,
                    backgroundColor: backgroundColor,
                    width: width,
                    height: height,
                marginLeft: marginLeft}}
                    onPress={onPress}>
                <Text style={styles.text}>{title}</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        paddingHorizontal: 12,
    },
    text: {
        fontSize: 16,
        fontWeight: '600'
    }
})