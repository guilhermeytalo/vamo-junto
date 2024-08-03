import { BASE_URL_IP } from "..";

export const getUser = async (userId: string) => {
    if (!userId) {
        console.error("Invalid userId provided");
        return null;
    }

    try {
        const response = await fetch(`${BASE_URL_IP}/user`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('response:', data);
        return data;
    } catch (error) {
        console.log('Network error:', error);
        throw error; // Re-throw the error if needed for further handling
    }
};