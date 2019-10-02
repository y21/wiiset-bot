import Command from "../structures/Command";
import Base from "../Base";
import fetch from "node-fetch";
import { Attachment } from "discord.js";

export default <Command>{
    name: "dog",
    description: "Sends a random dog picture using an external API",
    args: [],
    guildOnly: false,
    category: null,
    ownerOnly: false,
    run: (base: Base, message: any) => {
        return new Promise((a: any, b: any) => {
            fetch("https://dog.ceo/api/breeds/image/random").then(v => v.json()).then((res: any) => {
                a([res.message]);
            }).catch((err: any) => {
                b(err);
            })
        });
    }
}
