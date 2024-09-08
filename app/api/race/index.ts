import axios from "axios";
import { BASE_URL_IP } from "..";

export const registerRace = async (race: Race) => {
    console.log(JSON.stringify(race, null, 2));
    axios({
        method: "post",
        url: `${BASE_URL_IP}/race`,
        data: race,
        }).then((response) => {
            console.log("Server response:", response);
        })
        .catch((error) => {
            console.error("Failed to register a race2", error);
        });
};