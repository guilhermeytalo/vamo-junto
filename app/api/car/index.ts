import { BASE_URL_IP } from "..";
import axios from "axios";

export const registerCar = async (car: Car) => {
    axios({
        method: "post",
        url: `${BASE_URL_IP}/car`,
        data: car,
      }).then((response) => {
        console.log("Server response:", response);
      })
      .catch((error) => {
        console.error("Failed to register car:", error);
      });
}


export const getUserCars = async (userId: string) => {
    if (!userId) {
        console.error("Invalid userId provided");
        return null;
    }

    try {
        const response = await fetch(`${BASE_URL_IP}/car/user/${userId}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data: Car[] = await response.json();
        // console.log('Cars of user request:', JSON.stringify(data, null, 2));
        return data;
    } catch (error) {
        throw error; 
    }
};