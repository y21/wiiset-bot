import Command from "../structures/Command";
import Base from "../Base";
import fetch from "node-fetch";

export default <Command>{
    name: "list",
    description: "Shows Mario Kart Wii room statistics",
    args: [],
    guildOnly: false,
    category: "mkw",
    ownerOnly: false,
    run: (base: Base, message: any) => {
        return new Promise(async (a: any, b: any) => {

        });
    }
}