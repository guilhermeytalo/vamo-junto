import AsyncStorage from "@react-native-async-storage/async-storage";

// in future this will be changed when the user will be logged in
const USER_ID_KEY = "4f4e62c4-f839-4b2d-ab62-2195a3ec4565";

const storeUserId = async (value: string) => {
  try {
    await AsyncStorage.setItem(USER_ID_KEY, value);
  } catch (error) {
    console.error("Error storing userId:", error);
  }
};

export const getUserId = async () => {
  storeUserId(USER_ID_KEY);
  try {
    const userId = await AsyncStorage.getItem(USER_ID_KEY);
    return userId;
  } catch (error) {
    console.error("Error retrieving userId:", error);
    return null;
  }
};