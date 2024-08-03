import React from "react";
import { StyleSheet, TextInput, View, Text } from "react-native";

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  IconComponent: React.ComponentType<any>;
  iconName: string;
  error?: string; 
}

export default function SearchBar({
  placeholder = "Para onde?",
  value,
  onChangeText,
  IconComponent,
  iconName,
  error, 
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.searchBar, error ? styles.errorInput : null]}>
        <IconComponent
          style={{ marginRight: 13 }}
          name={iconName}
          size={24}
          color="black"
        />
        <TextInput
          placeholderTextColor="#888888"
          style={styles.input}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
        />
      </View>
      {error && <Text style={styles.errorMessage}>{error}</Text>} 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16, 
  },
  searchBar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    width: 346,
    backgroundColor: "#F5F5F5",
    borderRadius: 32,
  },
  input: {
    flex: 1,
    fontFamily: "Jost",
    fontWeight: "700",
    fontSize: 15,
  },
  errorInput: { 
    borderColor: 'red',
    borderWidth: 1,
    borderRadius: 32, 
  },
  errorMessage: { 
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
});
