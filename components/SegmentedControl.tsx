import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface SegmentedControlProps {
  values: string[];
  selectedIndex?: number;
  onChange?: (index: number) => void;
}

export default function SegmentedControl({ 
  values, 
  selectedIndex: controlledIndex,
  onChange 
}: SegmentedControlProps) {
    const [internalSelectedIndex, setInternalSelectedIndex] = useState(0);
    
    const selectedIndex = controlledIndex !== undefined ? controlledIndex : internalSelectedIndex;
    const handlePress = (index: number) => {
      setInternalSelectedIndex(index);
      onChange?.(index);
    };
    
    return (
        <View style={styles.segmentedControl}>
        {values.map((value, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.segmentedControlButton,
                index === selectedIndex && styles.segmentedControlButtonSelected,
              ]}
              onPress={() => handlePress(index)}
            >
              <Text
                style={[
                  styles.segmentedControlButtonText,
                  index === selectedIndex && styles.segmentedControlButtonTextSelected,
                ]}
              >
                {value}
              </Text>
            </TouchableOpacity>
        ))}
        </View>
    );
}

const styles = StyleSheet.create({
    segmentedControl: {
        flexDirection: "row",
        justifyContent: "center",
        marginVertical: 16,
    },
    segmentedControlButton: {
        padding: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#333",
        marginHorizontal: 4,
    },
    segmentedControlButtonSelected: {
        backgroundColor: "#333",
    },
    segmentedControlButtonText: {
        color: "#333",
    },
    segmentedControlButtonTextSelected: {
        color: "#fff",
    },
});